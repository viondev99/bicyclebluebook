/* eslint-disable react/self-closing-comp */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import images from 'assets/images';
import Collapse from 'reactstrap/lib/Collapse';
import StoreState from 'model/store';
import { useRouter } from 'next/router';
import useScreenDetect from 'hooks/useScreenDetect';
import HeaderSkeleton from './HeaderSkeleton';
import classes from './header.module.scss';

interface InfoDisplayModel {
  logo: string;
  cover: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
  description: string;
}

const HomePageHeader = () => {
  const { currentWidthScreen } = useScreenDetect();
  const onlineStoreInfo = useSelector((state: StoreState) => state.sellerInfo.onlineStoreInfo);
  const sellerInfo = useSelector((state: StoreState) => state.sellerInfo.sellerInfo);
  const loading = useSelector((state: StoreState) => state.sellerInfo.loading);
  const router = useRouter();
  const [visibleDescription, setVisibleDescription] = useState(true);

  const isSellerPersonal = useMemo(() => {
    return router.pathname.includes('seller');
  }, [router]);
  const isOnlineStore = useMemo(() => {
    if (router?.pathname?.includes('online-store')) {
      return true;
    }
    return false;
  }, [router]);

  const infoDisplay = useMemo((): InfoDisplayModel => {
    return {
      logo: isOnlineStore ? onlineStoreInfo?.logo : sellerInfo?.account?.avatar,
      cover: isOnlineStore ? onlineStoreInfo?.gallery : images.marketplace.headerBg,
      name: isOnlineStore ? onlineStoreInfo?.name : sellerInfo?.display_name,
      address: isOnlineStore ? onlineStoreInfo?.binding_address?.address : sellerInfo?.account?.address,
      city: isOnlineStore ? onlineStoreInfo?.binding_address?.city : sellerInfo?.account?.city,
      state: isOnlineStore ? onlineStoreInfo?.binding_address?.state : sellerInfo?.account?.state,
      zipCode: isOnlineStore ? onlineStoreInfo?.binding_address?.zip_code : sellerInfo?.account?.zip_code,
      email: isOnlineStore ? onlineStoreInfo?.email : sellerInfo?.account?.email,
      phone: isOnlineStore ? onlineStoreInfo?.phone : sellerInfo?.account?.phone,
      description: isOnlineStore ? onlineStoreInfo?.description : sellerInfo?.description,
    };
  }, [isOnlineStore, onlineStoreInfo, sellerInfo]);

  useEffect(() => {
    if (currentWidthScreen >= 576 && !visibleDescription) {
      setVisibleDescription(true);
      return;
    }
    if (currentWidthScreen < 576 && visibleDescription) {
      setVisibleDescription(false);
      return;
    }
  }, [currentWidthScreen]);

  return loading ? (
    <HeaderSkeleton />
  ) : (
    <div className={classes.wrapHeader}>
      <div className={classes.wrapAvatar}>
        {infoDisplay?.logo ? (
          <img src={infoDisplay?.logo} className={classes.avatar} alt="avatar" />
        ) : (
          <img src={images.marketplace.iconStoreGray} alt="avatar" />
        )}
      </div>

      <div className={classes.wrapInfomation}>
        <div className={classes.wrapTitle}>
          <div className={classes.title}>{infoDisplay?.name || 'N/A'}</div>
          <div className={classes.isVerify}>Verified</div>
        </div>

        <div className={classes.wrapAddress}>
          <div className={classes.address}>
            <img src={images.account.partner.icLocationBlue} alt="" className={classes._icLocationBlue} />
            {!isSellerPersonal ? (
              <span className={classes.headerText}>{`${infoDisplay?.address || 'N/A'}, ${infoDisplay?.city || 'N/A'}, ${
                infoDisplay?.state || 'N/A'
              }, ${infoDisplay?.zipCode || 'N/A'}`}</span>
            ) : (
              <span className={classes.headerText}>{`${infoDisplay?.city || 'N/A'}, ${infoDisplay?.state || 'N/A'}, ${
                infoDisplay?.zipCode || 'N/A'
              }`}</span>
            )}
          </div>

          <div className={classes.wrapEmailPhone}>
            <div className={classes.wrapEmail}>
              <a href={`mailto:${infoDisplay?.email}`} className={classes.customEmail}>
                <img src={images.icEmailBlue} alt="" className={classes._icEmailBlue} />
                <span className={classes.headerText}>{infoDisplay?.email || 'N/A'}</span>
              </a>
            </div>
            <div className={classes.wrapPhone}>
              <img src={images.icPhoneBlue} alt="" className={classes._icPhoneBlue} />
              <span className={classes.headerText}>{infoDisplay?.phone || 'N/A'}</span>
            </div>
          </div>
        </div>

        {currentWidthScreen < 576 && (
          <div className={classes.wrapMoreInfo} onClick={() => setVisibleDescription(!visibleDescription)}>
            <span>More info</span>
            <img src={images.icArrowDownBlue} alt="" className={visibleDescription && classes.isRotate180} />
          </div>
        )}

        <div className={classes.wrapDescription}>
          <Collapse isOpen={visibleDescription}>{infoDisplay?.description || ''}</Collapse>
        </div>
      </div>
    </div>
  );
};

export default HomePageHeader;
