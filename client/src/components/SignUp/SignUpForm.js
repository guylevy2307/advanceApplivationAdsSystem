import React from "react";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
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
                        onPwChange
                    }) => {
    return (
        <>
            <div className="loginBox">
                <h1>Sign Up</h1>
                {errors.message && <p style={{ color: "red" }}>{errors.message}</p>}

                <form onSubmit={onSubmit}>
                    <TextField
                        name="email"
                        floatingLabelText="email"
                        value={user.email}
                        onChange={onChange}
                        errorText={errors.email}
                    />
                    <br/>
                    <TextField
                        name="firstName"
                        floatingLabelText="first name"
                        value={user.firstName}
                        onChange={onChange}
                        errorText={errors.firstName}
                    />
                    <br/>
                    <TextField
                        name="lastName"
                        floatingLabelText="last name"
                        value={user.lastName}
                        onChange={onChange}
                        errorText={errors.lastName}
                    />
                    <br/>
                    <TextField
                        type={type}
                        name="password"
                        floatingLabelText="password"
                        value={user.password}
                        onChange={onPwChange}
                        errorText={errors.password}
                    />
                    <br/>
                    <div className="pwStrRow">
                        {score >= 1 && (
                            <div>
                                <PasswordStr score={score} />
                                <FlatButton
                                    className="pwShowHideBtn"
                                    label={btnTxt}
                                    onClick={pwMask}
                                    style={{
                                        position: "relative",
                                        left: "50%",
                                        transform: "translateX(-50%)"
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <br />
                    <RaisedButton
                        className="signUpSubmit"
                        primary={true}
                        type="submit"
                        label="submit"
                    />
                </form>
                <p>
                    Aleady have an account? <br />
                    <a href="/login">Log in here</a>
                </p>
            </div>
        </>
    );
};
