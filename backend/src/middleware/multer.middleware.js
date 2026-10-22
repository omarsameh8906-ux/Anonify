import { processArray, processFields, processFile } from "../common/utils/index.js"

export const uploadMiddleware = ({isRequired = true , customPath = "general" ,multerMiddleware,validation = []})=>{
        return async (req,res,next)=>{
         

    multerMiddleware(req,res, async(error)=>{

            if(error){
                next(new Error(error.message , {cause:{status:400}}))
            }else{

                if(isRequired && !(req.file || req.files?.length || typeof req.files == "object"))
                    next(new Error("File is required" , {cause:{status:400}}))
              try{

                if(req.file){
               req.file.finalPath =  await processFile({customPath , validation , file:req.file})
            }
            if(req.files?.length){
              req.files.finalPath = await processArray({customPath , validation , files:req.files})
            }else if(req.files && typeof req.files == "object" && Object.keys(req.files)?.length){
             req.files.finalPath  = await processFields({customPath , validation , files:req.files})
            }
            next()

           } catch (error) {
            
            next(error)

                }     
            }
       }) 
    }
}