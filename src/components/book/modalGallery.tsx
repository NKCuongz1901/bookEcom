import { Modal } from "antd";
import ImageGallery from "react-image-gallery";

interface IProps {
    currentIndex: number;
    setCurrentIndex: (v: number) => void;
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    items: {
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[];
}

const ModalGallery = (props: IProps) => {
    const { currentIndex, isModalOpen, setCurrentIndex, setIsModalOpen, items } = props;
    return (
        <>
            <Modal
                open={isModalOpen}
                onCancel={() => { setIsModalOpen(false) }}
            >
                <ImageGallery
                    items={items}
                    showPlayButton={false}
                    showFullscreenButton={false}
                    renderRightNav={() => <></>}
                    renderLeftNav={() => <></>}
                    slideOnThumbnailOver={true}

                />

            </Modal>
        </>
    )
}
export default ModalGallery;