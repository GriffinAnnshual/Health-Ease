import React from "react";
import "./ValueBar.css";
const ValueBar = (props) => {
  return (
    <div class="value-container">
      <div>
        <p className="label">{props.label}</p>
      </div>

      <button className="btn">
        <p class="value">{props.value}</p>
        <p class="unit">{props.unit}</p>
      </button>
    </div>
  );
};

export default ValueBar;
