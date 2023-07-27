import { useState, ChangeEvent } from 'react';
import { ISearch } from '@appTypes/common/common';

interface ISearchFn {
  handleChangeInputSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeSize: (offset: number) => void;
  handleChangePage: (size: number) => void;
  customChangeInputSearch: (data: any) => void;
}

export default <I>(input?: I & Partial<ISearch>): { inputSearch: ISearch; handle: ISearchFn } => {
  const [inputSearch, setInputSearch] = useState<ISearch>({
    ...(input && input),
    offset: input?.offset || 0,
    limit: input?.limit || 10,
  });

  function handleChangeSize(limit: number): void {
    setInputSearch({ ...inputSearch, limit });
  }

  function handleChangePage(offset: number): void {
    setInputSearch({ ...inputSearch, offset: offset * inputSearch.limit });
  }

  function handleChangeInputSearch(e: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;

    setInputSearch({ ...inputSearch, [name]: value });
  }

  function customChangeInputSearch(data: I): void {
    setInputSearch({ ...inputSearch, ...data });
  }

  return {
    inputSearch,
    handle: {
      handleChangeInputSearch,
      handleChangeSize,
      handleChangePage,
      customChangeInputSearch,
    },
  };
};
