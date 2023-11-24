import RegisterModel from "../Models/UserCredentials.js"
import jwt from "jsonwebtoken"
import bodyParser from "body-parser"
const auth = async (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")

    console.log("in header")
	const authheader = req.headers
    console.log(authheader)
	const token = authheader.authorization.split(" ")[1]
	if (token == null)
		return res.sendStatus(401).json({ message: "token not founds" })
	else {
		console.log(token)
		console.log(process.env.JWT_SECRET)
		const decode = jwt.verify(token, process.env.JWT_SECRET)
		console.log(decode)
		req.user = await RegisterModel.findOne({ _id : decode.id }).exec()
		next()
	}
}

export default auth
