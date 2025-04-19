import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Option } from 'react-select/src/filters';
import Skeleton from 'react-loading-skeleton';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Card from '@ui/Cards';
import Select from '@ui/Select/Select';
import cx from 'classnames';
import { Formik, FormikProps, Form } from 'formik';
import FormikInput from 'components/Formik/Input/FormikInput';
import iconBack from 'assets/img/register/ic_back.svg';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { useRouter } from 'next/router';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import FormikTextMask from 'components/Formik/TextMask/FormikTextMask';
import { statusToTextHistoryQuotes } from 'components/PartnerPortal/CostCalculator/constraint';
import { formatCurrency } from 'helpers/string.helper';
import Button from '@ui/Buttons/Primary/Button';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { BicycleDetailModel } from 'model/api/value-guide.model';
import { getDetailBicycle } from 'api/value-guide.api';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import { changeNameCondition, formatNumberLargeDecimal } from 'helpers/utilities.helper';
import {
  checkTradeInCompleteStepRequest,
  CheckTradeInCompleteStepResponse,
  CreateNewTradeInBody,
  saveAsQuote,
  updateStatusQuotes,
} from 'api/partner/scorecard.api';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './detail-quotes.module.scss';
import { ListFilterStagesQuotes, QuotesFilterStatus, StagesToTextHistoryQuotes } from '../../../Filter/filterContaints';

const ModalConfirmGotoCreateScorecard = React.lazy(() => import('@ui/Modal/ModalConfirmGotoCreateScorecard'));

dayjs.extend(LocalizedFormat);

interface Props {}

interface DataDetail {
  id: string;
  label: string;
  value: string | number;
  type: string;
  disable?: boolean;
  status?: string;
}

interface FormDetails {
  date: string;
  name: string;
  zip_code: string;
  trade_in_value: number;
  email: string;
  status_view: string;
  stage_view: string;
  phone: string;
  id?: string;
  notes?: string;
}

