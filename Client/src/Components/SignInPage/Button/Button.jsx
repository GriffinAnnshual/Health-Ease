import React from "react";
import "./Button.css";


const Button = (props) => {
 
  return (
    <button type="submit" className="login-btn" onClick={props.value} >
      {props.tag}
    </button>
  );
};
export default Button;
