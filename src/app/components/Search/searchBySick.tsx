import React, { useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import useFetch from '@customHooks/fetch';
import useSearch from '@customHooks/search';

import { list } from '@apis/morbidness';

import { ISick } from '@ts/sick';
import routersEndpoint from '@routers/routersEndpoint';
import { ISearch } from '@ts/common/common';

function SearchBySick() {
  const navigate = useNavigate();

  const { debounceValue: inputSearch, handle } = useSearch({}, { isUseDebounce: true });
  const { data } = useFetch<ISick, ISearch>(list, inputSearch);

  const [sicksSelected, setSicksSelected] = useState<string[]>([]);

  const handleSelectSick = (sickData: string) => {
    setSicksSelected((prev) => (prev.includes(sickData) ? prev : [...prev, sickData]));
  };

  const handleRemoveSick = (sickData: string) => {
    setSicksSelected((prev) => prev.filter((v) => v !== sickData));
  };

  const handleSearch = () => {
    navigate(routersEndpoint.searchBy.replace(':by', routersEndpoint.searchByMedicine), { state: { sicksSelected } });
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div className="inputWithIcon">
        <input
          type="text"
          placeholder="Nhập tên bệnh hoặc triệu chứng"
          name="name"
          onChange={handle.handleChangeInputSearch}
        />
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

      {sicksSelected.length > 0 && (
        <Button className="work-break" onClick={handleSearch}>
          Tìm thuốc
        </Button>
      )}

      <div id="wrapper_symptom">
        {data &&
          data.statusCode === 'OK' &&
          // @ts-expect-error
          data.data.map((v) => (
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
