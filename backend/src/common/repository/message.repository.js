import { MessageModel } from "../../DB/model/message.model.js"
import * as base from "./base.repository.js"
export const findOne = async ({
    filter = {},
    options = {}
}={})=>{
   
    return await base.findOne({filter , options , model:MessageModel})
}
export const create = async ({
    data = [{}],
    options = {}
}={})=>{
    return await base.create({data , options , model:MessageModel})
}
export const findById = async ({
    id,
    options = {}
  }={})=>{

  return await base.findById({id , model:MessageModel , options})
}
export const find = async ({
options = {},
filter = {}
}={})=>{

return await base.find({model:MessageModel , options , filter})
}
export const countDocument = async ({
filter = {}
}={})=>{
return await  base.countDocument({model:MessageModel , filter});

}
export const paginate = async ({
page = 1 ,
limit = 5 ,
filter = {},
options = {},




}={})=>{
 
    return await base.paginate({model:MessageModel , page , limit , filter , options});
}
export const deleteOne = async ({
    filter = {}
} = {}) => {
    return await base.deleteOne({model:MessageModel , filter})
}
export const updateOne = async ({
    filter = {},
    options = {},
    update
}={})=>{
    return await base.updateOne({model:MessageModel , filter , options , update})
}
export const createOne = async ({
    data = {},
    options = {}
}={})=>{
    return await base.createOne({model:MessageModel , data , options})
}
export const findByIdAndUpdate = async ({
    id,
    update,
    options = {}
} = {}) => {

    return await base.findByIdAndUpdate({model:MessageModel , id , update , options})
}
export const insertMany = async ({
    data
}) =>{
    return  await base.insertMany({data , model:MessageModel})
}