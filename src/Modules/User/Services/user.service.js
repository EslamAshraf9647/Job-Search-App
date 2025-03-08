import UserModel from "../../../DB/models/user.model.js";
import { comparing, } from "../../../Utils/crypto.utils.js";
import BlackListTokens from "../../../DB/models/black-list-tokens.js";

export const UpdateUserAccountService = async (req, res) => {

    const {_id} = req.loggedInUser
    const { mobileNumber, DOB, firstName, lastName, gender, } = req.body;
    const user = await UserModel.findById(_id)
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (gender) user.gender = gender
    if (DOB) user.DOB = DOB
    if (mobileNumber) req.user.mobileNumber = mobileNumber;
    await user.save()
    res.status(201).json({ message: "Your Account updated successfully" })
}


export const getLoggedInUser = async (req, res) => {
 
        if (!req.loggedInUser || !req.loggedInUser._id) {
            return res.status(401).json({ message: "Unauthorized. Please login first." });
        }

        const user = await UserModel.findById(req.loggedInUser._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
   
};

export const getUserProfile = async (req, res) => {
  
        const { _id } = req.params;
        const user = await UserModel.findById(_id).select("firstName lastName mobileNumber deletedAt");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
   
};

export const UpdatePasswordService = async (req,res) => {
    
    const {_id} = req.loggedInUser
    const {oldPassword , newPassword , ConfirmPassword}= req.body
    if(newPassword!= ConfirmPassword){
        return res.status(400).json({message:'password not equal confirmPassword'})
    }
    const user = await UserModel.findById(_id)
    const isPasswordMatched =comparing(oldPassword, user.password)   
    if(!isPasswordMatched) return res.status(400).json({message:"Invaild password"})
   user.password= newPassword
   user.changeCredentialTime = Date.now()
   await user.save()

   // revoke token 
   await BlackListTokens.create(req.loggedInUser.token)
   res.status(200).json({message:"Password updated successfully"})
}

export const SoftDeleteUserService = async (req, res) => {
    const { _id } = req.loggedInUser; 

    const user = await UserModel.findById(_id);
    if (!user){
         return res.status(404).json({ message: "User not found" });
    }
    if (user.deletedAt) {
        return res.status(400).json({ message: "User already deleted" });
    }
    user.deletedAt = Date.now();
    await user.save();

    res.status(200).json({ message: "Account deleted successfully (soft delete)" });
};

 export const UploadProfilePic = async (req, res) => {
    const {_id} = req.loggedInUser
    const {file} = req 
    if(!file){
        return res.status(400).json({message:"No file uploaded"})
    }
    const url = `${req.protocol}://${req.headers.host}/${file.path}`
    const user = await UserModel.findByIdAndUpdate(_id,{profilePic:url}, {new:true});
    res.status(200).json({ message: "Profile picture updated", user });
};

export const UploadCoverPic = async (req, res) => {
    const {_id} = req.loggedInUser
    const {files} = req 
    if(!files?.length){
        return res.status(400).json({message:"No file uploaded"})
    }
    const Images = files.map(file => `${req.protocol}://${req.headers.host}/${file.path}`) 
    const user = await UserModel.findByIdAndUpdate(_id,{coverPic:Images}, {new:true});
    res.status(200).json({ message: "Cover picture uploaded successfully", user });

};

export const DeleteProfilePic = async (req, res) => {
   
        const { _id } = req.loggedInUser;
        const user = await UserModel.findByIdAndUpdate(
            _id,
            { profilePic: null },
            { new: true }
        );

        res.status(200).json({ message: "Profile picture deleted", user });
    }

 export const DeleteCoverPic = async (req, res) => {
   
        const { _id } = req.loggedInUser;
        const user = await UserModel.findByIdAndUpdate(
            _id,
            { coverPic: null },
            { new: true }
        );

        res.status(200).json({ message: "Cover picture deleted", user });
    }

