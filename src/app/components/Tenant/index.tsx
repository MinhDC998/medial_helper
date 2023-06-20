import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ITenant } from '@ts/tenant';
import routersEndpoint from '@routers/routersEndpoint';

function Tenant() {
  const [tenant] = useState<ITenant>({ name: 'Chi nhanh Phu My', id: 1 });
  const navigate = useNavigate();

  return (
    <div className="main_content">
      <div id="wrapper_selection">
        <p>
          Bạn đang chọn chi nhánh:
          <strong>{tenant.name}</strong>
        </p>

        <div
          className="button_select cursor-pointer"
          onClick={() => {
            navigate(routersEndpoint.tenantManageMedicine.replace(':id', tenant.id.toString()));
          }}
        >
          Quản lý danh mục thuốc
        </div>
        <div className="button_select cursor-pointer"> Quản lý danh mục bệnh </div>
      </div>
    </div>
  );
}

export default Tenant;
