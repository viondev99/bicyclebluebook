import React, { FC, memo, useState, useCallback } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import cx from 'classnames';

import { Condition } from 'model/common';
import classes from './frame-size.module.scss';
import Modal from '../Modal/Modal';
import Tabs from '../Tabs/Tabs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const frameSizes = [
  {
    frameName: 'Road Bike',
    sizes: [
      'XXS (47–48cm) 4’10”-5’2”',
      'XS (49-50cm) 5’2”-5’6”)',
      'Small (52–53cm) 5’3”-5’6”',
      'Medium (54–55cm) 5’6”-5’9”',
      'M/L 5’11”-6’0”',
      'Large (56–58cm) 5’9”-6’0”',
      'XL (58–60cm) 6’0”-6’3”',
      'XXL (61cm +) 6’3”-6’6”',
    ],
  },
  {
    frameName: 'Mountain Bike',
    sizes: [
      'XS (13–14”) 4’10”-5’2”',
      'Small (15–16”) 5’2”-5’6”',
      'Medium (17–18”) 5’6”-5’10”',
      'Medium/Large 6’0”-6’1”',
      'Large (19–20”) 5’10”-6’1”',
      'XL (21–22”) 6’1”-6’4”',
      'XXL (23–24”) 6’4” +',
    ],
  },
];

const FrameSizeModal: FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const [currentTab, setCurrentTab] = useState(frameSizes[0].frameName);

  const onChangeTab = useCallback((value: Condition) => {
    setCurrentTab(value);
  }, []);

  return (
    <Modal
      className={classes.frameSizeModal}
      centered={true}
      isOpen={isOpen}
      onClose={onClose}
      title={'Bicycle Frame Sizes'}>
      <Tabs
        className={cx('d-flex', 'd-xl-none', 'd-lg-none', 'd-md-none')}
        tabs={frameSizes.map((item) => ({ label: item.frameName, value: item.frameName }))}
        value={currentTab}
        onChange={onChangeTab}
      />
      <Row
        className={cx(classes.frameSizeCol, 'd-flex', 'd-xl-none', 'd-lg-none', 'd-md-none')}
        style={{ marginTop: 20 }}>
        <Col xs={12}>
          <ul style={{ padding: '0px 20px' }}>
            {frameSizes
              .find((item) => item.frameName === currentTab)
              .sizes.map((size: string) => (
                <li key={size} className={classes.description}>
                  {size}
                </li>
              ))}
          </ul>
        </Col>
      </Row>
      <Row
        className={cx(classes.frameSizeCol, 'd-none', 'd-xl-flex', 'd-lg-flex', 'd-md-flex')}
        style={{ marginTop: 30 }}>
        {frameSizes.map((item) => (
          <Col key={item.frameName} lg={6} md={6}>
            <div className={classes.title}>{item.frameName}</div>
            <ul style={{ padding: '0px 20px' }}>
              {item.sizes.map((size: string) => (
                <li key={size} className={classes.description}>
                  {size}
                </li>
              ))}
            </ul>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default memo(FrameSizeModal);
