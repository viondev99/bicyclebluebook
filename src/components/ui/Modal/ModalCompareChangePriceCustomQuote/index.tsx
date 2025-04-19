/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import { formatCurrencyFixed } from 'helpers/string.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import React, { FC, memo } from 'react';
import { Row, Col } from 'reactstrap';
import classes from './modal-compare-change-price-custom-quote.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tradeInIdSelected: string) => void;
  dataModalReactive: {
    title: string;
    currentPrice: number;
    newPrice: number;
    tradeInIdSelected: string;
  };
}

const ModalCompareChangePriceCustomQuote: FC<Props> = ({ isOpen, onClose, onSubmit, dataModalReactive }) => {
  const { currentWidthScreen } = useScreenDetect();

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
      hideButtonClose={true}
      showButtonCloseXBlackLeft={currentWidthScreen <= 767}
      title={`Value Change`}>
      <div className={classes.wrapForm}>
        <div className={classes.wrapFormItem}>
          <div className={classes.titleForm}>
            The value of this bike has changed. Do you want to reactivate with the new value?
          </div>
          <Row className={classes.previous}>
            <Col xs={5} md={3}>
              Previous value
            </Col>
            <Col xs={7} md={9} className={classes.previousValue}>
              {formatCurrencyFixed(dataModalReactive?.currentPrice, true)}
            </Col>
          </Row>
          <Row className={classes.previous}>
            <Col xs={5} md={3}>
              New Value
            </Col>
            <Col xs={7} md={9} className={classes.newValue}>
              {formatCurrencyFixed(dataModalReactive?.newPrice, true)}
            </Col>
          </Row>
        </div>
        <div className={classes.wrapBottom}>
          <div>
            <Button
              buttonType="primary"
              onClick={() => onSubmit(dataModalReactive.tradeInIdSelected)}
              className={classes.customButtonSize}>
              Reactivate
            </Button>
          </div>
          <div>
            <Button buttonType="outline" className={classes.customButtonSize} onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalCompareChangePriceCustomQuote);
