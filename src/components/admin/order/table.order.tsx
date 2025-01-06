import { getOrderPaginateAPI } from "@/services/api";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import dayjs from "dayjs";

type TSearch = {
    name: string;
    address: string;
}
const TableOrder = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    const columns: ProColumns<IOrderTable>[] = [
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
                    <a>{entity._id}</a>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Price',
            dataIndex: 'totalPrice',
            hideInSearch: true,
            sorter: true,
            render(dom, entity, index, action, schema) {
                return (
                    <div>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.totalPrice)}
                    </div>
                )
            },
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            hideInSearch: true,
            sorter: true,
            render(dom, entity, index, action, schema) {
                return (
                    <div>
                        {dayjs(entity.createdAt).format("DD-MM-YYYY")};
                    </div>
                )
            },
        },
    ]

    return (
        <>
            <ProTable<IOrderTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                rowKey="_id"
                headerTitle="Table order"
                request={async (params, sort) => {
                    let query = '';
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.name) {
                            query += `&name=/${params.name}/i`;
                        }
                        if (params.address) {
                            query += `&address=/${params.address}/i`;
                        }
                    }
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? "createdAt" : "-createdAt"}`
                    }
                    const res = await getOrderPaginateAPI(query);
                    if (res && res.data) {
                        setMeta(res.data.meta);
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
        </>
    )
}
export default TableOrder;