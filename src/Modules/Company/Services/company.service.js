import { roles } from "../../../Constants/constants.js";
import companyModel from "../../../DB/models/company.model.js";
import UserModel from "../../../DB/models/user.model.js";

export const AddCompanyService = async (req, res) => {
    let { companyName, description, industry, address, numberOfEmployees, companyEmail, HRs, } = req.body;
    const { _id } = req.loggedInUser;

    const isCompanyExists = await companyModel.findOne({ $or: [{ companyName }, { companyEmail }] });
    if (isCompanyExists) {
        return res.status(409).json({ message: 'Company name or email already exists' });
    }

    const companyObject = {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        CreatedBy: _id,
    };

    if(HRs){
        if(typeof(HRs) === 'string'){
            HRs = [HRs]
        }
        const users = await UserModel.find({_id: {$in: HRs}, deletedAt: null, bannedAt: null})
        if(HRs.length !== users.length){
            return res.status(400).json({message: 'Invalid HRs ids'})
        }
        companyObject.HRs = HRs
    }
    const company = new companyModel(companyObject);
    await company.save();
    return res.status(201).json({ message: 'Company created successfully', company });
};



export const UpdateCompanyService = async (req, res) => {

        const { companyId } = req.params;
        const {companyName, description, industry, address, numberOfEmployees, companyEmail, HRs} = req.body  
        const { _id } = req.loggedInUser;
    
        const company = await companyModel.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
    
        if (company.CreatedBy.toString() !== _id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to update this company' });
        }
    
        if(company) company.companyName = companyName
        if(company) company.companyEmail = companyEmail
        if (description) company.description = description
        if (industry) company.industry = industry
        if (address) company.address = address
        if (numberOfEmployees) company.numberOfEmployees = numberOfEmployees
        if(HRs){
            const users = await UserModel.find({_id: {$in: HRs}, deletedAt: null, bannedAt: null})
            if(users.length !== HRs.length){
                return res.status(400).json({message: 'Invalid HRs ids'})
            }
            for (const HR of HRs) {
                if(company.HRs.includes(HR)){
                    return res.status(400).json({message: 'HR already added'})
                }
                company.HRs.push(HR)
            }
        }

    
        await company.save();
        return res.status(200).json({ message: 'Company updated successfully', company });
    };
    
     export const SofToftDeleteCompanyService = async (req, res) => {
        const {companyId} = req.params
        const {_id, role} = req.loggedInUser
    
        const company = await companyModel.findById(companyId)
        if(!company){
            return res.status(400).json({message: 'Company not found'})
        }
    
        if(company.CreatedBy.toString() !== _id.toString() && role !== roles.ADMIN){
            return res.status(400).json({message: 'Unauthorized, only the company owner or admins can delete the company'})
        }
        company.deletedAt = new Date()
        await company.save()
        return res.status(200).json({message: 'Company soft deleted successfully'})
    }

    export const SearchCompanyService = async (req, res) => {
        const {companyName} = req.params
    
        const company = await companyModel.findOne({companyName, deletedAt: null, bannedAt: null})
        if(!company){
            return res.status(404).json({message: 'Company not found '})
        }
        return res.status(200).json({message: 'Company data fetched successfully', company})
    }
    

export const UploadCompanyLogoService = async (req, res) => {
    const {_id} = req.loggedInUser
    const { companyId } = req.params;
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const company = await companyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    if (company.CreatedBy.toString() !== req.loggedInUser.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this company's logo" });
    }

    
    const url = `${req.protocol}://${req.headers.host}/${file.path}`
    const updatedCompany = await companyModel.findByIdAndUpdate(
      companyId,
      { logo: url },
      { new: true }
    );

    res.status(200).json({ message: "Company logo updated successfully", company: updatedCompany });;
};

export const UploadCompanyCoverService = async (req, res) => {
    const {_id} = req.loggedInUser
    const { companyId } = req.params;
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const company = await companyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    if (company.CreatedBy.toString() !== req.loggedInUser.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this company's cover" });
    }

    
    const url = `${req.protocol}://${req.headers.host}/${file.path}`
    const updatedCompany = await companyModel.findByIdAndUpdate(
      companyId,
      { coverPic: url },
      { new: true }
    );

    res.status(200).json({ message: "Company logo updated successfully", company: updatedCompany });;
};


export const DeleteCompanyLogoService = async (req, res) => {
    const { companyId } = req.params;
    const { _id } = req.loggedInUser;

    const company = await companyModel.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: 'Company not found' });
    }

    if (company.CreatedBy.toString() !== _id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to delete this company logo' });
    }

    company.logo = null;
    await company.save();

    return res.status(200).json({ message: 'Company logo deleted successfully', company });
};


export const DeleteCompanyCoverService = async (req, res) => {
    const { companyId } = req.params;
    const { _id } = req.loggedInUser;

    const company = await companyModel.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: 'Company not found' });
    }

    if (company.CreatedBy.toString() !== _id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to delete this company logo' });
    }

    company.coverPic = null;
    await company.save();

    return res.status(200).json({ message: 'Company cover deleted successfully', company });
};

