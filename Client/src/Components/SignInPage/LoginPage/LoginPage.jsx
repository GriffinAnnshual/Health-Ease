import React from "react";
import './LoginPage.css'
import LoginContainer from "../LoginContainer/LoginContainer";


const LoginPage=()=>{
return (
    <div class="background">
        <img src="/images/logo.png" alt=""  className="logo"/>
       <LoginContainer/>
    </div>
)
}
export default LoginPage;