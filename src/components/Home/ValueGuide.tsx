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

const imgValueGuide = `${CONFIG.IMAGE_CDN_URL}/imgHomeValueGuide.png`;

const Marketplace: FC = () => {
  return (
    <section className={cx(classes.section, classes.valueGuide)} id={'value-guide'}>
      <Container>
        <Row>
          <Col sm={5} className={'px-4 mt-4'}>
            <Image className={classes.valueGuideImage} src={imgValueGuide} alt="value-guide" unsized={true} />
          </Col>
          <Col sm={2} />
          <Col sm={5} className={'px-4 mt-4'}>
            <div className={classes.heading}>Value guide</div>
            <div className={classes.title}>Accurately value your bike</div>
            <div className={classes.content}>
              We are the cycling industry’s definitive valuation authority. Get an instant valuation before choosing to
              buy, sell, or trade.
            </div>
            <Link href={'/value-guide'}>
              <Button className={classes.button}>Learn More</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default React.memo(Marketplace);
