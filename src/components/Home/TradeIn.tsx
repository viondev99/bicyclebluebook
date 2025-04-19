import React, { FC } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import cx from 'classnames';
import Link from 'next/link';
import Button from '@ui/Buttons/Primary/Button';
import CONFIG from 'config';
import Image from 'next/image';
import classes from './home.module.scss';

const imgTradeIn = `${CONFIG.IMAGE_CDN_URL}/imgHomeTradeIn.png`;

const TradeIn: FC = () => {
  return (
    <section className={cx(classes.section, classes.valueGuide)}>
      <Container>
        <Row>
          <Col sm={5} className={'px-4 mt-4'}>
            <Image className={classes.imgTradeIn} src={imgTradeIn} alt="trade-in" unsized={true} />
          </Col>
          <Col sm={2} />
          <Col sm={5} className={'px-4 mt-4'}>
            <div className={classes.heading}>Trade in</div>
            <div className={classes.title}>Put your old bike to good use</div>
            <div className={classes.content}>
              Our trade in partner program allows you to put your old bike towards a new one—quickly, safely, and hassle
              free.
            </div>
            <Link href={'/trade-in'}>
              <Button className={classes.button}>Learn More</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default React.memo(TradeIn);
