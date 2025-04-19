import { useEffect, useState } from 'react';
import { getMessageFromError } from 'helpers/common.helper';
import { getImageType, ImageTypeModel } from 'api/trade-in.api';

const useTradeInImageType = () => {
  const [data, setData] = useState<ImageTypeModel[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getImageType();

        setData(response);
        setIsLoading(false);
      } catch (e) {
        setError(getMessageFromError(e));
      }
    };

    fetchData();
  }, []);

  return { data, error, isLoading };
};
export default useTradeInImageType;
