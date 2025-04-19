/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import moment from 'moment';
import React, { FC, Suspense, useCallback, useEffect, useState } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Card from '@ui/Cards';
import Input from '@ui/Inputs/Input';
import InvisibleBackdrop from '@ui/Backdrop/InvisibleBackdrop';
import Select from '@ui/Select/Select';
import trim from 'lodash/trim';
import { emailValidate, printContent } from 'helpers/utilities.helper';
import { useRouter } from 'next/router';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import StoreState from 'model/store';
import { useDispatch, useSelector } from 'react-redux';
import PrintScoreCard from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/PrintScoreCard';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';
import t from 'helpers/language';
import classes from './with-drop-off.module.scss';
import images from '@images';
import { FormStepFourSelectThree } from '../../../formDefaultValue';
import { HOLIDAYS } from '../../../constraint';

const ModalWithDropOffShowDateAndTime = React.lazy(() =>
  import('components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/Modal/ModalWithDropOffShowDateAndTime'),
);
interface Props {
  formStepFourSelectFour: FormStepFourSelectThree;
  setFormStepFourSelectFour: (values: FormStepFourSelectThree) => void;
  isCompleted: boolean;
}

export const selectTimeOptions = [
  { value: '7:00', label: '7:00a' },
  { value: '8:00', label: '8:00a' },
  { value: '9:00', label: '9:00a' },
  { value: '10:00', label: '10:00a' },
  { value: '11:00', label: '11:00a' },
  { value: '12:00', label: '12:00p' },
  { value: '13:00', label: '1:00p' },
  { value: '14:00', label: '2:00p' },
  { value: '15:00', label: '3:00p' },
  { value: '16:00', label: '4:00p' },
];

