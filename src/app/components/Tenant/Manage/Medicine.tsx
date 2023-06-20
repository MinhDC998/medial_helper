import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import SearchByMedicine from '@components/Search/searchByMedicine';
import routersEndpoint from '@routers/routersEndpoint';

import './styles.scss';

function ManageMedicine() {
  const navigate = useNavigate();

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
        <Button> Import excel </Button>
      </div>

      <SearchByMedicine />
    </div>
  );
}

export default ManageMedicine;
