import React from "react";
import "./DietPage.css";
import DietCard from "../DietCard/DietCard";
import { useNavigate } from "react-router-dom";

const DietPage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/end");
  };
  return (
    <div className="diet-page">
      <div className="diet-page-top-container">
        <p className="nav-btn diet-nav">LOGOUT</p>
        <h1 className="diet-page-header">HEALTHY MOMS, HEALTHY BEGININGS</h1>
      </div>
      <div className="diet-page-bottom-container">
        <div className="diet-container">
          <DietCard />
          <DietCard />
        </div>
      </div>

      <button onClick={handleClick} class="diet-page-next">NEXT</button>
    </div>
  );
};

export default DietPage;
