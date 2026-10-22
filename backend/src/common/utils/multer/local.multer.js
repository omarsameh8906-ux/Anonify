import multer from "multer"
import {randomUUID} from "node:crypto"
import {fileTypeFromBuffer} from "file-type"
import {mkdir, writeFile} from "node:fs/promises"
import {resolve} from "node:path"
import { BadException } from "../../exceptions/error.exception.js"

export const fileValidation = {
    image:["image/jpg" , "image/jpeg" , "image/png"],
    files:["application/json" , "application/pds"]
}

export const localFileUpload =  ({fileSize = 5} = {}) =>{

    const storage = multer.memoryStorage()
    return multer({ storage , limits:{fileSize: fileSize * 1024 * 1024}})
}

export const processFile =async ({customPath= "general" , validation = [], file})=>{
       
         const result = await fileTypeFromBuffer(file.buffer)
            if( !result || !validation.includes(result.mime)){
            throw BadException("Invalid format")
        }

        const customFolderPath = resolve(`./uploads/${customPath}`) 
        await mkdir(customFolderPath , {recursive:true})
        const uniqueFileName = `uploads/${customPath}/${randomUUID()}.${result.ext}`
        await writeFile(resolve(`./${uniqueFileName}`) , file.buffer )
        file.path = uniqueFileName
        return uniqueFileName ;
      

    }

export const processArray =async ({customPath , validation = [], files})=>{
        const asets = []
    for (const file of files) {
      const path =  await processFile({customPath , validation , file})
      asets.push(path)
    }
    return asets
    }


export const processFields =async ({customPath , validation = [], files})=>{
        
        const assets = []

        for (const field of Object.keys(files)) {
          const paths =  await processArray({customPath , validation , files:files[field]})
          assets.push({key:field , paths})
        }

        return assets
    }

