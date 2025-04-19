import React, { useState, useCallback } from 'react';
import images from 'assets/images';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import Tabs from '@ui/Tabs/Tabs';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import classes from './infoSection.module.scss';
import OverViewSection from './OverviewSection/OverViewSection';
import SpecificationSection from './SpecificationSection/SpecificationSection';
import ReviewSection from './ReviewSection/ReviewSection';

const detailTabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Specifications', value: 'specifications' },
  { label: 'Reviews', value: 'reviews' },
];

const InfoSection = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>(detailTabs[0].value);

  const onChangeTab = useCallback((value: string) => {
    setCurrentTab(value);
  }, []);

  const renderContentSection = useCallback(() => {
    switch (currentTab) {
      case detailTabs[0].value:
        return <OverViewSection />;

      case detailTabs[1].value:
        return <SpecificationSection />;

      case detailTabs[2].value:
        return <ReviewSection />;

      default:
        return null;
    }
  }, [currentTab]);

  return (
    <Row className={'my-4'}>
      <Col xs={12}>
        <div className="text-center">
          <Button buttonType="transparent" onClick={() => setCollapsed(!collapsed)} className={classes.toggleButton}>
            <span>Overview and Specifications</span>
            <img
              src={images.common.icDropDown}
              alt={'dropdown'}
              className={cx({ [classes.rotate]: !collapsed })}
              width={14}
              height={7}
            />
          </Button>
        </div>

        {collapsed && (
          <>
            <Tabs
              className={classes.tabs}
              tabs={detailTabs}
              value={currentTab}
              onChange={onChangeTab}
              tabBarClassName={classes.tabBar}
              activeClassName={classes.active}
            />
            {renderContentSection()}
          </>
        )}
      </Col>
    </Row>
  );
};

export default InfoSection;
