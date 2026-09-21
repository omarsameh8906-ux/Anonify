import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { profile, rotateToken, update } from "./user.service.js";
import { authentication, authorization } from "../../middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../common/enum/security.enum.js";
import { RoleEnum } from "../../common/enum/role.enum.js";
const router = Router()

router.get("/", authentication() , async (req, res, next) => {
    const data = await profile(req.user)
    return successResponse({ res, data})

})
router.patch("/", authentication() , async (req, res, next) => {
    const data = await update(req.user,req.body)
    return successResponse({ res, data})

})
router.patch("/rotate-token", authentication(TokenTypeEnum.REFRESH) , async (req, res, next) => {
    const data = await rotateToken(req.payload,req.user,`${req.protocol}://${req.host}`)
    return successResponse({ res, data})

})
export default router