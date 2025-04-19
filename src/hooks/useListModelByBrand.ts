import { useEffect, useState } from 'react';
import { BrandModel, getModelByBrand } from 'api/common.api';
import { getMessageFromError } from 'helpers/common.helper';

const useListModelByBrand = (brand: string) => {
  const [data, setData] = useState<BrandModel[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getModelByBrand(brand);

        setData(response);
        setIsLoading(false);
      } catch (e) {
        setError(getMessageFromError(e));
      }
    };
    if (brand || brand !== '') {
      fetchData();
    }
  }, [brand]);

  return { data, error, isLoading };
};
export default useListModelByBrand;
