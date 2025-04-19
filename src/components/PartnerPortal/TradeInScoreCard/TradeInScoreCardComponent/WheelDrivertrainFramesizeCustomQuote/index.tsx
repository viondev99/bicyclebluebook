/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import Radio from '@ui/Radio';
import cx from 'classnames';
import StoreState from 'model/store';
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Skeleton from 'react-loading-skeleton';
import { upgradeComps } from 'helpers/utilities.helper';
import TooltipWheelDrivertrain from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/TooltipWheelDrivertrain';
import { constTitleStep } from '../../CustomQuote/constraint';
import classes from './wheel-drivertrain-framesize.module.scss';

interface Props {
  upgradeCompIds: any[];
  setUpgradeCompIds: (values: any[]) => void;
  isCompleteCustomQuote: boolean;
}

const ModalTooltipWheelDrivertrain = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalTooltipWheelDrivertrain'),
);

const WheelDrivertrainFramesizeCustomQuote: FC<Props> = ({
  upgradeCompIds,
  setUpgradeCompIds,
  isCompleteCustomQuote,
}) => {
  const loading = useSelector((store: StoreState) => store.partner.account.loading);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [visibleModalTooltipWheelDrivertrain, setVisibleModalTooltipWheelDrivertrain] = useState('');

  const listModifications = useMemo(() => {
    const tempListModifications: any = {};

    upgradeComps.forEach((item: any) => {
      if (tempListModifications[item.name]) {
        tempListModifications[item.name].selects.unshift({
          value: item.id,
          label: item.up ? 'Upgraded' : 'Downgraded',
        });
      } else {
        tempListModifications[item.name] = {
          selects: [
            {
              value: item.id,
              label: item.up ? 'Upgraded' : 'Downgraded',
            },
            { value: '', label: 'None' },
          ],
        };
      }
    });

    return tempListModifications;
  }, []);

  useEffect(() => {
    if (upgradeCompIds?.length === 0) {
      setSelectedOptions([
        { key: 'Wheels', value: '' },
        { key: 'Drivetrain', value: '' },
      ]);
      return;
    }
    if (upgradeCompIds?.length === 1) {
      if (upgradeCompIds[0]?.key === 'Wheels') {
        setSelectedOptions([upgradeCompIds[0], { key: 'Drivetrain', value: '' }]);
        return;
      }
      setSelectedOptions([upgradeCompIds[0], { key: 'Wheels', value: '' }]);
      return;
    }
    setSelectedOptions([...upgradeCompIds]);
  }, [upgradeCompIds]);

  const handleChangeCheckbox = useCallback(
    (key: string, value: string | number) => {
      if (isCompleteCustomQuote) {
        return;
      }
      const newSelectedOptions = [...selectedOptions];
      const _index = newSelectedOptions.findIndex((it) => it.key === key);
      if (_index !== -1) {
        newSelectedOptions[_index].value = value;
        setSelectedOptions(newSelectedOptions);
        setUpgradeCompIds(newSelectedOptions);
      } else {
        setSelectedOptions([
          ...selectedOptions,
          ...[
            {
              key,
              value,
            },
          ],
        ]);
        setUpgradeCompIds([
          ...selectedOptions,
          ...[
            {
              key,
              value,
            },
          ],
        ]);
      }
    },
    [isCompleteCustomQuote, selectedOptions, setUpgradeCompIds],
  );

  const renderLoading = useMemo(() => {
    return (
      <Row className={cx(classes.customRow)}>
        <Col sm={12}>
          <Skeleton width="100%" height={30} />
        </Col>
        <Col sm={12} className="mt-2">
          <Skeleton width="100%" height={30} />
        </Col>
      </Row>
    );
  }, []);

  const renderFormRadio = useMemo(() => {
    return Object.keys(listModifications).map((key) => {
      return (
        <Row className={cx(classes.customRow)} key={key}>
          <Col lg={7} md={4} sm={12} className={classes.customCol}>
            <div className={classes.wrapTitle}>
              <span>{key}</span> <TooltipWheelDrivertrain onClick={() => setVisibleModalTooltipWheelDrivertrain(key)} />
            </div>
          </Col>
          <Col lg={5} md={8} sm={12} className={classes.customCol}>
            <div className={classes.wrapCheckbox}>
              {listModifications[key].selects.map((item: any) => {
                return (
                  <Radio
                    name={key}
                    key={item}
                    checked={selectedOptions.some((it) => it.value === item.value && it.key === key)}
                    className={classes.customCheckbox}
                    label={item.label}
                    onChange={() => handleChangeCheckbox(key, item.value)}
                  />
                );
              })}
            </div>
          </Col>
        </Row>
      );
    });
  }, [handleChangeCheckbox, listModifications, selectedOptions]);

  const renderFormRadioMobile = useMemo(() => {
    return Object.keys(listModifications).map((key) => {
      return (
        <Row className={cx(classes.customRow)} key={key}>
          <Col lg={6} md={6} sm={12} xs={12} className={classes.customCol}>
            <div className={classes.wrapTitle}>
              <span>{key}</span> <TooltipWheelDrivertrain onClick={() => setVisibleModalTooltipWheelDrivertrain(key)} />
            </div>
          </Col>
          <Col lg={6} md={6} sm={12} xs={12} className={classes.customCol}>
            <div className={classes.wrapCheckboxMobile}>
              {listModifications[key].selects.map((item: any) => {
                return (
                  <div
                    onClick={() => handleChangeCheckbox(key, item.value)}
                    className={cx(
                      classes.itemCheckboxMobile,
                      selectedOptions.some((it) => it.value === item.value && it.key === key) && classes.active,
                    )}
                    key={item}>
                    {item?.label}
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      );
    });
  }, [handleChangeCheckbox, listModifications, selectedOptions]);

  return (
    <>
      <div className={cx(classes.wrapSubStepThree, classes.isLargeScreen)}>
        <div className={classes.headerStep}>{constTitleStep.StepOneSubStepFour}</div>
        {loading ? renderLoading : renderFormRadio}
      </div>
      <div className={cx(classes.wrapSubStepThree, classes.isSmallScreen)}>
        <div className={classes.headerStep}>{constTitleStep.StepOneSubStepFour}</div>
        {loading ? renderLoading : renderFormRadioMobile}
      </div>

      {visibleModalTooltipWheelDrivertrain !== '' && (
        <Suspense fallback={null}>
          <ModalTooltipWheelDrivertrain
            isOpen={visibleModalTooltipWheelDrivertrain !== ''}
            onClose={() => {
              setVisibleModalTooltipWheelDrivertrain('');
            }}
            type={visibleModalTooltipWheelDrivertrain}
          />
        </Suspense>
      )}
    </>
  );
};

export default WheelDrivertrainFramesizeCustomQuote;
