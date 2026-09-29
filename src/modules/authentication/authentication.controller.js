import { Router } from "express";
import { login, signup } from "./authentication.service.js";
import { successResponse } from "../../common/utils/index.js";
import * as validators from "./authentication.validation.js"
import { BadException } from "../../common/exceptions/error.exception.js";
import { validation } from "../../middleware/validation.middleware.js";
const router = Router();

router.post("/signup", validation(validators.signup) ,async (req, res, next) => {

    const data = await signup(req.body)
    return successResponse({ res, status: 201, data })
})

router.post("/login", validation(validators.login) ,async (req, res, next) => {
 
    const data = await login(req.validate.body, `${req.protocol}://${req.host}`)
    return successResponse({ res, data })

})

export default router