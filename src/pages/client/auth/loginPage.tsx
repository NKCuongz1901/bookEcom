import { App, Button, Divider, Form, Input } from "antd";
import type { FormProps } from 'antd';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './login.scss'
import { loginAPI } from "@/services/api";


type FieldType = {
    username: string;
    password: string;
}
const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const { message, notification } = App.useApp()
    const handleLogin: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { username, password } = values;
        const res = await loginAPI(username, password);
        if (res.data) {
            localStorage.setItem('access_token', res.data.access_token);
            message.success("Login success");
            navigate('/');
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message && Array.isArray(res.data) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsSubmit(false);
    }

    return (
        <div className="login-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng nhập</h2>
                            <Divider />
                        </div>
                        <Form
                            name="form-register"
                            onFinish={handleLogin}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="username"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Password"
                                name="password"
                                rules={[
                                    { required: true, message: 'password không được để trống!' }
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>


                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal" style={{ textAlign: "center" }}>
                                Chưa có tài khoản ?
                                <span>
                                    <Link to='/register' > Đăng ký</Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}
export default LoginPage;