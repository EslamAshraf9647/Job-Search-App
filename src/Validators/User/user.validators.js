import Joi from "joi";

export const UpdateAccount= {
    body: Joi.object({
        firstName: Joi.string().min(3).max(30).optional(),
        lastName: Joi.string().min(3).max(30).optional(),
        mobileNumber: Joi.string().pattern(/^\d{10,15}$/).optional(),
        DOB: Joi.date().iso().optional(),
        gender: Joi.string().optional(),
        
    })
}

export const updatePassword = {
    body: Joi.object({
        oldPassword: Joi.string().min(10).max(20).required(),
        newPassword: Joi.string().min(10).max(20).required().regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/
        ).messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 10 characters",
            "string.max": "Password must be at most 20 characters"
        }),
        ConfirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
            .messages({
                "any.only": "Passwords do not match",
                "string.empty": "Confirm password is required"
            }),
    })
}