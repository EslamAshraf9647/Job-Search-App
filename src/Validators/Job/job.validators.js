import Joi from "joi";
import { jobLocation, workingTime, seniorityLevel } from "../../Constants/constants.js";

export const AddJobSchema = {
    body: Joi.object({
        jobTitle: Joi.string().min(3).max(100).required(),
        jobLocation: Joi.string().valid(...Object.values(jobLocation)).required(),
        workingTime: Joi.string().valid(...Object.values(workingTime)).required(),
        seniorityLevel: Joi.string().valid(...Object.values(seniorityLevel)).required(),
        jobDescription: Joi.string().min(10).max(100).required(),
        technicalSkills: Joi.array().items(Joi.string().min(2)).required(),
        softSkills: Joi.array().items(Joi.string().min(2)).required(),
        companyId: Joi.string().required(),
    })
}


export const updateJob = {
    body: Joi.object({
        jobTitle: Joi.string().min(2).max(100).optional(),
        jobLocation: Joi.string().valid(...Object.values(jobLocation)).optional(),
        workingTime: Joi.string().valid(...Object.values(workingTime)).optional(),
        seniorityLevel: Joi.string().valid(...Object.values(seniorityLevel)).optional(),
        jobDescription: Joi.string().min(10).optional(),
        technicalSkills: Joi.array().items(Joi.string().min(2)).min(1).optional(),
        softSkills: Joi.array().items(Joi.string().min(2)).min(1).optional(),
        closed: Joi.boolean().optional(),
    }),

}

export const acceptOrRejectApplicant = {
    body: Joi.object({
        isAccepted: Joi.bool().required()
    }),
    params: Joi.object({
        applicationId: Joi.string().hex().length(24).required()
    })
}
