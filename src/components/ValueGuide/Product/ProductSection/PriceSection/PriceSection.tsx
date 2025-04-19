import React, { FC, Suspense, useCallback, useMemo, useState } from 'react';
import Card from '@ui/Cards';
import images from 'assets/images';
import cx from 'classnames';
import { BicycleDetailModel, Condition } from 'model/store/value-guide.model';
import { useRouter } from 'next/router';
import _capitalize from 'lodash/capitalize';
import _find from 'lodash/find';
import _get from 'lodash/get';
import _startCase from 'lodash/startCase';
import numeral from 'numeral';
import Button from '@ui/Buttons/Primary/Button';
import ConditionModal from 'components/ValueGuide/Search/SelectBicycle/ConditionModal';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import classes from './priceSection.module.scss';

const PopupNotEligibleModel = React.lazy(() => import('../../PopupNotEligibleModel/PopupNotEligibleModel'));

interface Props {
  bicycle: BicycleDetailModel;
}
export function formatCurrency(s: number | string): string {
  return numeral(s).format('$0,0');
}

const formatMoneyFromTo = (from: number | string, to: number | string) => {
  return `${formatCurrency(from)} - ${formatCurrency(to)}`;
};

const formatConditionString = (condition: string) => {
  return _capitalize(_startCase(condition));
};

const PriceCard: FC<Props> = ({ bicycle }) => {
  const router = useRouter();
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  const [conditionModalVisible, setConditionModalVisible] = useState<boolean>(false);
  const [popupNotEligible, setPopupEligible] = useState<string>('');

  const condition = _get(router, 'query.condition', Condition.Good);
  const priceDetail = useMemo(
    () =>
      _find(bicycle.conditions, (item) => {
        return item.condition === condition;
      }),
    [bicycle.conditions, condition],
  );

  const isNewScoreCard = useMemo(() => {
    if (bicycle?.isEbike) {
      if (bicycle?.yearId < 2018) {
        return false;
      }
      return true;
    }
    return true;
  }, [bicycle]);

  const gotoCreateScoreCard = useCallback(() => {
    if (bicycle?.typeName === 'Kids' || bicycle?.typeName === 'E-Bike' || priceDetail?.tradeInValueMin < 400) {
      setPopupEligible(bicycle?.typeName);
      return;
    }
    let pathname = '/trade-in-account/trade-in/new';

    if (bicycle?.isEbike) {
      pathname = '/trade-in-account/trade-in/ebike-quote';
    }
    router.replace({
      pathname,
      query: {
        brandId: bicycle?.brandId,
        familyName: bicycle?.familyName || 'Allant',
        bicycleId: bicycle?.id,
        yearId: bicycle?.yearId,
        modelId: bicycle?.modelId,
        condition,
      },
    });
  }, [bicycle, condition, priceDetail, router]);

  return (
    <>
      <Card className={classes.priceSection}>
        <div className={classes.item}>
          <img src={images.valueGuide.icTradeInBlue} alt="Trade in" />

          <div className={classes.tag}>
            <div className={classes.title}>TRADE-IN RANGE</div>
            <div className={classes.price}>
              {formatMoneyFromTo(priceDetail?.tradeInValueMin, priceDetail?.tradeInValueMax)}
            </div>
          </div>
        </div>

        <div className={classes.item}>
          <img src={images.valueGuide.iconPrivatePrivacyBlue} alt="Private Privacy" />

          <div className={classes.tag}>
            <div className={classes.title}>Private Range</div>
            <div className={classes.price}>
              {formatMoneyFromTo(priceDetail?.privatePartyValueMin, priceDetail?.privatePartyValueMax)}
            </div>
          </div>
        </div>

        <div className={classes.item}>
          <img src={images.valueGuide.iconMsrpBlue} alt="MSRP" />

          <div className={classes.tag}>
            <div className={classes.title}>MSRP</div>
            <div className={classes.price}>{formatCurrency(bicycle.msrp)}</div>
          </div>
        </div>

        <div className={classes.footer}>
          <Button
            buttonType="transparent"
            className="d-flex align-items-center"
            onClick={() => setConditionModalVisible(true)}>
            <img src={images.common.iconEdit} alt="Edit Icon" />
            <span className="ml-3 text-capitalize">{formatConditionString(priceDetail?.condition)} Condition</span>
          </Button>
          {userInfo?.partner && isNewScoreCard && (
            <span className={cx('ml-3 text-capitalize', classes.link)} onClick={gotoCreateScoreCard}>
              Create a scorecard
            </span>
          )}
        </div>
      </Card>
      {conditionModalVisible && (
        <ConditionModal
          bicycle={bicycle}
          isOpen={conditionModalVisible}
          onClose={() => {
            setConditionModalVisible(false);
          }}
        />
      )}

      {popupNotEligible !== '' && (
        <Suspense fallback={null}>
          <PopupNotEligibleModel
            isOpen={popupNotEligible !== ''}
            onClose={() => setPopupEligible('')}
            typeBike={popupNotEligible}
            fairCondition={priceDetail?.tradeInValueMin}
          />
        </Suspense>
      )}
    </>
  );
};

export default PriceCard;
