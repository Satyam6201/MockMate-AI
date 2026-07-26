import User from "../model/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({message: "User is Not Found!"});
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message: `Failed to get User ${error}`});
    }
}