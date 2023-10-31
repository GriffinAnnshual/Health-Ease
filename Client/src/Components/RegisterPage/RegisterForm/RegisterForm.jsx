import React, { useState } from "react"
import "./RegisterForm.css"
import LoginInput from "../../SignInPage/LoginInput/LoginInput"
import Button from "../../SignInPage/Button/Button"
import axios from "axios"
import { useNavigate } from "react-router-dom"
const RegisterForm = () => {
	const navigate = useNavigate()
	const [name, setName] = useState("")
	const [AadharNumber, setAadharNumber] = useState("")
	const [phoneNumber, setPhoneNumber] = useState("")
	const [menstrualPeriod, setMenstrualPeriod] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [Age, setAge] = useState("")
	const token = process.env.REACT_APP_JWT_SECRET
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	}
	const handleSubmit = (e) => {
		e.preventDefault()
		console.log(
			name,
			" ",
			AadharNumber,
			" ",
			phoneNumber,
			" ",
			Age,
			" ",
			menstrualPeriod,
			" ",
			password,
			" ",
			confirmPassword
		)

		axios
			.post(
				"http://localhost:3001/register",
				{
					name,
					AadharNumber,
					phoneNumber,
					Age,
					menstrualPeriod,
					password,
					confirmPassword,
				},
				{ headers }
			)
			.then((result) => {
				console.log(result.request.response)
				if (result.request.response.length > 40) {
					alert("User already exists with this Username or Aadhar or PhoneNo! ")
				} else {
					if (result.request.response.includes("0_credential")) {
						alert("Password and Confirm password do not match!")
					} else {
						alert("Registration Successfull!")
						navigate("/login")
					}
				}
			})
			.catch((err) => console.log(err))
	}

	return (
		<div className="register-right-side">
			<form
				className="register-form"
				onSubmit={handleSubmit}>
				<LoginInput
					value={name}
					valueChanger={setName}
					placeholder="NAME"
					type="text"
					minlength="5"
					maxlength="16"
				/>
				<LoginInput
					value={AadharNumber}
					valueChanger={setAadharNumber}
					placeholder="AADHAR NUMBER"
					type="number"
					minlength="12"
					maxlength="12"
				/>
				<LoginInput
					value={phoneNumber}
					valueChanger={setPhoneNumber}
					placeholder="PHONE NUMBER"
					type="number"
					minlength="10"
					maxlength="10"
				/>
				<LoginInput
					value={Age}
					valueChanger={setAge}
					placeholder="AGE"
					type="number"
					minlength="1"
					maxlength="3"
				/>
				<LoginInput
					value={menstrualPeriod}
					valueChanger={setMenstrualPeriod}
					placeholder="MENSTRUAL PERIOD"
					type="date"
				/>
				<LoginInput
					value={password}
					valueChanger={setPassword}
					placeholder="PASSWORD"
					type="text"
					minlength="4"
					maxlength="20"
				/>
				<LoginInput
					value={confirmPassword}
					valueChanger={setConfirmPassword}
					placeholder="CONFIRM PASSWORD"
					type="password"
					minlength="4"
					maxlength="20"
				/>
				<Button tag="REGISTER" />
			</form>
		</div>
	)
}

export default RegisterForm
