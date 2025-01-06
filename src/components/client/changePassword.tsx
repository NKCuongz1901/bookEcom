import { App, Button, Form, FormProps, Input } from "antd";
import { useCurrentApp } from "../context/app.context";
import { useEffect } from "react";
import { changePasswordAPI } from "@/services/api";


type FieldType = {
    email: string;
    oldpass: string;
    newpass: string;
}

const ChangePassword = () => {
    const [form] = Form.useForm();
    const { user } = useCurrentApp();
    const { message } = App.useApp();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { email, newpass, oldpass } = values;
        const res = await changePasswordAPI(email, oldpass, newpass);
        if (res && res.data) {
            message.success("Change password success");
            form.setFieldValue("oldpass", "");
            form.setFieldValue("newpass", "");
        } else {
            message.error("Change password failed");
        }
    }

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                email: user.email,
            })
        }
    }, [user])
    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
                autoComplete="off"

            >
                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label={"Email"}
                    name={'email'}

                >
                    <Input disabled={true} />
                </Form.Item>
                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label={"Old Password"}
                    name={'oldpass'}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label={"New password"}
                    name={'newpass'}
                >
                    <Input.Password />
                </Form.Item>
                <Button onClick={() => form.submit()} type="primary">Change password</Button>
            </Form>
        </>
    )
}
export default ChangePassword;