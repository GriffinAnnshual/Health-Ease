import React, { Suspense,useState, useEffect } from "react"
import "./UserReport.css"
import ValueBar from "../ValueBar/ValueBar"
import Button from "../../SignInPage/Button/Button"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const UserReport = () => {
	const navigate = useNavigate()
	const handleClick = () => {
		navigate("/health")	
	}
	const [Readings, setReadings] = useState([]) // Use React state to store Readings
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		if(!localStorage.getItem("jwt_token")){
					navigate("/login")
				}
		const getUserDetails = async () => {
			const token = localStorage.getItem("jwt_token")
			const headers = {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			}
			try {
				const res = await axios.get("http://localhost:3001/getUserDetails",{headers})
				const results = JSON.parse(res.request.response)
				const result = results.document
				console.log(result)
				// Populate the Readings array with the desired values
				const readingsData = [
					{ id: 1, label: "HEIGHT", value: result.height, unit: "cm" },
					{ id: 2, label: "WEIGHT", value: result.weight, unit: "kg" },
					{ id: 3, label: "GLUCOSE", value: result.glucose, unit: "mg/dL" },
					{ id: 4, label: "TEMP", value: result.temperature, unit: "°C" },
					{ id: 5, label: "PULSE", value: result.pulse, unit: "BPM" },
					{ id: 7, label: "BP Diastolic", value: result["bp-d"], unit: "mmHg" },
					{ id: 8, label: "OXYGEN", value: result.oxygen, unit: "%" },
				]

				// Set the Readings state with the populated values
				setReadings(readingsData)
				setLoading(false)
				return {
					height: result.height,
					weight: result.weight,
					glucose: result.glucose,
					temperature: result.temperature,
					pulse: result.pulse,
					bps: result["bp-s"],
					bpd: result["bp-d"],
					oxygen: result.oxygen,
				}
			} catch (err) {
				setLoading(false)
				console.error(err)
			}
		}

		getUserDetails()
	}, [])

	if (loading) {
		return (
			<div class="report-page">
				<div className="report-container">
					<div className="report-inner-container">
						{Readings.map((values) => {
							return (
								<Suspense
									fallback={
										<ValueBar
											key={"id"}
											label={"Loading..."}
											value={"Loading..."}
											unit={"Loading..."}
										/>
									}>

									</Suspense>
							)
						})}
					</div>
				</div>
				<div className="save-btn-space">
					<Button
						tag="SAVE"
						value={handleClick}
					/>
				</div>
			</div>
		)
	}

	return (
		<div class="report-page">
			<div className="report-container">
				<div className="report-inner-container">
					{Readings.map((values) => {
						return (
							<Suspense
								fallback={
									<ValueBar
										key={"id"}
										label={"Loading..."}
										value={"Loading..."}
										unit={"Loading..."}
									/>
								}>
								<ValueBar
									key={values.id}
									label={values.label}
									value={values.value}
									unit={values.unit}
								/>
							</Suspense>
						)
					})}
				</div>
			</div>
			<div className="save-btn-space">
				<Button
					tag="SAVE"
					value={handleClick}
				/>
			</div>
		</div>
	)
}

export default UserReport
