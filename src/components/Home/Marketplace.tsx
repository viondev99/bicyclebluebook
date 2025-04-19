import React, { FC } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import cx from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@ui/Buttons/Primary/Button';
import CONFIG from 'config';
import classes from './home.module.scss';

const imgMarketplace = `${CONFIG.IMAGE_CDN_URL}/imgHomeMarketplace.png`;

const ValueGuide: FC = () => {
  return (
    <section className={cx(classes.section, classes.valueGuide)} id={'marketplace'}>
      <Container>
        <Row className="flex-sm-row-reverse">
          <Col sm={5} className={'px-4 mt-4'}>
            <Image className={classes.imgMarketplace} src={imgMarketplace} alt="value-guide" unsized={true} />
          </Col>
          <Col sm={2} />
          <Col sm={5} className={'px-4 mt-4'}>
            <div className={classes.heading}>Marketplace</div>
            <div className={classes.title}>Find the perfect bike for you</div>
            <div className={classes.content}>
              Filter through thousands of used bikes to find exactly what you’re looking for. Combine with the value
              guide to validate the asking price.
            </div>
            <Link href={'/marketplace'}>
              <Button className={classes.button}>Learn More</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default React.memo(ValueGuide);
