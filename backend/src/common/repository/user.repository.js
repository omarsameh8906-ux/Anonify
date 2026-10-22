import { userModel } from "../../DB/model/user.model.js"
import * as base from "./base.repository.js"
export const findOne = async ({
    filter = {},
    options = {}
}={})=>{
   
    return await base.findOne({filter , options , model:userModel})
}
export const create = async ({
    data = [{}],
    options = {}
}={})=>{
    return await base.create({data , options , model:userModel})
}
export const findById = async ({
    id,
    options = {}
  }={})=>{

  return await base.findById({id , model:userModel , options})
}
export const find = async ({
options = {},
filter = {}
}={})=>{

return await base.find({model:userModel , options , filter})
}
export const countDocument = async ({
filter = {}
}={})=>{
return await  base.countDocument({model:userModel , filter});

}
export const paginate = async ({
page = 1 ,
limit = 5 ,
filter = {},
options = {},




}={})=>{
 
    return await base.paginate({model:userModel , page , limit , filter , options});
}
export const deleteOne = async ({
    filter = {}
} = {}) => {
    return await base.deleteOne({model:userModel , filter})
}
export const updateOne = async ({
    filter = {},
    options = {},
    update
}={})=>{
    return await base.updateOne({model:userModel , filter , options , update})
}
export const createOne = async ({
    data = {},
    options = {}
}={})=>{
    return await base.createOne({model:userModel , data , options})
}
export const findByIdAndUpdate = async ({
    id,
    update,
    options = {}
} = {}) => {

    return await base.findByIdAndUpdate({model:userModel , id , update , options})
}
export const insertMany = async ({
    data
}) =>{
    return  await base.insertMany({data , model:userModel})
}