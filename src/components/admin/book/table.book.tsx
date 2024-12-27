import { deleteBookAPI, getBookPaginateAPI } from "@/services/api";
import { ExportOutlined, ImportOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, message, notification, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import dayjs from "dayjs";
import DetailBook from "./detail.book";
import CreateBook from "./create.book";
import { CSVLink } from "react-csv";
import UpdateBook from "./update.book";


type TSearch = {
    mainText: string;
    author: string;
}

const TableBook = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    const [openDetailView, setOpenDetailView] = useState<boolean>(false);
    const [detailData, setDetailData] = useState<IBookTable | null>(null);
    const [openCreateView, setOpenCreateView] = useState<boolean>(false);
    const [currentData, setCurrentData] = useState<IBookTable[]>([])
    const [openUpdateView, setOpenUpdateView] = useState<boolean>(false);
    const [updateData, setUpdateData] = useState<IBookTable | null>(null);
    const columns: ProColumns<IBookTable>[] = [
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
                return (
                    <a href="#"
                        onClick={() => { setOpenDetailView(true), setDetailData(entity) }}
                    >{entity._id}</a>
                )
            },
        },
        {
            title: 'MainText',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            hideInSearch: true,

        },
        {
            title: 'Author',
            dataIndex: 'author'

        },
        {
            title: 'Price',
            dataIndex: 'price',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (<>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.price)}
                </>
                )
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {dayjs(entity.createdAt).format("DD-MM-YYYY")};
                    </>
                )
            },

        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <div style={{ display: 'flex', gap: '10px', cursor: 'pointer' }}>
                        <CiEdit onClick={() => { setOpenUpdateView(true), setUpdateData(entity) }} />
                        <Popconfirm
                            title="Delete book"
                            description="Are u sure delete this book"
                            onConfirm={() => handleDeleteBook(entity._id)}
                        >
                            <MdDelete />
                        </Popconfirm>
                    </div>
                )
            },
        }
    ]
    const refreshTable = () => {
        actionRef?.current?.reload();

    }
    const handleDeleteBook = async (_id: any) => {
        const res = await deleteBookAPI(_id);
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
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                rowKey="_id"
                headerTitle="Table Book"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => { setOpenCreateView(true) }}
                    >
                        Add new
                    </Button>,
                    <Button
                        icon={<ImportOutlined />}
                        type='primary'
                    >
                        Import
                    </Button>,
                    <Button
                        icon={<ExportOutlined />}
                        type='primary'
                    >
                        <CSVLink data={currentData} filename='export-book.csv'>Export</CSVLink>;
                    </Button>
                ]}
                request={async (params, sort, filter) => {
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.author) {
                            query += `&author=/${params.author}/i`;
                        }
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`;
                        }
                    }
                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText === 'ascend' ? "mainText" : "-mainText"}`;
                    } else query += `&sort=mainText`
                    const res = await getBookPaginateAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentData(res.data?.result ?? []);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total

                    }
                }}
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }

            />
            <DetailBook
                openDetailView={openDetailView}
                setOpenDetailView={setOpenDetailView}
                detailData={detailData}
                setDetailData={setDetailData}
            />
            <CreateBook
                openCreateView={openCreateView}
                setOpenCreateView={setOpenCreateView}
                refreshTable={refreshTable}
            />
            <UpdateBook
                openUpdateView={openUpdateView}
                setOpenUpdateView={setOpenUpdateView}
                updateData={updateData}
                setUpdateData={setUpdateData}
                refreshTable={refreshTable}

            />

        </>
    )
}
export default TableBook