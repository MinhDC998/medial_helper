import { useState, ChangeEvent, useRef, useEffect } from 'react';

import { ISearch } from '@ts/common/common';

type TUseSearch<I> = I & Partial<ISearch>;

interface IUseSearchDebounce {
  isUseDebounce: boolean;
  delay?: number;
}

interface IResSearchFn {
  handleChangeInputSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeSize: (offset: number) => void;
  handleChangePage: (size: number) => void;
  customChangeInputSearch: (data: any) => void;
  customChangePagination: (offset: number, limit: number) => void;
}

interface IUseSearchRes {
  inputSearch: ISearch;
  handle: IResSearchFn;
  debounceValue: ISearch;
}

export default <I>(input?: TUseSearch<I>, debounce?: IUseSearchDebounce): IUseSearchRes<I> => {
  const [inputSearch, setInputSearch] = useState<ISearch>({
    ...(input && input),
    offset: input?.offset || 0,
    limit: input?.limit || 10,
  });

  const [debounceValue, setDebounceValue] = useState(inputSearch);

  const ref = useRef<any>(null);

  useEffect(() => {
    if (inputSearch.offset !== debounceValue.offset || inputSearch.limit !== debounceValue.limit) {
      setDebounceValue(inputSearch);
    }

    if (!debounce || !debounce.isUseDebounce) return;

    ref.current = setTimeout(() => {
      setDebounceValue(inputSearch);
    }, debounce.delay || 500);

    return () => {
      clearTimeout(ref.current);
    };
  }, [inputSearch]);

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

  function customChangePagination(offset: number, limit: number) {
    setInputSearch({ ...inputSearch, offset: offset * inputSearch.limit, limit });
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
      customChangePagination,
    },
    debounceValue,
  };
};
