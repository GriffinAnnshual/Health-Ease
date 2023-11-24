import React from "react";
import "./TestingStyles.css";
import Reading from "./Reading/Reading";
import Instruction from "./Instruction/Instruction";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

const TestingPage2 = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/test-3");
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
            <p className="guide-para">1.Stand still in front of the sensor.</p>
            <p className="guide-para">
              2.Ensure no obstructions between your finger and sensor.
            </p>
            <p className="guide-para">
              3.We'll measure your glucose level now.
            </p>
            <p className="guide-para">
              4.Wait for us to measure your height and weight.
            </p>
          </div>
          <div className="review-guide-container">
            <h4 className="guide-heading">REVIEW YOUR MEASUREMENTS</h4>
            <p className="guide-para">
              1.Verify the displayed reading for accuracy.
            </p>
            <p className="guide-para">
              2. If you suspect inaccuracies or issues, proceed to the next step
            </p>
          </div>
          <div className="verification-guide">
            <h4 className="guide-heading">INACCURATE READINGS?</h4>
            <p className="guide-para">
              1.Press "Refresh" for errors or incorrect stance.
            </p>
            <p className="guide-para">2.Click "Next" to record if satisfied.</p>
            <p className="guide-para">
              3.Follow on-screen instructions to finish.
            </p>
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
          <div className="reader-container-2">
            <Reading name="GLUCOSE" />
          </div>

          <button className="next-btn nb2" onClick={handleClick}>
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};
export default TestingPage2;
