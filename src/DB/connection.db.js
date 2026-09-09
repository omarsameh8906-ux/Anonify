import mongoose from "mongoose"
import { DB_URI } from "../config.js";
import { userModel } from "./model/user.model.js";

export const bootsrabDB = async (app,port)=>{
   try {
     await mongoose.connect(DB_URI , {serverSelectionTimeoutMS:30000})
    console.log(`DB connected successfully`);
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    await userModel.syncIndexes()
   } catch (error) {
    console.log(`Fail to connect on DB`);
    console.log(error);
        
   }
    
}