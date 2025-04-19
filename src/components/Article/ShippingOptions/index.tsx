import React from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Collapse from 'reactstrap/lib/Collapse';
import Container from 'reactstrap/lib/Container';
import classes from './shipping.module.scss';
import cx from 'classnames';
import Router from 'next/router';
import images from '@images';

interface IData {
  id: string;
  title: string;
  content: React.ReactElement;
  active: boolean;
}

const data: IData[] = [
  {
    id: 'calculated',
    title: 'Calculated Rate',
    content: (
      <ul>
        <li>
          <p>The seller will go to bicyclebluebook.com and select “Account” in the header menu.</p>
        </li>
        <li>
          <p> Select Sold from the Listings submenu on the navigation bar.</p>
        </li>
        <li>
          <p>
            Select Print Label from the Actions dropdown. This uses the Bicycle Blue Book UPS shipping label. The
            shipping cost will be passed from the buyer to Bicycle Blue Book.
          </p>
        </li>
        <li>
          <p> The seller will be responsible for packing and shipping the item using the printed shipping label.</p>
        </li>
        <li>
          <p> The tracking information will be sent to the buyer automatically.</p>
        </li>
      </ul>
    ),
    active: false,
  },
  {
    id: 'flat',
    title: 'Flat Rate',
    content: (
      <ul>
        <li>
          <p>
            {' '}
            The buyer will be charged the shipping amount that you entered in your listing and this amount will be
            included in the price of your item.
          </p>
        </li>
        <li>
          <p>
            {' '}
            The seller will be responsible for paying for shipping and creating a shipping label using the shipping
            service they choose.
          </p>
        </li>
        <li>
          <p> The seller will be responsible for packing and shipping the item.</p>
        </li>
        <li>
          <p>The seller will be responsible for sending tracking information to the buyer.</p>
        </li>
      </ul>
    ),
    active: false,
  },
  {
    id: 'local',
    title: 'Allow Local Pickup',
    content: (
      <p>
        The seller will contact the buyer and arrange a time, date, and location to give the item to the buyer. The
        seller will be paid via PayPal by the buyer at the time of sale.
      </p>
    ),
    active: false,
  },
];

function TradeInProgram() {
  const [active, setActive] = React.useState('shipping');
  const [accordion, setDataAccordion] = React.useState(data);
  return (
    <div className={classes.cover}>
      <Container className={cx(classes.sectionContainer)}>
        <Row>
          <Col lg={3}>
            <ul className={classes.wrapperListChoose}>
              {[
                { value: 'shipping', label: 'Shipping Options' },
                { value: 'calculated', label: 'Calculated Rate' },
                { value: 'flat', label: 'Flat Rate' },
                { value: 'local', label: 'Local Pickup' },
              ].map((item) => (
                <li>
                  <a
                    href={`#${item.value}`}
                    className={active === item.value ? classes.active : ''}
                    onClick={() => {
                      setActive(item.value);
                      setTimeout(() => {
                        window.scrollTo(0, window.scrollY - 88);
                      }, 0);
                    }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
          <Col lg={9}>
            <div id="shipping">
              <h2>Shipping Options</h2>
              <p>On the listing page, scroll down to the Shipping section and pick from the following options:</p>
              <div className={classes.listSale}>
                <Row>
                  <Col lg={3}>
                    <h4>Domestic Shipping</h4>
                  </Col>
                  <Col lg={9}>
                    <p>
                      You can select a fixed cost, or we can estimate the cost for you based on package weight and
                      dimensions. You can also choose to pay the shipping cost yourself or pass this along to the buyer.
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col lg={3}>
                    <h4>Allow Local Pickup</h4>
                  </Col>
                  <Col lg={9}>
                    <p>Buyers pick up the item from your home or another site of your choosing.</p>
                  </Col>
                </Row>
                <Row>
                  <Col lg={3}>
                    <h4> Both</h4>
                  </Col>
                  <Col lg={9}>
                    <p>Buyers can either pick up the item or have the item shipped to them.</p>
                  </Col>
                </Row>
                <p>If you select the option to ship your item, then you will pick from the following options:</p>
              </div>
            </div>
            <div>
              <Row>
                <Col lg={3}>
                  <h4> Calculated Rate</h4>
                </Col>
                <Col lg={9}>
                  <p>
                    If you select the “Calculated Rate” then the shipping cost will be determined by the buyer's
                    location at the time of purchase. Once the item sells, the buyer will automatically be charged the
                    shipping cost based on their location. This option uses Bicycle Blue Book’s UPS shipping account, so
                    the shipping cost will be passed directly from the buyer to Bicycle Blue Book. The seller will not
                    be required to pay for shipping with this option.
                  </p>
                </Col>
              </Row>
              <Row>
                <Col lg={3}>
                  <h4> Flat Rate</h4>
                </Col>
                <Col lg={9}>
                  <p>
                    If you select “Flat Rate” then you will enter the amount you would like to charge for shipping. Once
                    the item sells, the buyer will be charged the “Flat Rate” cost that you have selected. The seller
                    will receive the “Flat-rate” shipping fee from the buyer. The seller will be responsible for paying
                    the shipping and creating a shipping label.
                  </p>
                </Col>
              </Row>
              <Row>
                <Col lg={3}>
                  <h4> Allow Local Pickup</h4>
                </Col>
                <Col lg={9}>
                  <p>
                    If you select “Allow local pickup” then your item will be available to buyers in your area for pick
                    up only. If you would like to give buyers the option for both shipping and local pickup, then you
                    can select both options.
                  </p>
                </Col>
              </Row>
              <p>
                Once your item sells, depending on which shipping method you choose, you will take the following action.
              </p>
            </div>
            <div className={classes.desktopView}>
              {accordion.map((item) => {
                return (
                  <div id={item.id} className={classes.listSale}>
                    <h3>{item.title}</h3>
                    {item.content}
                  </div>
                );
              })}
            </div>
            <div className={classes.mobiView}>
              {accordion.map((item) => {
                return (
                  <div>
                    <div
                      className={classes.headDrop}
                      onClick={() => {
                        const newData = accordion.map((i) => {
                          if (i.id === item.id) {
                            return { ...i, ...{ active: !item.active } };
                          }
                          return i;
                        });
                        console.log('newDtaa', newData);
                        setDataAccordion(newData);
                      }}>
                      <h3>{item.title}</h3>
                      <div>
                        <img src={images.help.ic_drop} />
                      </div>
                    </div>
                    <Collapse isOpen={item.active}>{item.content}</Collapse>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>

        <div className={classes.divider} />
        <div className={classes.footerAction}>
          <div className={classes.buttonLeft} onClick={() => Router.push('/help')}>
            <img src={images.value_guide.ic_left_row} />
            Back to Help Centre
          </div>
          <div className={classes.buttonRight} onClick={() => window.scrollTo(0, 0)}>
            <img src={images.value_guide.ic_up_row} />
            <div> Back to Top</div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default TradeInProgram;
