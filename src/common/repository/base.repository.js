
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
const doc = await model.find(filter);
if(options.select){
    doc.select(options.select)
}
if(options.populate){
    doc.populate(options.populate)
}
if(options.skip){
    doc.skip(options.skip)
}
if(options.limit){
    doc.limit(options.limit)
}
if(options.lean){
    doc.lean()
}
return await doc.exec()
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