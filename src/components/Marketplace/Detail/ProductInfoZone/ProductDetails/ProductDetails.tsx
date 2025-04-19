import React, { FC, useState, useMemo, useCallback } from 'react';
import upperFirst from 'lodash/upperFirst';
import { useSelector } from 'react-redux';
import { toastError } from 'helpers/utils.helper';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import { getStatusProduct, HTMLTagOnString, normalizeServerConstant } from 'helpers/string.helper';
import StoreState from 'model/store';
import { Component } from 'model/common';
import ConditionModal from '@ui/Condition/ConditionModal';
import FrameSizeModal from '@ui/FrameSize/FrameSizeModal';
import { bicycleOutletId } from 'helpers/utilities.helper';
import t from 'helpers/language';
import { useLogin } from 'hooks/useLogin';
import iconError from 'assets/img/common/ic_error.svg';
import iconInfo from 'assets/img/marketplace/ic_info.svg';

import classes from './product-details.module.scss';
import ModalReportListing from './ModalReportListing/ModalReportListing';
import { safelySetHtml } from '../../../../../helpers/html.helper';

interface DetailRow {
  label: string;
  value: string;
  note?: boolean;
}

const ProductDetails: FC = () => {
  const detail = useSelector((state: StoreState) => state.marketplace.detail);
  const listingType: string = detail?.listingType || '';
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const goLogin = useLogin();
  const [openModal, setOpenModal] = useState('');
  const [modalReportVisible, setModalReportVisible] = useState(false);
  const isShowBannerSoldAsIs = detail?.wholesale || detail?.storefrontId === bicycleOutletId || false;

  const renderDescriptions = useMemo(() => {
    const checkString = HTMLTagOnString;
    const checkStringInDescriptions = RegExp(checkString).test(detail?.inventoryDescription);
    if (checkStringInDescriptions || detail?.sellerIsBBB) {
      return (
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: safelySetHtml(detail?.inventoryDescription),
          }}
        />
      );
    }
    return <pre className={classes.customDescription}>{detail?.inventoryDescription}</pre>;
  }, [detail]);

  const details = useMemo(() => {
    const components = detail?.components || [];
    const initialValue =
      listingType === 'PART_ACCESSORIES'
        ? []
        : [
            { label: 'Brand', value: detail?.bicycleBrandName },
            { label: 'Model', value: detail?.bicycleModelName },
            { label: 'Year', value: detail?.bicycleYearName },
            { label: 'Status', value: getStatusProduct(detail) },
            { label: 'Frame Size', value: detail?.bicycleSizeName || 'N/A', note: true },
            { label: 'Suspension', value: detail?.suspensionName },
            {
              label: 'Frame Material',
              value: detail?.frameMaterialName === 'No Modifier' ? 'N/A' : detail?.frameMaterialName,
            },
            { label: 'Brake Type', value: detail?.brakeName },
            { label: 'Wheel Size', value: detail?.wheelSizeName },
            { label: 'Inventory ID', value: detail?.inventoryName },
            { label: 'Serial Number', value: detail?.serialNumber },
            { label: 'Gender', value: detail?.genderName },
            { label: 'Location', value: detail?.location },
            { label: 'Type', value: detail?.bicycleTypeName },
            { label: 'Colors', value: detail?.colorName },
            {
              label: 'Condition',
              value: upperFirst(normalizeServerConstant(detail?.condition).toLowerCase()),
              note: true,
              isHideField: isShowBannerSoldAsIs,
            },
          ];
    return initialValue
      .concat(components.map((item: Component) => ({ label: item.name, value: item.value })))
      .filter((item) => !!item.value && !item.isHideField);
  }, [detail, isShowBannerSoldAsIs, listingType]);

  const dataBicycle = useMemo(() => {
    if (detail?.storefrontId === bicycleOutletId) {
      return details?.filter(
        (item) =>
          item?.label !== 'Brakes' &&
          item?.label !== 'Cassette' &&
          item?.label !== 'Saddle' &&
          item?.label !== 'Handlebar' &&
          item?.label !== 'Stem' &&
          item?.label !== 'Front Derailleur' &&
          item?.label !== 'Rear Derailleur' &&
          item?.label !== 'Crankset' &&
          item?.label !== 'Shifters' &&
          item?.label !== 'Fork' &&
          item?.label !== 'Drivetrain Type' &&
          item?.label !== 'Frame' &&
          !!item?.value,
      );
    }
    return details;
  }, [detail, details]);

  const onOpenModal = useCallback((modal: string) => {
    setOpenModal(modal);
  }, []);

  const onCloseModal = useCallback(() => {
    setOpenModal('');
  }, []);
  const renderModalInfo = useCallback(
    (modal: string) => {
      switch (modal) {
        case 'Frame Size':
          return <FrameSizeModal isOpen={openModal === 'Frame Size'} onClose={onCloseModal} />;

        case 'Condition':
          return (
            <ConditionModal
              condition={detail?.condition}
              isOpen={openModal === 'Condition'}
              onClose={onCloseModal}
              showLikeNewCondition
            />
          );

        default:
          return null;
      }
    },
    [openModal, onCloseModal, detail],
  );
  const handleOpenModalReport = useCallback(() => {
    if (!isLoggedIn) {
      toastError(t('authenticate.requireLogin'), t('seoTitle.loginRequired'));
      goLogin();
      return;
    }
    setModalReportVisible(true);
  }, [goLogin, isLoggedIn]);
  const renderReportListing = useMemo(() => {
    const notSellerOrNotLogin = !isLoggedIn || detail?.sellerId !== userInfo?._id;
    if (detail?.typeInventoryName === 'PTP' && notSellerOrNotLogin) {
      return (
        <Button buttonType="outline" className={classes.btnReport} onClick={handleOpenModalReport}>
          <img src={iconError} alt="icon error" width={28} height={29} />
          Report Listing
        </Button>
      );
    }
    return null;
  }, [detail, handleOpenModalReport, isLoggedIn, userInfo]);

  return (
    <>
      <section className={'my-5'}>
        <section className={cx(classes.noteToCustomer, classes.fixpaddingNotetoCustomer)}>
          {/* <p className={classes.label}>Description:</p> */}
          {renderDescriptions}
          {detail.sellerIsBBB && (
            <p>
              Sales price of bike is based on the condition described and accounts for any repairs or replacement parts
              needed to be sourced by the buyer.
            </p>
          )}
        </section>

        {dataBicycle.map((item: DetailRow, index: number) => (
          <div
            key={String(index)}
            className={cx(classes.detail, {
              [classes.transparent]: index % 2 === 0,
              [classes.white]: index % 2 !== 0,
            })}>
            <div className={classes.label}>{item.label}</div>
            {item.note ? (
              <Button buttonType="transparent" className={classes.buttonInfo} onClick={() => onOpenModal(item.label)}>
                {item.value}
                <img className={classes.iconInfo} src={iconInfo} alt="icon-info" />
                {renderModalInfo(item.label)}
              </Button>
            ) : (
              <div className={classes.value}>{item.value}</div>
            )}
          </div>
        ))}

        {!!detail?.noteToCustomer && (
          <section className={classes.noteToCustomer}>
            {/* <p className={classes.label}>Additional Information:</p> */}
            {detail?.sellerIsBBB && (
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: safelySetHtml(detail?.noteToCustomer),
                }}
              />
            )}
          </section>
        )}
      </section>

      {renderReportListing}
      <ModalReportListing open={modalReportVisible} onClose={() => setModalReportVisible(false)} />
    </>
  );
};

export default ProductDetails;
