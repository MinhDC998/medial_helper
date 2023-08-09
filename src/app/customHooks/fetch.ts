import { useState, useEffect } from 'react';
import { TCommonListResponse } from '@appTypes/common/response';
import { randomString } from '@utils/helper';

interface IUseFetch<D> {
  data: TCommonListResponse<D> | undefined;
  isLoading: boolean;
  reload: () => void;
}

const useFetch = <D, I>(apiFetch: any, input: I): IUseFetch<D> => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<TCommonListResponse<D>>();
  const [load, setLoad] = useState('');

  const reload = () => {
    setLoad(randomString());
  };

  useEffect(() => {
    const controller = new AbortController();

    try {
      setLoading(true);

      apiFetch(input)
        .then((res: TCommonListResponse<D>) => {
          setLoading(false);
          setData(res);
        })
        .catch((err: any) => {
          setLoading(true);
          console.log({ err });
        });
    } catch (err) {
      console.log(err);
    }

    return () => {
      controller.abort();
    };
  }, [apiFetch, input, load]);

  return { isLoading, data, reload };
};

export default useFetch;
