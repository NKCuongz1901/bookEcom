import { FilterOutlined, ReloadOutlined } from "@ant-design/icons"
import { Button, Checkbox, Col, Divider, Form, InputNumber, Pagination, Rate, Row, Tabs, TabsProps } from "antd"
import './home.scss'
import { useEffect, useState } from "react"
import { getBookPaginateAPI, getCategoryAPI } from "@/services/api"

const HomePage = () => {
    const [form] = Form.useForm()
    const [categoryData, setCategoryData] = useState<{
        label: string;
        value: string;
    }[]>([]);
    const [listBook, setListBook] = useState<IBookTable[]>([])
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [sortQuery, setSortQuery] = useState<string>("sort=-sold");
    const onFinish = () => {

    }
    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getCategoryAPI();
            if (res.data) {
                const data = res.data.map(item => {
                    return { label: item, value: item }
                })
                setCategoryData(data);
            }
        }
        fetchCategory();
    }, [])
    const fetchBook = async () => {
        let query = `current=${current}&pageSize=${pageSize}`;
        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        const res = await getBookPaginateAPI(query);
        if (res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }

    }
    useEffect(() => {
        fetchBook();
    }, [current, pageSize, sortQuery])
    console.log('Check listbook', listBook);
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Phổ biến',
            children: <></>,
        },
        {
            key: '2',
            label: 'Hàng mới',
            children: <></>,
        },
        {
            key: '3',
            label: 'Giá thấp đến cáo',
            children: <></>,
        },
        {
            key: '4',
            label: 'Giá cao đến thấp',
            children: <></>,
        },
    ];
    const handleOnChange = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    }
    return (
        <div className="homepage-container" style={{ maxWidth: 1140, margin: '0 auto' }}>
            <Row gutter={10}>
                <Col span={5} style={{ border: '1px solid red', padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span><FilterOutlined />Bộ lọc tìm kiếm</span>
                        <ReloadOutlined onClick={() => { form.resetFields() }} />
                    </div>
                    <Form
                        onFinish={onFinish}
                        form={form}
                    >
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Danh mục sản phẩm"
                            name={'category'}
                        >
                            <Checkbox.Group>
                                <Row>
                                    {categoryData?.map((item, index) => {
                                        return (
                                            <Col span={24} key={index}>
                                                <Checkbox value={item.label}>{item.value}</Checkbox>
                                            </Col>
                                        )
                                    })}

                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Khoảng giá"
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Form.Item>
                                    <InputNumber />
                                </Form.Item>
                                <span> -</span>
                                <Form.Item>
                                    <InputNumber />
                                </Form.Item>
                            </div>
                        </Form.Item>
                        <Button type="primary" style={{ width: '100%' }}>Áp dụng</Button>
                        <Divider />
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Đánh giá"
                        >
                            <div>
                                <Rate defaultValue={5} />
                                <span></span>
                            </div>
                            <div>
                                <Rate defaultValue={4} />
                                <span>trở lên</span>
                            </div>
                            <div>
                                <Rate defaultValue={3} />
                                <span>trở lên</span>
                            </div>
                            <div>
                                <Rate defaultValue={2} />
                                <span>trở lên</span>
                            </div>
                            <div>
                                <Rate defaultValue={1} />
                                <span>trở lên</span>
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={19} style={{ border: '1px solid yellow', padding: '10px' }}>
                    <Tabs defaultActiveKey="1" items={items} />
                    <Row className="customize-row">
                        {listBook?.map((item, index) => {
                            return (
                                <div className="column">
                                    <div className='wrapper'>
                                        <div className='thumbnail'>
                                            <img src={`http://localhost:8080/images/book/${item.thumbnail}`} alt="thumbnail book" />
                                        </div>
                                        <div className='text'>{item.mainText}</div>
                                        <div className='price'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                        </div>
                                        <div className='rating'>
                                            <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                            <span>{item.sold}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </Row>
                    <Divider />
                    <Row style={{ display: "flex", justifyContent: "center" }}>
                        <Pagination
                            defaultCurrent={6}
                            total={500}
                            responsive
                            current={current}
                            pageSize={pageSize}
                            onChange={(c, p) => { handleOnChange({ current: c, pageSize: p }) }}
                        />
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default HomePage