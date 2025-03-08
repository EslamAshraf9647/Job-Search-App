

export const AuthorizationMidddleware = (alowedRols) =>{
    return (req,res,next) => {
 
     try {
        const {role} = req.loggedInUser 
        const isRoleAllowed = alowedRols.includes(role)
      // console.log({ role, isRoleAllowed, allowedRoles })
            if(!isRoleAllowed){
                return res.status(401).json({message:"unauthorized"})
            }
        next()
     } catch (error) {
        console.log(error);
        res.status(500).json({message:"Intenal server error",error})
        
     }
    }
 }
 