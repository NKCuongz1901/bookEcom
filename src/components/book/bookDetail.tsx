import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Rate, Row } from "antd";
import { useRef, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import ImageGallery from "react-image-gallery";
import 'styles/book.scss'
import ModalGallery from "./modalGallery";
const BookDetail = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const refGallery = useRef<ImageGallery>(null);
    const images = [
        {
            original: "https://picsum.photos/id/1018/1000/600/",
            thumbnail: "https://picsum.photos/id/1018/250/150/",
        },
        {
            original: "https://picsum.photos/id/1015/1000/600/",
            thumbnail: "https://picsum.photos/id/1015/250/150/",
        },
        {
            original: "https://picsum.photos/id/1019/1000/600/",
            thumbnail: "https://picsum.photos/id/1019/250/150/",
        },
        {
            original: "https://picsum.photos/id/1019/1000/600/",
            thumbnail: "https://picsum.photos/id/1019/250/150/",
        },
        {
            original: "https://picsum.photos/id/1019/1000/600/",
            thumbnail: "https://picsum.photos/id/1019/250/150/",
        },
    ];
    const handleOnClick = () => {
        setIsModalOpen(true);
        setCurrentIndex(refGallery.current?.getCurrentIndex() ?? 0)
    }

    return (
        <>
            <div style={{ maxWidth: 1140, margin: '0 auto' }}>
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
                                <p className="book-detail__author">Author: NKC</p>
                                <p className="book-detail__mainText">Tôi nghiện liên minh huyền thoại</p>
                                <div>
                                    <Rate defaultValue={5} />
                                    <span>trở lên</span>
                                </div>
                                <p className="book-detail__price">100000000</p>
                                <p className="book-detail__delivery">Vận chuyển: Miễn phí vận chuyển</p>
                                <div className='quantity'>
                                    <span className='left'>Số lượng</span>
                                    <span className='right'>
                                        <button ><MinusOutlined /></button>
                                        <input defaultValue={1} />
                                        <button><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className='buy'>
                                    <button className='cart'>
                                        <BsCartPlus className='icon-cart' />
                                        <span>Thêm vào giỏ hàng</span>
                                    </button>
                                    <button className='now'>Mua ngay</button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
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