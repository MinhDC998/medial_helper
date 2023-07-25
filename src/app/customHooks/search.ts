import { useState, ChangeEvent } from 'react';
import { ISearch } from '@appTypes/common/common';

interface ISearchFn {
  handleChangeInputSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeSize: (offset: number) => void;
  handleChangePage: (size: number) => void;
  customChangeInputSearch: (data: any) => void;
}

export default <I>(input: I): [ISearch, ISearchFn] => {
  const [inputSearch, setInputSearch] = useState<ISearch>({
    ...input,
    offset: 0,
    limit: 10,
  });

  function handleChangeSize(limit: number): void {
    setInputSearch({ ...inputSearch, limit });
  }
  function handleChangePage(offset: number): void {
    setInputSearch({ ...inputSearch, offset });
  }

  function handleChangeInputSearch(e: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;

    setInputSearch({ ...inputSearch, [name]: value });
  }

  function customChangeInputSearch(data: I): void {
    setInputSearch({ ...inputSearch, ...data });
  }

  return [
    inputSearch,
    {
      handleChangeInputSearch,
      handleChangeSize,
      handleChangePage,
      customChangeInputSearch,
    },
  ];
};
