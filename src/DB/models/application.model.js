import mongoose from "mongoose";
import *  as constants from "./src/Constants/constants.js"

const applicationSchema = new mongoose.Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Jobs",
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    userCV: {
        secure_url: String,
        public_id: String,
        required: true
    },
    status:{
        type:String,
        default:constants.applicationStatus.PENDING,
        enum:Object.values(constants.applicationStatus)

    },

},{timestamps:true})

const applicationModel = mongoose.models.application || mongoose.model('application',applicationSchema)

export default applicationModel