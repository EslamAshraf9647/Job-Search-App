import mongoose from "mongoose";
import * as Constants from "../../Constants/constants.js";
import { Encryption, Decryption, hashing, comparing} from "../../Utils/crypto.utils.js";


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        tirm:true,
        required:true
    },
    lastName:{
        type:String,
        tirm:true,
        required:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email is already taken"],
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    provider:{
        type:String,
        default:Constants.provider.SYSTEM,
        enum:Object.values(Constants.provider),
        required:true
    },
    gender:{
        type:String,
        default:Constants.gender.OTHER,
        emum:Object.values(Constants.gender),
        required:true
    },
    DOB: {
        type: Date,
        validate: {
            validator: function (value) {
                const today = new Date();
                const minAge = new Date();
                minAge.setFullYear(today.getFullYear() - 18);
                return value < today && value <= minAge;
            },
            message: "DOB must be a valid date and user must be at least 18 years old"
        }
    },
    mobileNumber:{
        type:String
    },
    role:{
        type:String,
        default:Constants.roles.USER,
        enum:Object.values(Constants.roles)
    },
    isEmailVerified:{
        type:Boolean,
        default:false,
    },
    deletedAt: Date,
    bannedAt: Date,
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    changeCredentialTime: Date,
        otp: [{
            code: {
                type: String,
                required: true
            },
            type: {
                type: String,
                enum: Object.values(Constants.otpUsage),
                required: true
            },
            expiresIn: {
                type: Date,
                required: true
            }
        }],
        profilePic: {
            secure_url: String,
            public_id: String
        },
        coverPic: {
            secure_url: String,
            public_id: String
        },
    

},{ 
    timestamps:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


     userSchema.virtual("userName").get(function () {
    return `${this.firstName} ${this.lastName}`;
      });


      userSchema.pre('save', async function (next) {
        console.log(this);
        
           if (this.isModified('mobileNumber')) this.mobileNumber = await  Encryption({value:this.mobileNumber,secretKey:process.env.ENCRYPTED_KEY})
           if (this.isModified('password')) this.password =  hashing(this.password, +process.env.SALT)
            console.log(this);
                next()
    })
      userSchema.post("findOne", async function (doc) {
           if (doc) {
              console.log(doc.mobileNumber)
              doc.mobileNumber = await Decryption({cipher:doc.mobileNumber,secretKey:process.env.ENCRYPTED_KEY});
              console.log(doc.mobileNumber)
    }
});

const UserModel =  mongoose.models.User || mongoose.model('User',userSchema)

export default UserModel 
