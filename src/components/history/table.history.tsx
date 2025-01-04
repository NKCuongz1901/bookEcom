import { getHistoryOrderAPI } from "@/services/api";
import { Descriptions, Drawer, Space, Table, Tag } from "antd";
import { TableProps } from "antd/lib";
import { useEffect, useState } from "react";
import dayjs from "dayjs";


const TableHistory = () => {
    const [historyData, setHistoryData] = useState<IHistory[]>([]);
    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IHistory | null>(null);
    const columns: TableProps<IHistory>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'index',
            render(value, record, index) {
                return (
                    <>{index + 1}</>
                )
            },

        },
        {
            title: 'Time',
            dataIndex: 'createdAt',
            key: 'createAt',
            render(value, record, index) {
                return (
                    <>
                        {dayjs(record.createAt).format('DD-MM-YYYY')}
                    </>
                )
            },
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render(value, record, index) {
                return (<>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}
                </>
                )
            }
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_, record) => (
                <>
                    <Tag color="volcano" >Success</Tag>
                </>
            ),
        },
        {
            title: 'Detail',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => { setOpenDetail(true), setDataDetail(record) }} >View detail</a>
                </Space>
            ),
        },
    ];
    useEffect(() => {
        const fetchHistory = async () => {
            const res = await getHistoryOrderAPI();
            if (res && res.data) {
                setHistoryData(res.data);
            }
        }
        fetchHistory();
    }, [])


    return (
        <>
            <div>History order</div>
            <Table
                columns={columns}
                dataSource={historyData}
            />
            <Drawer
                open={openDetail}
                onClose={() => { setOpenDetail(false) }}
                width={'45vw'}
            >
                {dataDetail?.detail?.map(item => {
                    return (
                        <Descriptions
                            bordered
                            column={2}
                        >
                            <Descriptions.Item label="Title">{item.bookName}</Descriptions.Item>
                            <Descriptions.Item label="Quantity">{item.quantity}</Descriptions.Item>
                        </Descriptions>

                    )
                })}


            </Drawer>
        </>
    )
}
export default TableHistory