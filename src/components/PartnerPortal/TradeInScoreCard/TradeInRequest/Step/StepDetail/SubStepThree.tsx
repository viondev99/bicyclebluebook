import React, { FC, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import Card from '@ui/Cards';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import ModalCustomQuoteFirstLoadStepImage from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalCustomQuoteFirstLoadStepImage';
import useScreenDetect from 'hooks/useScreenDetect';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { ImageUpload } from 'model/api/account/personal/listings.model';
import PhotoSection from '../../../TradeInScoreCardComponent/PhotoSection/PhotoSection';
import classes from './sub-step-three.module.scss';
import { constTitleStep } from '../../constraint';
import images from '@images';

interface Props {
  tradeInImages?: ImageUpload[];
  setTradeInImages?: (listImage: ImageUpload[]) => void;
  isCompleted?: boolean;
}

const StepImages: FC<Props> = ({ tradeInImages, setTradeInImages, isCompleted }) => {
  const { currentWidthScreen } = useScreenDetect();
  const { query } = useRouter();
  const [visibleModalFirstLoadPageStepThree, setVisibleModalFirstLoadPageStepThree] = useState(true);
  const dataTradeInRequest = useSelector((store: StoreState) => store.partner.scorecard.dataTradeInRequest); // done

  const fileList = tradeInImages || [];

  const disabledTradeInRequest = useMemo(() => {
    if (query?.tradeInRequestId && query?.tradeInId) {
      return true;
    }
    return false;
  }, [query]);

  // const fileList = dataTradeInRequest?.images?.length
  //   ? dataTradeInRequest?.images?.map((it) => {
  //       return {
  //         url: it?.fullLink || '',
  //       };
  //     })
  //   : [];

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
                as a guide. Make sure to include dwgs and/or damage.
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
          <PhotoSection listImages={fileList} setValues={handleChange} isCompleted={!isCompleted} />
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
