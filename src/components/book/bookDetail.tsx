import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Rate, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import ImageGallery from "react-image-gallery";
import 'styles/book.scss'
import ModalGallery from "./modalGallery";

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
        if (type === "Minus") {
            setCurrentQuantity(currentQuantity - 1)
        }
        if (type === 'Plus') {
            setCurrentQuantity(currentQuantity + 1);
        }
    }
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
                                <p className="book-detail__author">{currentBook?.author}</p>
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
                                        <input defaultValue={1} value={currentQuantity} />
                                        <button onClick={() => { handleOnchangeBtn('Plus') }}><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className='btn-cta'>
                                    <button className='btn-cta__cart'>
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