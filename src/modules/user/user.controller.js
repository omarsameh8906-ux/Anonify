import { Router } from "express";
import { fileValidation, localFileUpload, successResponse } from "../../common/utils/index.js";
import { logout, profile, profileImage, rotateToken, update } from "./user.service.js";
import { authentication, authorization } from "../../middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../common/enum/security.enum.js";
import { localMulterMiddleware } from "../../middleware/multer.middleware.js";
const router = Router()

router.post("/profile-image",
       authentication(),
  localMulterMiddleware({
        isRequired:true ,
        customPath: "Users" ,
        multerMiddleware:localFileUpload({fileSize:2}).single("attachment"),
        validation: fileValidation.image 
    }) ,
    async (req, res, next) => {
        const data = await profileImage(req.user , req.file)
      return successResponse({ res, data:{user:req.user,file:req.file}})

})


router.get("/", authentication() , async (req, res, next) => {
    const data = await profile(req.user)
    return successResponse({ res, data})

})
router.patch("/", authentication() , async (req, res, next) => {
    const data = await update(req.user,req.body)
    return successResponse({ res, data})

})
router.post("/rotate-token", authentication(TokenTypeEnum.REFRESH) , async (req, res, next) => {
    const data = await rotateToken(req.payload,req.user,`${req.protocol}://${req.host}`)
    return successResponse({ res, data})

})
router.post("/logout", authentication() , async (req, res, next) => {
    const data = await logout(req.payload,req.user,req.body)
    return successResponse({ res, data})

})
export default router