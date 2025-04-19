/* eslint-disable react/jsx-key */
import React, { FC, memo, useCallback, useMemo, useState } from 'react';

import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import { useRouter } from 'next/router';
import { GetTradeInByIdResponseStepThreeResponse } from 'model/store/partner/scorecard.model';
import classes from './modal-step-image.module.scss';
import images from '@images';
import { constDescriptionStepImage } from '../../StandardQuote/constraint';
import ShowListImageScroll from '../ShowListImageScroll';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formStepThree: GetTradeInByIdResponseStepThreeResponse;
}

const ModalFirstLoadStepImage: FC<Props> = ({ isOpen, formStepThree, onClose }) => {
  const router = useRouter();
  const { query } = useRouter();
  const [disableButton, setDisabledButton] = useState(false);

  const renderListDescription = useMemo(() => {
    return constDescriptionStepImage.map((it) => {
      return (
        <div className={classes.item} key={it.id}>
          <img src={images.tradeIn.icCheckBlue} alt={'check-icon'} />
          <span>{it.title}</span>
        </div>
      );
    });
  }, []);

  const gotoStepTwo = useCallback(() => {
    setDisabledButton(true);
    router.push({
      pathname: `/trade-in-account/trade-in/${query?.id}`,
      query: {
        step: 2,
      },
    });
    setDisabledButton(false);
  }, [query, router]);

  return (
    <Modal
      isOpen={isOpen}
      hideToggle={true}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalSize}
      contentClassName={classes.paddingContentClassName}
      bodyProps={{
        className: classes.customModalBody,
      }}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      hideButtonClose={true}
      title={`Photo Requirements`}>
      <div className={classes.wrapBody}>
        <div className={classes.title}>Below outlines the scorecard photography requirements for trade ins.</div>
        <div className={classes.wrapDescription}>{renderListDescription}</div>

        <div className={classes.title}>Please use the below images as a guide when creating your ad.</div>
        <div className={classes.wrapImage}>
          <ShowListImageScroll files={formStepThree?.imageTypes || []} />
        </div>
        <div className={classes.wrapBottom}>
          <Button
            disabled={disableButton}
            className={cx(classes.customButtonSize, classes.mr20, classes.isLargeScreen)}
            buttonType={'outline'}
            onClick={gotoStepTwo}>
            Back
          </Button>
          <span className={cx(classes.mr20, classes.isSmallScreen, classes.btnBack)}>Back</span>
          <Button className={classes.customButtonSize} onClick={onClose}>
            Agree & Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalFirstLoadStepImage);
