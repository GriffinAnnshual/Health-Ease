import RegisterModel from "../Models/UserCredentials.js" 
import jwt from "jsonwebtoken"

const auth = async (req, res, next) => {
	const authheader = req.headers.authorization
    const token = authheader.split(" ")[1];
    if (token == null) return res.sendStatus(401) 
    else{
    console.log(token)
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await RegisterModel.findById(decode.id).select("-password");
    next();
    }
}

export default auth;
