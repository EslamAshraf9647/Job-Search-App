import UserModel from "../DB/models/user.model.js";

export const checkAuthUser = async (req, res, next) => {
    if (!req.loggedInUser || !req.loggedInUser._id) {
        return res.status(401).json({ message: "Unauthorized. Please login first." });
    }

    const user = await UserModel.findById(req.loggedInUser._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.bannedAt || user.deletedAt) {
        return res.status(403).json({ message: "User account is frozen or deleted" });
    }

    req.user = user;
    next();
}