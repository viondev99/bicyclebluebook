/* eslint-disable react/jsx-key */
import Modal from '@ui/Modal/Modal';
import { formatDateNoTime } from 'helpers/date.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import { cloneDeep } from 'lodash';
import { UserBasicInfoModel } from 'model/store/info.model';
import React, { FC, useMemo } from 'react';
import { GetOffersDetailResponse } from 'store/marketplace/marketplace.action';
import classes from './product-summary.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dataOffersDetail: GetOffersDetailResponse;
  userInfoBasic: UserBasicInfoModel[];
}

const PopupOffersDetail: FC<Props> = ({
  isOpen,
  onClose,
  dataOffersDetail: dataOffersDetailHasInfo,
  userInfoBasic,
}) => {
  const { currentWidthScreen } = useScreenDetect();
  const dataOffersDetail = useMemo(() => {
    let cloneDataOffersDetailHasInfo = cloneDeep(dataOffersDetailHasInfo);
    cloneDataOffersDetailHasInfo = {
      ...cloneDataOffersDetailHasInfo,
      data: cloneDataOffersDetailHasInfo?.data?.map((it) => {
        return {
          ...it,
          buyerName: userInfoBasic?.find((item) => item.id === it.buyerId)?.displayName || '',
        };
      }),
    };
    return cloneDataOffersDetailHasInfo;
  }, [dataOffersDetailHasInfo, userInfoBasic]);
  const renderTitle = useMemo(() => {
    return (
      <div className={classes.title}>
        Offers <span className={classes.totalOffers}>({dataOffersDetail?.total})</span>
      </div>
    );
  }, [dataOffersDetail]);
  const renderBody = useMemo(() => {
    return (
      <div>
        <table className={classes.tableClassName}>
          <thead className={classes.wrapBody}>
            <td>Date</td>
            {currentWidthScreen > 767 && <td>Buyer</td>}
            {currentWidthScreen > 767 && <td>ID</td>}
            {currentWidthScreen > 767 && <td>Frame</td>}
            <td>Amount</td>
            {currentWidthScreen > 767 && <td>Qty</td>}
            <td>Status</td>
          </thead>
          <tbody>
            {dataOffersDetail?.data?.map((it) => (
              <tr className={classes.wrapItem}>
                <td className={classes.itemOffers}>{formatDateNoTime(it.createdTime)}</td>
                {currentWidthScreen > 767 && <td className={classes.itemOffers}>{it.buyerName}</td>}
                {currentWidthScreen > 767 && <td className={classes.itemOffers}>{it.id}</td>}
                {currentWidthScreen > 767 && <td className={classes.itemOffers}>{it.frameSize}</td>}
                <td className={classes.itemOffers}>${it.offerPrice}</td>
                {currentWidthScreen > 767 && <td className={classes.itemOffers}>{it.quantity}</td>}
                <td className={classes.itemOffers}>{it.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [currentWidthScreen, dataOffersDetail]);

  return (
    <div className={classes.wrapModel}>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        className={classes.modal}
        contentClassName={classes.content}
        bodyClassName={classes.body}
        hideButtonClose={currentWidthScreen <= 767}
        showButtonCloseXBlackLeft={currentWidthScreen <= 767}
        title={renderTitle}>
        {renderBody}
      </Modal>
    </div>
  );
};

export default PopupOffersDetail;
