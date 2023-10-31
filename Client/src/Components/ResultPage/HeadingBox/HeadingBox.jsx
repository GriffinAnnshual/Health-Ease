import React from "react";
import "./HeadingBox.css";

const HeadingBox = (props) => {
  return (
    <div className="heading-box-div">
      <button className="heading-btn">{props.heading}</button>
    </div>
  );
};

export default HeadingBox;