const WithDropOff: FC<Props> = ({ formStepFourSelectFour, setFormStepFourSelectFour, isCompleted }) => {
  const { currentWidthScreen } = useScreenDetect();
  const { query } = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  const detailPartnerLocation = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);

  const getDetailPartner = useCallback(async () => {
    if (!detailPartnerLocation) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
    }
  }, [detailPartnerLocation, dispatch, userInfo]);

  const handleGetDefaultStepSummary = useCallback(async () => {
    dispatch(scoreCardAction.getStepSummaryStandardQuote(`${query?.id}`));
  }, [dispatch, query]);

  useEffect(() => {
    getDetailPartner();
    handleGetDefaultStepSummary();
  }, []);

  const [visibleBackDropChooseDateAndTime, setVisibleBackDropChooseDateAndTime] = useState(false);
  const [visibleModalChooseDateAndTime, setVisibleModalChooseDateAndTime] = useState(false);
  const { dropOffContactEmail, dateDrop, timeDrop, error } = formStepFourSelectFour || {};

  const handleChangeForm = useCallback(
    (key: string, value: string | Date) => {
      switch (key) {
        case 'dropOffContactEmail': {
          if (typeof value === 'string' && trim(value) === '') {
            setFormStepFourSelectFour({
              ...formStepFourSelectFour,
              [key]: value,
              error: {
                ...formStepFourSelectFour.error,
                dropOffContactEmail: t('common.validate.emailRequired'),
              },
            });
          } else if (typeof value === 'string' && trim(value) !== '' && !emailValidate(trim(value))) {
            setFormStepFourSelectFour({
              ...formStepFourSelectFour,
              [key]: value,
              error: {
                ...formStepFourSelectFour.error,
                dropOffContactEmail: t('common.validate.emailInvalid'),
              },
            });
          } else if (typeof value === 'string' && trim(value) !== '' && emailValidate(trim(value))) {
            setFormStepFourSelectFour({
              ...formStepFourSelectFour,
              [key]: value,
              error: {
                ...formStepFourSelectFour.error,
                dropOffContactEmail: '',
              },
            });
          }
          break;
        }
        default:
          setFormStepFourSelectFour({
            ...formStepFourSelectFour,
            [key]: value,
            error: {
              ...formStepFourSelectFour.error,
              [key]: '',
            },
          });
          break;
      }
    },
    [formStepFourSelectFour, setFormStepFourSelectFour],
  );

  const handleOpenBackDrop = useCallback(() => {
    const currentValueDate = {
      dateDrop: formStepFourSelectFour?.dateDrop,
      timeDrop: formStepFourSelectFour?.timeDrop,
    };
    setFormStepFourSelectFour({
      ...formStepFourSelectFour,
      previousData: {
        ...formStepFourSelectFour.previousData,
        ...currentValueDate,
      },
    });
    if (currentWidthScreen > 767) {
      setVisibleBackDropChooseDateAndTime(true);
      return;
    }
    setVisibleModalChooseDateAndTime(true);
  }, [currentWidthScreen, formStepFourSelectFour, setFormStepFourSelectFour]);

  const handleCancelDate = useCallback(() => {
    setFormStepFourSelectFour({
      ...formStepFourSelectFour,
      dateDrop: formStepFourSelectFour?.previousData?.dateDrop,
      timeDrop: formStepFourSelectFour?.previousData?.timeDrop,
      previousData: {
        ...formStepFourSelectFour.previousData,
        dateDrop: null,
        timeDrop: null,
      },
    });
    if (currentWidthScreen > 767) {
      setVisibleBackDropChooseDateAndTime(false);
      return;
    }
    setVisibleModalChooseDateAndTime(false);
  }, [currentWidthScreen, formStepFourSelectFour, setFormStepFourSelectFour]);

  const handleConfirmFormDate = useCallback(() => {
    let checkError: boolean = false;
    let fieldError = {
      dateDrop: '',
      timeDrop: '',
    };
    if (!dateDrop) {
      fieldError = {
        ...fieldError,
        dateDrop: 'Please select your date.',
      };
      checkError = true;
    }
    if (!timeDrop) {
      fieldError = {
        ...fieldError,
        timeDrop: 'Please select your time.',
      };
      checkError = true;
    }
    if (checkError) {
      setFormStepFourSelectFour({
        ...formStepFourSelectFour,
        error: {
          ...formStepFourSelectFour.error,
          ...fieldError,
        },
      });
      return;
    }
    if (currentWidthScreen > 767) {
      setVisibleBackDropChooseDateAndTime(false);
      return;
    }
    setVisibleModalChooseDateAndTime(false);
  }, [currentWidthScreen, dateDrop, formStepFourSelectFour, setFormStepFourSelectFour, timeDrop]);

  const printScoreCard = useCallback(() => {
    const target = document.getElementById('PrintScoreCard');
    if (target) {
      printContent(target.innerHTML);
    }
  }, []);

  return (
    <Card className={classes.customCard}>
      {!isCompleted && (
        <>
          <div className={classes.title}>Drop Off Preparation</div>

          <Row>
            <Col md={6} xs={12}>
              <div className={classes.formTitle}>1. Print Your Scorecard</div>
              <div className={classes.formDescription}>
                Print a copy of your scorecard and bring it with you to the drop off.
              </div>
              <div className={classes.wrapAction} onClick={printScoreCard}>
                <img src={images.account.order.icPrintBlue} alt={'Print Icon'} />
                <div className={classes.textPrimary}>Print Scorecard</div>
              </div>
            </Col>
            <Col md={6} xs={12}>
              <div className={classes.formTitle}>2. Schedule Drop Off</div>
              <div className={classes.formDescription}>
                Select a date and time for you to drop off the bike at our warehouse.
              </div>
              <div className={cx(classes.wrapAction, classes.mobileMb0)} onClick={handleOpenBackDrop}>
                <img src={images.icCalendarBlue} alt={'Select Dates'} />
                <div className={classes.textPrimary}>
                  {dateDrop && timeDrop
                    ? `${moment(dateDrop).format('DD MMMM YYYY')} at ${timeDrop}`
                    : 'Choose Date and Time'}
                </div>
              </div>
              {(error?.timeDrop !== '' || error?.dateDrop !== '') && (
                <p className={classes.errorMessage}>Please select your date and time.</p>
              )}
              {visibleBackDropChooseDateAndTime && (
                <InvisibleBackdrop onClick={handleCancelDate}>
                  <div className={classes.wraFormDateTime}>
                    <div className={classes.formDateTime}>
                      <div className={classes.wrapCalendar}>
                        <Calendar
                          onChange={(value: any) => handleChangeForm('dateDrop', value)}
                          value={dateDrop}
                          tileDisabled={({ date }: any) => {
                            return (
                              moment(date).isBefore(moment().startOf('days')) ||
                              HOLIDAYS.indexOf(moment(date).format('M/D/YYYY')) > -1 ||
                              moment(date).isoWeekday() === 6 ||
                              moment(date).isoWeekday() === 7
                            );
                          }}
                        />
                        {error?.dateDrop !== '' && <p className={classes.errorMessage}>{error?.dateDrop}</p>}
                      </div>
                      <hr className={classes.customHrFormDate} />

                      <div className={classes.wrapSelect}>
                        <Row className={classes.width100}>
                          <Col xs={4} className={classes.wrapTime}>
                            <div>Time</div>
                            <span>(GMT-7)</span>
                          </Col>
                          <Col xs={8}>
                            <div className={classes.wrapSelect}>
                              <Select
                                inputId={'select-state'}
                                value={timeDrop}
                                onChange={(value: any) => handleChangeForm('timeDrop', value?.value)}
                                options={selectTimeOptions}
                                className={classes.formSize}
                                name="partner"
                                isSearchable={true}
                                selectStyles={{
                                  control: {
                                    minHeight:
                                      currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                                    border: error?.timeDrop !== '' && '1px solid red',
                                  },
                                }}
                              />
                            </div>
                            {error?.timeDrop !== '' && <p className={classes.errorMessage}>{error?.timeDrop}</p>}
                          </Col>
                        </Row>
                      </div>
                      <div className={classes.wrapFormBottom}>
                        <div className={classes.actionCancel} onClick={handleCancelDate}>
                          Cancel
                        </div>
                        <div className={classes.actionConfirm} onClick={handleConfirmFormDate}>
                          Confirm
                        </div>
                      </div>
                    </div>
                  </div>
                </InvisibleBackdrop>
              )}
            </Col>
          </Row>

          <hr className={classes.customHr} />

          <div className={classes.formDescription}>Please enter your email address incase we need to contact you.</div>
          <Row>
            <Col md={6} xs={12}>
              <Input
                value={dropOffContactEmail}
                className={cx(classes.customButtonSize, error?.dropOffContactEmail !== '' && classes.error)}
                placeholder="Email Address"
                onChange={(e) => handleChangeForm('dropOffContactEmail', e.target.value)}
              />
              {error?.dropOffContactEmail !== '' && (
                <p className={classes.errorMessage}>{error?.dropOffContactEmail}</p>
              )}
            </Col>
          </Row>

          <hr className={classes.customHr} />
        </>
      )}
      <Row>
        <Col md={3} xs={12}>
          <div className={classes.formTitle}>Drop Off Address</div>
        </Col>
        <Col md={3} xs={12}>
          <div className={cx(classes.formDescription, classes.mb0)}>
            Bicycle Blue Book 2240 Paragon Drive San Jose, CA, 951131
          </div>

          <div className={classes.viewMap}>
            <a
              href="https://www.google.com/maps/place/2240+Paragon+Dr,+San+Jose,+CA+95131,+Hoa+K%E1%BB%B3/@37.3888295,-121.9099413,17z/data=!3m1!4b1!4m5!3m4!1s0x808fcbfc291696df:0xb1ce93c242e2074a!8m2!3d37.3888253!4d-121.9077526"
              target="_blank"
              className={classes.textPrimary}>
              View on Map
            </a>
          </div>
        </Col>
        <Col md={6} xs={12}>
          <div className={cx(classes.formDescription, classes.mb0)}>
            Please ensure drop off date and time is confirmed via email by us prior to arriving.
          </div>
        </Col>
      </Row>

      {visibleModalChooseDateAndTime && (
        <Suspense fallback={null}>
          <ModalWithDropOffShowDateAndTime
            isOpen={visibleModalChooseDateAndTime}
            handleConfirmFormDate={handleConfirmFormDate}
            handleCancelDate={handleCancelDate}
            handleChangeForm={handleChangeForm}
            formStepFourSelectFour={formStepFourSelectFour}
          />
        </Suspense>
      )}

      <PrintScoreCard />
    </Card>
  );
};

export default WithDropOff;
