import { updateUserAPI } from "@/services/api";
import { App, Form, FormProps, Input, Modal } from "antd";
import { useEffect } from "react";

interface TProps {
    openViewUpdate: boolean;
    setOpenViewUpdate: (v: boolean) => void;
    updateData: IUserTable | null;
    setUpdateData: (v: IUserTable | null) => void;
    refreshTable: () => void;

}
type FieldType = {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
}
const UpdateUser = (props: TProps) => {
    const [form] = Form.useForm();
    const { openViewUpdate, setOpenViewUpdate, setUpdateData, updateData, refreshTable } = props;
    const { message, notification } = App.useApp();

    useEffect(() => {
        if (updateData) {
            form.setFieldsValue(
                {
                    _id: updateData._id,
                    fullName: updateData.fullName,
                    email: updateData.email,
                    phone: updateData.phone
                }
            )
        }
    }, [updateData])
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, fullName, phone } = values;
        const res = await updateUserAPI(_id, fullName, phone);
        if (res && res.data) {
            message.success("Update information success");
            setOpenViewUpdate(false);
            setUpdateData(null);
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
            <Modal
                title="Update user"
                open={openViewUpdate}
                onCancel={() => { { setOpenViewUpdate(false) }; setUpdateData(null) }}
                onOk={() => { form.submit() }}
                okText="Update"
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="ID"
                        name={"_id"}
                        hidden={true}
                        rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Full Name"
                        name={"fullName"}
                        rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Email"
                        name={"email"}
                        rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                    >
                        <Input disabled={true} />
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Phone number"
                        name={"phone"}
                        rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UpdateUser;