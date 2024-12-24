import { Descriptions, Divider, Drawer, Image, Upload } from "antd";
import dayjs from "dayjs";
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
interface TProps {
    openDetailView: boolean;
    setOpenDetailView: (v: boolean) => void;
    detailData: IBookTable | null;
    setDetailData: (v: IBookTable | null) => void;
}
const DetailBook = (props: TProps) => {
    const { detailData, openDetailView, setDetailData, setOpenDetailView } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (detailData) {
            let imgThumbnail: any = {}, imgSlider: UploadFile[] = [];
            if (detailData.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: detailData.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${detailData.thumbnail}`
                }
            }
            if (detailData.slider && detailData.slider.length > 0) {
                detailData.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider]);
        }
    }, [detailData])


    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    return (
        <Drawer
            title="Detail book"
            onClose={() => { setOpenDetailView(false), setDetailData(null) }}
            open={openDetailView}
            width={'55vw'}
        >
            <Descriptions
                title={`Detail ${detailData?.mainText}`}
                bordered
                column={2}
            >
                <Descriptions.Item label="ID">{detailData?._id}</Descriptions.Item>
                <Descriptions.Item label="Name">{detailData?.mainText}</Descriptions.Item>
                <Descriptions.Item label="Category">{detailData?.category}</Descriptions.Item>
                <Descriptions.Item label="Author">{detailData?.author}</Descriptions.Item>
                <Descriptions.Item label="Price">{detailData?.price}</Descriptions.Item>
                <Descriptions.Item label="Sold">{detailData?.sold}</Descriptions.Item>
                <Descriptions.Item label="Created At">{dayjs(detailData?.createdAt).format("DD-MM-YYYY")}</Descriptions.Item>
                <Descriptions.Item label="Updated At">{dayjs(detailData?.updatedAt).format("DD-MM-YYYY")}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                showUploadList={
                    { showRemoveIcon: false }
                }
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}


        </Drawer>
    )
}

export default DetailBook;