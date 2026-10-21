import { Router } from "express";
import { confirmEmail, login, requestForgetPasswordCode, resendConfirmEmail, resetForgetPassword, signup, signupWithGmail, verifyForgetPasswordCode } from "./authentication.service.js";
import { successResponse } from "../../common/utils/index.js";
import * as validators from "./authentication.validation.js"
import { validation } from "../../middleware/validation.middleware.js";
import { del } from "../../common/sevices/cache.service.js";
import { generateRateLimiter } from "../../common/utils/limiter.js";
const router = Router();

router.post("/signup", validation(validators.signup) ,async (req, res, next) => {

    const data = await signup(req.body)
    return successResponse({ res, status: 201, data })
})

router.patch("/confirm-email", validation(validators.confirmEmail) ,async (req, res, next) => {

    const data = await confirmEmail(req.body)
    return successResponse({ res, status: 200, data })
})

router.patch("/resend-confirm-email", validation(validators.ResendConfirmEmail) ,async (req, res, next) => {

    const data = await resendConfirmEmail(req.body)
    return successResponse({ res, status: 200, data })
})

router.post("/verify-forget-password", validation(validators.confirmEmail) ,async (req, res, next) => {

    const data = await verifyForgetPasswordCode(req.body)
    return successResponse({ res, status: 200, data })
})

router.patch("/Reset-forget-password", validation(validators.ResetForgetPassword) ,async (req, res, next) => {

    const data = await resetForgetPassword(req.body)
    return successResponse({ res, status: 200, data })
})

router.post("/request-forget-password-code", validation(validators.ResendConfirmEmail) ,async (req, res, next) => {

    const data = await requestForgetPasswordCode(req.body)
    return successResponse({ res, status: 201, data })
})

router.post("/signup-with-gmail" ,async (req, res, next) => {

    const {status , data} = await signupWithGmail(req.body ,  `${req.protocol}://${req.host}`)
    return successResponse({ res, status: 201, data })
})
const loginLimiter = generateRateLimiter({limit: 5 , ttl : 3 , skipSuccessfulRequests:true})
router.post("/login", loginLimiter ,validation(validators.login) ,async (req, res, next) => {
 
    const data = await login(req.validate.body, `${req.protocol}://${req.host}`)
    await del({key: req.rateLimit.key})
    return successResponse({ res, data })

})

export default router