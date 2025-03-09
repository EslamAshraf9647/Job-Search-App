import { Router } from "express";
import * as jobservice from "../Job/Services/job.service.js"
import { AuthorizationMidddleware } from "../../Middleware/authorization.moddleware.js";
import { errorhandler } from "../../Middleware/error-handler.middleware.js";
import { ValidationMiddleware } from "../../Middleware/vaildation.middleware.js";
import *  as validation  from "../../Validators/Job/job.validators.js"
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";
import { Multer } from "../../Middleware/multer.middleware.js";
import { DocumentExtension, roles } from "../../Constants/constants.js";

const jobcontroller = Router()

jobcontroller.post('/addJob',
    errorhandler(authenticationMiddleware()),
    ValidationMiddleware(validation.AddJobSchema),
    errorhandler(jobservice.AddJobService)
)

jobcontroller.put('/updateJob/:jobId',
    errorhandler(authenticationMiddleware()),
    ValidationMiddleware(validation.updateJob),
    errorhandler(jobservice.updateJobService)
)

jobcontroller.delete('/deleteJob/:jobId',
    errorhandler(authenticationMiddleware()),
    errorhandler(jobservice.DeleteJobService)
)
jobcontroller.get('/companyJobs/:companyId',
    errorhandler(jobservice.GetCompanyJobs)

)

jobcontroller.get('/applyJob/:jobId',
    errorhandler(authenticationMiddleware()),
    AuthorizationMidddleware(roles.USER),
    Multer('Application/Cv',DocumentExtension).single('cv'),
    errorhandler(jobservice.GetJobApplications)

)

jobcontroller.patch('/AcceptedOrRejected/:applicationId',
    errorhandler(authenticationMiddleware()),
    ValidationMiddleware(validation.acceptOrRejectApplicant),
    errorhandler(jobservice.AcceptOrRejectApplicant)

)

export default jobcontroller 
