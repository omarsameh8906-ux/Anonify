
export const findOne = async ({
    model,
    filter = {},
    options = {}
}={})=>{
   const doc = model.findOne(filter)
    if(options.select){
      doc.select(options.select)
    }
    if(options.populate){
       doc.populate(options.populate)
    }
    if(options.lean){
       doc.lean()
    }
    return await doc.exec()    
}
export const create = async ({
    model,
    data = [{}],
    options = {}
}={})=>{
    return await model.create(data,options)
}
export const findById = async ({
id,
model,
options = {}
}={})=>{
const doc =  model.findById(id);
if(options.select){
    doc.select(options.select)
}
if(options.populate){
    doc.populate(options.populate)
}
if(options.lean){
    doc.lean()
}
return await doc.exec()
}
export const find = async ({
model,
options = {},
filter = {}
}={})=>{
const doc =  model.find(filter);
if(options.select){
    doc.select(options.select)
}
if(options.populate){
    doc.populate(options.populate)
}
if(options.skip){
    doc.skip(options.skip)
}
if(options.sort){
    doc.sort(options.sort)
}
if(options.limit){
    doc.limit(options.limit)
}
if(options.lean){
    doc.lean()
}
return await doc.exec()
}
export const countDocument = async ({
model,
filter = {}
}={})=>{
return await  model.countDocuments(filter);

}
export const paginate = async ({
model,
page = 1 ,
limit = 5 ,
filter = {},
options = {},




}={})=>{

    const skip = (page-1) * limit ;
    const count = await countDocument({filter , model})
    const pages = Math.ceil(count / limit)
    const docs = await find({
        model ,
        filter, 
        options:{
            ...options,
            skip,
            limit
        }
        
        
        })

 
    return {count , limit , pages , currentPage:page , docs};
}
export const deleteOne = async ({
    model,
    filter = {}
} = {}) => {
    return await model.deleteOne(filter || {})
}
export const updateOne = async ({
    model,
    filter = {},
    options = {},
    update
}={})=>{
    return await model.updateOne(
        filter || {},
        {...update,$inc:{__v : 1}},
        options
    )
}
export const createOne = async ({
    model,
    data = {},
    options = {}
}={})=>{
    const doc = await create({model,data:[data],options})
    return doc
}
export const findByIdAndUpdate = async ({
    model,
    id,
    update,
    options = {}
} = {}) => {

    const doc = model.findByIdAndUpdate(
        id,
        { ...update, $inc: { __v: 1 } },
        options
    );

    if (options.select) {
        doc.select(options.select);
    }

    if (options.populate) {
        doc.populate(options.populate);
    }

    if (options.lean) {
        doc.lean();
    }

    return await doc.exec();
}
export const insertMany = async ({
    data,
    model
}) =>{
    return  (await model.insertMany(data))
}