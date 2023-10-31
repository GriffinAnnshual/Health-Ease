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


app.get("/getDietPlan", (req, res) => {
	const HealthyFood = [[
		"Healthy food choices are essential for maintaining overall well-being and promoting optimal physical and mental health. A balanced diet is characterized by a variety of nutrient-rich foods that provide the body with the vitamins, minerals, and energy it needs to function effectively. Fruits and vegetables, such as leafy greens, colorful berries, and cruciferous vegetables, offer a plethora of essential nutrients, antioxidants, and fiber that support various bodily functions. These foods can help reduce the risk of chronic diseases, including heart disease and certain types of cancer.",
		"Whole grains, like brown rice, whole wheat, and quinoa, are rich in complex carbohydrates and fiber, offering sustained energy and aiding in digestion. Lean sources of protein, such as lean meats, fish, poultry, tofu, and legumes, are crucial for muscle maintenance and repair, as well as immune function. Healthy fats from sources like avocados, nuts, and olive oil are vital for brain health and the absorption of fat-soluble vitamins. Additionally, incorporating dairy products or dairy alternatives into the diet provides essential calcium for strong bones and teeth.",
		"A well-balanced diet also extends to what we drink. Staying hydrated with water is fundamental for bodily functions, including digestion, circulation, and temperature regulation. Limiting the intake of added sugars, sugary beverages, and processed foods is crucial in preventing excessive calorie consumption and the associated risks of obesity and related health conditions. Healthy food choices not only impact physical health but also contribute to mental well-being, as proper nutrition can enhance mood, cognitive function, and overall vitality. Making mindful choices in our daily diet can lead to a healthier and more fulfilling life."
	],[
	"Avoid processed foods high in added sugars and unhealthy fats for better health. These items lead to weight gain and chronic diseases.",
	"Steer clear of sugary drinks like soda and fruit juices. They contribute to weight gain and dental issues.",
	"Limit excessive caffeine from energy drinks, and consider abstaining from alcohol when it poses health risks, especially during pregnancy. Responsible choices impact overall well-being."

	]
	]
res.status(200).json(HealthyFood)

})






app.listen(3001, () => {
  console.log("Listening to port 3001 ");
});
