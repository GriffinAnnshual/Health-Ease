import React from "react";
import "./NavBar.css";
import NavButton from "../NavButton/NavButton";

const NavBar = (props) => {
  const navs = props.navs;
  return (
    <div className="nav-container">
      {navs.map((nav) => {
        return <NavButton key={nav.id} tag={nav.tag} />;
      })}
      
    </div>
  );
};
export default NavBar;
