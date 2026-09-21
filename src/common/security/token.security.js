import jwt from "jsonwebtoken";
import { ACCESS_ADMIN_TOKEN_SIGNATURE, ACCESS_TOKEN_EXPIRES_IN, ACCESS_USER_TOKEN_SIGNATURE, REFRESH_ADMIN_TOKEN_SIGNATURE, REFRESH_TOKEN_EXPIRES_IN, REFRESH_USER_TOKEN_SIGNATURE } from "../../config.js";
import { BadException, NotfoundException } from "../exceptions/error.exception.js";
import { findById } from "../repository/base.repository.js";
import { userModel } from "../../DB/model/user.model.js";
import { TokenTypeEnum } from "../enum/security.enum.js";
import { RoleEnum } from "../enum/role.enum.js";
export const createToken = async ({
    payload = {},
    options = {},
    secret = ACCESS_USER_TOKEN_SIGNATURE
}={})=>{
    return jwt.sign(payload,secret,options)
}
export const verifyToken = async ({
    token = "",
    secret = ACCESS_USER_TOKEN_SIGNATURE
}={})=>{
    return jwt.verify(token,secret)
}
const getTokenSignatures = async ({role = RoleEnum.USER}={})=>{
        let signatures ;
        switch (role) {
            case RoleEnum.ADMIN:
                signatures = {accessSignature:ACCESS_ADMIN_TOKEN_SIGNATURE,refreshSignature:REFRESH_ADMIN_TOKEN_SIGNATURE}
                break;
        
            default:
                  signatures = {accessSignature:ACCESS_USER_TOKEN_SIGNATURE,refreshSignature:REFRESH_USER_TOKEN_SIGNATURE}
                break;
        }
        return signatures
}
const getSignature = async ({tokenType=TokenTypeEnum.ACCESS,role=RoleEnum.USER}={})=>{
    const signatures = await getTokenSignatures({role})
    return tokenType == TokenTypeEnum.ACCESS ? signatures.accessSignature : signatures.refreshSignature
}
export const decodeToken = async ({
    authorization = "" ,
    tokenType = TokenTypeEnum.ACCESS
}={})=>{
    const decoded = jwt.decode(authorization)
    if(!decoded?.aud?.length){
        throw BadException("Missing Token Failed")
    }
    const payload = await verifyToken({
        token:authorization,
        secret: await getSignature({tokenType,role:decoded.aud[0]})
    })
    if(!payload?.sub){
        throw BadException("missing token payload")
    }
    const user = await findById({model:userModel,id:payload.sub})
    if(!user){
        throw NotfoundException("Invalid user")
    }
    return { user , payload }
}
export const createLoginCredentials = async ({
    user,
    issuer,
    options = {}
} = {}) => {
    const {accessSignature,refreshSignature} = await getTokenSignatures({role:user.role})
    const access_token = await createToken({
       payload: {sub:user._id},
        secret:accessSignature ,
        options: {
            ...options,
         issuer,   
        audience:[user.role],  
        expiresIn: ACCESS_TOKEN_EXPIRES_IN
        }
    })

    const refresh_token = await createToken({
      payload: {sub:user._id},
        options: {
            ...options,
         issuer,   
            audience:[user.role],
            expiresIn: REFRESH_TOKEN_EXPIRES_IN
        },
        secret: refreshSignature
    })

    return {
        access_token,
        refresh_token
    }
}
