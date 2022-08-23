import React, { Component } from "react";
import { SignUpForm } from "./SignUpForm.js";
import { signUp } from "../../services/UserService";
const FormValidators = require("./validate");
const validateSignUpForm = FormValidators.validateSignUpForm;


export class SignUpContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            user: {
                email: "",
                password: "",
                firstName: "",
                lastName: ""
            },
            btnTxt: "show",
            type: "password",
            score: "0"
        };


        this.handleChange = this.handleChange.bind(this);
        this.submitSignup = this.submitSignup.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.pwHandleChange = this.pwHandleChange.bind(this);
    }

    handleChange(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({
            user
        });
    }

    pwHandleChange(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({
            user
        });

    }

    submitSignup(user) {
        signUp(user)
    }

    validateForm(event) {
        event.preventDefault();
        var payload = validateSignUpForm(this.state.user);
        console.log(payload)
        if (payload.success) {
            this.setState({
                errors: {}
            });
            var user = {
                email: this.state.user.email,
                password: this.state.user.password,
                firstName: this.state.user.firstName,
                lastName: this.state.user.lastName
            };
            console.log('go to submit sign up')
            this.submitSignup(user);
        } else {
            const errors = payload.errors;
            this.setState({
                errors
            });
        }
    }



    render() {
        return (
            <div>
                <SignUpForm
                    onSubmit={this.validateForm}
                    onChange={this.handleChange}
                    onPwChange={this.pwHandleChange}
                    errors={this.state.errors}
                    user={this.state.user}
                    score={this.state.score}
                    btnTxt={this.state.btnTxt}
                    type={this.state.type}

                />
            </div>
        );
    }
}