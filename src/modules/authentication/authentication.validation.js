import {z} from "zod";
import { generalValidationFields } from "../../common/general.validation.js";



export const loginSchema = (language)=>{
    return z.strictObject({
    email:generalValidationFields.email(language),
    password:generalValidationFields.password(language)
})
}

export const login = (language)=>{
    return z.object({
    body:loginSchema(language)
    })
}

export const confirmEmail = (language)=>{
    return z.object({
        body:z.strictObject({
            email:generalValidationFields.email(language),
            otp:generalValidationFields.otp(language)

        })
    })
}

export const ResendConfirmEmail = (language)=>{
    return z.object({
        body:z.strictObject({
            email:generalValidationFields.email(language),

        })
    })
}

export const ResetForgetPassword = (language)=>{
    return z.object({
        body:z.strictObject({
            email:generalValidationFields.email(language),
            otp:generalValidationFields.otp(language),
            password:generalValidationFields.password(language),
            confirmPassword:generalValidationFields.password(language),
        }).superRefine((data,ctx)=>{
            generalValidationFields.matchFields({original:"password", copy: "confirmPassword" , data , ctx})
        })
    })
}

export const signup = (language)=>{
    return z.object({
    body:loginSchema(language).safeExtend({
    username:generalValidationFields.username(language),
    confirmPassword:generalValidationFields.password(language),
    phone:generalValidationFields.phone(language)
}).superRefine((data,ctx)=>{
    generalValidationFields.matchFields({original:"password" , copy:"confirmPassword" , data , ctx , language})

    })
})
}