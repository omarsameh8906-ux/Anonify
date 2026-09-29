import {z} from "zod"
import { GenderEnum } from "./enum/user.gender.js"
import { languageEnum } from "./enum/security.enum.js"


const validationMessage = {
    102: {
        AR: "عفوا لا يمكن ادخال اسم المستخدم اقل من حرفين",
        EN: "minimum username length is 2 char"
    }
}

const getValidationMessage = (language,code)=>{
    return language == languageEnum.AR ? validationMessage[code].AR : validationMessage[code].EN
}

const matchFields = ({original , copy , data , ctx , language})=>{
        if(data[original] != data[copy]){
        ctx.addIssue({
            code:"custom",
            message:language == languageEnum.AR? `فشل التطابق بين ${original} , ${copy}` :`Fail to match between ${original} and ${copy}`,
            path: ["copy"]
        })
    
    }
}

export const generalValidationFields = {
    email:(language)=> z.email({message:"Invalid Email Format ,please add valid email like example@any.com"}),
    password:(language)=> z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\s{0,})(?=.*\d(?=.*[!@#$%^&*_])).{8,16}$/).min(8).max(16),
    username:(language)=> z.string().min(2,{message:getValidationMessage(language,102)}).max(50),
    phone:(language)=> z.e164(),
    gender:(language)=> z.enum(GenderEnum),
    matchFields
}