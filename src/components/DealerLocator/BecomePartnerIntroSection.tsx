import React, { FC, useMemo } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import Link from 'next/link';
import useScreenDetect from 'hooks/useScreenDetect';
import imgBecomePartner from 'assets/img/common/img_become_partner.png';
import Button from '@ui/Buttons/Primary/Button';
import SafeImage from 'components/Image/SafeImage';
import classes from './dealer-locator.module.scss';

interface Props {}
const BecomePartnerSection: FC<Props> = () => {
  const screen = useScreenDetect();
  const renderContentIntro = useMemo(() => {
    return (
      <>
        <div id={'become-a-trade-in-partner'} className={classes.linkJoin}>
          JOIN THE CREW
        </div>
        <h1 className={classes.titleBecomePartner}>Become an authorized trade in partner</h1>
        <p className={classes.contentIntro}>
          Are you a bike shop interested in becoming an Authorized Trade-in Partner? Help your customers unlock the
          value of their current bike toward in your store
        </p>
        <Button buttonType="primary" className={classes.customLink}>
          <Link href="/become-a-partner">
            <a>Get Started</a>
          </Link>
        </Button>
      </>
    );
  }, []);
  const renderImgPartner = useMemo(() => {
    return <SafeImage src={imgBecomePartner} className={classes.imgPartner} />;
  }, []);
  return (
    <section className={classes.becomePartnerWrap}>
      <Container>
        {!screen.isMediumScreen() ? (
          <Row>
            <Col xs={12} lg={6}>
              {renderContentIntro}
            </Col>
            <Col xs={12} lg={6}>
              {renderImgPartner}
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xs={12} lg={6} className={classes.imgPartnerMobile}>
              {renderImgPartner}
            </Col>
            <Col xs={12} lg={6}>
              {renderContentIntro}
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
};

export default BecomePartnerSection;
