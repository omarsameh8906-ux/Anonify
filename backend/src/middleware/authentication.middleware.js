import { TokenTypeEnum } from "../common/enum/security.enum.js"
import { BadException, ForbiddenException, UnauthorizedException } from "../common/exceptions/error.exception.js"
import { basicAuth, decodeToken } from "../common/security/token.security.js"

export const bearerAuth = async ({req , tokenType= TokenTypeEnum.ACCESS} = {})=>{
const [key , credential] = req.headers["authorization"]?.split(" ") || [] ;
const {user , payload} = await decodeToken({authorization:credential , tokenType})
req.user = user 
req.payload = payload
}

export const authentication = (tokenType=TokenTypeEnum.ACCESS)=>{
   return async (req,res,next)=>{
    const {authorization} = req.headers;

    if(!authorization){
        throw UnauthorizedException("Unauthorized Account")
    }
  const [key , credential] = authorization.split(" ") || [];
    
    switch (key) {
        case "Bearer":
            await bearerAuth({req , tokenType})
            break;
        case "Basic":
            const [email , password] = Buffer.from(credential , "base64").toString()?.split(":");
            req.user = await basicAuth({email , password})
            break;
        default:
            throw BadException("Invalid authentication approach")
            break;
    }
next()
}
}
export const authorization = (accessRole)=>{
   return async (req,res,next)=>{

    if(req.user.role < accessRole){
        throw ForbiddenException("Forbidden Account")
    }

   next()
}
}