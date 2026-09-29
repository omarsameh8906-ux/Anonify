import jwt from "jsonwebtoken"
import { findById, findByIdAndUpdate } from "../../common/repository/base.repository.js"
import { userModel } from "../../DB/model/user.model.js"
import { createLoginCredentials, createRevokeToken, userBaseRevokeTokenKey, userRevokeTokenKey, verifyToken } from "../../common/security/token.security.js"
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "../../config.js"
import { ConflictException } from "../../common/exceptions/error.exception.js"
import { del, keys} from "../../common/sevices/index.js"
import { logoutEnum } from "../../common/enum/security.enum.js"
export const profile = async (account) => {

    return account
}
export const update = async (user, data) => {
    const account = await findByIdAndUpdate({ id: user._id, model: userModel, update: data })
    return account
}
export const rotateToken = async (payload, user, issuer) => {
    const accessExpiresIn = (payload.iat + ACCESS_TOKEN_EXPIRES_IN) * 1000
    const currentTime = Date.now() + (30 * 60000);
    if (currentTime < accessExpiresIn) {
        throw ConflictException("sorry we cannot create new login credentials while current access token still within valid range")
    }
    const data =  await createLoginCredentials({ user, issuer })
    return createRevokeToken({payload})
    return data
}
export const logout = async (payload, user , {action = logoutEnum.DEVICE}) => {
    switch (action) {
        case logoutEnum.ALL:
            user.changeCredentialsTime = new Date();
            await user.save()
            await del({key:await keys({prefix:userBaseRevokeTokenKey({userId:payload.sub})})})
            break;
        default:
            createRevokeToken({payload})
            break;
    }
  return 
}