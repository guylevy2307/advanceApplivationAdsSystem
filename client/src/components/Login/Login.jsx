import { Button, TextField } from "@mui/material";
import { notification } from "antd";
import 'antd/dist/antd.css';
import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import validator from "validator/es";
import logoImage from '../../public/adsystem.png';
import { getUserByEmail, login } from "../../services/UserService";
import "./loginForm.css";

export default function FormDialog() {
    const [open, setOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const [successLogIn, setSuccessLogIn] = useState("PENDING")
    const [validEmail, setValidEmail] = useState(true)
    const [validPassword, setValidPassword] = useState(true)
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const navigate = useNavigate();


    const validateError = () => {
        const email = emailRef.current.value
        const password = passwordRef.current.value
        console.log({ email, password });
        const currentErrors = errors
        setValidEmail(validator.isEmail(email))
        if (!validEmail)
            currentErrors.email = "Please provide a correct email address."
        setValidPassword(password.length !== 0)
        if (!validPassword)
            currentErrors.password = "Password can't be empty."
        setErrors(currentErrors)
    }

    const signIn = async () => {
        const credentials = { email: emailRef.current.value, password: passwordRef.current.value }
        var res = true
        try {
            await login(credentials)
        } catch {
            res = false
        }
        if (res) {
            setSuccessLogIn("SUCCESS")
            const user = await getUserByEmail(emailRef.current.value);
            localStorage.setItem("user", JSON.stringify(user))
            //localStorage.setItem("password",passwordRef.current.value)
            navigate("/")
            handleClose()
        }
        else {
            setSuccessLogIn("FAILED")
            openNotification('Email or password is wrong');
        }
    }
    
    const handleClose = () => {
        setOpen(false);
    };

    const openNotification = (content) => {
        notification.open({
            message: content,
        });
    };

    return (
        <>
            <img src={logoImage} alt="logo" />
            <div className="loginBox">
                <TextField
                    error={!validEmail}
                    inputRef={emailRef}
                    autoFocus
                    margin="dense"
                    label="Email Address"
                    type="email"
                    onChange={validateError}
                    helperText={!validEmail ? errors.email : ""}
                    fullWidth
                />
                <br />
                <TextField
                    error={!validPassword}
                    inputRef={passwordRef}
                    autoFocus
                    margin="dense"
                    label="Password"
                    type="password"
                    onChange={validateError}
                    helperText={!validPassword ? errors.password : ""}
                    fullWidth
                />
                {successLogIn === "FAILED"
                    // <label className={"errorMessage"}>Email or password is wrong</label>
                }
                <Button style={{ paddingTop: 20 }} onClick={signIn} color="primary" disabled={!validEmail || !validPassword}>
                    Sign In
                </Button>
                <Button style={{ paddingTop: 20 }} onClick={(e) => {
                    navigate("/register")
                }} color="primary">
                    Sign Up
                </Button>
            </div>
        </>
    );
}