import mongoose from "mongoose";
import *  as constants from "../../Constants/constants.js"

const JobOpportunitySchema = new mongoose.Schema({
    jobTitle:{
        type:String,
        required:true,
    },
    jobLocation :{
        type:String,
        enum:Object.values(constants.jobLocation),
        required:true,
    },
    workingTime :{
        type:String,
        enum:Object.values(constants.workingTime),
        required:true,
    },
    seniorityLevel:{
        type:String,
        enum:Object.values(constants.seniorityLevel),
        required:true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    technicalSkills: [{
        type: String,
        required: true,
    }],
    softSkills: [{
        type: String,
        required: true,
    }],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    closed: {
        type: Boolean,
        default: false
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    }

},{timestamps:true})

const JobOpportunityModel = mongoose.models.Jobs || mongoose.model('Jobs',JobOpportunitySchema)

export default JobOpportunityModel