import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, message, Upload, Modal } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import SearchByMedicine from '@components/Search/searchByMedicine';
import routersEndpoint from '@routers/routersEndpoint';

import { importExcel } from '@apis/medicine';
import { randomString, isFailedRes } from '@utils/helper';
import { getUser } from '@utils/user';
import role from '@constants/role';

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

    try {
      const res = await importExcel(formData);
      setUploading(false);

      if (!res || res.statusCode !== 'OK') {
        message.error('Đã xảy ra lỗi');

        return;
      }

      message.success('Thêm thành công');
      setFileList([]);
      toggleModal();
      setReloadData(randomString());
    } catch (err) {
      if (isFailedRes(err)) {
        message.error(err.message);
        setFileList([]);
        setUploading(false);
      }
    }
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      console.log(file.type);
      if (
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      ) {
        setFileList([file]);
        return;
      }
      setFileList([]);
      message.error('Vui lòng chọn đúng định dạng file');
    },
    fileList,
    multiple: false,
  };

  return (
    <div className="main_content">
      {+getUser().role === role.TENANT_USER && (
        <div id="wrapper_btn">
          <Link to={routersEndpoint.tenantManageMedicineById.replace(':medicineId', 'tao-moi')}>
            <Button>Thêm mới</Button>
          </Link>
          <Button onClick={toggleModal}>Import Excel</Button>
        </div>
      )}

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
