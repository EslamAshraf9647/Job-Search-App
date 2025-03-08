import { Router } from "express";
import * as authServices from './Services/authentication.service.js'
import { errorhandler } from "../../Middleware/error-handler.middleware.js";
import { ValidationMiddleware } from "../../Middleware/vaildation.middleware.js";
import * as validation from "../../Validators/Auth/auth.validators.js";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";

const authcontroller = Router()

authcontroller.post('/signup',
    ValidationMiddleware(validation.SignUpSchema),
    errorhandler(authServices.SignUpService))

authcontroller.post('/verify',
    ValidationMiddleware(validation.VerifyAccount),
    errorhandler(authServices.VerifyAccountService)
)

authcontroller.post('/signin',
    ValidationMiddleware(validation.Signin),
    errorhandler(authServices.SigninService)
)

authcontroller.post('/refresh',
    errorhandler(authServices.RefreshTokenService)
)

authcontroller.post('/signout',
    errorhandler(authenticationMiddleware()),
    errorhandler(authServices.SignOutService)
)

authcontroller.post('/forget',
    ValidationMiddleware(validation.forgetPassword),
    errorhandler(authServices.forgetPasswordService)
)

authcontroller.post('/reset',
    ValidationMiddleware(validation.ResetPassword),
    errorhandler(authServices.ResetPasswordService)
)




export default authcontroller