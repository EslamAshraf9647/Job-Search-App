import { Router } from "express";
import { errorhandler } from "../../Middleware/error-handler.middleware.js";
import { ValidationMiddleware } from "../../Middleware/vaildation.middleware.js";
import * as validation from "../../Validators/Company/company.validators.js"
import * as companyService from "../../Modules/Company/Services/company.service.js"
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";
import { Multer } from "../../Middleware/multer.middleware.js";
import { ImageExtension } from "../../Constants/constants.js";

const companycontroller = Router()

companycontroller.post('/addCompany',
    errorhandler(authenticationMiddleware()),
    ValidationMiddleware(validation.AddCompany),
    errorhandler(companyService.AddCompanyService)
)

companycontroller.put('/updateCompany/:companyId',
    errorhandler(authenticationMiddleware()),
    ValidationMiddleware(validation.UpdateCompany),
    errorhandler(companyService.UpdateCompanyService)
)
companycontroller.delete('/deleteCompany/:companyId',
    errorhandler(authenticationMiddleware()),
    ValidationMiddleware(validation.SoftDeleteCompany),
    errorhandler(companyService.SofToftDeleteCompanyService)

)
companycontroller.get('/searchCompanyName/:companyName',
    errorhandler(companyService.SearchCompanyService),
    ValidationMiddleware(validation.SearchCompany)
)
companycontroller.patch('/companylogo/:companyId',
    errorhandler(authenticationMiddleware()),
    Multer('Company/logo',ImageExtension).single('logo'),
    ValidationMiddleware(validation.UploadCompanyLogo),
    errorhandler(companyService.UploadCompanyLogoService)
)
companycontroller.patch('/companyCover/:companyId',
    errorhandler(authenticationMiddleware()),
    Multer('Company/Cover',ImageExtension).single('cover'),
    ValidationMiddleware(validation.UploadCompanyCover),
    errorhandler(companyService.UploadCompanyCoverService)
)
companycontroller.delete('/deleteLogo/:companyId',
    errorhandler(authenticationMiddleware()),
    errorhandler(companyService.DeleteCompanyLogoService)
)

companycontroller.delete('/deleteCover/:companyId',
    errorhandler(authenticationMiddleware()),
    errorhandler(companyService.DeleteCompanyCoverService)
)


export default companycontroller