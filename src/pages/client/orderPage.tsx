import OrderDetail from "@/components/order/orderDetail";
import Payment from "@/components/order/payment";
import { Button, Result, Steps } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import 'styles/order.scss';

const OrderPage = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    return (
        <>

            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                    <div className="order-steps">
                        <Steps
                            size="small"
                            current={currentStep}
                            items={[
                                {
                                    title: 'Đơn hàng',
                                },
                                {
                                    title: 'Đặt hàng',
                                },
                                {
                                    title: 'Thanh toán',
                                },
                            ]}
                        />
                    </div>
                    {currentStep === 0 &&
                        <OrderDetail
                            setCurrentStep={setCurrentStep}
                        />
                    }
                    {currentStep === 1 &&
                        <Payment
                            setCurrentStep={setCurrentStep}
                        />
                    }
                    {currentStep === 2 &&
                        <Result
                            status="success"
                            title="Successfully create order!"
                            subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                            extra={[
                                <Button key="home" >
                                    <Link to={"/"} type="primary">
                                        Home page
                                    </Link>
                                </Button>,
                                <Button key="history">
                                    <Link to={"/history"} type="primary">
                                        History
                                    </Link>
                                </Button>,
                            ]}
                        />
                    }
                </div>
            </div>
        </>
    )
}

export default OrderPage;