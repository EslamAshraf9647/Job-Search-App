import { Router } from "express";
import * as userService from "./Services/user.service.js"
import { ValidationMiddleware } from "../../Middleware/vaildation.middleware.js";
import * as validation from "../../Validators/User/user.validators.js"
import { errorhandler } from "../../Middleware/error-handler.middleware.js";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";
import { checkAuthUser } from "../../Middleware/checkUser.middleware.js";
import { Multer } from "../../Middleware/multer.middleware.js";
import { ImageExtension } from "../../Constants/constants.js";



const usercontroller = Router()

usercontroller.patch('/updateAccount',
    ValidationMiddleware(validation.UpdateAccount),
    errorhandler(authenticationMiddleware()),
    errorhandler(checkAuthUser),
    errorhandler(userService.UpdateUserAccountService)

)

usercontroller.get('/userData',
    errorhandler(authenticationMiddleware()),
    errorhandler(checkAuthUser),
    errorhandler(userService.getLoggedInUser)
)
usercontroller.get('/profileData/:_id',
    errorhandler(userService.getUserProfile)
)

usercontroller.patch('/updatePassword',
    ValidationMiddleware(validation.updatePassword),
    errorhandler(authenticationMiddleware()),
    errorhandler(checkAuthUser),
    errorhandler(userService.UpdatePasswordService)
)


usercontroller.delete('/delete', 
    errorhandler(authenticationMiddleware()),
    errorhandler(checkAuthUser),
    errorhandler(userService.SoftDeleteUserService)
)

usercontroller.patch('/uploadProfilePic',
    errorhandler(authenticationMiddleware()),
    Multer('User/Profile',ImageExtension).single('image'),
    errorhandler(checkAuthUser),
    errorhandler(userService.UploadProfilePic),
    
)


usercontroller.post('/uploadCoverPic',
    errorhandler(authenticationMiddleware()),
    Multer('User/Cover',ImageExtension).array('cover'),
    errorhandler(checkAuthUser),
    errorhandler(userService.UploadCoverPic)
)

usercontroller.delete('/deleteProfile',
    errorhandler(authenticationMiddleware()),
    errorhandler(checkAuthUser),
    errorhandler(userService.DeleteProfilePic)

)
usercontroller.delete('/deleteCover',
    errorhandler(authenticationMiddleware()),
    errorhandler(checkAuthUser),
    errorhandler(userService.DeleteCoverPic)

)
export default usercontroller 
