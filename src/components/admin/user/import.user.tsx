import { InboxOutlined } from "@ant-design/icons";
import { App, message, Modal, Table, Upload } from "antd";
import type { UploadProps } from 'antd';
import Column from "antd/es/table/Column";
import { useState } from "react";
import Exceljs from 'exceljs';
import { Buffer } from 'buffer';
import { createListUserAPI } from "@/services/api";
import templateFile from "assets/template/templateUser.xlsx?url";

interface IProps {
    openViewImport: boolean;
    setOpenViewImport: (v: boolean) => void;
    refreshTable: () => void;
}

type IImportData = {
    fullName: string;
    email: string;
    phone: string
}
const ImportUser = (props: IProps) => {
    const { openViewImport, setOpenViewImport, refreshTable } = props;
    const [dataImport, setDataImport] = useState<IImportData[]>([]);
    const { notification } = App.useApp();
    const onFinish = async () => {
        const dataSubmit = dataImport.map(item => ({
            ...item,
            password: import.meta.env.VITE_PASSWORD_DEFAULT
        }))
        const res = await createListUserAPI(dataSubmit);
        if (res && res.data) {
            notification.success({
                message: `Success: ${res.data.countSuccess} Error:${res.data.countError}`
            })
            setOpenViewImport(false);
            setDataImport([]);
            refreshTable();
        } else {
            notification.error({
                message: `${res.data?.detail}`
            })
        }
    }
    const { Dragger } = Upload;

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000);
        },

        async onChange(info) {
            const { status } = info.file;
            console.log("Check info: ", info);
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                const file = info.fileList[0].originFileObj!;
                //Convert buffer
                const workbook = new Exceljs.Workbook();
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)
                await workbook.xlsx.load(buffer);

                //Convert to json
                let jsonData: any = [];
                workbook.worksheets.forEach(function (sheet) {
                    // read first row as data keys
                    let firstRow = sheet.getRow(1);
                    if (!firstRow.cellCount) return;
                    let keys: any = firstRow.values;
                    sheet.eachRow((row, rowNumber) => {
                        if (rowNumber == 1) return;
                        let values: any = row.values
                        let obj: any = {};
                        for (let i = 1; i < keys.length; i++) {
                            obj[keys[i]] = values[i];
                        }
                        jsonData.push(obj);
                    })

                });
                setDataImport(jsonData)
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    return (
        <>
            <Modal
                title="Import User"
                open={openViewImport}
                onCancel={() => { setOpenViewImport(false), setDataImport([]) }}
                onOk={onFinish}
                okText="Import user"
                width={"50vw"}
                destroyOnClose={true}
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                        <a onClick={e => { e.stopPropagation() }} href={templateFile} download> Download template </a>
                    </p>
                </Dragger>
                <Table dataSource={dataImport}>
                    <Column
                        title="Full Name"
                        dataIndex={'fullName'}
                        key={"fullName"}
                    />
                    <Column
                        title="Email"
                        dataIndex={'email'}
                        key={"email"}
                    />
                    <Column
                        title="Phone number"
                        dataIndex={'phone'}
                        key={"phone"}
                    />
                </Table>
            </Modal>
        </>
    )
}

export default ImportUser;