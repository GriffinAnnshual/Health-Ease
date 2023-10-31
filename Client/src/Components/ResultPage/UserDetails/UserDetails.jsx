import React from "react"
import "./UserDetails.css"
import ValueBar from "../ValueBar/ValueBar"
import axios from "axios"
const res = await axios.get("http://localhost:3001/getUser")
const results = JSON.parse(res.request.response)
const result = results.user
console.log(result)

const UserDetails = () => {
	return (
		<div class="user-data-container">
			<div class="Details-container">
				<ValueBar
					label="NAME"
					value={result.name}
				/>
				<ValueBar
					label="AGE"
					value={result.Age}
				/>
				<ValueBar
					label="PHONE NUMBER"
					value={result.phoneNumber}
				/>
			</div>
			<div className="Trimester-box">
				<p class="heading">TRIMESTER</p>
			</div>
		</div>
	)
}
export default UserDetails
