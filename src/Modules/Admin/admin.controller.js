import { Router } from "express";
import { roles } from "../../Constants/constants.js";
import { AuthorizationMidddleware } from "../../Middleware/authorization.moddleware.js";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";
import { errorhandler } from "../../Middleware/error-handler.middleware.js";
import * as adminServices from "../Admin/Services/admin.service.js"
import { checkAuthUser } from "../../Middleware/checkUser.middleware.js";

const admincontroller = Router()

const {ADMIN} = roles

admincontroller.post('/bannedUser',
    errorhandler(authenticationMiddleware()),
    errorhandler(checkAuthUser),
    AuthorizationMidddleware([ADMIN]),
    errorhandler(adminServices.BanUserService)
)
admincontroller.post('/bannedCompany',
    errorhandler(authenticationMiddleware()),
    errorhandler(checkAuthUser),
    AuthorizationMidddleware([ADMIN]),
    errorhandler(adminServices.BanCompanyService)
)

admincontroller.post('/approveCompany',
    errorhandler(authenticationMiddleware()),
    errorhandler(checkAuthUser),
    AuthorizationMidddleware([ADMIN]),
    errorhandler(adminServices.ApproveCompanyService)
)

export default admincontroller
