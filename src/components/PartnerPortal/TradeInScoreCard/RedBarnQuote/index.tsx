/* eslint-disable no-nested-ternary */
import Button from '@ui/Buttons/Primary/Button';
import {
  CreateNewRedbarnResponse,
  CreateNewTradeInBody,
  CreateNewTradeInParams,
  createNewTradeInRedbarn,
  createRedBarnSummaryRequest,
  declineRedBarnRequest,
  TradeInDetailDeclineBody,
} from 'api/partner/scorecard.api';
import cx from 'classnames';
import dayjs from 'dayjs';
import { FormikProps } from 'formik';
import { DATA_RESET_CREATE_SCORECARD_QUANTITY, getTradeInPrice } from 'helpers/utilities.helper';
import { toastError } from 'helpers/utils.helper';
import cloneDeep from 'lodash/cloneDeep';
import trim from 'lodash/trim';
import StoreState from 'model/store';
import { GetListTradeInBicycleParams, TradeInSummaryBody } from 'model/store/partner/scorecard.model';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import { ScorecardStatuses } from 'constants/scorecard';
import images from '@images';
import Header from '../TradeInScoreCardComponent/Header';
import { ModalDeclineStepOneFormValue } from '../TradeInScoreCardComponent/Modal/ModalDeclineStepOne';
import Stepper from '../TradeInScoreCardComponent/Stepper/Stepper';
import {
  FormStepOneDefaultValue,
  FormStepOneSubStepThreeDefaultValue,
  FormSummary,
  TradeInScoreCardsProps,
} from './formDefaultValue';
import StepDetail from './Step/StepDetail';
import StepSummary from './Step/StepSummary';
import classes from './trade-in.module.scss';

