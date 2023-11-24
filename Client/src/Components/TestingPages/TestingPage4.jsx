import React from "react";
import "./TestingStyles.css";
import Reading from "./Reading/Reading";
import Instruction from "./Instruction/Instruction";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const TestingPage4 = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/report");
  };
  const handleLogout = () => {
    localStorage.removeItem("jwt_token")
    navigate("/login");
  };
  
  useEffect(() => {
		if (!localStorage.getItem("jwt_token")) {
			navigate("/login")
		}
	}, [])

  return (
    <div class="test-page">
      <div class="test-left-side">
        <Instruction />
        <div className="test-steps-guide-container">
          <div className="initial-guide-container">
            <p className="guide-para">
              1.Stand still in front of the pulse oximeter sensor.
            </p>

            <p className="guide-para">
              2.Ensure no obstructions between your finger and the sensor.
            </p>
            <p className="guide-para">
              3.We'll measure your oxygen saturation level and pulse.
            </p>
            
          </div>
          <div className="review-guide-container">
            <h4 className="guide-heading">REVIEW YOUR MEASUREMENTS</h4>
            <p className="guide-para">
              1.Check the displayed reading for accuracy.
            </p>
            <p className="guide-para">
              2.If there are inaccuracies or issues, proceed as follows:
            </p>
          </div>
          <div className="verification-guide">
            <h4 className="guide-heading">CORRECTING READINGS</h4>
            <p className="guide-para">
              1.Press "Refresh" for errors or incorrect stance.
            </p>
            <p className="guide-para">
              2.If satisfied, click "Next" to record your reading
            </p>
            <p className="guide-para">3.Follow on-screen prompts to finish.</p>
          </div>
        </div>
      </div>

      <div class="test-right-side">
        <div className="test-right-top-div">
          <btn className="logout-btn-test" onClick={handleLogout}>
            LOGOUT
          </btn>
        </div>

        <div className="bottom-div">
          <div className="reader-container">
            <Reading name="PULSE" />
            <Reading name="OXYGEN SATURATION" />
          </div>

          <button className="next-btn" onClick={handleClick}>
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};
export default TestingPage4;
