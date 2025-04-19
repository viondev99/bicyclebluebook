import React, { FC, useCallback, useEffect, useState } from 'react';
import Modal from '@ui/Modal';
import MobileModalHeader from '@ui/Modal/MobileModalHeaderCommon';
import StoreState from 'model/store/index';
import uniq from 'lodash/uniq';
import Link from 'next/link';
import { formatDateNoTime } from 'helpers/date.helper';
import { useDispatch, useSelector } from 'react-redux';
import { OfferBikeModal } from 'model/api/account/personal/offers.model';
import { formatCurrency, formatStatus } from 'helpers/string.helper';
import { getListOfferBike } from 'store/account/personal/offers/offers.action';
import cx from 'classnames';
import { getUsersBasicInfo } from 'api/info.api';
import { toastError } from 'helpers/utils.helper';
import iconClose from 'assets/img/modal/ic_close.svg';
import classes from './modal-offers-listing.module.scss';

const TableFields = [
  {
    name: 'Date',
    width: 'auto',
  },
  {
    name: 'Buyer',
    width: 'auto',
    hideWhenMobile: true,
  },
  {
    name: 'ID',
    width: 'auto',
    hideWhenMobile: true,
  },
  {
    name: 'Frame',
    width: 'auto',
    hideWhenMobile: true,
  },
  {
    name: 'Amount',
    width: 'auto',
  },
  {
    name: 'Qty',
    width: 'auto',
    hideWhenMobile: true,
  },
  {
    name: 'Status',
    width: '10%',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  offerCount?: number;
  masterListingId?: number;
}
const ModalOffersListing: FC<Props> = ({ isOpen, onClose, offerCount, masterListingId }) => {
  const [listPersonals, setListPersonals] = useState([]);
  const listBikeOffers = useSelector((store: StoreState) => store.account.personal.offers.listBikeOffers);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getListOfferBike({
        id: masterListingId,
        sortFile: 'LAST_UPDATE',
        sortType: 'DESC',
      }),
    );
  }, [dispatch, masterListingId]);
  useEffect(() => {
    if (listBikeOffers?.length > 0) {
      const listUserIds: string[] = [];
      const list = listBikeOffers?.forEach((item) => {
        listUserIds.push(item?.buyerId);
      });
      if (listUserIds?.length > 0) {
        const request = getUsersBasicInfo(uniq(listUserIds));
        request
          .then((res) => {
            setListPersonals(res);
          })
          .catch(toastError);
      }
    }
  }, [listBikeOffers]);
  const findBuyerInfo = useCallback(
    (bikeOffer: OfferBikeModal): string => {
      const result = listPersonals.find((user) => user?._id === bikeOffer?.buyerId);
      return result?.display_name;
    },
    [listPersonals],
  );
  const renderHeader = () => {
    return (
      <>
        <div className={cx('d-flex flex-column flex-md-row', classes.wrapHeader)}>
          <h2 className={classes.title}>
            Offers <span className={classes.offerNumber}>({offerCount})</span>
          </h2>
          <button
            className={cx(classes.btnClose, 'close_btn', 'ml-auto', 'd-none d-md-block')}
            onClick={onClose}
            type="button">
            <img className={'close_icon'} src={iconClose} alt="Close icon" />
          </button>
        </div>
        <div className="d-block d-md-none">
          <MobileModalHeader onClose={() => onClose()} className={classes.modalCloseBtn} />
        </div>
      </>
    );
  };
  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      className={classes.modal}
      contentClassName={classes.content}
      bodyClassName={classes.body}
      showClose={false}
      header={<>{renderHeader()}</>}>
      <table className={classes.tableOffer}>
        <thead>
          <tr>
            {TableFields.map((field) => (
              <th
                key={field.name}
                style={{ width: field.width }}
                className={cx({
                  [classes.hideWhenMobile]: field.hideWhenMobile,
                })}>
                {field.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {listBikeOffers?.map((offer) => (
            <tr key={offer.id}>
              <td>{formatDateNoTime(offer.createdTime)}</td>
              <td className={classes.hideWhenMobile}>
                <Link href={`/marketplace/seller/${offer?.buyerId}`}>
                  <a className={classes.customLink}>{findBuyerInfo(offer)}</a>
                </Link>
              </td>
              <td className={classes.hideWhenMobile}>{offer.id}</td>
              <td className={classes.hideWhenMobile}>{offer.frameSize}</td>
              <td>{formatCurrency(offer.offerPrice)}</td>
              <td className={classes.hideWhenMobile}>{offer.quantity}</td>
              <td>{formatStatus(offer.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
};

export default ModalOffersListing;
