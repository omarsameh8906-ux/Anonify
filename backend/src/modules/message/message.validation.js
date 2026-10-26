import {z} from "zod"
import { generalValidationFields } from "../../common/general.validation.js"

export const createMessage = (language)=>{
    return z.object({
        body: z.strictObject({
            content:z.string().min(2).max(50000).optional() ,
            receiverId: generalValidationFields.id(language)
        }),
        files: z.array(generalValidationFields.file(language)).max(3).optional()
    
    }).superRefine((data , ctx)=>{
        if(!data.body.content && !data.files?.length){
            ctx.addIssue({
                code:"custom",
                path: ["body", "content"],
                message: "Missing message content"
            })
        }
    })
}


export const allMessages = (language)=>{
    return z.object({
        query: z.strictObject({
            type:z.enum(["0" , "1" , "2"]).default("0"), 
            page: z.coerce.number().default(1),
            limit: z.coerce.number().default(5),

        }),
        files: z.array(generalValidationFields.file(language)).max(3).optional()
    
    })
}

export const deleteMessage = (language)=>{
    return z.object({
        params: z.strictObject({
            messageId : generalValidationFields.id(language), 

        }),
        files: z.array(generalValidationFields.file(language)).max(3).optional()
    
    })
}