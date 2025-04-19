import React, { FC, useCallback, useState } from 'react';
import cx from 'classnames';
import Card from '@ui/Cards';
import { ImageUpload } from 'model/api/account/personal/listings.model';
import { GetTradeInByIdResponseStepThreeResponse } from 'model/store/partner/scorecard.model';
import PhotoSection from '../../../TradeInScoreCardComponent/PhotoSection/PhotoSection';
import classes from './step-image.module.scss';
import { constTitleStep } from '../../constraint';
import ModalFirstLoadStepImage from '../../../TradeInScoreCardComponent/Modal/ModalFirstLoadStepImage';

interface Props {
  isCompleted: boolean;
  formStepThree: GetTradeInByIdResponseStepThreeResponse;
  handleBackPreviousStep: () => void;
  setFormStepThree: (formStepThree: GetTradeInByIdResponseStepThreeResponse) => void;
}

const StepImages: FC<Props> = ({ isCompleted, formStepThree, setFormStepThree }) => {
  const [visibleModalFirstLoadPageStepThree, setVisibleModalFirstLoadPageStepThree] = useState(true);
  const fileList = formStepThree?.tradeInImages || [];

  const handleChange = useCallback(
    (values: { fileList: ImageUpload[] }) => {
      setFormStepThree({
        ...formStepThree,
        tradeInImages: values?.fileList,
      });
    },
    [formStepThree, setFormStepThree],
  );

  return (
    <div className={classes.wrapStepImage}>
      <div className={classes.wrapTradeInValue}>
        <div className={classes.header}>{constTitleStep.StepThree}</div>
        <Card className={classes.customCard}>
          <div className={cx(classes.textGrey, classes.mb46)}>
            You can add up to 12 photos of your bike. We don’t allow photos with extra borders, text, or artwork. Please
            take clear photos, remove all accessories not being trade in, and include dwgs and/or damage.
          </div>
          <PhotoSection listImages={fileList} setValues={handleChange} isCompleted={isCompleted} />
          <div className={classes.miniDescription}>Display Photo</div>
        </Card>
      </div>

      {visibleModalFirstLoadPageStepThree && (
        <ModalFirstLoadStepImage
          isOpen={visibleModalFirstLoadPageStepThree}
          onClose={() => setVisibleModalFirstLoadPageStepThree(false)}
          formStepThree={formStepThree}
        />
      )}
    </div>
  );
};

export default StepImages;
