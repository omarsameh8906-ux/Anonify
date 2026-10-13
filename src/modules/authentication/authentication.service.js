import { BadException, ConflictException, NotfoundException, TooManyRequestException } from "../../common/exceptions/error.exception.js"
import { createOne, findOne } from "../../common/repository/base.repository.js"
import { encryption } from "../../common/security/encryption.security.js"
import { compare, hash } from "../../common/security/hash.security.js"
import { userModel } from "../../DB/model/user.model.js"
import { createLoginCredentials, userBaseRevokeTokenKey } from "../../common/security/token.security.js"
import { WEB_CLIENT_IDS } from "../../config.js"
import {OAuth2Client} from 'google-auth-library';
import { ProviderEnum } from "../../common/enum/user.gender.js"
import { createOtp, emailEvent, sendEmail, UserEmailKey, UserEmailTrialsKey } from "../../common/utils/index.js"
import { EmailSubjectEnum } from "../../common/enum/email.enum.js"
import { del, expire, get, incrementBy, keys, set, ttl } from "../../common/sevices/cache.service.js"

const client = new OAuth2Client();
async function verifyGoogleAccount(idToken) {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: WEB_CLIENT_IDS
  });
  const payload = ticket.getPayload();

  if(!payload.email_verified){
    throw BadException("email not verified")
  }

 return payload
}


export const loginWithGmail = async (account,issuer) => {
    
return await createLoginCredentials({user:account,issuer})
}


export const signupWithGmail = async ({idToken}, issuer)=>{
      
    const {name , email , picture} = await verifyGoogleAccount(idToken)

    const existAccount = await findOne({
        model:userModel,
        filter: { email }
    })
    if(existAccount){
        if(existAccount.provider != ProviderEnum.GOOGLE){
            throw ConflictException("Invalid Account Provider")
        }
        return {status: 200 , data: await createLoginCredentials({user:existAccount , issuer})}
    }

    const user = await createOne({
        model:userModel,
        data:{
            username:name,
            email,
            confirmEmail:new Date(),
            provider:ProviderEnum.GOOGLE,
            image:picture
        }
    })

    return {status: 201 ,   data: await createLoginCredentials({user , issuer})}
} 

const sendEmailOtp = async ({email , subject , expiresIn = 120 , maxTrials = 3 , blockInSeconds = 300 , title})=>{

    const existOTP_TTL = await ttl({key:UserEmailKey({email , subject})})

    if(existOTP_TTL>0){
        throw ConflictException(`Sorry we cannot create new otp while existing one still valid please try again later after ${existOTP_TTL}s`)
    }
    const oldTrials = await get({key:UserEmailTrialsKey({email , subject})}) ?? 0
    if(oldTrials >= maxTrials){
        throw TooManyRequestException("Max otp trials has been reached")
    }
       const code = createOtp();
    await set({
        key:UserEmailKey({email , subject}),
        value:await hash(code.toString()),
        ttl:expiresIn
    })
  const currentTrials =  await incrementBy({key:UserEmailTrialsKey({email,subject}) });
  if(currentTrials == 3){
    await expire({key:UserEmailTrialsKey({email,subject}) , ttl:blockInSeconds})
  }
     emailEvent.emit("sendEmail" , {recipients:{to:email} , subject:EmailSubjectEnum.CONFIRM_EMAIL , data:{code},title:title??subject})

} 


export const signup = async ({username,email,password,phone})=>{
    const duplicatedAccount = await findOne({
        model:userModel,
        filter:{email},
        options:{select:"email"}
    })

    if(duplicatedAccount){
        throw ConflictException("Email Exists")
        
    }

    const account = await createOne({
        model:userModel,
        data:{
            username,
            email,
            password: await hash(password),
            phone:await encryption(phone)

        }, 
    })
    await sendEmailOtp({email , subject:EmailSubjectEnum.CONFIRM_EMAIL})
    return account
}

export const confirmEmail = async ({otp,email})=>{
    const account = await findOne({
        model:userModel,
        filter:{email,provider:ProviderEnum.SYSTEM , confirmEmail:{$exists:false}}
    })
    if(!account){
        throw NotfoundException("Invalid Account")
    }

    const hashOtp = await get({key:UserEmailKey({email, subject:EmailSubjectEnum.CONFIRM_EMAIL})})

    if(!hashOtp || !await compare(otp , hashOtp)){
        throw ConflictException("Invalid OTP")
    }

account.confirmEmail = new Date()
await account.save()
await del({key:await keys({prefix:UserEmailKey({email, subject:EmailSubjectEnum.CONFIRM_EMAIL}) })})
return

}

export const resendConfirmEmail = async ({email})=>{
    const account = await findOne({
        model:userModel,
        filter:{email,provider:ProviderEnum.SYSTEM , confirmEmail:{$exists:false}}
    })
    if(!account){
        throw NotfoundException("Invalid Account")
    }
    await sendEmailOtp({email , subject:EmailSubjectEnum.CONFIRM_EMAIL})

return 

}
    
export const requestForgetPasswordCode = async ({email})=>{
    const account = await findOne({
        
        model:userModel,filter:{
            email,
            provider:ProviderEnum.SYSTEM ,
            confirmEmail:{$exists:true}
        }
    })
}
export const verifyForgetPasswordCode = async ({otp,email})=>{
    const account = await findOne({
        model:userModel,
        filter:{email,provider:ProviderEnum.SYSTEM , confirmEmail:{$exists:true}}
    })
    if(!account){
        throw NotfoundException("Invalid Account")
    }

   return account ;

}
  
   export const resetForgetPassword = async ({otp,email,password})=>{
   const account = await verifyForgetPasswordCode({otp , email})
    account.password = await hash(password)
    account.changeCredentialsTime = new Date();
    await account.save()
 

    const result = await Promise.all([
        keys({prefix:userBaseRevokeTokenKey({userId:account._id})}),
        keys({prefix:UserEmailKey({email, subject:EmailSubjectEnum.FORGET_PASSWORD}) })
    ])

    await del({
        key: [...result[0] , ...result[1]]
    })
    
    

   return ;

}

export const login = async ({email,password},issuer) => {
    const account = await findOne({
        model:userModel,
        filter:{email,provider:ProviderEnum.SYSTEM , confirmEmail:{$exists:true}},
    })

console.log(account)
    if (!account) {
    throw NotfoundException()
    }
    
    const match = await compare(password,account.password)
    if(!match) throw NotfoundException("Not Exist")

return await createLoginCredentials({user:account,issuer})
}