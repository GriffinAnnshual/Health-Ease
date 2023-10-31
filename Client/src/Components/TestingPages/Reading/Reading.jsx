import React from "react";
import "./Reading.css";

const Reading = (props) => {
  return (
    
      <div className={`inner-container`}>
        <div className="refresh-container">
          <button className="refresh-round">
            <img
              className="refresh-icon"
              src="/images/refresh.png"
              alt="refresh-icon"
            />
          </button>
        </div>
        <div className="reading-container">
          <div className="test-label-container">
            <div>
              <p
                className={
                  props.name === "TEMPERATURE"
                    ? "test-label test-temp-label"
                    : "test-label"
                }
              >
                {props.name}
              </p>
            </div>
          </div>
          <div className="input-box-container">
            <input type="text" className="input-box" name="" id="" />
          </div>
        </div>
      </div>

  );
};

export default Reading;
