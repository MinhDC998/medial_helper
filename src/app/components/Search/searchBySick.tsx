import React, { useState } from 'react';

import { ISick } from '@ts/sick';

function SearchBySick() {
  const test: ISick[] = [
    {
      id: 1,
      name: 'Đau đầu',
    },
    {
      id: 2,
      name: 'Sổ mũi',
    },
    {
      id: 3,
      name: 'Chóng mặt',
    },
    {
      id: 4,
      name: 'Ho Khan',
    },
  ];

  const [sicksSelected, setSicksSelected] = useState<string[]>([]);

  const handleSelectSick = (sickData: string) => {
    setSicksSelected((prev) => (prev.includes(sickData) ? prev : [...prev, sickData]));
  };

  const handleRemoveSick = (sickData: string) => {
    setSicksSelected((prev) => prev.filter((v) => v !== sickData));
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div className="inputWithIcon">
        <input type="text" placeholder="Nhập tên bệnh hoặc triệu chứng" />
        <i className="fa fa-search fa-lg fa-fw" aria-hidden="true" />
      </div>

      <div id="wrapper_sick_selected">
        <span>Các triệu chứng đã chọn:</span>
        {sicksSelected.map((v) => (
          <span
            key={v}
            onClick={() => {
              handleRemoveSick(v);
            }}
            className="sick_selected"
          >
            {v}
            <span className="remove_sick_icon"> x </span>
          </span>
        ))}
      </div>
      <div id="wrapper_symptom">
        {test.map((v) => (
          <div
            className="symptom cursor-pointer"
            key={v.id}
            onClick={() => {
              handleSelectSick(v.name);
            }}
          >
            {v.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBySick;
