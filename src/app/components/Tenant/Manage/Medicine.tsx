import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message, Upload, Modal } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import SearchByMedicine from '@components/Search/searchByMedicine';
import routersEndpoint from '@routers/routersEndpoint';

import { importExcel } from '@apis/medicine';

import './styles.scss';

function ManageMedicine() {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [reloadData, setReloadData] = useState('');

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('excel', file as RcFile);
    });

    setUploading(true);

    const res = await importExcel(formData);
    setUploading(false);

    if (!res || res.statusCode !== 'OK') {
      message.error('Đã xảy ra lỗi');

      return;
    }

    message.success('Thêm thành công');
    setFileList([]);
    toggleModal();
    setReloadData(new Date().toDateString());
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);

      return false;
    },
    fileList,
    multiple: false,
  };

  return (
    <div className="main_content">
      <div id="wrapper_btn">
        <Button
          onClick={() => {
            navigate(routersEndpoint.tenantManageMedicineById);
          }}
        >
          Thêm mới
        </Button>
        <Button onClick={toggleModal}>Import Excel</Button>
      </div>

      <SearchByMedicine resetDataAt={reloadData} />

      <Modal
        title="Import Excel"
        open={isOpenModal}
        onCancel={toggleModal}
        footer={[
          <Button onClick={toggleModal} key="cancel">
            Hủy bỏ
          </Button>,
        ]}
      >
        <Upload {...props}>
          <Button>Chọn file</Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Đang tải lên' : 'Tải lên'}
        </Button>
      </Modal>
    </div>
  );
}

export default ManageMedicine;
