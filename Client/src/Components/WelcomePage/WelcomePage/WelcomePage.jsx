import React from "react";
import "./WelcomePage.css";
import Mother from "../Mother/Mother";
import Greeting from "../Greeting/Greeting";

const WelcomePage = (props) =>{
let greet="WELCOME";
  if(props.page){
    greet="THANK YOU";
  }
  return (
    <div class="welcome-page">
      <Mother />
      
      <Greeting greet={greet}/>
    </div>
  );
  
};
export default WelcomePage;
