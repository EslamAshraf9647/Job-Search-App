import JobOpportunityModel from "../../../DB/models/Job opportunity.model.js";
import companyModel from "../../../DB/models/company.model.js";

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