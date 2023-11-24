import React, { useEffect, useState } from "react"
import LoginInput from "../LoginInput/LoginInput"
import "./LoginContainer.css"
import RegisterText from "../RegisterText/RegisterText"
import Button from "../Button/Button"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const LoginContainer = () => {
	const navigate = useNavigate()
	const [authorized, setAuthorized] = useState(false)
	const [name, setName] = useState("") // Fix the typo here
	const [password, setPassword] = useState("")

			const handleSubmit = (e) => {
				e.preventDefault()
				console.log("username - " + name)
				console.log("password - " + password)
				axios
					.post("http://localhost:3001/login", { name, password })
					.then((result) => {
						console.log("got response :")
						console.log(result)
						alert("Login successful!")
						navigate("/test-1")
						localStorage.setItem("jwt_token",result.data.token)
					})
					.catch((err) => {
						alert("Invalid Password or Username!")
					})
			}
	useEffect(() => {
		if (localStorage.getItem("jwt_token")) {
			console.log(localStorage.getItem("jwt_token"))
			const token = localStorage.getItem("jwt_token")
			const headers = {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			}
			axios
				.get("http://localhost:3001/login", { headers })
				.then(() => {
					navigate("/test-1")
				})
				.catch((e) => {
					setAuthorized(true)
					console.log("token not found", e)
				})
		} else {
			setAuthorized(true)
		}
	}, [])

	if (!authorized){
		return null
	}
	else{
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

}

export default LoginContainer
