/* eslint-disable react/jsx-key */
import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import { useRouter } from 'next/router';
import React, { FC, memo, useCallback, useState } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { constListImageFirstLoadPageModalStepImage } from '../../../StandardQuote/constraint';
import classes from './modal-step-image.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCustomQuoteFirstLoadStepImage: FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { query } = useRouter();
  const [disableButton, setDisabledButton] = useState(false);
  const { currentWidthScreen } = useScreenDetect();

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
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalSize}
      contentClassName={classes.paddingContentClassName}
      bodyProps={{
        className: classes.customModalBody,
      }}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      hideButtonClose={currentWidthScreen <= 767}
      showButtonCloseXBlackLeft={currentWidthScreen <= 767}
      title={`Photo Guide`}>
      <div className={classes.wrapBody}>
        <div className={classes.titleDescription}>Please use the below images as a guide when creating your ad.</div>
        <div className={classes.wrapImage}>
          <Row>
            {constListImageFirstLoadPageModalStepImage.map((item, index: number) => (
              <Col md={4} sm={6} className={classes.customColImage}>
                <div key={item.id || String(index)}>
                  <div className={classes.imageWrapper}>
                    <img src={item?.defaultImage} alt={'Product'} className={'img-fluid'} />
                  </div>
                  <div className={classes.descriptionImage}>{item?.name || ''}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalCustomQuoteFirstLoadStepImage);
