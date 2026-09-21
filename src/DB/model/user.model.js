import mongoose from "mongoose";
import { GenderEnum } from "../../common/enum/user.gender.js";
import { RoleEnum } from "../../common/enum/role.enum.js";



const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:25
    },
    lastName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:25
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    phone:String,
    DOB:Date,
    confirmEmail:Date,
    image:String,
    coverImage:[String],
    gender:{
        type:Number,
        enum:Object.values(GenderEnum),
        default:GenderEnum.MALE
    },
    role:{
        type:Number,
        enum:Object.values(RoleEnum),
        default:RoleEnum.USER
    
    }

    

},{
    timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    strict:true,
    strictQuery:true,
    autoIndex:true
})

userSchema.virtual("username").set(function(value){
    const [firstName , lastName] = value?.split(" ") || [];
    this.set({firstName,lastName})
}).get(function(){
    return `${this.firstName} ${this.lastName}`
})
export const userModel = mongoose.models.User || mongoose.model("User",userSchema)