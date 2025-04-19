/* eslint-disable react/jsx-key */
import React, { FC, memo, useEffect } from 'react';
import cx from 'classnames';
import Modal from '@ui/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './modal-contact-rep.module.scss';
import images from '@images';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isTour?: boolean;
}

const ModalContactRep: FC<Props> = (props) => {
  const { isOpen, onClose, isTour } = props;
  const { currentWidthScreen } = useScreenDetect();
  const dispatch = useDispatch();
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const partner = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);

  useEffect(() => {
    if (userInfo) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
    }
  }, [dispatch, userInfo]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={cx(classes.customModalSize, {
        [classes.tour]: isTour,
      })}
      contentClassName={classes.paddingContentClassName}
      bodyProps={{
        className: classes.customModalBody,
      }}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      hideButtonClose={currentWidthScreen <= 767}
      showButtonCloseXBlackLeft={currentWidthScreen <= 767}
      title={`Contact Your Rep`}>
      <div className={classes.wrapBody}>
        <div className={classes.title}>{partner?.admin_manager?.name || ''}</div>
        <div className={classes.wrapItem}>
          <div className={classes.wrapImage}>
            <img className={classes.icEmailBlack} src={images.icEmailBlack} alt="Email logo" />
          </div>
          <a href={`mailto:${partner?.admin_manager?.email}`}>{partner?.admin_manager?.email || ''}</a>
        </div>
        {partner?.admin_manager?.phones?.length
          ? partner.admin_manager.phones.map((phone: string, index: number) => (
              <div className={classes.wrapItem} key={phone}>
                <div className={classes.wrapImage}>
                  <img className={classes.icPhoneBlack} src={images.icPhoneBlack} alt="Phone logo" />
                </div>
                <a href={`tel:${phone}`}>{phone}</a>
              </div>
            ))
          : null}
      </div>
    </Modal>
  );
};

export default memo(ModalContactRep);
