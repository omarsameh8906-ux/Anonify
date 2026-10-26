import { Router } from "express";
import { fileValidation, localFileUpload, successResponse } from "../../common/utils/index.js";
import { logout, profile, profileImage, rotateToken, update } from "./user.service.js";
import { authentication} from "../../middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../common/enum/security.enum.js";
import { uploadMiddleware } from "../../middleware/multer.middleware.js";
import * as validators from "./user.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
const router = Router()

router.post("/profile-image",
       authentication(),
  uploadMiddleware({
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
router.patch(
    "/",
    authentication(),
    validation(validators.updateProfile),
    async (req, res, next) => {
        const data = await update(req.user, req.validate.body);
        return successResponse({ res, data });
    }
);
router.post("/rotate-token", authentication(TokenTypeEnum.REFRESH) , async (req, res, next) => {
    const data = await rotateToken(req.payload,req.user,`${req.protocol}://${req.host}`)
    return successResponse({ res, data})

})
router.post("/logout", authentication() , async (req, res, next) => {
    const data = await logout(req.payload,req.user,req.body)
    return successResponse({ res, data})

})
export default router