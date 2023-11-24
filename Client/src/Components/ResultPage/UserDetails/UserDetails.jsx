import React, { useState, useEffect } from "react"
import "./UserDetails.css"
import ValueBar from "../ValueBar/ValueBar"
import axios from "axios"
import { CircularProgressBar } from "@tomickigrzegorz/react-circular-progress-bar"
import { useNavigate } from "react-router-dom"

const UserDetails = () => {
	const navigate = useNavigate()
	const config = {
	id: 0,
  	percent: 0,
		colorSlice: "#E91E63",
  		colorCircle: "#f1f1f1",
  		number: false,
        fontColor: "#F50057",
        fontSize: "1.2rem",
        fontWeight: 700,
		size: 350
	};
	const [week, setweek] = useState("")
	const [userDetails, setUserDetails] = useState(null)
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		if(!localStorage.getItem("jwt_token")){
			navigate("/login")
		}
		const token = localStorage.getItem("jwt_token")
		const headers = {
			"Authorization": `Bearer ${token}`,
			"Content-Type": "application/json",
		}
		const fetchData = async () => {
			try {
				const res = await axios.get("http://localhost:3001/getUser",{headers})
				setUserDetails(res.data.user)
				console.log(userDetails)
				setLoading(false)
			} catch (error) {
				console.error("Error fetching user details:", error)
				setLoading(false)
			}
		}

		fetchData()
	},[])

	const [update, setUpdate] = useState(config);

	useEffect(()=>{
		const weekMethod = async () => {
			const token = localStorage.getItem("jwt_token")
			const headers = {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			}
			const res = await axios.get("http://localhost:3001/getUser",{headers}) ;
			const startDate = new Date(res.data.user.menstrualPeriod)
			const currentDate = new Date()
			const millisecondsDifference = currentDate - startDate
			// Calculate the number of weeks
			const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000
			const week = Math.floor(millisecondsDifference / millisecondsPerWeek)
			setweek(week)
		}
		weekMethod()
	},[])
	

  useEffect(() => {

      setUpdate({
        config,
        id: 0, // we indicate which component we want to change
        percent: Math.floor(parseInt((week * 100/40))),
		colorSlice: "#E91E63",
  		colorCircle: "#f1f1f1",
  		number: false,
        fontColor: "#F50057",
        fontSize: "1.2rem",
        fontWeight: 700
      });
  }, [update]);



	const newObject = { ...config, ...update };

	if (loading) {
		return (
			<div class="user-data-container">
				<div class="Details-container">
					<ValueBar
						label="NAME"
						value={"loading..."}
					/>
					<ValueBar
						label="AGE"
						value={"loading..."}
					/>
					<ValueBar
						label="PHONE NUMBER"
						value={"loading..."}
					/>
				</div>
				<div className="Trimester-box">
					<p className="heading">Loading...</p>
				</div>
			</div>
		)
	}
	else{
	return (
		<div class="user-data-container">
			<div class="Details-container">
				<ValueBar
					label="NAME"
					value={userDetails.name}
				/>
				<ValueBar
					label="AGE"
					value={userDetails.Age}
				/>
				<ValueBar
					label="PHONE NUMBER"
					value={userDetails.phoneNumber}
				/>
			</div>
			<div className="trimester-label">
				<div className="Trimester-box">
					<div>
						<CircularProgressBar
							key={0}
							{...newObject}
						/>
					</div>
					<p className="heading">
						<p className="weeks">{String(week)}</p>WEEKS
					</p>
				</div>
			</div>
		</div>
	)
}
}
export default UserDetails;