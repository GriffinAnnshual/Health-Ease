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


// Your routes and other middleware

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
			req.body.confirmPassword  = hashPassword
			RegisterModel.create(req.body)
				.then(() => {
					console.log("Registered")
				})
				.catch((err) => consolge.log(err))
	}

	} 
const user = await RegisterModel.findOne({ name: name }).exec()
console.log(user._id)
res.json({
	userExists:
		usernameExists +
		useraadharExists +
		userphoneExists +
		credential +
		"_" +
		"credential",
	token: generateToken(user._id),
})
});


app.get("/login",auth, (req, res) => {
res.status(200).json({"message":"Login successful"})
})


app.post("/login", async (req, res) => {
	while (!connection) {
		continue
	}
	console.log(req.body)

	const name = req.body.name
	const user = await RegisterModel.findOne({ name: name }).exec()
	
	console.log(user)

if (user && await bcrypt.compare(req.body.password,user.password)) {
res.status(200).json({ message: "Login successful", token: generateToken(user.id)})
}
else{
	res.status(401).json({"message": "Invalid User Credentials"})
}
});

const generateToken = (id) => {
	const jwt_token = jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "10d",
	})
	return jwt_token;
}

app.get("/me", async(req,res)=>{
const {_id,name,aadhar,phone} = await RegisterModel.findById(req.user.id);
return res.status(200).json({_id,name,aadhar,phone})
});


app.get("/getUserDetails", async(req, res) => {
console.log("inside")
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

app.get("/getUser",auth, async (req, res) => {
	console.log("inside")
	console.log(req.user)
	try{
			const user = req.user
			return res.status(200).json({user})

		} catch (e) {
			console.error("message", e)
		}
	});


app.get("/getDietPlan",auth, async(req, res) => {


const food_suggestions = [
	"Leafy Greens: Support overall health, potentially aiding in controlling blood pressure and reducing the risk of preeclampsia.",
	"Berries: Rich in antioxidants and fiber, may contribute to stable blood sugar levels, helping prevent gestational diabetes.",
	"Salmon: A great source of omega-3 fatty acids, supporting cardiovascular health and potentially reducing the risk of preterm labor.",
	"Nuts and Seeds: High in omega-3s, fiber, and essential nutrients, can help maintain steady blood sugar levels and support overall well-being.",
	"Beans and Legumes: Packed with fiber and protein, contribute to blood sugar control and may reduce the risk of gestational diabetes.",
	"Avocado: Rich in healthy fats, provides essential nutrients and may support cardiovascular health, potentially helping to regulate blood pressure.",
	"Whole Grains: High in fiber and complex carbohydrates, contribute to stable blood sugar levels and may reduce the risk of gestational diabetes.",
	"Greek Yogurt: A good source of protein and probiotics, supports digestive health, potentially reducing the risk of infections."
]

const middleIndex = Math.floor(food_suggestions.length / 2)
const firstHalf = food_suggestions.slice(0, middleIndex)
const secondHalf = food_suggestions.slice(middleIndex)

const dietPlan =  [firstHalf, secondHalf]

// // Add a default prompt sentence
// const defaultPrompt = "Generate the response as coherrent sentences. "

// // Your specific prompt
// const customPrompt = `
// These are the pregnancy complications that pregnant women can face : High Blood Pressure, Gestational Diabetes, Infections ,Preeclampsia ,Preterm Labor,Depression & Anxiety, Pregnancy Loss/Miscarriage, Stillbirth. As a Doctor suggest some good food habit for the women to keep in control their Oxygen level, Blood pressure, Blood Sugar, Pulse etc.. .And avoid the above complications.  Eg: "Eat 8 to 12 ounces of seafood each week", Don’t eat certain foods.
// These foods may have bacteria in them that can hurt your baby. Stay away from:
// Raw (uncooked) or rare (undercooked) fish or shellfish, like sushi or raw oysters
// Raw or rare meats, poultry, or eggs
// Unpasteurized juice, milk, or cheese — make sure it says “pasteurized” on the label
// Lunch or deli meats, smoked seafood, and hot dogs — unless they’re heated until" . Similarly Generate 10 points .  Format <Food> <Their Benefits> . Don't describe each of it . I need as a single sentence `
//
// const generateSentences = async() => {
// 		const completionResponse = await openai.completions.create({
// 		model: "text-davinci-003",
// 		prompt: `${defaultPrompt} ${customPrompt}`,
// 		max_tokens: 250,
// 	})

// 	const id = completionResponse["id"];
// 	const text = completionResponse["choices"][0]["text"];
// 	const sentences = sbd.sentences(text)
// 	return sentences
// }

// // Example usage
// generateSentences()
// 	.then((sentences) => {
		
			// const middleIndex = Math.floor(sentences.length / 2)
			// const firstHalf = sentences.slice(0, middleIndex)
			// const secondHalf = sentences.slice(middleIndex)

			// return [firstHalf, secondHalf]
// 	})
// 	.catch((error) => {
// 		console.error("Error:", error)
// 	})

// const dietPlan = generateSentences();

  
res.status(200).json({dietPlan})

})




app.listen(3001, () => {
  console.log("Listening to port 3001 ");
});
