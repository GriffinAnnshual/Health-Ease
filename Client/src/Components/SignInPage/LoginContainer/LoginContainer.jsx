import React, { useState } from "react"
import LoginInput from "../LoginInput/LoginInput"
import "./LoginContainer.css"
import RegisterText from "../RegisterText/RegisterText"
import Button from "../Button/Button"
import axios from "axios"
import { useNavigate } from "react-router-dom"
const LoginContainer = () => {
	const navigate = useNavigate()
	const [name, setName] = useState("") // Fix the typo here
	const [password, setPassword] = useState("")

	const token = process.env.REACT_APP_JWT_SECRET
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	}
	const handleSubmit = (e) => {
		e.preventDefault()
		console.log("username - " + name)
		console.log("password - " + password)
		axios
			.post("http://localhost:3001/login", { name, password }, { headers })
			.then((result) => {
				console.log(result)

				alert("Login successful!")
				navigate("/test-1")
			})
			.catch((err) => {
				alert("Invalid Password or Username!")
			})
	}

	return (
		<div
			className="login-container"
			onSubmit={handleSubmit}>
			<form className="login-bar-container">
				<LoginInput
					name="username"
					placeholder="USERNAME"
					type="text"
					valueChanger={setName}
				/>
				<LoginInput
					name="password"
					placeholder="PASSWORD"
					type="password"
					valueChanger={setPassword}
				/>
				<Button tag="LOGIN" />
				<RegisterText />
			</form>
		</div>
	)
}

export default LoginContainer
