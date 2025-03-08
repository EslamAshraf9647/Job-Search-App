import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyName:{
        type:String,
        unique:true,
        required:true
    },
    description: String,
    industry: String,
    address: String,
    numberOfEmployees: {
        type: String,
        required: true,
        match: [/^\d{1,3}-\d{1,3}$/, 'numberOfEmployees must be a valid range like "11-20"'],
        validate: {
          validator: value => {
            const [min, max] = value.split('-').map(Number);
            return min < max;
          },
          message: 'numberOfEmployees must have a valid range where the first number is less than the second',
        },
      },
      companyEmail: {
        type: String,
        required: true,
        unique: true
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    HRs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    logo: {
        secure_url: String,
        public_id: String
    },
    coverPic: {
        secure_url: String,
        public_id: String
    },
    deletedAt: Date,
    bannedAt: Date,
    approvedByAdmin: Boolean,
    legalAttachment: {
        secure_url: String,
        public_id: String
    },

},{timestamps:true})


const companyModel = mongoose.models.Company || mongoose.model("Company",companySchema)

export default companyModel