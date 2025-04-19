import { useEffect, useState } from 'react';
import { getMessageFromError } from 'helpers/common.helper';
import { getOffer } from 'api/common.api';
import { OfferModel } from 'model/api/common.model';

export default function useOfferInfo(id: string) {
  const [data, setData] = useState<OfferModel>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getOffer(id);
        setLoading(false);
        setData(res);
      } catch (e) {
        setLoading(false);
        setError(getMessageFromError(e));
      }
    };
    fetchData();
  }, [id]);

  return { data, error, loading };
}
