import UserModel from "../../../DB/models/user.model.js";
import companyModel from "../../../DB/models/company.model.js";

export const BanUserService = async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "user not found" })
    if (user.bannedAt) {
        await UserModel.updateOne({ email }, { $unset: { bannedAt: 1 } });
        return res.status(200).json({ message: "user unbanned successfully" })
    }
    user.bannedAt = new Date()
    await user.save()
    res.status(200).json({ message: " user banned successfully" })
}


export const BanCompanyService = async (req, res) => {
    const { companyEmail } = req.body;
    const company = await companyModel.findOne({ companyEmail })
    if (!company) return res.status(404).json({ message: "company not found" })
    if (company.bannedAt) {
        await companyModel.updateOne({ companyEmail }, { $unset: { bannedAt: 1 } });
        return res.status(200).json({ message: "company unbanned successfully" })
    }
    company.bannedAt = new Date()
    await company.save()
    res.status(200).json({ message: " Company banned successfully" })
}

export const ApproveCompanyService = async (req, res) => {
    const { companyEmail } = req.body
    const company = await companyModel.findOne({ companyEmail })
    if (!company) return res.status(404).json({ message: "company not found" })
    if (company.approvedByAdmin) return res.status(400).json({ message: "company already approved" })
    company.approvedByAdmin = true
    await company.save()
    res.status(200).json({ message: `yor company is approved by the admin` })
}