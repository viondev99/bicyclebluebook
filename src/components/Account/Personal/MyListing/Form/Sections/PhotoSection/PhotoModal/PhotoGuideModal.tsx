import React, { FC } from 'react';
import MobileFullScreenModal from '@ui/Modal/MobileFullScreenModal';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import useTradeInImageType from 'hooks/useTradeInImageType';
import SafeImage from 'components/Image/SafeImage';
import classes from './photo-guide.module.scss';

interface Props {
  onClose: Function;
  isOpen: boolean;
}

const PhotoGuideModal: FC<Props> = ({ onClose, isOpen }) => {
  const { data, isLoading } = useTradeInImageType();

  return (
    <MobileFullScreenModal title={'Photo Guide'} onClose={onClose} isOpen={isOpen}>
      <p className={classes.description}>Please use the below images as a guide when creating your ad.</p>
      <Row>
        {data.map((item) => (
          <Col md={4} xs={12} key={item.id} className={classes.wrapper}>
            <SafeImage src={item.defaultImage} className={'img-fluid'} />
            <span className={classes.name}>{item.name}</span>
          </Col>
        ))}
      </Row>
    </MobileFullScreenModal>
  );
};

export default PhotoGuideModal;
