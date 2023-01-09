import React from 'react';

import { listAllNotes } from '@apis/notes';

import { INote } from '@appTypes/note';
import { ISearch } from '@appTypes/common/common';

import useFetch from '@customHooks/fetch';
import useSearch from '@customHooks/search';

import { useDebounce } from '@services/debounce';

import './App.scss';

function App(): JSX.Element {
  const [inputSearch, { handleChangePage, handleChangeInputSearch }] = useSearch({ name: '' });
  const inputDebounce = useDebounce(inputSearch);

  const { isLoading, data } = useFetch<INote[], ISearch>(listAllNotes, inputDebounce);

  function changePage(): void {
    handleChangePage(10);
  }

  return (
    <div className="App">
      <input type="text" name="name" onChange={handleChangeInputSearch} />

      {!isLoading && data?.statusCode === 'OK' ? (
        <div>
          <div className="App-content">
            {data.data.map((v) => (
              <p key={v._id}>{v.content}</p>
            ))}
          </div>
          <span onClick={changePage}>change page</span>
        </div>
      ) : (
        'loading'
      )}
    </div>
  );
}

export default App;
