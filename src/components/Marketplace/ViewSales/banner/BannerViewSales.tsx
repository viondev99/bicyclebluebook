/* eslint-disable no-nested-ternary */
import React, { FC, useMemo, useState } from 'react';
import { Row } from 'reactstrap';
import Container from 'reactstrap/lib/Container';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import images from '@images';
import classes from './banner.module.scss';

interface Props {
  customWrapBanner?: string;
}

const BannerViewSales: FC<Props> = ({ customWrapBanner }) => {
  const { currentWidthScreen } = useScreenDetect();
  const [showReadMore, setShowReadMore] = useState<boolean>(false);

  const renderTextMobile = useMemo(() => {
    if (showReadMore) {
      return (
        <div className={classes.text}>
          This is home to all the amazing bikes we mark down even further. Just like everything else on our site,
          they’re mostly one of one—so if you catch something you like, now’s the time to snag it. Once these bikes are
          gone, they’re gone for good.
        </div>
      );
    }
    return (
      <div className={classes.text}>This is home to all the amazing bikes we mark down even further. Just like</div>
    );
  }, [showReadMore]);

  const renderPC = useMemo(() => {
    return (
      <Row className={classes.wrapBanner}>
        <div className={classes.wrapRight}>
          <div className={classes.wrapAvatar}>
            <span className={classes.text24}>Sale</span>
          </div>
          <div className={classes.wrapContentRight}>
            {currentWidthScreen < 1200 && currentWidthScreen > 767 ? (
              <div className={classes.customTextContent}>
                This is home to all the amazing bikes we mark down even further. Just like everything else on our site,
                they’re mostly one of one—so if you catch something you like, now’s the time to snag it. Once these
                bikes are gone, they’re gone for good.
              </div>
            ) : (
              <div className={cx(classes.customTextContent)}>
                This is home to all the amazing bikes we mark down even further. Just like everything else on our site,
                <br />
                they’re mostly one of one—so if you catch something you like, now’s the time to snag it. Once these
                <br />
                bikes are gone, they’re gone for good.
              </div>
            )}
          </div>
        </div>
      </Row>
    );
  }, [currentWidthScreen]);

  const renderMobile = useMemo(() => {
    return (
      <div className={classes.wrapBannerMobile1}>
        <div className={classes.coverAvatar}>
          <div className={classes.wrapAvatar}>
            <span className={classes.text24}>Sale</span>
          </div>
        </div>
        <div className={classes.wrapTextContent}>
          <div className={cx(classes.customTextContentMobile)}>
            <div className={classes.text}>{renderTextMobile}</div>
            <div className={classes.wrapbtnReadMore}>
              <span onClick={() => setShowReadMore(!showReadMore)} className={classes.btnReadMore}>
                {!showReadMore ? 'Read More' : 'Read Less'}
                <img
                  className={cx({ [classes.rotate]: !showReadMore }, { [classes.rotate180]: showReadMore })}
                  src={images.common.icDropDown}
                  alt="icon arrow down"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }, [showReadMore, renderTextMobile]);
  return (
    <Container className={cx(classes.container, customWrapBanner)}>
      {!currentWidthScreen ? null : currentWidthScreen < 768 ? renderMobile : renderPC}
    </Container>
  );
};

export default BannerViewSales;
