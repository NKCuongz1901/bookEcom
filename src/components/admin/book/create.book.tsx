import { getCategoryAPI } from "@/services/api";
import { Col, Form, Image, Input, InputNumber, Modal, Row, Select, Upload, message } from "antd";
import { useEffect, useState } from "react";
import type { FormProps, GetProp, UploadProps, UploadFile } from 'antd';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import { UploadChangeParam } from 'antd/es/upload';
interface TProps {
    openCreateView: boolean;
    setOpenCreateView: (v: boolean) => void;
    refreshTable: () => void;

}
type FieldType = {
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: any;
    slider: any;
};

const CreateBook = (props: TProps) => {
    const [form] = Form.useForm();
    const { openCreateView, setOpenCreateView, refreshTable } = props;
    const [categoryData, setCategoryData] = useState<{
        label: string;
        value: string;
    }[]>([]);
    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log("Check values: ", values);
    }

    useEffect(() => {
        const getCategory = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const data = res.data.map(item => {
                    return {
                        label: item, value: item
                    }
                })
                setCategoryData(data);
            }

        }
        getCategory();
    }, [])
    //GetBase64
    const getBase64 = (img: FileType, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };
    //Check beforeUpload
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    //Change upload
    const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
        if (info.file.status === 'uploading') {
            type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    };

    const handleUploadFile: UploadProps['customRequest'] = ({ file, onSuccess, onError }) => {
        setTimeout(() => {
            if (onSuccess)
                onSuccess("ok");
        }, 1000);
    };

    //Preview upload file
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    return (
        <>
            <Modal
                title="Add new book"
                open={openCreateView}
                onCancel={() => { setOpenCreateView(false), form.resetFields() }}
                okText="Add new"
                onOk={() => { form.submit() }}
                width={"50vw"}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Title"
                                name="mainText"
                                rules={[{ required: true, message: 'Pls enter name!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Author"
                                name="author" rules={[{ required: true, message: 'Pls enter author' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Price"
                                name={"price"}
                                rules={[{ required: true, message: 'Pls enter price' }]}
                            >
                                <InputNumber
                                    min={0}
                                    addonAfter={"VND"}
                                    formatter={value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Category"
                                name={"category"}
                                rules={[{ required: true, message: 'Pls select category' }]}
                            >
                                <Select
                                    placeholder="Select category"
                                    options={categoryData}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Quantity"
                                name={"quantity"}
                                rules={[{ required: true, message: 'Pls enter quantity' }]}
                            >
                                <InputNumber
                                    min={0}
                                    formatter={value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thumbnail"
                                name={"thumbnail"}
                                rules={[{ required: true, message: 'Pls upload thumbnail' }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFile}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'thumbnail')}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"
                                rules={[{ required: true, message: 'Vui lòng nhập upload slider!' }]}
                                //convert value from Upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    multiple
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    customRequest={handleUploadFile}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}
export default CreateBook;