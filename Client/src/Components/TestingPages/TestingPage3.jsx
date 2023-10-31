import React from "react";
import "./TestingStyles.css";
import Reading from "./Reading/Reading";
import Instruction from "./Instruction/Instruction";
import { useNavigate } from "react-router-dom";

const TestingPage3 = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/test-4");
  };
  const handleLogout = () => {
    navigate("/login");
  };
  return (
    <div class="test-page">
      <div class="test-left-side">
        <Instruction />
        <div className="test-steps-guide-container">
          <div className="initial-guide-container">
            <p className="guide-para">1.Stand in front of the sensor.</p>
            <p className="guide-para">2.Keep your finger dry.</p>
            <p className="guide-para">
              3.Ensure no obstructions between your finger and the sensor.
            </p>
            <p className="guide-para">4.We'll measure your temperature now.</p>
          </div>
          <div className="review-guide-container">
            <h4 className="guide-heading">REVIEW YOUR MEASUREMENTS</h4>
            <p className="guide-para">
              1.Verify the displayed temperature accuracy.
            </p>
            <p className="guide-para">
              2.If you suspect issues, proceed to the next step.
            </p>
          </div>
          <div className="verification-guide">
            <h4 className="guide-heading">INACCURATE READINGS?</h4>
            <p className="guide-para">
              1.Press "Refresh" for errors or wrong stance
            </p>
            <p className="guide-para">2.Click "Next" to record if satisfied.</p>
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
          <div className="reader-container-2">
            <Reading name="TEMPERATURE" />
          </div>

          <button className="next-btn nb2" onClick={handleClick}>
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};
export default TestingPage3;
