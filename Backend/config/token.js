import jwt from "jsonwebtoken"

const genToken = async (userId) => {
    try {
        const token = jwt.sign({userId}, 
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d"}
        );
        return token;
    } catch (error) {
        console.log(`Error come from ${error}`);
    }
}

export default genToken;