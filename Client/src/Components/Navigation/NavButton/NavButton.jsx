import React from "react";
import './NavButton.css';
import { useNavigate } from "react-router-dom";

const NavButton=(props)=>{
    const navigate=useNavigate();
    const handleClick=()=>{
        if(props.tag==="HOME"){
            navigate("/");
        }
        else if(props.tag==="LOGOUT"){
            navigate("/login");
        }
    }
return <button onClick={handleClick} class="nav-btn">{props.tag}</button>
}
export default NavButton;