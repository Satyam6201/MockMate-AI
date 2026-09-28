import genToken from "../config/token.js";
import User from "../model/user.model.js";

// Controller for the google Auth
export const googleAuth = async (req, res) => {
    try {
        const {name, email} = req.body;

        let user = await User.findOne({email});
        if (!user) {
            user = await User.create({
                name,
                email
            })
        }

        const isProduction = process.env.NODE_ENV === "production";
        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days 
        });

        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: `error is coming from googleAuth ${error}`});
    }
}

// Controller for the logout
export const logout = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });
        return res.status(200).json({message: "Logout Successfully"});
    } catch (error) {
        return res.status(500).json({message: `Logout error ${error}`});
    }
}