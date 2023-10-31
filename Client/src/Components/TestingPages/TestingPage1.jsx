import React from "react";
import "./TestingStyles.css";
import Reading from "./Reading/Reading";
import Instruction from "./Instruction/Instruction";
import { useNavigate } from "react-router-dom";

const TestingPage1 = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/test-2");
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
            <p className="guide-para">
              1.Stand straight on the weighing scale.
            </p>
            <p className="guide-para" >2.Place your feet flat on the machine</p>
            <p className="guide-para">
              3.Align your head with the height marker.
            </p>
            <p className="guide-para">
              4.Wait for us to measure your height and weight.
            </p>
          </div>
          <div className="review-guide-container">
            <h4 className="guide-heading">REVIEW YOUR MEASUREMENTS</h4>
            <p className="guide-para">
              1.Verify displayed readings for accuracy.
            </p>
            <p className="guide-para">
              2.If unsure or suspect inaccuracies, proceed to next step.
            </p>
          </div>
          <div className="verification-guide">
            <h4 className="guide-heading">STOOD INCORRECTLY?</h4>
            <p className="guide-para">
              If you believe you stood incorrectly or for inaccurate
              measurements, press "Refresh" button"
            </p>
            <p className="guide-para">
              If satisfied, click "Next" to record your reading for your
              records.
            </p>
            <p className="guide-para">
              Follow on-screen prompts to complete the process.
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
          <div className="reader-container">
            <Reading name="HEIGHT" />
            <Reading name="WEIGHT" />
          </div>

          <button className="next-btn" onClick={handleClick}>
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};
export default TestingPage1;
