import { Col, Image, Modal, Row } from "antd";
import { useRef } from "react";
import ImageGallery from "react-image-gallery";

interface IProps {
    currentIndex: number;
    setCurrentIndex: (v: number) => void;
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    items: {
        original: string;
        thumbnail: string;
    }[];
}

const ModalGallery = (props: IProps) => {
    const { currentIndex, isModalOpen, setCurrentIndex, setIsModalOpen, items } = props;
    const refGallery = useRef<ImageGallery>(null);
    return (
        <>
            <Modal
                open={isModalOpen}
                onCancel={() => { setIsModalOpen(false) }}
                width={'50vw'}
            >
                <Row gutter={20}>
                    <Col span={16}>
                        <ImageGallery
                            items={items}
                            showPlayButton={false}
                            showFullscreenButton={false}
                            renderRightNav={() => <></>}
                            renderLeftNav={() => <></>}
                            slideOnThumbnailOver={true}
                            startIndex={currentIndex}
                        />

                    </Col>
                    <Col span={8}>
                        <Row gutter={[20, 10]}>
                            {items.map((item, index) => {
                                return (
                                    <Col key={index}>
                                        <Image
                                            width={100}
                                            height={100}
                                            src={item.original}
                                            preview={false}
                                            onClick={() => { refGallery?.current?.slideToIndex(index) }}
                                        />
                                    </Col>
                                )
                            })}


                        </Row>
                    </Col>

                </Row>

            </Modal>
        </>
    )
}
export default ModalGallery;