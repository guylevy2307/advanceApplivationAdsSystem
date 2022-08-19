import React, {useRef, useState} from "react"
import {signUp} from "../../services/UserService";
import ImageUploader from "react-images-upload";
import {SignUpForm} from "./SignUpForm";
import {SignUpContainer} from "./SignUpContainer"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import "./SignUpPage.css"
import {useNavigate} from "react-router-dom";

export const SignUp = ()=>{
    const firstName = useRef()
    const lastName = useRef()
    const email = useRef()
    const password = useRef()
    //const [profileImage, setProfileImage] = useState("")
    const profile = useRef()
    const history = useNavigate();


    function createUser(){
        const newUser = {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            fullName: firstName.current.value + " " + lastName.current.value,
            isAdmin: false,
            creationDate: new Date(Date.now()),
            email: email.current.value,
            password: password.current.value,
            profileImage: ""
        }

        signUp(newUser)
        history("/login")
    }

    function loadImage(files){
        console.log(files)
        console.log(files.length)

        if(files.length>0)
            console.log(URL.createObjectURL(files[0]))//files[0]
        //setProfileImage(files.length===0?"":files[0].text())
        //console.log(Profile.current.value)
    }

    return (
        <>
            {/*    <label>*/}
            {/*        first name:*/}
            {/*        <input ref={firstName} type="text" />*/}
            {/*        <br/>*/}
            {/*        last name:*/}
            {/*        <input ref={lastName} type="text"/>*/}
            {/*        <br/>*/}
            {/*        email:*/}
            {/*        <input ref={email} type="email"/>*/}
            {/*        <br/>*/}
            {/*        password:*/}
            {/*        <input ref={password} type="password" />*/}
            {/*        <br/>*/}
            {/*        Profile image:*/}
            {/*        <br/>*/}
            {/*        <button type="submit" onClick={createUser}>sign up</button>*/}

            {/*    </label>*/}
            {/*<ImageUploader*/}
            {/*    withIcon={false}*/}
            {/*    withPreview={true}*/}
            {/*    label=""*/}
            {/*    buttonText="Upload Image"*/}
            {/*    onChange={loadImage}*/}
            {/*    imgExtension={[".jpg", ".png", ".gif", ".svg"]}*/}
            {/*    fileSizeError=" file size is too big"*/}
            {/*    singleImage ={true}*/}
            {/*/>*/}
            <MuiThemeProvider>
                <SignUpContainer />
            </MuiThemeProvider>
        </>
    )
}