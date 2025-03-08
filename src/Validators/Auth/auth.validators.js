import Joi from "joi";

export const SignUpSchema = {
    body:Joi.object({
        firstName: Joi.string().min(3).max(10).required(),
        lastName: Joi.string().min(3).max(10).required(),
        email :Joi.string().email({
            tlds:{
                allow:['com' ,'yahoo'],
                deny:['net','org','io']
            },
            maxDomainSegments:2,
            multiple:true,
            separator:'#'
        }),
        password:Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
        .messages({
            'string.pattern.base':"password must be at least 8 characters long and contain at least one uppercase and one lowercase and speacial characters[@$!*%]"
        }),
        confirmPassword:Joi.string().required().valid(Joi.ref('password')),
        gender: Joi.string().valid("male", "female", "other").default("other"),
        mobileNumber:Joi.string().pattern(/^\+?\d{10,15}$/).required().messages({
            "string.pattern.base": "Phone number must be a valid international format"
        }), 
        role: Joi.string().valid("user", "admin").default("user"),
        DOB: Joi.date().iso().max("now").min(new Date(new Date().setFullYear(new Date().getFullYear() - 100))).required(),
    })

}

export const VerifyAccount = {
    body: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).pattern(/^\d{6}$/).required()
    })
}
export const Signin = {
    body:Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().required(),
    })
}


export const forgetPassword = {
    body: Joi.object({
        email: Joi.string().email().required(),
    })
}

export const ResetPassword = {
    body: Joi.object({
        email: Joi.string().email().required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Invalid email format"
            }),
        otp: Joi.string().length(6).pattern(/^\d+$/).required()
            .messages({
                "string.empty": "OTP is required",
                "string.length": "OTP must be exactly 6 digits",
                "string.pattern.base": "OTP must contain only numbers"
            }),
        password: Joi.string().min(8).max(30).required().pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/
        ).messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password must be at most 30 characters"
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
            .messages({
                "any.only": "Passwords do not match",
                "string.empty": "Confirm password is required"
            }),
    })
}