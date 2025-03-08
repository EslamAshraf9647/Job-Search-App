import { Router } from "express";
import * as jobservice from "../Job/Services/job.service.js"
import { AuthorizationMidddleware } from "../../Middleware/authorization.moddleware.js";
import { errorhandler } from "../../Middleware/error-handler.middleware.js";
import { ValidationMiddleware } from "../../Middleware/vaildation.middleware.js";
import *  as validation  from "../../Validators/Job/job.validators.js"
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";

const jobcontroller = Router()

jobcontroller.post('/addJob',
    errorhandler(authenticationMiddleware()),
    ValidationMiddleware(validation.AddJobSchema),
    errorhandler(jobservice.AddJobService)
)

export default jobcontroller 
