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
import { stagesToTextHistoryLead, statusToTextHistoryLead } from 'components/PartnerPortal/CostCalculator/constraint';
import { formatCurrency } from 'helpers/string.helper';
import Button from '@ui/Buttons/Primary/Button';
import { LeadItem, updateDetailLeadGenRequest } from 'api/partner/account.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { BicycleDetailModel } from 'model/api/value-guide.model';
import { getDetailBicycle } from 'api/value-guide.api';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './detail-lead.module.scss';
import { LeadFilterStages, LeadFilterStatus } from '../../../Filter/filterContaints';

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

const DetailLead: FC<Props> = () => {
  const { query, back, push } = useRouter();
  const dispatch = useDispatch();
  const { currentWidthScreen } = useScreenDetect();
  const detaillHistoryLead = useSelector((state: StoreState) => state.partner.scorecard.detaillHistoryLead);
  const loading = useSelector((state: StoreState) => state.partner.scorecard.loading);
  const [statusSelected, setStausSelected] = useState<string>('');
  const [stagesSelected, setStagesSelected] = useState<string>('');
  const [visibleModalConfirmGotoCreateScorecard, setVisibleModalConfirmGotoCreateScorecard] = useState(false);

  const getDetailScorecardHistoryLead = useCallback(() => {
    const leadId = query?.id;
    dispatch(scoreCardAction.getDetailScorecardHistoryLead(leadId));
  }, [dispatch, query]);

  useEffect(() => {
    getDetailScorecardHistoryLead();
  }, [getDetailScorecardHistoryLead]);

  const isDisableStatus = useMemo(() => {
    return (
      detaillHistoryLead?.status_view === statusToTextHistoryLead.CONVERTED ||
      detaillHistoryLead?.status_view === statusToTextHistoryLead.CLOSED
    );
  }, [detaillHistoryLead]);

  useEffect(() => {
    if (detaillHistoryLead) {
      setStausSelected(detaillHistoryLead?.status_view);
      setStagesSelected(detaillHistoryLead?.stage_view);
    }
  }, [detaillHistoryLead]);

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

  const gotoCreateScoreCard = useCallback(async () => {
    const body: LeadItem = {
      name: detaillHistoryLead?.name,
      zip_code: detaillHistoryLead?.zip_code,
      trade_in_value: detaillHistoryLead?.trade_in_value,
      email: detaillHistoryLead?.email,
      status_view: stagesToTextHistoryLead.CONVERTED,
      stage_view: stagesToTextHistoryLead.CONVERTED,
      phone: detaillHistoryLead?.phone,
      id: detaillHistoryLead?._id,
    };
    await updateDetailLeadGenRequest(body);
    if (detaillHistoryLead?.bike?.id) {
      await gotoCreateScoreCardHasBicycleId(detaillHistoryLead?.bike?.id);
      return;
    }
    push({
      pathname: `/trade-in-account/trade-in/custom-quote`,
      query: {
        brand: encodeURIComponent(detaillHistoryLead?.bike?.brand),
        model: encodeURIComponent(detaillHistoryLead?.bike?.model),
        year: detaillHistoryLead?.bike?.year,
      },
    });
  }, [detaillHistoryLead, gotoCreateScoreCardHasBicycleId, push]);

  const initialValues = useMemo(() => {
    return {
      date: dayjs(detaillHistoryLead?.date_created).format('LL'),
      name: detaillHistoryLead?.name,
      zip_code: detaillHistoryLead?.zip_code,
      trade_in_value: formatCurrency(detaillHistoryLead?.trade_in_value),
      email: detaillHistoryLead?.email,
      status_view: detaillHistoryLead?.status_view,
      stage_view: detaillHistoryLead?.stage_view,
      phone: detaillHistoryLead?.phone,
      notes: detaillHistoryLead?.notes,
    };
  }, [detaillHistoryLead]);

  const dataDetail: DataDetail[] = useMemo(() => {
    return [
      {
        id: 'date',
        label: 'Date',
        value: detaillHistoryLead?.date_created,
        type: 'input',
      },
      {
        id: 'name',
        label: 'Name',
        value: detaillHistoryLead?.name,
        type: 'input',
      },
      {
        id: 'zip_code',
        label: 'Zip Code',
        value: detaillHistoryLead?.zip_code,
        type: 'input',
      },
      {
        id: 'phone',
        label: 'Phone Number',
        value: detaillHistoryLead?.phone,
        type: 'phone',
      },
      {
        id: 'email',
        label: 'Email',
        value: detaillHistoryLead?.email,
        type: 'input',
      },
      {
        id: 'status_view',
        label: 'Status',
        value: detaillHistoryLead?.status_view || detaillHistoryLead?.status,
        type: 'select_status',
      },
      {
        id: 'stage_view',
        label: 'Stages',
        status: detaillHistoryLead?.status_view,
        value: detaillHistoryLead?.stage_view,
        type: 'select_stage',
        disable: !isDisableStatus,
      },
      {
        id: 'trade_in_value',
        label: 'Trade-in Value',
        value: formatCurrency(detaillHistoryLead?.trade_in_value),
        type: 'input',
      },
      {
        id: 'notes',
        label: 'Notes',
        value: detaillHistoryLead?.notes,
        type: 'text-area',
        disable: !isDisableStatus,
      },
    ];
  }, [detaillHistoryLead, isDisableStatus]);

  const handleChangeValueSelect = useCallback((option: Option, field) => {
    setStagesSelected(option?.value);
    switch (option?.value) {
      case stagesToTextHistoryLead?.NEW_LEAD:
        setStausSelected(statusToTextHistoryLead.NEW_LEAD);
        break;

      case stagesToTextHistoryLead?.CONTACTED:
        setStausSelected(statusToTextHistoryLead.OPEN);
        break;

      case stagesToTextHistoryLead?.FOLLOW_UP_LATER:
        setStausSelected(statusToTextHistoryLead.OPEN);
        break;

      case stagesToTextHistoryLead?.CONVERTED:
        setStausSelected(statusToTextHistoryLead.CONVERTED);
        setVisibleModalConfirmGotoCreateScorecard(true);
        break;

      case stagesToTextHistoryLead?.NO_INTEREST:
        setStausSelected(statusToTextHistoryLead.CLOSED);
        break;

      case stagesToTextHistoryLead?.NON_RESPONSE:
        setStausSelected(statusToTextHistoryLead.CLOSED);
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
              options={LeadFilterStatus}
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
              options={LeadFilterStages?.filter((e) => e?.value !== '')}
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

  const handleFormSubmit = useCallback(
    async (form: FormDetails) => {
      try {
        const body = {
          name: detaillHistoryLead?.name,
          zip_code: detaillHistoryLead?.zip_code,
          trade_in_value: detaillHistoryLead?.trade_in_value,
          email: detaillHistoryLead?.email,
          status_view: statusSelected,
          stage_view: stagesSelected,
          phone: detaillHistoryLead?.phone,
          id: String(query?.id),
          notes: form?.notes,
        };
        await updateDetailLeadGenRequest(body);
        toastSuccess('Update Lead Successfully');
        getDetailScorecardHistoryLead();
      } catch (error) {
        toastError(error);
      }
    },
    [detaillHistoryLead, getDetailScorecardHistoryLead, query, stagesSelected, statusSelected],
  );

  const handleBack = useCallback(() => {
    back();
  }, [back]);

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
              Back to Leads
            </div>
          </div>
          <div
            className={
              classes.title
            }>{`${detaillHistoryLead?.bike?.year} ${detaillHistoryLead?.bike?.model} ${detaillHistoryLead?.bike?.brand}`}</div>
          <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={handleFormSubmit}>
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
                        className={cx(classes.label, {
                          [classes.lableNote]: item?.id === 'notes',
                        })}>
                        {item?.label}
                      </Col>
                      <Col sm={8} xs={12}>
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
            onCreatedScoreCard={gotoCreateScoreCard}
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

export default DetailLead;
