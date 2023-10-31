import "./HealthPage.css"
import HealthInput from "../HealthInput/HealthInput"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import React, { useState, useEffect } from "react" // Import useState and useEffect from React

const HealthPage = () => {
	const navigate = useNavigate()
	const handleClick = () => {
		navigate("/diet")
	}
	// Define a state variable for your data
	const [data, setData] = useState([])

	useEffect(() => {
		// Inside useEffect, make the API call and update the data when the component mounts
		const fetchData = async () => {
			try {
				const res = await axios.get("http://127.0.0.1:3001/predict")
				const apiData = res.data[0]
				console.log(apiData.json())
				// Process and set the data
				const newData = [{
					BMI: {
						value: apiData.BMI.value,
						risk: apiData.BMI.short,
					},
					Oxygen: {
						value: apiData.Oxygen.value,
						risk: apiData.Oxygen.short,
					},
					bloodsugar: {
						value: apiData.blood_sugar.value,
						risk: apiData.blood_sugar.short,
					},
					diastolic_pressure: {
						value: apiData.diastolic_pressure.value,
						risk: apiData.diastolic_pressure.short,
					},
					systolic_pressure: {
						value: apiData.systolic_pressure.value,
						risk: apiData.systolic_pressure.short,
					},
					pulse: {
						value: apiData.pulse.value,
						risk: apiData.pulse.short,
					},
					temperature: {
						value: apiData.temperature.value,
						risk: apiData.temperature.short,
					},
					RiskLevel: apiData.RiskLevel,
				}]

				setData(newData) // Set the data state
			} catch (error) {
				console.error("Error fetching data:", error)
			}
		}	

		fetchData(); // Call the fetchData function when the component mounts
	}, [])


	return (
		<div className="health-page">
			<div className="health-page-top-container">
				<img
					src="/images/logo.png"
					alt=""
					className="logo"
				/>
				<p class="health-page-head">HEALTH REPORT</p>
				<p class="health-logout-nav">LOGOUT</p>
			</div>
			<div className="health-page-bottom-container">
				<div className="health-container">
					<div className="test-results-container">
						<div className="value-box">
							<p>HEIGHT</p>
							<HealthInput
								value=""
								risk=""
							/>
						</div>
						<div className="value-box">
							<p>WEIGHT</p>
							<HealthInput
								value=""
								risk=""
							/>
						</div>
						<div className="value-box">
							<p>BMI</p>
							<HealthInput
								value={data[0].BMI.value}
								risk={data[0].BMI.risk}
							/>
						</div>
						<div className="value-box">
							<p>OXYGEN</p>
							<HealthInput
								value={data[0].Oxygen.value}
								risk={data[0].Oxygen.risk}
							/>
						</div>
						<div className="value-box">
							<p>PULSE</p>
							<HealthInput
								value={data[0].pulse.value}
								risk={data[0].pulse.risk}
							/>
						</div>
						<div className="value-box">
							<p>TEMP</p>
							<HealthInput
								value={data[0].temperature.value}
								risk={data[0].temperature.risk}
							/>
						</div>
						<div className="value-box">
							<p>Systolic Pressure</p>
							<HealthInput
								value={data[0].systolic_pressure.value}
								risk={data[0].systolic_pressure.risk}
							/>
						</div>
						<div className="value-box">
							<p>Diastolic pressure</p>
							<HealthInput
								value={data[0].diastolic_pressure.value}
								risk={data[0].diastolic_pressure.risk}
							/>
						</div>
						<div className="value-box">
							<p>GLUCOSE</p>
							<HealthInput
								value={data[0].blood_sugar.value}
								risk={data[0].blood_sugar.risk}
							/>
						</div>
					</div>
					<div className="prediction-container">
						<p className="health-condition-header"> OVERALL HEALTH CONDITION</p>

						<div className="round">
							<img
								class="round-emoji r"
								src="./images/smile.png"
								alt=""
							/>
						</div>
						<div className="vertical-line"></div>
						<div className="round">
							<img
								class="round-emoji"
								src="./images/medium.png"
								alt=""
							/>
						</div>
						<div className="vertical-line"></div>
						<div className="round">
							<img
								class="round-emoji"
								src="./images/sad.png"
								alt=""
							/>
						</div>
						<p id="normal">NORMAL</p>
						<p id="risk">MID RISK</p>
						<p id="high-risk">HIGH RISK</p>
					</div>
				</div>
				<button
					onClick={handleClick}
					class="diet-plan-btn">
					DIET PLAN
				</button>
			</div>
		</div>
	)
}
export default HealthPage
