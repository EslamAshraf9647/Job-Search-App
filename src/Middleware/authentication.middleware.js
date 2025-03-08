import jwt from 'jsonwebtoken'
import BlackListTokens from '../DB/models/black-list-tokens.js'
import UserModel from '../DB/models/user.model.js'

export const authenticationMiddleware= () => {
    return async (req,res,next) =>{
        const {accesstoken} = req.headers
            if(!accesstoken){
                return res.status(400).json({message:"access token is required"})
            }
            //verify token 
            const decodedToken =jwt.verify(accesstoken , process.env.JWT_SECRET_LOGIN) 

            // check if token  is blacklisted 

            const isTokenBlacklisted = await BlackListTokens.findOne({tokenId:decodedToken.jti})
            if(isTokenBlacklisted){
                return res.status(401).json({message:"the token expired please login again"})
            }
             
            // get data from database

            const user = await UserModel.findById(decodedToken._id , '-password -__v ')
            if(!user){
                return res.status(401).json({message:"please signup"})
            }

            // add user to request

            req.loggedInUser= {...user._doc , token:{tokenId: decodedToken.jti , expiryDate: decodedToken.exp}} 
            next()
    }


}