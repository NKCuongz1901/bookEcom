import 'styles/order.scss'
import { useCurrentApp } from '../context/app.context';
import { useEffect, useState } from 'react';
import { Col, Divider, InputNumber, Row } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';

interface IProps {
    setCurrentStep: (v: number) => void;
}

const OrderDetail = (props: IProps) => {
    const { carts, setCarts } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const { setCurrentStep } = props;
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
    const handleOnChangeInput = (value: number, book: IBookTable) => {
        if (!value || value <= 1) return;
        const cartStorage = localStorage.getItem("carts");
        if (!isNaN(+value)) {
            if (cartStorage && book) {
                const carts = JSON.parse(cartStorage) as ICart[];
                //check exist
                let isExistIndex = carts.findIndex(c => c._id === book?._id);
                if (isExistIndex > -1) {
                    carts[isExistIndex].quantity = +value;
                }
                localStorage.setItem("carts", JSON.stringify(carts));
                setCarts(carts);
            }

        }
    }
    const handleDelete = (_id: string) => {
        const cartsStorage = localStorage.getItem("carts");
        if (cartsStorage) {
            const carts = JSON.parse(cartsStorage) as ICart[];
            const newCarts = carts.filter(item => item._id !== _id);
            localStorage.setItem("carts", JSON.stringify(newCarts));
            setCarts(newCarts);
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
                                                    onChange={(value) => handleOnChangeInput(value as number, item.detail)}
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
                            <div className='order-sum'>
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
                                <Divider style={{ margin: "10px 0" }} />
                                <button className='order-sum__buy' onClick={() => setCurrentStep(1)}>Mua Hàng ({carts?.length ?? 0})</button>
                            </div>
                        </Col>

                    </Row>
                </div>
            </div>
        </>
    )
}

export default OrderDetail;