import React from "react"
import "./DietCard.css"

const DietCard = (props) => {
	const { title, passage } = props
  console.log(passage)
	return (
		<div className="diet-card">
			<p className="diet-topic">{title}</p>
			<div className="diet-para-container">
				{Array.isArray(passage) &&
					passage.map((value, index) => (
						<p
							key={index}
							className="diet-para">
							{value}
						</p>
					))}
			</div>
		</div>
	)
}

export default DietCard
