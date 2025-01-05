import { Modal, Tabs } from "antd";
import { TabsProps } from "antd/lib";
import ChangePassword from "./changePassword";
import UserInfo from "./user.info";


interface IProps {
    modalOpen: boolean;
    setModalOpen: (v: boolean) => void;
}

const ManageAccount = (props: IProps) => {
    const { modalOpen, setModalOpen } = props;


    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'User Info',
            children: <UserInfo />,
        },
        {
            key: '2',
            label: 'Change Password',
            children: <ChangePassword />,
        },

    ];
    return (
        <>
            <Modal
                open={modalOpen}
                onCancel={() => { setModalOpen(false) }}
                footer={null}
                width={'50vw'}
            >
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                />
            </Modal>

        </>
    )
}
export default ManageAccount;