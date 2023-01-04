import { useState, useEffect } from 'react';
import { TCommonResponse } from '@appTypes/common/response';

interface IUseFetch<D> {
  data: TCommonResponse<D> | undefined
  isLoading: boolean
}

const useFetch = <D, I>(apiFetch: any, input: I): IUseFetch<D> => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<TCommonResponse<D>>();

  console.log({ input });

  useEffect(() => {
    // const controller = new AbortController();

    const fetching = (): void => {
      try {
        setLoading(true);

        apiFetch(input)
          .then((res: TCommonResponse<D>) => {
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
    };

    fetching();

    // return () => { controller.abort(); };
  }, [apiFetch, input]);

  return { isLoading, data };
};

export default useFetch;
