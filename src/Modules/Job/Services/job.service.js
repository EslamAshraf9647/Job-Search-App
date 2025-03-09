import JobOpportunityModel from "../../../DB/models/Job opportunity.model.js";
import companyModel from "../../../DB/models/company.model.js";
import mongoose from "mongoose";
import applicationModel from "../../../DB/models/application.model.js";
import { Application_Accept,Application_Reject } from "../../../Utils/email-tempelte.js";
import { populate } from "dotenv";
import { emitter } from "../../../Services/send-email.service.js";
import { applicationStatus } from "../../../Constants/constants.js";

export const AddJobService = async (req, res) => {
    const {_id} = req.loggedInUser 
    const {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, companyId} = req.body
     
    const company = await companyModel.findOne({_id: companyId, bannedAt: { $exists: false }, deletedAt: { $exists: false }})
    if(!company){
        return res.status(404).json({message: 'Company not found'})
    }

    if( company.CreatedBy.toString() !== _id.toString() && !company.HRs.includes(_id)){
        return res.status(400).json({message: 'Unautharized'})
    }

    const jobObject = {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel, 
        jobDescription, 
        technicalSkills,
        softSkills, 
        addedBy: _id, 
        companyId
    }
    
    const job = await JobOpportunityModel.create(jobObject)
    return res.status(200).json({message: 'Job addedd successfully', job})
}

export const updateJobService = async (req, res) => {
    const { jobTitle, jobLocation, workingTime,
        seniorityLevel, jobDescription, technicalSkills, softSkills, closed } = req.body;
    const { jobId } = req.params
    const {_id} = req.loggedInUser
    const job = await JobOpportunityModel.findById(jobId)
    if(!job){
        return res.status(404).json({message: 'Job not found'})
    }

    const company = await companyModel.findOne({_id: job.companyId, deletedAt: null, bannedAt: null})
    if(!company){
        return res.status(404).json({message: 'Company not found'})
    }

    if(company.CreatedBy.toString() !== _id.toString()){
        return res.status(400).json({message: 'You can not add job'})
    }

    const updatedJob = await JobOpportunityModel.findOneAndUpdate({_id: job._id},
        { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, closed, updatedBy: _id },
        {new: true}
    )
    return res.status(200).json({message: 'Job updated successfully', updatedJob})
} 


export const DeleteJobService = async (req, res) => {
    const {_id} = req.loggedInUser
    const {jobId} = req.params

    const job = await JobOpportunityModel.findById(jobId)
    if(!job){
        return res.status(404).json({message: 'Job not found'})
    }

    const company = await companyModel.findOne({_id: job.companyId, deletedAt: null, bannedAt: null})
    if(!company){
        return res.status(404).json({message: 'Company not found'})
    }

    if(!company.HRs.includes(_id)){
        return res.status(400).json({message: 'You can not delete job'})
    }
    await JobOpportunityModel.deleteOne({_id: jobId})
    return res.status(200).json({message: 'Job deleted successfully'})
}

export const GetCompanyJobs = async (req, res) => {
    const { companyId } = req.params;
        let { page = 1, limit = 3 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 3;
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "Invalid Company ID" });
        }
        const jobs = await JobOpportunityModel.find({ companyId })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Jobs fetched successfully",
            total: jobs.length,
            page,
            limit,
            jobs
        });
}


export const GetJobApplications = async (req, res) => {

    const { jobId } = req.params
     const {_id} = req.loggedInUser
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "CV file is required" });
        }

        const job = await JobOpportunityModel.findOne({ _id: jobId, deletedAt: null, bannedAt: null });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const applicationObject = {
            userId:_id,
            jobId,
            userCV: req.file.path,
        };

        const application = await applicationModel.create(applicationObject);

        return res.status(201).json({
            message: "Job applied successfully",
            application
        });
}

export const AcceptOrRejectApplicant = async (req, res) => {
    const {applicationId} = req.params
    let {isAccepted} = req.body
    const {_id} = req.loggedInUser
    
    if(isAccepted === 'true')   isAccepted = true
    if(isAccepted === 'false')  isAccepted = false
    
    
    const application = await applicationModel.findOne({_id: applicationId, status: applicationStatus.PENDING}).populate(
        [
            {
                path: 'jobId',
                select: 'jobTitle addedBy -_id'
            },
            {
                path: 'userId',
                select: 'email firstName lastName'
            }
        ]
    )
    if(!application){
        return res.status(404).json({message: 'Application not found'})
    }
    
    // jobId.addedBy
    if(application.jobId.addedBy.toString() !== _id.toString()){
        return res.status(400).json({message: 'Unauthorized, only the job HR can perform this action'})
    }

    if(isAccepted){
        application.status = applicationStatus.ACCEPTED

        emitter.emit('sendEmail', {
            to: application.userId.email,
            subject: 'Job Application Status',
            html: Application_Accept(`${application.userId.firstName} ${application.userId.lastName}`)
        })
        await application.save()
        return res.status(200).json({message: 'Application accepted', application})
    }

    if(!isAccepted){
        application.status = applicationStatus.REJECTED

        emitter.emit('sendEmail', {
            to: application.userId.email,
            subject: 'Job Application Status',
            html: Application_Reject(`${application.userId.firstName} ${application.userId.lastName}`)
        })
        await application.save()
        return res.status(200).json({message: 'Application rejected', application})
    }
}