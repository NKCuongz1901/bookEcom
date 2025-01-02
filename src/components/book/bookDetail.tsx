import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, Rate, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import ImageGallery from "react-image-gallery";
import 'styles/book.scss'
import ModalGallery from "./modalGallery";
import { useCurrentApp } from "../context/app.context";


interface IProps {
    currentBook: IBookTable | null;
}
type img = {
    original: string,
    thumbnail: string,
}

type UserAction = "Minus" | "Plus";
const BookDetail = (props: IProps) => {
    const { currentBook } = props;
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const refGallery = useRef<ImageGallery>(null);
    const [images, setImages] = useState<img[]>([]);
    const [currentQuantity, setCurrentQuantity] = useState<number>(1);
    const { carts, setCarts } = useCurrentApp();
    const { message } = App.useApp();
    useEffect(() => {
        if (currentBook) {
            const img = [];
            if (currentBook.thumbnail) {
                img.push({
                    original: `http://localhost:8080/images/book/${currentBook?.thumbnail}`,
                    thumbnail: `http://localhost:8080/images/book/${currentBook?.thumbnail}`,
                })
            }
            if (currentBook.slider) {
                currentBook.slider.map((item, index) => {
                    img.push({
                        original: `http://localhost:8080/images/book/${item}`,
                        thumbnail: `http://localhost:8080/images/book/${item}`,
                    })
                })
            }
            setImages(img);
        }
    }, [currentBook])
    const handleOnClick = () => {
        setIsModalOpen(true);
        setCurrentIndex(refGallery.current?.getCurrentIndex() ?? 0)
    }

    const handleOnchangeBtn = (type: UserAction) => {
        if (type === "Minus" && currentBook) {
            if (currentQuantity === 1) return;
            setCurrentQuantity(currentQuantity - 1)
        }
        if (type === 'Plus' && currentBook) {
            if (currentQuantity === +currentBook.quantity) return;
            setCurrentQuantity(currentQuantity + 1);
        }
    }
    const handleOnchange = (value: string) => {
        if (!isNaN(+value)) {
            if (+value > 0 && currentBook && +value < +currentBook.quantity) {
                setCurrentQuantity(+value);
            }
        }
    }
    const addToCart = () => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && currentBook) {
            //update
            const carts = JSON.parse(cartStorage) as ICart[];
            //check exist
            let isExistIndex = carts.findIndex(c => c._id === currentBook?._id);
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity =
                    carts[isExistIndex].quantity + currentQuantity;
            } else {
                carts.push({
                    quantity: currentQuantity,
                    _id: currentBook._id,
                    detail: currentBook
                })
            }
            localStorage.setItem("carts", JSON.stringify(carts));
            //sync React Context
            setCarts(carts);
        } else {
            //create
            const data = [{
                _id: currentBook?._id!,
                quantity: currentQuantity,
                detail: currentBook!
            }]
            localStorage.setItem("carts", JSON.stringify(data))
            //sync React Context
            setCarts(data);

        }
        message.success("Add to cart success");
    }
    console.log("Check carts", carts);
    return (
        <>
            <div style={{ maxWidth: 1140, margin: '0 auto', padding: 10, border: '2px solid green' }}>
                <Row gutter={20}>
                    <Col span={10}>
                        <ImageGallery
                            ref={refGallery}
                            items={images}
                            showPlayButton={false}
                            showFullscreenButton={false}
                            renderRightNav={() => <></>}
                            renderLeftNav={() => <></>}
                            slideOnThumbnailOver={true}
                            onClick={() => { handleOnClick() }}
                        />
                    </Col>
                    <Col span={14}>
                        <Row>
                            <Col span={24} className="book-detail">
                                <p className="book-detail__author">Author:{currentBook?.author}</p>
                                <p className="book-detail__mainText">{currentBook?.mainText}</p>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <Rate defaultValue={5} />
                                    <span>trở lên</span>
                                </div>
                                <p className="book-detail__price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBook?.price ?? 0)}</p>
                                <p className="book-detail__sold">Đã bán: {currentBook?.sold}</p>
                                <p className="book-detail__delivery">Vận chuyển: Miễn phí vận chuyển</p>
                                <div className='quantity'>
                                    <span className='left'>Số lượng</span>
                                    <span className='right'>
                                        <button onClick={() => { handleOnchangeBtn('Minus') }} ><MinusOutlined /></button>
                                        <input value={currentQuantity} onChange={(event) => { handleOnchange(event.target.value) }} />
                                        <button onClick={() => { handleOnchangeBtn('Plus') }}><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className='btn-cta'>
                                    <button className='btn-cta__cart' onClick={() => addToCart()}>
                                        <BsCartPlus className='icon-cart' />
                                        <span>Thêm vào giỏ hàng</span>
                                    </button>
                                    <button className='btn-cta__now'>Mua Ngay</button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row >
            </div >
            <ModalGallery
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                items={images}
            />
        </>
    )
}
export default BookDetail;