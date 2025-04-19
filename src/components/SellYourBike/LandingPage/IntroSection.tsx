import React, { useCallback, useState } from 'react';
import images from 'assets/images';
import Modal from '@ui/Modal/Modal';
import { Roles } from 'constants/roles';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import StoreState from 'model/store/index';
import Button from '@ui/Buttons/Primary/Button';
import classes from './landing-page.module.scss';

const IntroSection = () => {
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const role = useSelector((state: StoreState) => state.authenticate.user?.role);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const [modalNotifyVisible, openModalNotify] = useState<boolean>(false);
  const router = useRouter();
  const checkRoleRedirect = useCallback(() => {
    const isStoreFront = !!userInfo?.storefront;
    if (!isLoggedIn) {
      return router.push('/login');
    }
    if (role === Roles.PERSONAL) {
      return router.push('/account/mylistings/create/');
    }
    if (isStoreFront) {
      return router.push('/store-front/mylistings/create');
    }
    openModalNotify(true);
  }, [isLoggedIn, role, router, userInfo]);
  return (
    <section>
      <Row>
        <Col xs={12} md={4} className={classes.customCard}>
          <img src={images.sell.icSelling} alt="icon icSelling" className={classes.cardIcon} />
          <div>
            <div className={classes.titleCard}>Marketplace</div>
            <div className={classes.contentCard}>
              Reach thousands of online shoppers by listing your bike for sale on our vast marketplace.
            </div>
            <Button buttonType="primary" onClick={checkRoleRedirect}>
              Create a Listing
            </Button>
          </div>
        </Col>
        <Col xs={12} md={4} className={classes.customCard} id={'marketplace-payout-trade-in'}>
          <img src={images.sell.iconInstantPayout} alt="icon instant" className={classes.cardIcon} />
          <div>
            <div className={classes.titleCard}>Instant Payout</div>
            <div className={classes.contentCard}>
              Want a quick sale? Get a quick and easy quote for your old bike and receive an instant payment.
            </div>
            <Button buttonType="primary" className={classes.customBtn}>
              <Link href={'/instant-payout/request'}>
                <a>Get a Free Quote</a>
              </Link>
            </Button>
          </div>
        </Col>
        <Col xs={12} md={4} className={classes.customCard}>
          <img src={images.icTradeIn} alt="icon tradein" className={classes.cardIcon} />
          <div>
            <div className={classes.titleCard}>Trade in</div>
            <div className={classes.contentCard}>
              Put your old bike to good use by trading it in for a new one at our Authorized Trade in Partners.
            </div>
            <Button buttonType="primary" className={classes.customBtn}>
              <Link href={'/trade-in/request'}>
                <a>Request a Trade in</a>
              </Link>
            </Button>
          </div>
        </Col>
      </Row>
      <Modal isOpen={modalNotifyVisible} className={classes.modalNotify} onClose={() => openModalNotify(false)}>
        <div className={classes.contentModal}>
          <div>Please create Online Store to sell your bike</div>
          <Button
            buttonType="outline"
            onClick={() => router.push('/trade-in-account/my-account/profile?create-online-store/')}
            className={classes.btnOk}>
            OK
          </Button>
        </div>
      </Modal>
    </section>
  );
};

export default IntroSection;
