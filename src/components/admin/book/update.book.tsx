import { getCategoryAPI, updateBookAPI, uploadFileAPI } from "@/services/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import { UploadChangeParam } from 'antd/es/upload';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import type { FormProps, GetProp, UploadProps, UploadFile } from 'antd';

interface IProps {
    openUpdateView: boolean;
    setOpenUpdateView: (v: boolean) => void;
    updateData: IBookTable | null;
    setUpdateData: (v: IBookTable) => void;
    refreshTable: () => void;
}
type FieldType = {
    _id: string;
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: any;
    slider: any;
};

type UserUploadFile = "thumbnail" | "slider"


const UpdateBook = (props: IProps) => {
    const [form] = Form.useForm();
    const { openUpdateView, setOpenUpdateView, updateData, setUpdateData, refreshTable } = props;
    const [categoryData, setCategoryData] = useState<{
        label: string;
        value: string;
    }[]>([]);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
    const { message, notification } = App.useApp();
    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getCategoryAPI();
            if (res.data) {
                const data = res.data.map(item => {
                    return { label: item, value: item }
                })
                setCategoryData(data);
            }
        }
        fetchCategory();
    }, [])
    useEffect(() => {
        if (updateData) {
            const arrThumbnail = [{
                uid: uuidv4(),
                name: updateData.thumbnail,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${updateData.thumbnail}`
            }]
            const arrSlider = updateData?.slider?.map(item => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                }
            })
            form.setFieldsValue({
                _id: updateData._id,
                mainText: updateData.mainText,
                author: updateData.author,
                category: updateData.category,
                price: updateData.price,
                quantity: updateData.quantity,
                thumbnail: updateData.thumbnail,
                slider: updateData.slider
            })
            setFileListSlider(arrSlider as any);
            setFileListThumbnail(arrThumbnail as any);
        }
    }, [updateData])
    //GetBase64
    const getBase64 = (img: FileType, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
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
    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadFile) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, 'book');
        if (res && res.data) {
            const uploadFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
            }
            if (type === 'thumbnail') {
                setFileListThumbnail([{ ...uploadFile }]);
            } else {
                setFileListSlider((prevState) => [...prevState, { ...uploadFile }]);
            }
        }
        if (onSuccess) {
            onSuccess('ok');
        } else {
            message.error(res.message);
        }
    }
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
    const handleRemove = async (file: UploadFile, type: UserUploadFile) => {
        if (type === 'thumbnail') {
            setFileListThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = fileListSlider.filter(x => x.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    };
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, mainText, author, price, category, quantity, slider, thumbnail } = values;
        const res = await updateBookAPI(_id, mainText, author, price, quantity, category, thumbnail, slider);
        if (res.data) {
            message.success('Update book success');
            setOpenUpdateView(false);
            setFileListSlider([]);
            setFileListThumbnail([]);
            form.resetFields();
            refreshTable();
        } else {
            notification.error({
                message: 'Update book false',
            })
        }
    }
    return (
        <>
            <Modal
                title="Update book"
                open={openUpdateView}
                onCancel={() => { setOpenUpdateView(false), form.resetFields() }}
                okText="Update"
                onOk={() => { form.submit() }}
                width={"50vw"}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={20}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="ID"
                            name="_id"
                            rules={[{ required: true, message: 'Pls enter name!' }]}
                            hidden={true}
                        >
                            <Input />
                        </Form.Item>
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
                            <Form.Item<FieldType>
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
                            <Form.Item<FieldType>
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
                            <Form.Item<FieldType>
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
                            <Form.Item<FieldType>
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
                            <Form.Item<FieldType>
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
                                    customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'thumbnail')}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemove(file, 'thumbnail')}
                                    fileList={fileListThumbnail}
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
                                    customRequest={(options) => handleUploadFile(options, 'slider')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onRemove={(file) => handleRemove(file, 'slider')}
                                    fileList={fileListSlider}
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
export default UpdateBook;