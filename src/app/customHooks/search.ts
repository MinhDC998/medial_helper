import { useState, ChangeEvent } from 'react';
import { ISearch } from '@appTypes/common/common';

interface ISearchFn {
  handleChangeInputSearch: (e: ChangeEvent<HTMLInputElement>) => void
  handleChangeSize: (offset: number) => void
  handleChangePage: (size: number) => void
  customChangeInputSearch: (data: Record<string, any>) => void
}

export default <I>(input: I): [ ISearch, ISearchFn ] => {
  const [inputSearch, setInputSearch] = useState<ISearch>({
    ...input,
    offset: 0,
    size: 10,
  });

  function handleChangeSize(size: number): void { setInputSearch({ ...inputSearch, size }); }
  function handleChangePage(offset: number): void { setInputSearch({ ...inputSearch, offset }); }

  function handleChangeInputSearch(e: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;

    console.log(name);

    setInputSearch({ ...inputSearch, [name]: value });
  }

  function customChangeInputSearch(data: Record<string, any>): void { setInputSearch({ ...inputSearch, ...data }); }

  return [
    inputSearch,
    {
      handleChangeInputSearch, handleChangeSize, handleChangePage, customChangeInputSearch,
    },
  ];
};
