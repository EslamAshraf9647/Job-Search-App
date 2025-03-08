import UserModel from "../../../DB/models/user.model.js"
import { hashing, comparing } from "../../../Utils/crypto.utils.js"
import { emitter } from "../../../Services/send-email.service.js"
import emailTemplate from "../../../Utils/email-tempelte.js"
import { DateTime } from "luxon";
import jwt from 'jsonwebtoken'
import {v4 as uuidv4} from 'uuid'
import BlackListTokens from "../../../DB/models/black-list-tokens.js";



export const SignUpService = async(req,res) => {
    const { firstName, lastName, email, password, confirmPassword, gender, DOB, mobileNumber, role } = req.body
    if(password != confirmPassword){
        return res.status(400).json({message:'password not equal confirmPassword'})
    }
    const isEmailExsist = await UserModel.findOne({email})
    if(isEmailExsist){
        return res.status(409).json({message:"Email is already Exsist"})
    }
    
    // generate otp 

    const otp= Math.floor(100000 + Math.random() * 900000).toString()
    const hashedOtp = hashing(otp, +process.env.SALT)  
    const otp_expires =new Date(Date.now() + 10 * 60 *1000) 

     // Calculate the remaining minutes before OTP expires

    //  const now = new Date();
    //  const otpExpirationMinutes = Math.round((otp_expires - now) / (1000 * 60))

      // send verfication Email with OTP 

      emitter.emit('SendEmail',
        {
            to:email,
            subject:'verfiy your Email ',
            html:emailTemplate(firstName , otp)
        }
      )

      const birthDay = DateTime.fromISO(DOB).toJSDate();
      const user = new UserModel({
          firstName, lastName, email, password, mobileNumber, gender, role, DOB: birthDay,
          otp: [{ code: hashedOtp, type: "confirmEmail", expiresIn: otp_expires }]
      })
      await user.save()
      if(!user){
        return res.status(500).json({message:"create Account is failed"})
    }
      res.status(201).json({ message: "Account created successfully" })
  }


  export const VerifyAccountService = async(req,res) => {

            const { email, otp } = req.body;
      
            const user = await UserModel.findOne({ email, isEmailVerified: false });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const otpEntry = user.otp.find(entry => entry.type === "confirmEmail");
            if (!otpEntry) {
                return res.status(400).json({ message: "OTP not found" });
            }
            if (otpEntry.expiryDate < Date.now()) {
                return res.status(400).json({ message: "OTP has expired" });
            }
            const isOtpMatched = comparing(otp, otpEntry.code);
            if (!isOtpMatched) {
                return res.status(400).json({ message: "Invalid OTP" });
            }
            await UserModel.findByIdAndUpdate(user._id, {
                isEmailVerified: true,
                $pull: { otp: { type: "confirmEmail" } }, 
            });
    
            return res.status(200).json({ message: "Email verified successfully" });
        
    };

    export const SigninService = async(req,res) => {
        const {email , password} = req.body 
        const user = await UserModel.findOne({email, isEmailVerified:true})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        if(user.bannedAt || user.deletedAt){
            return res.status(403).json({message:"user frezzed"})
        }
        const isPasswordMatched = comparing(password, user.password)
        if(!isPasswordMatched){
            return res.status(400).json({message:"Invaild Email or password"})
        }
        const accesstoken = jwt.sign(
            {_id:user._id, email:user.email},
            process.env.JWT_SECRET_LOGIN,
            {expiresIn:"1h",jwtid:uuidv4()}
        )
        const refreshtoken = jwt.sign(
            {_id:user._id, email:user.email},
            process.env.JWT_SECRET_REFRESH,
            {expiresIn:"7d",jwtid:uuidv4()}
        )
        res.status(200).json({message:"User login Successfully",accesstoken,refreshtoken})

    }

    export const RefreshTokenService =async (req,res) => {
        
        const{ refreshtoken} = req.headers
        if(!refreshtoken){
            return res.status(401).json({message:"Refresh token is required"})
        }
        const decodedRefreshToken = jwt.verify(refreshtoken, process.env.JWT_SECRET_REFRESH,)
        const isRefreshTokenBlacklisted = await BlackListTokens.findOne({ tokenId: decodedRefreshToken.jti });
    if (isRefreshTokenBlacklisted) return res.status(400).json({ message: "accesstoken already blacklisted" })
        const user = await UserModel.findById(decodedRefreshToken._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.changeCredentialTime) {
        const passwordChangedTimestamp = parseInt(user.changeCredentialTime.getTime() / 1000, 10);
        if (passwordChangedTimestamp > decodedRefreshToken.iat) {
            return res.status(401).json({ message: "Token expired due to password change" });
        }
    }
    const accesstoken = jwt.sign(
         { _id: decodedRefreshToken._id, email: decodedRefreshToken.email },
         process.env.JWT_SECRET_LOGIN,
         { expiresIn: '1h', jwtid: uuidv4() })
         
         
    res.status(200).json({ message: "accesstoken refershed successfully", accesstoken });
}


export const SignOutService = async (req,res) => {
    
        const {accesstoken,refreshtoken} = req.headers;
        const decodedData =jwt.verify(accesstoken,process.env.JWT_SECRET_LOGIN) 
        const decodedRefershToken =jwt.verify(refreshtoken,process.env.JWT_SECRET_REFRESH)
       // insert token id to black list 
       
       await BlackListTokens.insertMany([
        {
            tokenId:decodedData.jti,
            expiryDate:decodedData.exp
        },
        {
            tokenId:decodedRefershToken.jti,
            expiryDate:decodedRefershToken.exp
        }
       ])
       res.status(201).json({message:"user logged out successfully"})
    
}

export const forgetPasswordService = async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "user not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = hashing(otp,+process.env.SALT);
    const otp_expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Send OTP via email
    emitter.emit("SendEmail", {
        to: email,
        subject: "Your OTP code",
        html: emailTemplate(user.firstName, otp, "reset your password"),
    });

    // Save OTP in user document
    await UserModel.findByIdAndUpdate(user._id, {
        otp: { code: hashedOtp, type: "forgetPassword", expiresIn: otp_expires },
    });

    res.status(202).json({ message: "OTP sent successfully" });
}

export const ResetPasswordService = async (req, res) => {
        const { email, otp, password, confirmPassword } = req.body;
        if(password != confirmPassword){
            return res.status(400).json({message:'password not equal confirmPassword'})
        }
        const user = await UserModel.findOne({ email })
        if (!user) return res.status(400).json({ message: "Email is not Registred" });
        const otpEntry = user.otp.find(entry => entry.type === "forgetPassword");
        if (!otpEntry || DateTime.now() > otpEntry.expiresIn) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        const isOtpValid = comparing(otp.toString(), otpEntry.code);
        if (!isOtpValid) {
            return res.status(401).json({ message: "Invalid OTP" });
        }
        const hashedPassword = hashing(password, +process.env.SALT)
        await UserModel.findByIdAndUpdate(user._id, {
            password: hashedPassword, $pull: { otp: { type: "forgetPassword" } }
        });
        res.status(200).json({ message: "password reset successfully" });
    }
    

 




