import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { IMedicine } from '@ts/tenant';
import routersEndpoint from '@routers/routersEndpoint';
import { Button } from 'antd';

function MedicineDetail() {
  const navigate = useNavigate();

  //   const [detail] = useState<IMedicine>();
  const { register } = useForm<IMedicine>();
  const [file, setFile] = useState<any>('');

  const handleShowImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const reader = new FileReader();

    if (!files) return;

    reader.readAsDataURL(files[0]);

    reader.onloadend = function () {
      setFile(reader.result);
    };
  };

  return (
    <div className="main_content">
      <Button
        onClick={() => {
          navigate(routersEndpoint.tenantManageMedicine);
        }}
      >
        Trờ lại
      </Button>
      <form id="form_medicine">
        <div className="form-input">
          <label htmlFor="name">
            <span className="label_title">Tên thuốc</span>
            <input id="name" type="text" {...register('name')} />
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="medicineName">
            <span className="label_title">Bệnh điều trị</span>
            <input id="medicineName" type="text" {...register('medicineName')} />
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="medicineCode">
            <span className="label_title">Mã thuốc</span>
            <input id="medicineCode" type="text" {...register('medicineCode')} />
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="symptoms">
            <span className="label_title">Triệu chứng</span>
            <input id="symptoms" type="text" {...register('symptoms')} />
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="ingredients">
            <span className="label_title">Thành phần chính</span>
            <input id="ingredients" type="text" {...register('ingredients')} />
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="specificDisease">
            <span className="label_title">Công dụng</span>
            <input id="specificDisease" type="text" {...register('specificDisease')} />
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="dosage">
            <span className="label_title">Liều lượng</span>
            <input id="dosage" type="text" {...register('dosage')} />
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="specificObject">
            <span className="label_title">Độ tuổi</span>
            <input id="specificObject" type="text" {...register('specificObject')} />
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="note">
            <span className="label_title">Ghi chú</span>
            <textarea id="note" {...register('note')} />
          </label>
        </div>

        <div />

        <div className="form-input">
          <label htmlFor="name">
            <span className="label_title">Tải lên hình ảnh thuốc</span>
            <input type="file" id="name" onChange={handleShowImage} />
          </label>

          {file && <img src={file} alt="medicineImage" className="medicine_image" />}
        </div>

        <div />

        <div className="form-input">
          <input type="submit" value="Lưu" className="btn_confirm" />
        </div>
      </form>
    </div>
  );
}

export default MedicineDetail;
