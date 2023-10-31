import React from "react";
import './HealthInput.css'

const HealthInput = (props) => {
  return (
    <div class="input-bx">
      <input type="text" required="required" value={props.value} />
      <label>{props.risk}</label>
    </div>
  );
};
export default HealthInput;
