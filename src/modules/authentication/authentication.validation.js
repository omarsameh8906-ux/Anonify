import {z} from "zod";
import { GenderEnum } from "../../common/enum/user.gender.js";
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