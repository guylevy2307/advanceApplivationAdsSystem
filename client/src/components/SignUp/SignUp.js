import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../services/UserService";
import { SignUpContainer } from "./SignUpContainer";
import "./SignUpPage.css";

export const SignUp = () => {
  const firstName = useRef();
  const lastName = useRef();
  const email = useRef();
  const password = useRef();
  const profile = useRef();
  const history = useNavigate();

  function createUser() {
    const newUser = {
      firstName: firstName.current.value,
      lastName: lastName.current.value,
      fullName: firstName.current.value + " " + lastName.current.value,
      isAdmin: false,
      creationDate: new Date(Date.now()),
      email: email.current.value,
      password: password.current.value,
      profileImage: "",
    };

    signUp(newUser);
    history("/login");
  }

  function loadImage(files) {
    console.log(files);
    console.log(files.length);

    if (files.length > 0) console.log(URL.createObjectURL(files[0])); //files[0]
  }

  return (
    <>
      <SignUpContainer />
    </>
  );
};
