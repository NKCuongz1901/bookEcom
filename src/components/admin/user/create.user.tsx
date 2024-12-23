import { createUserAPI } from "@/services/api";
import { App, Divider, Form, FormProps, Input, Modal } from "antd";


interface IProps {
    openViewAdd: boolean;
    setOpenViewAdd: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string;
}

const CreateUser = (props: IProps) => {
    const [form] = Form.useForm();
    const { openViewAdd, refreshTable, setOpenViewAdd } = props;
    const { message, notification } = App.useApp();


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, password, email, phone } = values;
        const res = await createUserAPI(fullName, password, email, phone);
        if (res && res.data) {
            message.success("Create user successful");
            setOpenViewAdd(false);
            form.resetFields();
            refreshTable();
        } else {
            notification.error({
                message: 'Error',
                description: res.message && Array.isArray(res.data) ? res.message[0] : res.message,
                duration: 5
            })
        }
    }
    return (
        <>
            <Modal title="Create new user" open={openViewAdd} onOk={() => { form.submit() }} onCancel={() => { setOpenViewAdd(false), form.resetFields() }}>
                <Divider />
                <Form
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Tên hiển thị"
                        name={"fullName"}
                        rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Password"
                        name={"password"}
                        rules={[{ required: true, message: 'Vui long nhap mat khau' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Email"
                        name={"email"}
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Phone number"
                        name={"phone"}
                        rules={[{ required: true, message: 'Vui lòng nhập so dien thoai!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default CreateUser;