const RedBarnQuote: React.FC = () => {
  const router = useRouter();
  const { query } = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  const detailScoreCard = useSelector((state: StoreState) => state.partner.scorecard.dataStepSummaryStandardQuote);
  const dataTradeInBicycle = useSelector((store: StoreState) => store.partner.account.dataTradeInBicycle);
  const detailPartnerLocation = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);
  const dataStepDetailStandardQuote = useSelector(
    (state: StoreState) => state.partner.scorecard.dataStepDetailStandardQuote,
  );
  const dataDetailStandardQuote = useSelector((state: StoreState) => state.partner.scorecard.dataDetailStandardQuote);
  const { listDataStepStandardQuote, indexScorecardSelected } = useSelector(
    (state: StoreState) => state.partner.scorecard.createScoreCardQuantityData,
  );
  const isLoading = useSelector((state: StoreState) => state.partner.scorecard.loading);

  const formStepTwoRef = useRef<FormikProps<FormSummary>>();

  const [loadingButton, setLoadingButton] = useState(false);
  const formStepOneStepTwoRef = useRef(null);
  const [subStep, setSubStep] = useState(2);
  const [activeCard, setActiveCard] = useState(1);
  const [status, setStatus] = useState('');
  const [formStepDetails, setFormStepDetails] = useState(FormStepOneDefaultValue);
  const [formStepOneSubStepThree, setFormStepOneSubStepThree] = useState<GetListTradeInBicycleParams>(
    FormStepOneSubStepThreeDefaultValue,
  );

  const [customQuoteId, setCustomQuoteId] = useState('');

  const isCompletedStepTwo = useMemo(() => status === ScorecardStatuses.COMPLETE_RED_BARN, [status]);

  const step = useMemo(() => {
    return Number(query?.step) || 1;
  }, [query]);

  const hideBackStepSummary = useMemo(() => {
    const bicycleBrandId = detailScoreCard?.bicycleBaseInfo?.bicycleBrandId;
    const bicycleModelId = detailScoreCard?.bicycleBaseInfo?.bicycleModelId;
    if (query?.id && step === 2 && (!bicycleBrandId || !bicycleModelId)) {
      return true;
    }
    return false;
  }, [detailScoreCard, query, step]);

  const handleGetDefaultStepSummary = useCallback(
    async (id: string | string[]) => {
      if (id) {
        dispatch(scoreCardAction.getStepSummaryRedBarnQuote(`${id}`));
      }
    },
    [dispatch],
  );

  const handleGetDefaultStepDetails = useCallback(async () => {
    if (dataStepDetailStandardQuote) {
      setFormStepDetails({
        brand: `${dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleBrandId}`,
        familyName: dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleProductFamily
          ? `${dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleProductFamily}`
          : 'Allant',
        frameSize:
          dataStepDetailStandardQuote?.redBarnComponents?.length > 0 &&
          dataStepDetailStandardQuote.redBarnComponents.filter(
            (item) => item.redBarnCompDetailId.inventoryCompTypeId === 178,
          ).length > 0
            ? dataStepDetailStandardQuote.redBarnComponents.filter(
                (item) => item.redBarnCompDetailId.inventoryCompTypeId === 178,
              )[0].value
            : '',
        upgradeCompIds: dataStepDetailStandardQuote?.upgradeComps?.length
          ? dataStepDetailStandardQuote?.upgradeComps?.map((it) => {
              return {
                key: it.name,
                value: it.id,
              };
            })
          : [],
        condition: dataStepDetailStandardQuote?.condition,
        tradeInValue: dataStepDetailStandardQuote?.tradeValue,
      });
      setFormStepOneSubStepThree({
        brandId: `${dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleBrandId}`,
        chargerIncluded: null,
        ebikeSubtypeId: -1,
        hasKey: null,
        modelId: `${dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleModelId}`,
        yearId: dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleYearId,
        bicycleId: dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleId,
      });

      if (query?.step && query?.subStep) {
        return setSubStep(2);
      }
      if (
        !dataStepDetailStandardQuote ||
        !dataStepDetailStandardQuote?.condition ||
        !dataStepDetailStandardQuote?.redBarnComponents ||
        dataStepDetailStandardQuote?.redBarnComponents?.length === 0
      ) {
        return setSubStep(5);
      }
      if (step) {
        setSubStep(6);
      }
    }
  }, [dataStepDetailStandardQuote, query, step]);

  const gotoStep = useCallback(
    (stepNumber: number, subStepNumber?: number | string) => {
      let _query: any = {
        step: stepNumber,
      };
      if (router.query.isView) {
        Object.assign(_query, { isView: router.query.isView });
      }
      if (subStepNumber) {
        _query = {
          ..._query,
          subStep: subStepNumber,
        };
      }
      router.push({
        pathname: `/trade-in-account/trade-in/red-barn-quote/${query?.id}`,
        query: _query,
      });
    },
    [query, router],
  );

  const handleChangeStep = useCallback(
    (index: number) => {
      if (index === 0) {
        gotoStep(index + 1, 2);
        setSubStep(2);
        return;
      }
      gotoStep(index + 1);
    },
    [gotoStep],
  );

  const handleCheckCompleteStep = useCallback(async () => {
    dispatch(scoreCardAction.getDetailRedBarnQuote(`${query?.id}`));
  }, [dispatch, query]);

  useEffect(() => {
    if (dataDetailStandardQuote) {
      setStatus(dataDetailStandardQuote.status);
      if (dataDetailStandardQuote.redBarnCustomQuotesId) {
        setCustomQuoteId(dataDetailStandardQuote.redBarnCustomQuotesId);
      }
    }
  }, [dataDetailStandardQuote]);

  useEffect(() => {
    if (query?.id) {
      handleCheckCompleteStep();
      switch (step) {
        case 1: {
          handleGetDefaultStepDetails();
          break;
        }
        case 2: {
          // handleDataBarcodeScoreCard();
          handleGetDefaultStepSummary(query?.id);
          break;
        }

        default:
          handleGetDefaultStepDetails();
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query, step]);

  useEffect(() => {
    if (userInfo) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
    }
  }, [dispatch, userInfo]);

  const disabledStepperStepDetailsOfCustomQuoteApproved = useMemo(() => !!customQuoteId, [customQuoteId]);

  const isDisabledStepOne = useMemo(() => {
    if (query.id) {
      return true;
    }
    if (
      listDataStepStandardQuote[indexScorecardSelected]?.indexStepComplete >= 1 ||
      listDataStepStandardQuote[indexScorecardSelected]?.isDecline
    ) {
      return true;
    }
    return false;
  }, [indexScorecardSelected, listDataStepStandardQuote, query.id]);

  const onChangeForm = useCallback(
    (values: TradeInScoreCardsProps) => {
      setFormStepDetails({
        ...formStepDetails,
        ...values,
      });
    },
    [formStepDetails],
  );

  const gotoStandardQuote = useCallback(() => {
    router.push({
      pathname: `/trade-in-account/trade-in/new`,
    });
  }, [router]);

  const handleBackPreviousStep = useCallback(() => {
    gotoStep(step - 1);
  }, [gotoStep, step]);

  const onRestart = useCallback(() => {
    if (query?.id && step !== 1) {
      gotoStep(1);
    }
    setSubStep(2);
    setActiveCard(1);
    setFormStepDetails({
      brand: '',
      familyName: '',
      frameSize: '',
      upgradeCompIds: [],
      condition: '',
      tradeInValue: undefined,
    });
    setFormStepOneSubStepThree({
      brandId: '',
      chargerIncluded: null,
      ebikeSubtypeId: -1,
      hasKey: null,
      modelId: '',
      yearId: '',
      bicycleId: '',
    });
    dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
    setTimeout(() => {
      gotoStandardQuote();
    }, 0);
  }, [dispatch, gotoStandardQuote, gotoStep, query, step]);

  const handleSubmitStepOneSubStepTwo = useCallback(async () => {
    // setSubStep(3);
  }, []);

  const handleSetSubStepList = useCallback(
    (numbSubStep: number) => {
      dispatch(scoreCardAction.setSubStepScoreCard(numbSubStep));
    },
    [dispatch],
  );

  const handleContinues = useCallback(async () => {
    setLoadingButton(true);
    if (step === 1) {
      switch (subStep) {
        case 2: {
          formStepOneStepTwoRef?.current && formStepOneStepTwoRef.current.handleSubmit();
          setLoadingButton(false);

          if (!formStepDetails.familyName || formStepDetails.familyName === '') {
            handleSetSubStepList(2.5);
            setSubStep(2.5);
            return;
          }
          handleSetSubStepList(3);
          setSubStep(3);
          break;
        }
        case 2.5: {
          handleSetSubStepList(3);
          setSubStep(3);
          break;
        }
        case 3: {
          handleSetSubStepList(4);
          setSubStep(4);
          break;
        }
        case 4: {
          handleSetSubStepList(5);
          setSubStep(5);
          break;
        }
        case 5: {
          handleSetSubStepList(6);
          setSubStep(6);
          break;
        }
        case 6: {
          gotoStep(2);
          break;
        }
        default:
          break;
      }
    }
    if (step === 2) {
      formStepTwoRef.current.handleSubmit();
    }

    setTimeout(() => {
      setLoadingButton(false);
    }, 0);
  }, [step, subStep, formStepDetails, handleSetSubStepList, gotoStep]);

  const getWheelsOrDrivetrain = useCallback(
    (name: string) => {
      if (
        formStepDetails?.upgradeCompIds &&
        Array.isArray(formStepDetails?.upgradeCompIds) &&
        formStepDetails?.upgradeCompIds.length &&
        dataTradeInBicycle?.upgradeComps?.length
      ) {
        const upgradeCompIds: any = formStepDetails?.upgradeCompIds || [];
        const selectedUpgradeCompIds = upgradeCompIds.find((it: any) => it.key === name);
        const nameConvert = dataTradeInBicycle?.upgradeComps.find((it) => it.id === selectedUpgradeCompIds?.value);
        return nameConvert?.up === true ? 'up' : nameConvert?.up === false ? 'down' : '';
      }
      return '';
    },
    [dataTradeInBicycle, formStepDetails],
  );

  const scoreCardSetting = useMemo(() => {
    return detailPartnerLocation?.is_enable_adjustment ? detailPartnerLocation?.score_card : null;
  }, [detailPartnerLocation]);

  const tradeInValue = useMemo(() => {
    if (formStepDetails && dataTradeInBicycle) {
      const msrp = dataTradeInBicycle.msrp || 0;
      const condition: { tradeInValue: number } = dataTradeInBicycle.conditions.find(
        (item: any) => item.condition === formStepDetails?.condition,
      );

      const Wheels = getWheelsOrDrivetrain('Wheels');
      const Drivetrain = getWheelsOrDrivetrain('Drivetrain');

      return getTradeInPrice(
        condition?.tradeInValue ? Number(condition.tradeInValue) : 0,
        Wheels,
        Drivetrain,
        null,
        msrp,
        scoreCardSetting ? -(scoreCardSetting?.shipping + scoreCardSetting?.handling) : 0,
      );
    }
    return 0;
  }, [dataTradeInBicycle, formStepDetails, getWheelsOrDrivetrain, scoreCardSetting]);

  const handleListCreateScorecardQuantity = useCallback(
    (response: CreateNewRedbarnResponse, type: string) => {
      const cloneArr = cloneDeep(listDataStepStandardQuote);
      if (type === 'accepted') {
        cloneArr[indexScorecardSelected] = {
          ...cloneArr[indexScorecardSelected],
          indexStepComplete: 1,
          id: response?.id,
          step: 2,
        };
      } else if (type === 'decline') {
        cloneArr[indexScorecardSelected] = {
          ...cloneArr[indexScorecardSelected],
          isDecline: true,
          id: response?.id,
        };
      }
      if (type === 'decline') {
        // find uncreate
        const findIndex = cloneArr.findIndex(
          (it, index) =>
            !it.isDecline && (!it.indexStepComplete || it.indexStepComplete < 1) && index !== indexScorecardSelected,
        );
        if (findIndex !== -1) {
          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              listDataStepStandardQuote: cloneArr,
              indexScorecardSelected: findIndex,
            }),
          );
          router.push({
            pathname: `/trade-in-account/trade-in/red-barn-quote`,
          });
          return;
        }

        // find complete
        const findIndexComplele = cloneArr.findIndex(
          (it, index) => it.indexStepComplete === 1 && index !== indexScorecardSelected,
        );
        if (findIndexComplele !== -1) {
          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              listDataStepStandardQuote: cloneArr,
              indexScorecardSelected: findIndexComplele,
            }),
          );
          return router.push({
            pathname: `/trade-in-account/trade-in/red-barn-quote/${cloneArr[findIndexComplele]?.id}`,
            query: {
              step: listDataStepStandardQuote[findIndexComplele]?.step,
            },
          });
        }
        dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
        // setSubStep(1);
        return router.push({
          pathname: `/trade-in-account/trade-in/new`,
        });
      }
      dispatch(
        scoreCardAction.setCreateScorecardQuantity({
          listDataStepStandardQuote: cloneArr,
        }),
      );
      router.push({
        pathname: `/trade-in-account/trade-in/red-barn-quote/${response?.id}`,
        query: {
          step: 2,
        },
      });
    },
    [dispatch, indexScorecardSelected, listDataStepStandardQuote, router],
  );

  const handleSubmitStandardQuoteStepOneNextToStepTwo = useCallback(
    async (isInstantPayouts: boolean, action?: string) => {
      try {
        setLoadingButton(true);
        const params: CreateNewTradeInParams = { isInstantPayout: isInstantPayouts };

        const payload: CreateNewTradeInBody = {
          bicycleId: formStepOneSubStepThree.bicycleId,
          chargerIncluded: false,
          clean: null,
          compRequests: [{ compId: '178', value: formStepDetails.frameSize }],
          condition: formStepDetails.condition,
          hasDiagnosticReport: false,
          hasKey: false,
          isTamperedWith: false,
          upgradeCompIds: formStepDetails?.upgradeCompIds?.length
            ? formStepDetails?.upgradeCompIds?.filter((it: any) => !!it.value).map((it: any) => it.value)
            : [],
          value: Number(tradeInValue) || 0,
        };

        const response: CreateNewRedbarnResponse = await createNewTradeInRedbarn(payload, params);

        switch (action) {
          case 'noAction': {
            break;
          }
          default:
            handleListCreateScorecardQuantity(response, 'accepted');
        }
        setLoadingButton(false);
        return response;
      } catch (error) {
        toastError(error);
        setLoadingButton(false);
      }
    },
    [formStepDetails, formStepOneSubStepThree.bicycleId, handleListCreateScorecardQuantity, tradeInValue],
  );

  const handleSubmitStepSummary = useCallback(
    async (isSave: boolean, formSummary?: FormSummary) => {
      const values = formSummary || formStepTwoRef?.current?.values;
      if ((!formSummary && trim(values.firstName) === '') || trim(values.lastName) === '') {
        toastError('First Name, Last Name are required.');
        return false;
      }
      const payload: TradeInSummaryBody = {
        employeeEmail: trim(values.employeeEmail),
        employeeLocation: trim(values.employeeLocation),
        employeeName: trim(values.employeeName),
        id: `${query?.id}`,
        owner: {
          address: trim(values.address),
          city: trim(values.city),
          email: trim(values.email),
          firstName: trim(values.firstName),
          lastName: trim(values.lastName),
          licenseOrPassport: trim(values.licenseOrPassport),
          name: `${trim(values.firstName)} ${trim(values.lastName)}`,
          paypalEmail: trim(values.paypalEmail),
          phone: values.phone,
          serial: trim(values.serial),
          state: trim(values.state),
          zipCode: trim(values.zipCode),
        },
        proof: {
          date: dayjs(values.proofDate).format('YYYY-MM-DDTHH:mm:ss.SSS'),
          name: trim(values.proofName),
        },
        save: true,
      };
      try {
        setLoadingButton(true);
        await createRedBarnSummaryRequest(payload);

        let cloneArr = cloneDeep(listDataStepStandardQuote);
        // find isDefaultFillDataStepSummary
        const findFillData = listDataStepStandardQuote.find((it) => it.dataStepSummary);
        if (findFillData) {
          // if change value of isDefaultFillDataStepSummary
          if (cloneArr[indexScorecardSelected]?.isDefaultFillDataStepSummary) {
            cloneArr = cloneArr.map((it) => {
              return {
                ...it,
                dataStepSummary: values,
              };
            });
          } else {
            cloneArr[indexScorecardSelected] = {
              ...cloneArr[indexScorecardSelected],
              dataStepSummary: values,
            };
          }
        } else {
          cloneArr[indexScorecardSelected] = {
            ...cloneArr[indexScorecardSelected],
            isDefaultFillDataStepSummary: true,
          };
          cloneArr = cloneArr.map((it) => {
            return {
              ...it,
              dataStepSummary: values,
            };
          });
        }
        cloneArr[indexScorecardSelected] = {
          ...cloneArr[indexScorecardSelected],
          indexStepComplete: 2,
        };
        setLoadingButton(false);
        // find uncreate
        const findIndex = cloneArr.findIndex(
          (it, index) =>
            !it.isDecline && (!it.indexStepComplete || it.indexStepComplete < 1) && index !== indexScorecardSelected,
        );
        if (findIndex !== -1) {
          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              listDataStepStandardQuote: cloneArr,
              indexScorecardSelected: findIndex,
            }),
          );
          router.push({
            pathname: `/trade-in-account/trade-in/red-barn-quote`,
          });
          return false;
        }

        // find complete
        const findIndexComplele = cloneArr.findIndex(
          (it, index) => it.indexStepComplete === 1 && index !== indexScorecardSelected,
        );
        if (findIndexComplele !== -1) {
          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              listDataStepStandardQuote: cloneArr,
              indexScorecardSelected: findIndexComplele,
            }),
          );
          router.push({
            pathname: `/trade-in-account/trade-in/red-barn-quote/${cloneArr[findIndexComplele]?.id}`,
            query: {
              step: listDataStepStandardQuote[findIndexComplele]?.step,
            },
          });
          return false;
        }

        dispatch(
          scoreCardAction.setCreateScorecardQuantity({
            listDataStepStandardQuote: cloneArr,
          }),
        );

        query.id && (await handleCheckCompleteStep());
        return true;
      } catch (error) {
        setLoadingButton(false);
        toastError(error);
        return false;
      }
    },
    [dispatch, handleCheckCompleteStep, indexScorecardSelected, listDataStepStandardQuote, query, router],
  );

  const handleDeclineStepOne = useCallback(
    async (values: ModalDeclineStepOneFormValue) => {
      try {
        const response: CreateNewRedbarnResponse = await handleSubmitStandardQuoteStepOneNextToStepTwo(
          false,
          'noAction',
        );
        let payload: TradeInDetailDeclineBody = {
          comment: values?.comment,
          reasonDeclineId: values?.reasonDeclineId,
        };
        if (values?.reasonDeclineId === '3') {
          payload = {
            ...payload,
            priceExpected: values?.priceExpected,
          };
        }
        await declineRedBarnRequest(String(response?.id), payload);
        if (listDataStepStandardQuote?.length > 1) {
          handleListCreateScorecardQuantity(response, 'decline');
          return;
        }
        return onRestart();
      } catch (error) {
        toastError(error);
      }
    },
    [
      handleListCreateScorecardQuantity,
      handleSubmitStandardQuoteStepOneNextToStepTwo,
      listDataStepStandardQuote,
      onRestart,
    ],
  );

  const gotoCustomQuote = useCallback(() => {
    router.push({
      pathname: `/trade-in-account/trade-in/custom-quote`,
    });
  }, [router]);

  const renderForm = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <StepDetail
            form={formStepDetails}
            subStep={subStep}
            activeCard={activeCard}
            formStepOneStepTwoRef={formStepOneStepTwoRef}
            formStepOneSubStepThree={formStepOneSubStepThree}
            onChangeForm={onChangeForm}
            setActiveCard={setActiveCard}
            handleSubmitStepOneSubStepTwo={handleSubmitStepOneSubStepTwo}
            setFormStepOneSubStepThree={setFormStepOneSubStepThree}
            handleSubmitStandardQuoteStepOneNextToStepTwo={handleSubmitStandardQuoteStepOneNextToStepTwo}
            handleDeclineStepOne={handleDeclineStepOne}
            isCompleted={isDisabledStepOne}
            gotoCustomQuote={gotoCustomQuote}
            handleCountinues={handleContinues}
            setSubStep={setSubStep}
            statusHistoryQuote={''}
          />
        );

      case 2:
        return (
          <StepSummary
            handleSubmitStepSummary={handleSubmitStepSummary}
            handleBackPreviousStep={handleBackPreviousStep}
            isCompleted={isCompletedStepTwo}
            statusHistoryQuote={''}
            formStepTwoRef={formStepTwoRef}
            hideBackStepSummary={hideBackStepSummary}
            hideNextBackStatusDeclined={true}
          />
        );

      default:
        return null;
    }
  }, [
    step,
    formStepDetails,
    subStep,
    activeCard,
    formStepOneSubStepThree,
    onChangeForm,
    handleSubmitStepOneSubStepTwo,
    handleSubmitStandardQuoteStepOneNextToStepTwo,
    handleDeclineStepOne,
    isDisabledStepOne,
    gotoCustomQuote,
    handleContinues,
    handleSubmitStepSummary,
    handleBackPreviousStep,
    isCompletedStepTwo,
    hideBackStepSummary,
  ]);

  const handleBackScreen = useCallback(() => {
    if (step === 1 && subStep === 2) {
      gotoStandardQuote();
      return;
    }
    if (step === 1 && subStep === 2.5) {
      handleSetSubStepList(2);
      setSubStep(2);
      return;
    }
    if (step === 1 && subStep === 5) {
      handleSetSubStepList(subStep - 1);
      setSubStep(subStep - 1);
      return;
    }
    if (step === 1) {
      handleSetSubStepList(subStep - 1);
      setSubStep(subStep - 1);
      return;
    }
    gotoStep(Number(query?.step) - 1);
  }, [step, subStep, gotoStep, query, gotoStandardQuote, handleSetSubStepList]);

  const printScoreCard = useCallback(async () => {
    const target = document.getElementById('button-print-redbarn-step-summary');
    if (target) {
      target.click();
    }
  }, []);
  const isShowButtonNextStepContinues = useMemo(() => {
    if (step === 1 && subStep === 6 && !isDisabledStepOne) {
      return false;
    }
    if (step === 1 && subStep === 6 && status === ScorecardStatuses.DECLINED_RED_BARN) {
      return false;
    }
    if (step === 2 && isCompletedStepTwo) return false;
    return true;
  }, [isCompletedStepTwo, isDisabledStepOne, status, step, subStep]);

  const checkDisabledButtonContinues = useMemo(() => {
    return (
      (subStep === 3 && formStepOneSubStepThree.brandId === '') ||
      (step === 1 && subStep === 5 && (formStepDetails.frameSize === '' || formStepDetails.condition === '')) ||
      (subStep === 3 && formStepOneSubStepThree.bicycleId === '') ||
      (subStep === 2.5 && step === 1 && (!formStepDetails.familyName || formStepDetails.familyName === ''))
    );
  }, [
    formStepDetails.condition,
    formStepDetails.familyName,
    formStepDetails.frameSize,
    formStepOneSubStepThree.bicycleId,
    formStepOneSubStepThree.brandId,
    step,
    subStep,
  ]);

  const checkDisabledButtonContinuesStepTwo = useMemo(() => {
    return step === 1 && subStep === 2 && formStepDetails.brand === '';
  }, [formStepDetails.brand, step, subStep]);

  const renderButtonSession = useMemo(() => {
    const disableBtn =
      checkDisabledButtonContinues || loadingButton || checkDisabledButtonContinuesStepTwo || isLoading;

    return (
      <>
        <div className={cx(classes.wrapButton, classes.wrapButtonfixed)}>
          {step === 2 && (
            <Button
              onClick={printScoreCard}
              className={cx(classes.btnPrintReport, classes.customButtonSize)}
              buttonType="outline">
              <div>
                <img src={images.account.order.icPrintGrey} alt={'Print Icon'} className="mr-2" />
                <span>Print Scorecard</span>
              </div>
            </Button>
          )}
          <div className="ml-auto d-flex">
            {!!customQuoteId || (step === 1 && subStep === 2) ? null : (
              <Button
                buttonType="outline"
                onClick={handleBackScreen}
                className={cx(classes.btnBack, classes.customButtonSize)}>
                <img src={images.messages.icArrowLeftGrey} alt="icon_next" className="mr-4" />
                Back
              </Button>
            )}
            {isShowButtonNextStepContinues ? (
              <Button
                disabled={disableBtn}
                className={classes.customButtonSize}
                onClick={() => !disableBtn && handleContinues()}>
                {step === 2 ? 'Submit' : 'Continue'}
                {step !== 2 && <img src={images.iconNextWhite} alt="icon_next" className="ml-4" />}
              </Button>
            ) : null}
          </div>
        </div>

        <div className={classes.wrapButtonSupportFixed} />
      </>
    );
  }, [
    checkDisabledButtonContinues,
    checkDisabledButtonContinuesStepTwo,
    customQuoteId,
    handleBackScreen,
    handleContinues,
    isLoading,
    isShowButtonNextStepContinues,
    loadingButton,
    printScoreCard,
    step,
    subStep,
  ]);

  const hideRestart = useMemo(() => {
    return isCompletedStepTwo || isDisabledStepOne;
  }, [isCompletedStepTwo, isDisabledStepOne]);

  return (
    <div className={cx(classes.tradeInLayout, classes.container)}>
      <Head>
        <title>New Trade In Scorecard</title>
      </Head>
      <Header
        hideSave
        hideRestart={hideRestart}
        onRestart={onRestart}
        onSave={() => {}}
        visibleSaveStep={false}
        loadingButton={loadingButton}
        isCompleted={isCompletedStepTwo}
        setFormStepDetails={setFormStepDetails}
        setSubStep={setSubStep}
        setFormStepOneSelectImage={setFormStepOneSubStepThree}
      />
      <div className={classes.tradeInContent}>
        <div className={classes.container}>
          <Stepper
            total={2}
            active={step}
            subActive={subStep}
            showComplete={true}
            stepList={['Details', 'Summary']}
            deactiveStepOne={true}
            handleChangeStep={handleChangeStep}
            isCompleted={true}
            completedStep={isCompletedStepTwo ? 2 : query?.id ? 1 : 0}
            numberActiveStep={Number(query?.step)}
            disabledStepperStepDetailsOfCustomQuoteApproved={disabledStepperStepDetailsOfCustomQuoteApproved}
          />
          <section className={classes.formRequestSection}>{renderForm}</section>
          <div className={classes.wrapButton}>{renderButtonSession}</div>
        </div>
      </div>

      {/* <PrintScoreCardRedBarn /> */}
    </div>
  );
};

export default RedBarnQuote;
