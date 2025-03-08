import { globalErrorHandler } from "../Middleware/error-handler.middleware.js";
import admincontroller from "../Modules/Admin/admin.controller.js";
import authcontroller from "../Modules/Auth/auth.controller.js";
import companycontroller from "../Modules/Company/company.controller.js";
import jobcontroller from "../Modules/Job/job.controller.js";
import usercontroller from "../Modules/User/user.controller.js";


const routerhandler = (app,express) => {
    app.use('/auth',authcontroller)
    app.use('/user',usercontroller)
    app.use('/company',companycontroller)
    app.use('/admin',admincontroller)
    app.use('/job',jobcontroller)
    app.use("/Assets",express.static("Assets"))

    app.get('/',(req,res) => res.status(200).json({message:"welcome to saraha app"}))

    app.all('*',(req,res) => res.status(404).json({
        message:"Route not found please make sure from your url and your method"
    }))


    app.use(globalErrorHandler)

}
export default routerhandler