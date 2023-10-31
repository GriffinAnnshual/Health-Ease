import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./LoginInput.css";

const LoginInput = (props) => {
  const handleDateChange = (date) => {
    // Pass the selected date directly to the parent component's valueChanger function
    props.valueChanger(date);
  };

  if (props.type === "date") {
    return (
      <div>
        <DatePicker
          className="login-input date-input"
          selected={props.value} // Use the provided value as selected
          onChange={handleDateChange}
          placeholderText={props.placeholder}
          required
          dateFormat="dd/MM/yyyy"
          isClearable // Show a clear button - to remove date
        />
      </div>
    );
  } else {
    return (
      <>
        <input
          className="login-input"
          type={props.type}
          name={props.name}
          placeholder={props.placeholder}
          onChange={(e) => props.valueChanger(e.target.value)}
          required
        />
      </>
    );
  }
};

export default LoginInput;