const DetailQuotes: FC<Props> = () => {
  const { query, back, push } = useRouter();
  const dispatch = useDispatch();
  const { currentWidthScreen } = useScreenDetect();
  const dataStepSummaryStandardQuote = useSelector(
    (state: StoreState) => state.partner.scorecard.dataStepSummaryStandardQuote,
  );
  const loading = useSelector((state: StoreState) => state.partner.scorecard.loading);
  const [statusSelected, setStausSelected] = useState<string>('');
  const [stagesSelected, setStagesSelected] = useState<string>('');
  const [visibleModalConfirmGotoCreateScorecard, setVisibleModalConfirmGotoCreateScorecard] = useState(false);

  const frameSize = useMemo(() => {
    return dataStepSummaryStandardQuote?.tradeInComponents?.length > 0 &&
      dataStepSummaryStandardQuote.tradeInComponents.filter((item) => item.id.inventoryCompTypeId === 178).length > 0
      ? dataStepSummaryStandardQuote.tradeInComponents.filter((item) => item.id.inventoryCompTypeId === 178)[0].value
      : '';
  }, [dataStepSummaryStandardQuote]);

  const drivetrain = useMemo(() => {
    // eslint-disable-next-line no-nested-ternary
    return dataStepSummaryStandardQuote?.upgradeComps?.length
      ? dataStepSummaryStandardQuote?.upgradeComps?.some((it) => it.id === 4)
        ? 'Downgraded'
        : 'Upgraded'
      : 'None';
  }, [dataStepSummaryStandardQuote]);

  const wheels = useMemo(() => {
    // eslint-disable-next-line no-nested-ternary
    return dataStepSummaryStandardQuote?.upgradeComps?.length
      ? dataStepSummaryStandardQuote?.upgradeComps?.some((it) => it.id === 3)
        ? 'Downgraded'
        : 'Upgraded'
      : 'None';
  }, [dataStepSummaryStandardQuote]);

  const getDetailScorecardHistoryQuote = useCallback(() => {
    const quoteId = query?.id;
    dispatch(scoreCardAction.getStepSummaryStandardQuote(quoteId));
    // dispatch(scoreCardAction.getDetailScorecardHistoryQuote(quoteId));
  }, [dispatch, query]);

  useEffect(() => {
    getDetailScorecardHistoryQuote();
  }, [getDetailScorecardHistoryQuote]);

  const isDisableStatus = useMemo(() => {
    return (
      dataStepSummaryStandardQuote?.status === statusToTextHistoryQuotes.CONVERTED_QUOTE ||
      dataStepSummaryStandardQuote?.status === statusToTextHistoryQuotes.CLOSED_QUOTE ||
      dataStepSummaryStandardQuote?.status === statusToTextHistoryQuotes.EXPIRED_QUOTE
    );
  }, [dataStepSummaryStandardQuote]);

  useEffect(() => {
    if (dataStepSummaryStandardQuote) {
      setStausSelected(dataStepSummaryStandardQuote?.status);
      setStagesSelected(dataStepSummaryStandardQuote?.stage);
    }
  }, [dataStepSummaryStandardQuote]);

  const gotoCreateScoreCardHasBicycleId = useCallback(
    async (idBicycle: string) => {
      const bicycle: BicycleDetailModel = await getDetailBicycle({
        idOrName: idBicycle,
      });
      let pathname = '/trade-in-account/trade-in/new';
      if (bicycle?.isEbike) {
        pathname = '/trade-in-account/trade-in/ebike-quote';
      }
      push({
        pathname,
        query: {
          brandId: bicycle?.brandId,
          familyName: bicycle?.familyName || 'Allant',
          bicycleId: bicycle?.id,
          yearId: bicycle?.yearId,
          modelId: bicycle?.modelId,
        },
      });
    },
    [push],
  );

  const handleSaveQuote = useCallback(
    async (value: any) => {
      const params = {
        isInstantPayout: false,
      };
      const payload: CreateNewTradeInBody = {
        bicycleId: dataStepSummaryStandardQuote?.bicycleBaseInfo?.bicycleId,
        chargerIncluded: false,
        clean: null,
        compRequests: [{ compId: '178', value: dataStepSummaryStandardQuote?.tradeInComponents[0]?.value }],
        condition: dataStepSummaryStandardQuote?.condition,
        hasDiagnosticReport: false,
        hasKey: false,
        isEbike: false,
        isTamperedWith: false,
        upgradeCompIds: [],
        value: Number(dataStepSummaryStandardQuote?.tradeValue),
        ownerNotes: value?.notes,
        status: statusSelected,
        stage: stagesSelected,
      };
      try {
        await saveAsQuote(payload, params);
        toastSuccess('Updated Successfully');
        dispatch(scoreCardAction.getStepSummaryStandardQuote(`${query?.id}`));
      } catch (error) {
        toastError(error);
      }
    },
    [dataStepSummaryStandardQuote, dispatch, query, stagesSelected, statusSelected],
  );

  const handleConverQuote = useCallback(async () => {
    try {
      await updateStatusQuotes(String(query?.id), 'CONVERTED');
      const res: CheckTradeInCompleteStepResponse = await checkTradeInCompleteStepRequest(`${query?.id}`);
      push(`/trade-in-account/trade-in/${res?.scoreCardId}?step=2`);
      setVisibleModalConfirmGotoCreateScorecard(false);
    } catch (error) {
      toastError(error);
    }
  }, [push, query]);

  const initialValues = useMemo(() => {
    return {
      trade_in_value: formatCurrency(dataStepSummaryStandardQuote?.tradeValue),
      status_view: dataStepSummaryStandardQuote?.status,
      stage_view: dataStepSummaryStandardQuote?.stage,
      notes: dataStepSummaryStandardQuote?.owner?.notes,
    };
  }, [dataStepSummaryStandardQuote]);

  const dataDetail: DataDetail[] = useMemo(() => {
    return [
      {
        id: 'status_view',
        label: 'Status',
        value: dataStepSummaryStandardQuote?.status || dataStepSummaryStandardQuote?.status,
        type: 'select_status',
      },
      {
        id: 'stage_view',
        label: 'Stages',
        status: dataStepSummaryStandardQuote?.status,
        value: dataStepSummaryStandardQuote?.stage,
        type: 'select_stage',
        disable: !isDisableStatus,
      },
      // {
      //   id: 'trade_in_value',
      //   label: 'Trade-in Value',
      //   value: formatCurrency(dataStepSummaryStandardQuote?.trade_in_value),
      //   type: 'input',
      // },
      {
        id: 'notes',
        label: 'Notes',
        value: dataStepSummaryStandardQuote?.owner?.notes,
        type: 'text-area',
        disable: !isDisableStatus,
      },
    ];
  }, [dataStepSummaryStandardQuote, isDisableStatus]);

  const handleChangeValueSelect = useCallback((option: Option, field) => {
    setStagesSelected(option?.value);
    switch (option?.value) {
      case StagesToTextHistoryQuotes?.NEW:
        setStausSelected(statusToTextHistoryQuotes.OPEN_QUOTE);
        break;

      case StagesToTextHistoryQuotes?.CONTACTED:
        setStausSelected(statusToTextHistoryQuotes.OPEN_QUOTE);
        break;

      case StagesToTextHistoryQuotes?.FOLLOW_UP_LATER:
        setStausSelected(statusToTextHistoryQuotes.OPEN_QUOTE);
        break;

      case StagesToTextHistoryQuotes?.CONVERTED:
        setStausSelected(statusToTextHistoryQuotes.CONVERTED_QUOTE);
        setVisibleModalConfirmGotoCreateScorecard(true);
        break;

      case StagesToTextHistoryQuotes?.NO_INTEREST:
        setStausSelected(statusToTextHistoryQuotes.CLOSED_QUOTE);
        break;

      case StagesToTextHistoryQuotes?.NON_RESPONSE:
        setStausSelected(statusToTextHistoryQuotes.CLOSED_QUOTE);
        break;

      default:
        break;
    }
  }, []);

  const renderValueDetail = useCallback(
    (item: DataDetail) => {
      switch (item?.type) {
        case 'input':
          return <FormikInput name={item?.id} disabled={!item?.disable} />;

        case 'text-area':
          return <FormikTextarea disabled={!item?.disable} rows={6} name={item?.id} />;

        case 'phone':
          return <FormikTextMask name="phone" typeMask="phone" disabled={!item?.disable} />;

        case 'select_status':
          return (
            <Select
              inputId={item?.id}
              isSearchable={true}
              value={statusSelected}
              options={QuotesFilterStatus}
              onChange={(value: Option) => handleChangeValueSelect(value, 'status')}
              isDisabled={true}
            />
          );

        case 'select_stage':
          return (
            <Select
              inputId={item?.id}
              isSearchable={true}
              value={stagesSelected}
              options={ListFilterStagesQuotes?.filter((e) => e?.value !== '')}
              onChange={(value: Option) => handleChangeValueSelect(value, 'stages')}
              isDisabled={!item?.disable}
            />
          );

        default:
          return null;
      }
    },
    [handleChangeValueSelect, stagesSelected, statusSelected],
  );

  const handleBack = useCallback(() => {
    back();
  }, [back]);

  const renderBicycleItem = useCallback((title: string, value?: string | number) => {
    return (
      <div className={classes.wrapBicycleInfoItem}>
        <div className={cx(classes.textGrey, classes.mb9, classes.mobileItemTitle)}>{title}</div>
        <div className={cx(classes.textBlack, classes.mobileItemValue)}>{value}</div>
      </div>
    );
  }, []);

  const renderGroupBtn = useCallback(() => {
    switch (isDisableStatus) {
      case false:
        return (
          <>
            {currentWidthScreen <= 768 ? (
              <div className={classes.btnSaveMobile}>
                <Button type="submit" className="mb-3" disabled={isDisableStatus}>
                  Save Changes
                </Button>
                <Button
                  type="button"
                  buttonType="outline"
                  onClick={() => setVisibleModalConfirmGotoCreateScorecard(true)}
                  disabled={isDisableStatus}>
                  Convert to Scorecard
                </Button>
              </div>
            ) : (
              <div className={classes.btnSave}>
                <Button
                  type="button"
                  buttonType="outline"
                  onClick={() => setVisibleModalConfirmGotoCreateScorecard(true)}
                  disabled={isDisableStatus}>
                  Convert to Scorecard
                </Button>
                <Button type="submit" disabled={isDisableStatus}>
                  Save Changes
                </Button>
              </div>
            )}
          </>
        );

      default:
        return (
          <div className={classes.onlyBtnSave}>
            <Button type="submit" disabled={isDisableStatus}>
              Save Changes
            </Button>
          </div>
        );
    }
  }, [currentWidthScreen, isDisableStatus]);

  return (
    <div>
      {loading && <ScorecardSkeleton />}
      {!loading && (
        <Card className={classes.card}>
          <div className={classes.header}>
            <div className={classes.textHeader} onClick={handleBack}>
              <img className={'mr-3'} src={iconBack} alt="Back icon" />
              Back to Quotes
            </div>
          </div>
          <div
            className={
              classes.title
            }>{`${dataStepSummaryStandardQuote?.bicycleBaseInfo?.bicycleYearName} ${dataStepSummaryStandardQuote?.bicycleBaseInfo?.bicycleBrandName} ${dataStepSummaryStandardQuote?.bicycleBaseInfo?.bicycleModelName}`}</div>
          <div className={classes.wrapBicycleInfo}>
            {renderBicycleItem('Frame Size', frameSize)}
            {renderBicycleItem('Drivetrain', drivetrain)}
            {renderBicycleItem('Wheels', wheels)}
            {renderBicycleItem('Condition', changeNameCondition(dataStepSummaryStandardQuote?.condition))}
          </div>
          <div className={classes.tradeInValue}>
            <div className={classes.labelTradeIn}>Trade-in value</div>
            <div className={classes.valueTradeIn}>
              ${formatNumberLargeDecimal(dataStepSummaryStandardQuote?.tradeValue)}
            </div>
          </div>
          <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={handleSaveQuote}>
            {({ handleSubmit }: FormikProps<any>) => (
              <Form onSubmit={handleSubmit}>
                {dataDetail?.map((item: DataDetail) => {
                  return (
                    <Row
                      className={cx(classes.rowItem, {
                        [classes.rowNotes]: item?.id === 'notes',
                      })}>
                      <Col
                        sm={4}
                        xs={12}
                        className={cx(classes.label, 'mb-2', {
                          [classes.lableNote]: item?.id === 'notes',
                        })}>
                        {item?.label}
                      </Col>
                      <Col md={8} xs={12}>
                        {renderValueDetail(item)}
                      </Col>
                    </Row>
                  );
                })}
                {renderGroupBtn()}
              </Form>
            )}
          </Formik>
        </Card>
      )}
      {visibleModalConfirmGotoCreateScorecard && (
        <Suspense fallback={null}>
          <ModalConfirmGotoCreateScorecard
            isOpen={visibleModalConfirmGotoCreateScorecard}
            onClose={() => setVisibleModalConfirmGotoCreateScorecard(false)}
            onCreatedScoreCard={handleConverQuote}
          />
        </Suspense>
      )}
    </div>
  );
};

export const ScorecardSkeleton: FC = () => {
  return (
    <Card className={classes.card}>
      <p className={classes.location}>
        <Skeleton />
      </p>
      <p className={classes.location}>
        <Skeleton />
      </p>
      <p className={classes.location}>
        <Skeleton />
      </p>
      <p className={classes.location}>
        <Skeleton />
      </p>
      <p className={classes.location}>
        <Skeleton />
      </p>
      <p className={classes.location}>
        <Skeleton />
      </p>
      <p className={classes.location}>
        <Skeleton />
      </p>
      <p className={classes.location}>
        <Skeleton />
      </p>
    </Card>
  );
};

export default DetailQuotes;
