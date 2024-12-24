import { deleteUserAPI, getUserPaginateAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { App, Button, Popconfirm, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import DetailUser from './detail.user';
import CreateUser from './create.user';
import ImportUser from './import.user';
import { CSVLink } from "react-csv";
import UpdateUser from './update.user';



type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string
}
const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);
    const [openViewAdd, setOpenViewAdd] = useState<boolean>(false);
    const [openViewImport, setOpenViewImport] = useState<boolean>(false);
    const [currentData, setCurrentData] = useState<IUserTable[]>([]);
    const [openViewUpdate, setOpenViewUpdate] = useState<boolean>(false);
    const [updateData, setUpdateData] = useState<IUserTable | null>(null);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    const { message, notification } = App.useApp();
    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (<a href='#'
                    onClick={() => {
                        setDataViewDetail(entity);
                        setOpenViewDetail(true);
                    }}
                >{entity._id}</a>)
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            hideInSearch: true,
            valueType: 'date',
            sorter: true,

        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            hideInTable: true,
            valueType: 'dateRange',
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={() => { handleDeleteUser(entity._id) }}
                            okText="Yes"
                            cancelText="No"

                        >
                            <MdDelete style={{ cursor: 'pointer' }} />
                        </Popconfirm>
                        <CiEdit style={{ cursor: 'pointer' }} onClick={() => { setOpenViewUpdate(true), setUpdateData(entity) }} />
                    </div>
                )
            },
        }

    ];
    const refreshTable = () => {
        actionRef?.current?.reload();
    }
    const handleDeleteUser = async (_id: any) => {
        const res = await deleteUserAPI(_id);
        if (res && res.data) {
            message.success("Delete user success");
            refreshTable();
        } else {
            notification.error({
                message: 'Error'
            })
        }
    }
    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered

                request={async (params, sort, filter) => {
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`;
                        }
                        if (params.email) {
                            query += `&email=/${params.email}/i`;
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                        }
                    }
                    query += "&sort=-createdAt";
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`;
                    }
                    const res = await getUserPaginateAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentData(res.data?.result ?? []);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total,
                    }

                }}
                rowKey="_id"
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenViewAdd(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>,
                    <Button
                        icon={<ImportOutlined />}
                        type='primary'
                        onClick={() => { setOpenViewImport(true) }}
                    >
                        Import
                    </Button>,
                    <Button
                        icon={<ExportOutlined />}
                        type='primary'
                    >
                        <CSVLink data={currentData} filename='export-user.csv'>Export</CSVLink>;
                    </Button>

                ]}
            />
            <DetailUser
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <CreateUser
                openViewAdd={openViewAdd}
                setOpenViewAdd={setOpenViewAdd}
                refreshTable={refreshTable}
            />
            <ImportUser
                openViewImport={openViewImport}
                setOpenViewImport={setOpenViewImport}
                refreshTable={refreshTable}

            />
            <UpdateUser
                openViewUpdate={openViewUpdate}
                setOpenViewUpdate={setOpenViewUpdate}
                updateData={updateData}
                setUpdateData={setUpdateData}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableUser;