import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import RegisterModel from "./Models/UserCredentials.js";
import dotenv from "dotenv"
dotenv.config()
import bcrypt from "bcrypt";
const app = express();
app.use(express.json());
app.use(cors());
import OpenAI from "openai"
import sbd from "sbd"

const apiKey = process.env.API_KEY // Replace with your OpenAI API key
const openai = new OpenAI({ apiKey: apiKey })


import { MongoClient } from "mongodb"
import fs from "fs";

import jwt  from "jsonwebtoken";
import auth from "./middleware/authMiddleware.js"

const uri = process.env.ATLAS_SECRET;
mongoose.connect(uri)


const connection = mongoose.connection;
connection.once('open',()=>{
  console.log("Database connection established!");
})


// app.get("/v", (req, res) => {
//   console.log("hhfa");
// });


app.post("/register", async(req, res) => {
  while (!connection){
    continue;
  }
  console.log(req.body)
  console.log(req.body);
	const aadhar = req.body.AadharNumber
	const name = req.body.name
	const phone = req.body.phone
	const password = req.body.password
	const confirmPassword = req.body.confirmPassword
	const useraadharExists = await RegisterModel.findOne({
		AadharNumber: aadhar,
	}).exec()
	const usernameExists = await RegisterModel.findOne({ name: name }).exec()
	const userphoneExists = await RegisterModel.findOne({
		phoneNumber: phone,
	}).exec()
	var credential = true
 
	if (usernameExists || userphoneExists || useraadharExists) {

		console.log("User already exists");   
	}
	// Create user
	else{

	if (password != confirmPassword) {
		var credential = false
	} 
	else {
			const password = req.body.password
			const key = await bcrypt.genSalt(10)
			const hashPassword = await bcrypt.hash(password, key)
			req.body.password = hashPassword
			RegisterModel.create(req.body)
				.then(() => {
					console.log("Registered")
				})
				.catch((err) => consolge.log(err))
	}

	} 


res.json({"userExists": usernameExists + useraadharExists + userphoneExists + credential+"_"+"credential"});
});



let current = {};

app.post("/login", async (req, res) => {
	while (!connection) {
		continue
	}
	console.log(req.body)

	const name = req.body.name
	const user = await RegisterModel.findOne({ name: name }).exec()
	
	console.log(user)

if (user && await bcrypt.compare(req.body.password,user.password)) {
	res.json({
		_id: user._id,
		name:user.name,
		aadhar: user.AadharNumber,
		phone: user.phoneNumber,
		token: generateToken(user._id),
		status: "Login successful"
	})
	console.log({
		_id: user._id,
		name: user.name,
		aadhar: user.AadharNumber,
		phone: user.phoneNumber,
		token: generateToken(user._id),
		status: "Login successful",
	})

	const dataToStore = {
 	 name: name
};
const jsonData = JSON.stringify(dataToStore);
const filePath = 'user.json';
fs.writeFile(filePath, jsonData, (err) => {
  if (err) {
    console.error('Error writing to JSON file:', err);
  } else {
    console.log('Data has been written to the JSON file.');
  }
});

}
else{

	res.status(404).json({msg: "Invalid User Data"})

}


});

const generateToken = (id) => {
	return jwt.sign({id},process.env.JWT_SECRET,{
		expiresIn: "10d"
	})
}

app.get("/me", async(req,res)=>{
const {_id,name,aadhar,phone} = await RegisterModel.findById(req.user.id);
return res.status(200).json({_id,name,aadhar,phone})
});


app.get("/getUserDetails", async(req, res) => {

const url = process.env.ATLAS_SECRET
const client = new MongoClient(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

client.connect((err) => {
	if (err) {
		console.error("Error connecting to MongoDB:", err)
		return
	}
	console.log("Connected to MongoDB")
})
const db = client.db("test"); 
const collection = db.collection("Readings"); 
    const cursor = collection.find({}).sort({ _id: -1 }).limit(1);
    const document = await cursor.next();
	console.log(document)
	return res.status(200).json({ document})
})

app.get("/getUser", async (req, res) => {
	const url = process.env.ATLAS_SECRET
	const client = new MongoClient(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})

	client.connect((err) => {
		if (err) {
			console.error("Error connecting to MongoDB:", err)
			return
		}
		console.log("Connected to MongoDB")
	})
	const db = client.db("test")
	const collection = db.collection("usercredentials")
	const filePath = "user.json"
	fs.readFile(filePath, "utf8", async(err, data) => {
		if (err) {
			console.error("Error reading JSON file:", err)
			return
		}
		try {
			const jsonData = JSON.parse(data)
			const name = jsonData.name
			const user = await collection.findOne({ name: name })
			return res.status(200).json({user})

		} catch (parseError) {
			console.error("Error parsing JSON data:", parseError)
		}
	})


})


app.get("/getDietPlan", async(req, res) => {


// Add a default prompt sentence
const defaultPrompt = "Generate the response as coherrent sentences. "

// Your specific prompt
const customPrompt = "I want you to act as an AI assisted doctor. I am a pregnant women give me suggestions for healthy food habits in 10 sentences."

const generateSentences = async() => {
		const completionResponse = await openai.completions.create({
		model: "text-davinci-003",
		prompt: `${defaultPrompt} ${customPrompt}`,
		max_tokens: 250,
	})

	const id = completionResponse["id"];
	const text = completionResponse["choices"][0]["text"];
	const sentences = sbd.sentences(text)
	return sentences
}

// Example usage
generateSentences()
	.then((sentences) => {
		
			const middleIndex = Math.floor(sentences.length / 2)
			const firstHalf = sentences.slice(0, middleIndex)
			const secondHalf = sentences.slice(middleIndex)

			return [firstHalf, secondHalf]
	})
	.catch((error) => {
		console.error("Error:", error)
	})

const dietPlan = generateSentences();

  
res.status(200).json({dietPlan})

})




app.listen(3001, () => {
  console.log("Listening to port 3001 ");
});
