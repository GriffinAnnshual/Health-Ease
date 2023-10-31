import React from "react";
import './RegisterText.css';
import { useNavigate } from "react-router-dom";

const RegisterText=()=>{
const navigate=useNavigate();
const handleClick=()=>{
    navigate("/register");
}
return (<div className="register-text">
<p>Don't have an Account?&nbsp;&nbsp;&nbsp;<span onClick={handleClick}>Sign Up.</span></p>
</div>)
}
export default RegisterText;
