import { languageEnum } from "../common/enum/security.enum.js"
import { BadException } from "../common/exceptions/error.exception.js"


export const validation = (schema)=>{
    return (req,res,next)=>{
        const language = Number(req.headers['accept-language'] ?? languageEnum.EN)
     const validationResult = schema(language).safeParse({
        body:req.body,
        query:req.query,
        params:req.params
     })
    if(!validationResult.success){
        throw BadException("Validation Error",validationResult.error.issues)
    }
    req.validate = validationResult.data
    next()
}}