import React, { FC, useCallback, useState } from 'react';
import cx from 'classnames';
import Card from '@ui/Cards';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { ImageUpload } from 'model/api/account/personal/listings.model';
import ModalCustomQuoteFirstLoadStepImage from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalCustomQuoteFirstLoadStepImage';
import useScreenDetect from 'hooks/useScreenDetect';
import PhotoSection from '../../../TradeInScoreCardComponent/PhotoSection/PhotoSection';
import classes from './step-image.module.scss';
import { constTitleStep } from '../../constraint';
import images from '@images';

interface Props {
  tradeInImages: ImageUpload[];
  setTradeInImages: (listImage: ImageUpload[]) => void;
  isCompleteCustomQuote: boolean;
}

const StepImages: FC<Props> = ({ tradeInImages, setTradeInImages, isCompleteCustomQuote }) => {
  const { currentWidthScreen } = useScreenDetect();
  const [visibleModalFirstLoadPageStepThree, setVisibleModalFirstLoadPageStepThree] = useState(true);
  const fileList = tradeInImages || [];

  const handleChange = useCallback(
    (values: { fileList: ImageUpload[] }) => {
      setTradeInImages(values?.fileList);
    },
    [setTradeInImages],
  );

  return (
    <div className={classes.wrapStepImage}>
      <div className={classes.wrapTradeInValue}>
        <div className={classes.header}>{constTitleStep.StepThree}</div>
        <Card className={classes.customCard}>
          <Row>
            <Col md={6}>
              <div className={cx(classes.textGrey, classes.mb46)}>
                You can add up to 12 photos of your bike. We don’t allow photos with extra borders, text, or artwork.
                Please take clear photos, using the images found
                <a onClick={() => setVisibleModalFirstLoadPageStepThree(true)} className={classes.link}>
                  here
                </a>
                as a guide. Make sure to include DWGS and/or damage.
              </div>
            </Col>
            {currentWidthScreen > 767 && (
              <Col md={6}>
                <div className={classes.wrapInfoRight}>
                  <div className={classes.wrapDescriptionheader}>
                    <img src={images.valueGuide.icImportantBlack} alt="MSRP" />
                    <span>Important</span>
                  </div>
                  <div className={classes.textDescription}>
                    Please remove all accessories not being traded in with the bike pior to photography. This includes,
                    but is not limited to, pedals, bottle cages, computer mounts, computers bells, saddle bags.
                    nutrition cariers, lights and frame pumps.
                  </div>
                </div>
              </Col>
            )}
          </Row>
          <PhotoSection listImages={fileList} setValues={handleChange} isCompleted={isCompleteCustomQuote} />
          <div className={classes.miniDescription}>Display Photo</div>
          {currentWidthScreen <= 767 && (
            <div className={classes.wrapInfoBottom}>
              <div className={classes.wrapInfoRight}>
                <div className={classes.wrapDescriptionheader}>
                  <img src={images.valueGuide.icImportantBlack} alt="MSRP" />
                  <span>Important</span>
                </div>
                <div className={classes.textDescription}>
                  Please remove all accessories not being traded in with the bike pior to photography. This includes,
                  but is not limited to, pedals, bottle cages, computer mounts, computers bells, saddle bags. nutrition
                  cariers, lights and frame pumps.
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
      <div className={classes.wrapBottomPadding} />

      {visibleModalFirstLoadPageStepThree && (
        <ModalCustomQuoteFirstLoadStepImage
          isOpen={visibleModalFirstLoadPageStepThree}
          onClose={() => setVisibleModalFirstLoadPageStepThree(false)}
        />
      )}
    </div>
  );
};

export default StepImages;
