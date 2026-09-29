import jwt from "jsonwebtoken";
import { ACCESS_ADMIN_TOKEN_SIGNATURE, ACCESS_TOKEN_EXPIRES_IN, ACCESS_USER_TOKEN_SIGNATURE, REFRESH_ADMIN_TOKEN_SIGNATURE, REFRESH_TOKEN_EXPIRES_IN, REFRESH_USER_TOKEN_SIGNATURE } from "../../config.js";
import { BadException, NotfoundException, UnauthorizedException } from "../exceptions/error.exception.js";
import { findById, findOne } from "../repository/base.repository.js";
import { userModel } from "../../DB/model/user.model.js";
import { TokenTypeEnum } from "../enum/security.enum.js";
import { RoleEnum } from "../enum/role.enum.js";
import { randomUUID } from "node:crypto"
import { exist, set } from "../sevices/index.js";
import { compare } from "./hash.security.js";
export const userBaseKey = ({userId}) => {
    return `User::${userId.toString()}`
}
export const userBaseRevokeTokenKey = ({userId}) => {
    return `User::${userBaseKey({userId})}::Revoke_Token`
}
export const userRevokeTokenKey = ({userId, jti}) => {
    return `User::${userBaseRevokeTokenKey({userId})}::Revoke_Token::${jti}`
}

export const createToken = async ({
    payload = {},
    options = {},
    secret = ACCESS_USER_TOKEN_SIGNATURE
} = {}) => {
    return jwt.sign(payload, secret, options)
}
export const verifyToken = async ({
    token = "",
    secret = ACCESS_USER_TOKEN_SIGNATURE
} = {}) => {
    return jwt.verify(token, secret)
}
const getTokenSignatures = async ({ role = RoleEnum.USER } = {}) => {
    let signatures;
    switch (role) {
        case RoleEnum.ADMIN:
            signatures = { accessSignature: ACCESS_ADMIN_TOKEN_SIGNATURE, refreshSignature: REFRESH_ADMIN_TOKEN_SIGNATURE }
            break;

        default:
            signatures = { accessSignature: ACCESS_USER_TOKEN_SIGNATURE, refreshSignature: REFRESH_USER_TOKEN_SIGNATURE }
            break;
    }
    return signatures
}
const getSignature = async ({ tokenType = TokenTypeEnum.ACCESS, role = RoleEnum.USER } = {}) => {
    const signatures = await getTokenSignatures({ role })
    return tokenType == TokenTypeEnum.ACCESS ? signatures.accessSignature : signatures.refreshSignature
}
export const decodeToken = async ({
    authorization = "",
    tokenType = TokenTypeEnum.ACCESS
} = {}) => {
    const decoded = jwt.decode(authorization)
    if (!decoded?.aud?.length) {
        throw BadException("Missing Token Failed")
    }
    const payload = await verifyToken({
        token: authorization,
        secret: await getSignature({ tokenType, role: decoded.aud[0] })
    })
    if (!payload?.sub) {
        throw BadException("missing token payload")
    }
    if (await exist({ key: userRevokeTokenKey({ userId: payload.sub, jti: payload.jti }) })) {
        throw UnauthorizedException("Expire Login Credentials")
    }
    const user = await findById({ model: userModel, id: payload.sub })
    if (!user) {
        throw NotfoundException("Invalid user")
    }
    if((user.changeCredentialsTime?.getTime() ?? 0) > payload.iat * 1000){
        throw UnauthorizedException("Expired Login Credentials")
    }
    return { user, payload }
}
export const createLoginCredentials = async ({
    user,
    issuer,
    options = {}
} = {}) => {
    const { accessSignature, refreshSignature } = await getTokenSignatures({ role: user.role })
    const jwtId = randomUUID()
    const access_token = await createToken({
        payload: { sub: user._id },
        secret: accessSignature,
        options: {
            ...options,
            issuer,
            audience: [user.role],
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
            jwtId
        }
    })

    const refresh_token = await createToken({
        payload: { sub: user._id },
        options: {
            ...options,
            issuer,
            audience: [user.role],
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
            jwtId
        },
        secret: refreshSignature
    })

    return {
        access_token,
        refresh_token
    }
}
export const createRevokeToken = async ({payload})=>{
    return consumedTime = (Math.ceil(Date.now() / 1000)) - payload.iat
        const refreshExpiresIn = payload.iat + REFRESH_TOKEN_EXPIRES_IN
        const ttl = refreshExpiresIn - consumedTime
        await set({ key: userRevokeTokenKey({userId:payload.sub , jwi:payload.jti}), value: payload.jti, ttl })
        return
}

export const basicAuth = async ({email,password})=>{
    const account = await findOne({model:userModel, filter:{email}})
    if (!account) throw NotfoundException("Invalid Login Data")
        const match = await compare(password,account.password)
    if(!match) throw NotfoundException("Invalid Login Data")
}
