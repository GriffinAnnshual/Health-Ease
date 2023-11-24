import React,{useState, useEffect} from "react";
import "./DietPage.css";
import DietCard from "../DietCard/DietCard";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const DietPage = () => {
  const navigate = useNavigate();

  const handleLogout = ()=>{
	localStorage.removeItem("jwt_token")
	navigate("/login")
  }
  const handleClick = () => {
    navigate("/end");
  };
	const [loading, setLoading] = useState(true)
	const [newData, setData ] = useState([])

	useEffect(() => {
		if (!localStorage.getItem("jwt_token")) {
			navigate("/login")
		}
		// Inside useEffect, make the API call and update the data when the component mounts
		const fetchData = async () => {
			const token = localStorage.getItem("jwt_token")
			const headers = {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			}
			try {
				const res = await axios.get("http://localhost:3001/getDietPlan",{headers});
				const apiData = res.data.dietPlan;
				console.log(apiData)


				setData(apiData) // Set the data state
        setLoading(false)
			} catch (error) {
				console.error("Error fetching data:", error)
        setLoading(false)
			}
		}
		fetchData()
	}, [])



  if (loading) {
  return (
    <div className="diet-page">
      <div className="diet-page-top-container">
        <p className="nav-btn diet-nav" onClick={handleLogout}>LOGOUT</p>
        <h1 className="diet-page-header">HEALTHY MOMS, HEALTHY BEGININGS</h1>
      </div>
      <div className="diet-page-bottom-container">
        <div className="diet-container">
          <DietCard title ="Healthy Food Choice" passage={"Loading..."}/>
          <DietCard title = "Healthy Food Choice" passage={"Loading..."}/>
        </div>
      </div>

      <button onClick={handleClick} class="diet-page-next">NEXT</button>
    </div>
  );
  }
    else {
    return (
			<div className="diet-page">
				<div className="diet-page-top-container">
					<p
						className="nav-btn diet-nav"
						onClick={handleLogout}>
						LOGOUT
					</p>
					<h1 className="diet-page-header">HEALTHY MOMS, HEALTHY BEGININGS</h1>
				</div>
				<div className="diet-page-bottom-container">
					<div className="diet-container">
						<DietCard
							title="Healthy Food Choice"
							passage={newData[0]}
						/>
						<DietCard
							title="Healthy Food Choice"
							passage={newData[1]}
						/>
					</div>
				</div>

				<button
					onClick={handleClick}
					class="diet-page-next">
					NEXT
				</button>
			</div>
		)
}
}
export default DietPage;
