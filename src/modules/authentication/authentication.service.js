import { ConflictException, NotfoundException } from "../../common/exceptions/error.exception.js"
import { create, createOne, findOne } from "../../common/repository/base.repository.js"
import { decryption, encryption } from "../../common/security/encryption.security.js"
import { compare, hash } from "../../common/security/hash.security.js"
import { userModel } from "../../DB/model/user.model.js"
import bcrypt from 'bcrypt'
export const signup = async ({username,email,password,phone})=>{
    const duplicatedAccount = await findOne({
        model:userModel,
        filter:{email},
        options:{select:"email"}
    })
    if(duplicatedAccount){
        throw ConflictException("Email Exists")
        
    }
    const salt = await bcrypt.genSalt(12,"a")
    const user = await createOne({
        model:userModel,
        data:{
            username,
            email,
            password: await hash({plainText:password}),
            phone:await encryption(phone)
        }, 
    })
    return user
} 

export const login = async ({email,password}) => {
    const account = await findOne({
        model:userModel,
        filter:{email},
    })

    if (!account) {
    throw NotfoundException()
    }
    const match = await compare({plainText:password,cipherText:account.password})
    if(!match){
        throw NotfoundException("not exist")
    }
    account.phone = await decryption(account.phone)
    return account
}