import React from "react";
import { TextField, Button } from "@mui/material";
import PasswordStr from "./PasswordStr";
import "./signUpForm.css";

export const SignUpForm = ({
  history,
  onSubmit,
  onChange,
  errors,
  user,
  score,
  btnTxt,
  type,
  pwMask,
  onPwChange,
}) => {
  return (
    <>
      <div className="loginBox">
        <h1>Sign Up</h1>
        {errors.message && <p style={{ color: "red" }}>{errors.message}</p>}

        <form onSubmit={onSubmit}>
          <TextField
            name="email"
            label="Email Address"
            value={user.email}
            onChange={onChange}
            helperText={errors ? errors.email : " "}
          />
          <br />
          <TextField
            name="firstName"
            label="First Name"
            value={user.firstName}
            onChange={onChange}
            helperText={errors ? errors.firstName : " "}
          />
          <br />
          <TextField
            name="lastName"
            label="Last Name"
            value={user.lastName}
            onChange={onChange}
            helperText={errors ? errors.lastName : " "}
          />
          <br />
          <TextField
            type={type}
            name="password"
            label="Password"
            value={user.password}
            onChange={onPwChange}
            helperText={errors ? errors.password : " "}
          />
          <br />
          <div className="pwStrRow">
            {score >= 1 && (
              <div>
                <PasswordStr score={score} />
                <Button
                  className="pwShowHideBtn"
                  label={btnTxt}
                  onClick={pwMask}
                  style={{
                    position: "relative",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {btnTxt}
                </Button>
              </div>
            )}
          </div>
          <br />
          <Button
            variant="contained"
            className="signUpSubmit"
            type="submit"
            label="submit"
          >
            Sumbit
          </Button>
        </form>
        <p>
          Aleady have an account? <br />
          <a href="/login">Log in here</a>
        </p>
      </div>
    </>
  );
};
