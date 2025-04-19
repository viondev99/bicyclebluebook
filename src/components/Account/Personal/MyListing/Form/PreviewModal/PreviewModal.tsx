import React, { FC } from 'react';
import Modal from '@ui/Modal/Modal';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import Container from 'reactstrap/lib/Container';
import Button from '@ui/Buttons/Primary/Button';
import cx from 'classnames';
import iconBack from 'assets/img/register/ic_back.svg';
import TitleSection from './TitleSection/TitleSection';
import ProductBuyZone from './ProductBuyZone/ProductBuyZone';
import ProductInfoZone from './ProductInfoZone/ProductInfoZone';
import classes from './preview-modal.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: FormValue;
  isAccessories?: boolean;
}

const PreviewModal: FC<Props> = ({ isOpen, onClose, formData, isAccessories }) => {
  const renderHeader = () => {
    return (
      <Container className={'d-flex'}>
        <Button buttonType="clear" onClick={onClose} className={classes.back}>
          <img className={'mr-2'} src={iconBack} alt="Back icon" />
          Back to edit
        </Button>
        <Button className={cx('ml-auto', classes.publish)} onClick={onClose} type="submit" buttonType={'clear'}>
          Publish
        </Button>
      </Container>
    );
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={classes.modal}
      contentClassName={classes.content}
      header={<>{renderHeader()}</>}
      showClose={false}>
      <Container>
        <TitleSection formData={formData} />
        <ProductBuyZone formData={formData} isAccessories={isAccessories} />
        <ProductInfoZone formData={formData} isAccessories={isAccessories} />
      </Container>
    </Modal>
  );
};

export default PreviewModal;
