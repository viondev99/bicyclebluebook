import { useEffect, useState } from 'react';
import { getMessageFromError } from 'helpers/common.helper';
import { ConditionsBicycleResponse, getConditionByComponents } from 'api/trade-in.api';

const useConditionByBMY = (brand: string, model: string, year: string) => {
  const [data, setData] = useState<ConditionsBicycleResponse>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getConditionByComponents({ brand, model, year });

        setData(response);
        setIsLoading(false);
      } catch (e) {
        setError(getMessageFromError(e));
      }
    };
    if (brand && model && year) {
      fetchData();
    }
  }, [brand, model, year]);

  return { data, error, isLoading };
};
export default useConditionByBMY;
