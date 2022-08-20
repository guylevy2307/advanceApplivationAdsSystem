import { PermMedia } from "@mui/icons-material";
import { Button, Form, Input, notification, PageHeader } from "antd";
import 'antd/dist/antd.min.css'
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import useMounted from "../../useMounted";
import { SERVER_URL } from "../../services/HttpServiceHelper";
import { getCurrentUser } from "../../Utils/currentUser";

const blobToBase64 = require('blob-to-base64')

const openNotification = (content) => {
    notification.open({
        message: content,
    });
};

export default function UpdateUser() {
    const [form] = Form.useForm();
    const [user, setUser] = useState();
    const email = useParams().userEmail;
    const isMounted = useMounted();
    const [file, setFile] = useState(user && user.profilePicture);

    useEffect( () => {
        const fetchUser = async() => {
            const response = await axios.get(SERVER_URL + `/users/${email}`);
            const { data } = response;
            setUser(data);
        }
        isMounted && fetchUser();
    }, [isMounted]);

    const endUser = useMemo(() => user || {}, [user]);

    const onFinish = (values) => {
        // let updatedUser = {firstName: values.firstName, lastName: values.lastName, password: values.password,
        //     address: values.address}
        // if (file) {
        //     const data = new FormData();
        //     const fileName = Date.now() + file.name;
        //     data.append("name", fileName);
        //     data.append("file", file);
        //     //newPost.img = fileName;
        //     blobToBase64.default(file, async function (error, base64) {
        //         if (!error) {
        //             try {
        //                 debugger
        //                 console.log(updatedUser)
        //                 updatedUser.profilePicture = base64;
        //                 const response = await axios.patch(SERVER_URL + `/users/${endUser.email}`, updatedUser);
        //                 if(response.status === 200){
        //                     openNotification('User updated successfully!');
        //                 }
        //                 else openNotification('Error while updating your user');
        //                 window.location.href("/");
        //             } catch (err) {}
        //         }
        //     })
        // }
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        let updatedUser = {firstName: form.getFieldValue("firstname"), lastName: form.getFieldValue("lastname"), password: form.getFieldValue("password"),
            address: form.getFieldValue("address")}
        if (file) {
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            //newPost.img = fileName;
            blobToBase64.default(file, async function (error, base64) {
                if (!error) {
                    try {
                        console.log(updatedUser)
                        updatedUser.profilePicture = base64;
                        const response = await axios.patch(SERVER_URL + `/users/${endUser.email}`, updatedUser);
                        console.log("Updated user: " + response.data);
                        if(response.status === 200){
                            if(response.data.email === getCurrentUser().email)
                                localStorage.setItem("user", JSON.stringify(response.data));
                            openNotification('User updated successfully!');
                        }
                        else openNotification('Error while updating your user');
                        window.location.href("/");
                    } catch (err) {}
                }
            })
        }
    };


    return (
         <div style={{flex: 5.5}}>
                <PageHeader
                    className="site-page-header"
                    onBack={() => null}
                    title="Edit your details"
                    subTitle={endUser.firstName + " " + endUser.lastName}
                />
                <Form form={form} onSubmitCapture={submitHandler}
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                      style={{paddingRight:500}}
                >
                    <Form.Item
                        label="First Name"
                        name="firstname"
                    >
                        <Input
                            placeholder={endUser.firstName}
                            //ref={firstName}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastname"
                    >
                        <Input
                            placeholder={endUser.lastName}
                            //ref={lastName}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                    >
                        <Input
                            placeholder={endUser.address}
                            //ref={address}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item style={{paddingLeft: 290}}>
                        <label htmlFor="file" className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon" />
                            <span className="shareOptionText">Upload avatar picture</span>
                            <input style={{ display: "none" }}
                                    type="file"
                                    id="file"
                                    accept=".png,.jpeg,.jpg"
                                    onChange={(e) => setFile(e.target.files[0])}
                            />
                        </label>
                    </Form.Item>


                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                        style={{paddingLeft: 230}}>
                        <Button type="primary" htmlType="submit" onClick={submitHandler}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
         </div>
    )
}