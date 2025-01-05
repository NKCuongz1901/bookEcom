import { App, Avatar, Button, Col, Form, FormProps, Input, Row, Upload } from "antd";
import { useCurrentApp } from "../context/app.context";
import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { UploadFile } from "antd";
import { changeInfoUserAPI, uploadFileAPI } from "@/services/api";
import { UploadChangeParam } from "antd/es/upload";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';



type FieldType = {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
}

const UserInfo = () => {
    const { user, setUser } = useCurrentApp();
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;
    const [form] = Form.useForm();
    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
    const { message } = App.useApp();
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone
            })
        }
    }, [user])
    const handleUploadFile = async (options: RcCustomRequestOptions) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "avatar");
        if (res && res.data) {
            const newAvatar = res.data.fileUploaded;
            setUserAvatar(newAvatar);
            if (onSuccess)
                onSuccess('ok')
        } else {
            message.error(res.message)
        }
    };
    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadFile,
        onChange(info: UploadChangeParam) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
                message.success(`Upload file thành công`);
            } else if (info.file.status === 'error') {
                message.error(`Upload file thất bại`);
            }
        },
    };
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, phone, _id } = values;
        const avatar = userAvatar;
        const res = await changeInfoUserAPI(fullName, phone, avatar, _id);
        if (res && res.data) {
            setUser({
                ...user!,
                avatar: userAvatar,
                fullName,
                phone
            })
            localStorage.removeItem("access_token");
            message.success("Change information success");
        } else {
            message.error("Error!!!!");
        }
    }
    return (
        <>
            <Row gutter={[20, 10]}>
                <Col span={12}>
                    <Row>
                        <Col span={24}>
                            <Avatar
                                size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
                                src={urlAvatar}
                                shape="circle"
                                icon={<AntDesignOutlined />}
                            />
                        </Col>
                        <Col span={24}>
                            <Upload  {...propsUpload}>
                                <Button icon={<UploadOutlined />} >
                                    Upload Avatar
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label={"ID"}
                            name={"_id"}
                            hidden={true}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label={"Display Name"}
                            name={'fullName'}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label={"Email"}
                            name={'email'}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label={"Phone number"}
                            name={'phone'}
                        >
                            <Input />
                        </Form.Item>
                        <Button onClick={() => form.submit()} type="primary">Update information</Button>
                    </Form>
                </Col>
            </Row>
        </>
    )

}
export default UserInfo;