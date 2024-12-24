import { FORMATE_DATE } from "@/services/helper";
import { Avatar, Descriptions, Drawer, Tag } from "antd";
import dayjs from "dayjs";
interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IUserTable | null;
    setDataViewDetail: (v: IUserTable | null) => void;
}

const DetailUser = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;
    const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataViewDetail?.avatar}`;
    return (
        <Drawer
            title="Detail user"
            onClose={() => { setOpenViewDetail(false), setDataViewDetail(null) }}
            open={openViewDetail}
            width={'55vw'}
        >
            <Descriptions
                title={`Detail user ${dataViewDetail?.fullName}`}
                bordered
                column={2}
            >
                <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
                <Descriptions.Item label="Full Name">{dataViewDetail?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                <Descriptions.Item label="Phone">{dataViewDetail?.phone}</Descriptions.Item>
                <Descriptions.Item label="Role"><Tag color="volcano">{dataViewDetail?.role}</Tag></Descriptions.Item>
                <Descriptions.Item label="Avatar"><Avatar src={avatarURL} /></Descriptions.Item>
                <Descriptions.Item label="Created At">{dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE)}</Descriptions.Item>
                <Descriptions.Item label="Updated At">{dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE)}</Descriptions.Item>
            </Descriptions>
        </Drawer>
    )


}

export default DetailUser;