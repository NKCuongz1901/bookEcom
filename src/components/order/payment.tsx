import 'styles/order.scss'
import { useCurrentApp } from '../context/app.context';
import { App, Col, Divider, Form, Input, InputNumber, Radio, Row, Space } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { FormProps } from 'antd/lib';
import { createOrderAPI } from '@/services/api';

interface IProps {
    setCurrentStep: (v: number) => void;
}
type UserMethod = "COD" | "BANKING";
type FieldType = {
    fullName: string;
    phone: string;
    address: string;
    method: UserMethod
}
const Payment = (props: IProps) => {
    const { setCurrentStep } = props;
    const { carts, setCarts, user } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [form] = Form.useForm();
    const { notification, message } = App.useApp()
    const { TextArea } = Input
    const handleDelete = (_id: string) => {
        const cartsStorage = localStorage.getItem("carts");
        if (cartsStorage) {
            const carts = JSON.parse(cartsStorage) as ICart[];
            const newCarts = carts.filter(item => item._id !== _id);
            localStorage.setItem("carts", JSON.stringify(newCarts));
            setCarts(newCarts);
        }
    }
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone
            })
        }
    }, [])
    useEffect(() => {
        if (carts && carts.length) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            })
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts])
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { address, fullName, method, phone } = values;
        const detail = carts.map(item => {
            return {
                bookName: item.detail.mainText,
                quantity: item.quantity,
                _id: item._id
            }

        })
        const res = await createOrderAPI(fullName, address, phone, totalPrice, method, detail);
        if (res && res.data) {
            setCurrentStep(2);
            setCarts([]);
            localStorage.removeItem("carts");
            message.success("Create order success")
        } else {
            notification.error({
                message: 'Create an order fail'
            })
        }
    }
    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                    <Row gutter={[20, 10]}>
                        <Col span={18}>
                            {carts.map((item, i) => {
                                const currentPriceBook = item?.detail?.price;
                                return (
                                    <div className="order-card">
                                        <div >
                                            <img src={`http://localhost:8080/images/book/${item.detail.thumbnail}`} alt="thumbnail book" className="order-card__thumbnail" />
                                        </div>
                                        <div className="order-card__mainText">{item.detail.mainText}</div>
                                        <div className='order-card__price'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPriceBook)}
                                        </div>
                                        <div className="order-card__action">

                                            <div className='order-card__action-quantity'>
                                                <InputNumber
                                                    min={1}

                                                    value={item.quantity}
                                                />
                                            </div>
                                            <div className="order-card__action-sum">
                                                Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPriceBook * item.quantity)}
                                            </div>
                                            <DeleteTwoTone
                                                style={{ cursor: "pointer" }}
                                                twoToneColor="#eb2f96"
                                                onClick={() => handleDelete(item._id)}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </Col>
                        <Col span={6}>
                            <div className="payment-container">
                                <Form
                                    form={form}
                                    title='Form đặt hàng'
                                    onFinish={onFinish}
                                >
                                    <Form.Item<FieldType>
                                        labelCol={{ span: 24 }}
                                        label={"Hình thức thanh toán"}
                                        name={'method'}
                                    >
                                        <Radio.Group>
                                            <Space direction="vertical">
                                                <Radio value={"COD"}>Thanh toán khi nhận hàng</Radio>
                                                <Radio value={"BANKING"}>Chuyển khoản ngân hàng</Radio>
                                            </Space>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        labelCol={{ span: 24 }}
                                        label={"Họ tên"}
                                        name={'fullName'}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        labelCol={{ span: 24 }}
                                        label={"Số điện thoại"}
                                        name={'phone'}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        labelCol={{ span: 24 }}
                                        label={"Địa chỉ nhận hàng"}
                                        name={'address'}
                                    >
                                        <TextArea rows={4} />
                                    </Form.Item>
                                    <div className='calculate'>
                                        <span> Tạm tính: </span>
                                        <span>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                                        </span>
                                    </div>
                                    <Divider style={{ margin: "10px 0" }} />
                                    <div className='calculate'>
                                        <span>Tổng tiền: </span>
                                        <span className='sum-final'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                                        </span>
                                    </div>
                                    <button className='order-sum__buy'>Đặt hàng ({carts?.length ?? 0})</button>
                                </Form>

                            </div>
                        </Col>

                    </Row>
                </div>
            </div >
        </>
    )
}
export default Payment;