import { useState, useRef, useEffect, useCallback } from 'react';

import { getBankInfo } from 'api/info.api';
import { deleteAccountStripeRequest, getUrlConnectStripeAccount } from 'api/account/personal/listings.api';
import { toastSuccess } from 'helpers/utils.helper';

interface ConnectStripeModel {
  loading: boolean;
  account: string;
  url: string;
  onConnect: () => void;
  onDelete: () => void;
}

export function useConnectStripe(): ConnectStripeModel {
  const [url, setUrl] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const timer = useRef<NodeJS.Timer>();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingGetUrlConnectStripe, setLoadingGetUrlConnectStripe] = useState<boolean>(false);
  const [loadingGetBankInfoWithStripe, setLoadingGetBankInfoWithStripe] = useState<boolean>(false);

  const getUrlConnectStripe = useCallback(() => {
    setLoadingGetUrlConnectStripe(true);
    getUrlConnectStripeAccount()
      .then((response) => {
        setUrl(response.url);
      })
      .finally(() => {
        setLoadingGetUrlConnectStripe(false);
      });
  }, []);

  const getBankInfoWithStripe = useCallback(() => {
    setLoadingGetBankInfoWithStripe(true);
    getBankInfo()
      .then((response) => {
        if (response[0]?.last4) {
          setAccount(`XXXX XXXX ${response[0].last4}`);
          setLoadingGetBankInfoWithStripe(false);
        } else {
          getUrlConnectStripe();
        }
      })
      .catch(() => {
        setAccount('');
        setLoadingGetBankInfoWithStripe(false);
        getUrlConnectStripe();
      });
  }, [getUrlConnectStripe]);

  useEffect(() => {
    getBankInfoWithStripe();
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [getBankInfoWithStripe]);

  const onConnect = useCallback(() => {
    let newWindow = window.open(url, '_blank', 'width=1000,height=600');
    if (timer.current) {
      clearInterval(timer.current);
    }
    if (newWindow) {
      setLoading(true);
      timer.current = setInterval(() => {
        if (newWindow?.closed) {
          setLoading(false);
          getBankInfoWithStripe();
          newWindow = undefined;
        }
      }, 1);
    }
  }, [url, getBankInfoWithStripe]);

  const onDelete = useCallback(async () => {
    try {
      setLoading(true);
      await deleteAccountStripeRequest();
      await getUrlConnectStripe();
      toastSuccess(`Delete Account Stripe Successfully.`);
      setAccount('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [getUrlConnectStripe]);

  return {
    loading: loading || loadingGetBankInfoWithStripe || loadingGetUrlConnectStripe,
    url,
    account,
    onConnect,
    onDelete,
  };
}
