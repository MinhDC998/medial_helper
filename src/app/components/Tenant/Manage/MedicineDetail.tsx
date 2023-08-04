import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'antd';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { ICreateMedicine, IMedicine } from '@ts/medicine';
import routersEndpoint from '@routers/routersEndpoint';

import { create, detail as getDetail, update } from '@apis/medicine';

function MedicineDetail() {
  const navigate = useNavigate();
  const params = useParams();

  const schema = yup.object().shape({
    name: yup.string().required('Không được để trống.'),
    symptoms: yup.string().required('Không được để trống.'),
    medicineCode: yup.string().required('Không được để trống.'),
    medicineName: yup.string().required('Không được để trống.'),
    morbidness: yup.string().required('Không được để trống.'),
    dosage: yup.string().required('Không được để trống.'),
    specificDisease: yup.string().required('Không được để trống.'),
    specificObject: yup.string().required('Không được để trống.'),
    ingredients: yup.string().required('Không được để trống.'),
    // note: yup.string().required('Không được để trống.'),
  });

  const {
    register,
    setError,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ICreateMedicine>({
    // resolver: yupResolver(schema),
  });

  useEffect(() => {
    console.log(params.medicineId);
    if (params.medicineId && !Number.isNaN(+params.medicineId)) {
      console.log(typeof +params.medicineId !== 'string');
      getDetail(+params.medicineId).then((res) => {
        if (res.statusCode === 'OK') {
          Object.keys(res.data).forEach((v) => {
            // @ts-expect-error
            setValue(v, res.data[v]);
          });
        }
      });
    }
  }, [params.medicineId]);

  const [file, setFile] = useState<{ display: any; input: any }>({
    display: undefined,
    input: undefined,
  });

  const handleShowImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const reader = new FileReader();

    if (!files) return;

    reader.readAsDataURL(files[0]);

    reader.onloadend = function () {
      setFile({
        display: reader.result,
        input: files[0],
      });
    };
  };

  const onSubmit = async (data: any) => {
    try {
      const form = new FormData();

      Object.keys(data).forEach((k) => {
        form.append(k, data[k]);
      });

      if (file.input) form.append('file', file.input);

      const caller =
        params?.medicineId && !Number.isNaN(+params.medicineId)
          ? update(+params.medicineId, form as any)
          : create(form as any);

      const res = await caller;

      switch (res.statusCode) {
        case 'invalidCredentials':
        case 'FAILED':
          setError('submitError', { type: 'custom', message: res.message });
          return;

        case 'RequiredField':
          Object.keys(res.message).forEach((v: any) => {
            setError(v, { type: 'custom', message: res.message[v][0] });
          });
          return;

        case 'OK':
          navigate(routersEndpoint.tenantManageMedicine);
          reset();

          return;

        default:
          throw new Error('Đã xảy ra lỗi');
      }
    } catch (err) {
      throw new Error('Đã xảy ra lỗi');
    }
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
      <form id="form_medicine" onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-input">
          <label htmlFor="name">
            <span className="label_title">Tên thuốc</span>
            <div>
              <input id="name" type="text" {...register('medicineName')} />
              <span className="error-message">{errors.medicineName?.message || ''}</span>
            </div>
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="medicineName">
            <span className="label_title">Bệnh điều trị</span>
            <input id="medicineName" type="text" {...register('specificDisease')} />
            <span className="error-message">{errors.medicineName?.message || ''}</span>
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="medicineCode">
            <span className="label_title">Mã thuốc</span>
            <input id="medicineCode" type="text" {...register('medicineCode')} />
            <span className="error-message">{errors.medicineCode?.message || ''}</span>
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="symptoms">
            <span className="label_title">Triệu chứng</span>
            <input id="symptoms" type="text" {...register('symptoms')} />
            <span className="error-message">{errors.symptoms?.message || ''}</span>
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="ingredients">
            <span className="label_title">Thành phần chính</span>
            <textarea id="ingredients" {...register('ingredients')} />
            <span className="error-message">{errors.ingredients?.message || ''}</span>
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="specificDisease">
            <span className="label_title">Công dụng</span>
            <textarea id="specificDisease" {...register('specificDisease')} />
            <span className="error-message">{errors.specificDisease?.message || ''}</span>
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="dosage">
            <span className="label_title">Liều lượng</span>
            <textarea id="dosage" {...register('dosage')} />
            <span className="error-message">{errors.dosage?.message || ''}</span>
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="specificObject">
            <span className="label_title">Độ tuổi</span>
            <input id="specificObject" type="text" {...register('specificObject')} />
            <span className="error-message">{errors.specificObject?.message || ''}</span>
          </label>
        </div>

        <div className="form-input">
          <label htmlFor="note">
            <span className="label_title">Ghi chú</span>
            <textarea id="note" {...register('note')} />
            <span className="error-message">{errors.note?.message || ''}</span>
          </label>
        </div>

        <div />

        <div className="form-input">
          <label htmlFor="name">
            <span className="label_title">Tải lên hình ảnh thuốc</span>
            <input type="file" id="name" onChange={handleShowImage} />
          </label>

          {file.display && <img src={file.display} alt="medicineImage" className="medicine_image" />}
        </div>

        <div />

        <div className="form-input">
          <input type="submit" value="Lưu" className="btn_confirm cursor-pointer" />
        </div>
      </form>
    </div>
  );
}

export default MedicineDetail;
