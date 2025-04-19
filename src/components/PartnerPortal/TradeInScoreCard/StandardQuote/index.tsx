/* eslint-disable import/no-duplicates */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-new-wrappers */
/* eslint-disable import/no-cycle */
import Button from '@ui/Buttons/Primary/Button';
import { addTradeInDropOffRequest, getListTradeInBicycleRequest } from 'api/partner/account.api';
import {
  CalculateShippingRequest,
  checkCustomerExistRequest,
  checkTradeInCompleteStepRequest,
  CheckTradeInCompleteStepResponse,
  completeShippingShippingSelectOneRequest,
  completeShippingShippingSelectThreeRequest,
  CompleteShippingShippingSelectThreeRequest,
  completeShippingShippingSelectTwoRequest,
  CompleteShippingShippingSelectTwoRequest,
  createCustomerRequest,
  createNewTradeIn,
  CreateNewTradeInBody,
  CreateNewTradeInParams,
  CreateNewTradeInResponse,
  createTradeInSummaryRequest,
  deleteTradeInImageRequest,
  getStepSummaryStandardQuoteRequest,
  getTradeInByIdRequestStepImage,
  saveAsQuote,
  saveShippingShippingSelectThreeRequest,
  tradeInDetailDecline,
  TradeInDetailDeclineBody,
  updateNewTradeIn,
  updateTradeInImageRequest,
} from 'api/partner/scorecard.api';
import cx from 'classnames';
import { V3_TOKEN_KEY } from 'constants/common';
import { FormikProps } from 'formik';
import {
  DATA_RESET_CREATE_SCORECARD_QUANTITY,
  emailValidate,
  getTradeInPrice,
  parseJwt,
  printContent,
  TREK_PARTNER_PARENT_ID,
} from 'helpers/utilities.helper';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import CookieBrowser from 'js-cookie';
import cloneDeep from 'lodash/cloneDeep';
import isNil from 'lodash/isNil';
import pick from 'lodash/pick';
import trim from 'lodash/trim';
import { ImageUpload } from 'model/api/account/personal/listings.model';
import StoreState from 'model/store';
import {
  CheckCustomerExistResponse,
  GetListTradeInBicycleParams,
  GetStepDetailStandardQuoteResponse,
  GetTradeInByIdResponseStepThreeResponse,
  TradeInSummaryBody,
} from 'model/store/partner/scorecard.model';
import dayjs from 'dayjs';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { statusToTextHistoryQuotes } from 'components/PartnerPortal/CostCalculator/constraint';
import React, { FC, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPartnerLocationDetail } from 'store/partner/account/account.action';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import { ScorecardStatuses } from 'constants/scorecard';
import PrintScoreCard from 'components/PartnerPortal/TradeInScoreCard/TradeInScoreCardComponent/PrintScoreCard';
import t from 'helpers/language';
import images from '@images';
import Header from '../TradeInScoreCardComponent/Header';
import { ModalDeclineStepOneFormValue } from '../TradeInScoreCardComponent/Modal/ModalDeclineStepOne';
import ModalSubmitStepThree from '../TradeInScoreCardComponent/Modal/ModalSubmitStepThree';
import Stepper from '../TradeInScoreCardComponent/Stepper/Stepper';
import {
  FormStepFourSelectThree,
  FormStepFourSelectThreeDefaultValue,
  FormStepOneDefaultValue,
  FormStepOneSubStepThreeDefaultValue,
  FormSummary,
  SaveAsQuoteData,
  TradeInScoreCardsProps,
} from './formDefaultValue';
import StepComplete from './Step/StepComplete';
import StepDetail from './Step/StepDetail';
import StepImages from './Step/StepImages';
import StepShipping from './Step/StepShipping';
import { FormStepFourSelectOne } from './Step/StepShipping/WithBicycleBlueBook';
import { FormStepFourSelectTwo } from './Step/StepShipping/WithMyAccount';
import StepSummary from './Step/StepSummary';
import ModalSuccessSaveAsQuote from './ModalSaveAsQuote/modalSuccessSaveAsQuote';
import classes from './trade-in.module.scss';

const PopupNotEligibleModel = React.lazy(() =>
  import('components/ValueGuide/Product/PopupNotEligibleModel/PopupNotEligibleModel'),
);

const StandardQuote: FC = () => {
  const router = useRouter();
  const { query, pathname } = useRouter();

  const dispatch = useDispatch();
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  const detailScoreCard = useSelector((state: StoreState) => state.partner.scorecard.dataStepSummaryStandardQuote);
  const dataTradeInBicycle = useSelector((store: StoreState) => store.partner.account.dataTradeInBicycle);
  const detailPartnerLocation = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);
  const dataStepDetailStandardQuote = useSelector(
    (state: StoreState) => state.partner.scorecard.dataStepDetailStandardQuote,
  );

  const formStepForSelectOneRef = useRef<FormikProps<FormStepFourSelectOne>>();
  const formStepForSelectTwoRef = useRef<FormikProps<FormStepFourSelectTwo>>();
  const formStepTwoRef = useRef<FormikProps<FormSummary>>();

  const [loadingButton, setLoadingButton] = useState(false);
  const formStepOneStepTwoRef = useRef(null);
  const [subStep, setSubStep] = useState(1);
  const [activeCard, setActiveCard] = useState(1);
  const [activeShip, setActiveShip] = useState(1);
  const [formStepFourSelectFour, setFormStepFourSelectFour] = useState<FormStepFourSelectThree>(
    FormStepFourSelectThreeDefaultValue,
  );
  const [formStepDetails, setFormStepDetails] = useState(FormStepOneDefaultValue);
  const [formStepOneSubStepThree, setFormStepOneSubStepThree] = useState<GetListTradeInBicycleParams>(
    FormStepOneSubStepThreeDefaultValue,
  );
  const [formStepThree, setFormStepThree] = useState<GetTradeInByIdResponseStepThreeResponse>(null);
  const [oldImageStepThree, setOldImageStepThree] = useState<any[]>([]);
  const [completedStep, setCompletedStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isDisabledStepByStatusQuote, setIsDisabledStepByStatusQuote] = useState(false);
  const [statusHistoryQuote, setStatusHistoryQuote] = useState<string>('');
  const [visibleModalSubmitStepThree, setVisibleModalSubmitStepThree] = useState<boolean>(false);
  const [dataModalStepFiveTradeInCredit, setdataModalStepFiveTradeInCredit] = useState(null);
  const [hideNextBackStatusDeclined, setHideNextBackStatusDeclined] = useState<boolean>(false);
  const [isOpenModalSuccessSaveAsQuote, setIsOpenModalSuccessSaveAsQuote] = useState<boolean>(false);
  const [isMappingParams, setIsMappingParams] = useState<boolean>(false);
  const { createScorecardQuantity, listDataStepStandardQuote, indexScorecardSelected } = useSelector(
    (state: StoreState) => state.partner.scorecard.createScoreCardQuantityData,
  );
  const [popupNotEligible, setPopupEligible] = useState(null);
  const loadingBarcode = useSelector((state: StoreState) => state.partner.scorecard.loadingBarcode);

  const checkUncreateScorecard = useMemo(() => {
    const findUncreateScorecard = listDataStepStandardQuote.find(
      (it) => !it.isDecline && (!it.indexStepComplete || it.indexStepComplete < 1),
    );
    return !!findUncreateScorecard;
  }, [listDataStepStandardQuote]);

  const step = useMemo(() => {
    return Number(query?.step) || 1;
  }, [query]);

  const visibleSaveStep = useMemo(() => {
    return step > 1 || (step === 1 && (subStep > 6 || (subStep === 6 && formStepDetails.condition !== '')));
  }, [formStepDetails.condition, step, subStep]);

  const isBBBRack = useMemo(() => {
    const info: { is_bbb_rack: boolean } = parseJwt(CookieBrowser.get(V3_TOKEN_KEY));
    return info?.is_bbb_rack;
  }, []);

  const hideBackStepSummary = useMemo(() => {
    const bicycleBrandId = detailScoreCard?.bicycleBaseInfo?.bicycleBrandId;
    const bicycleModelId = detailScoreCard?.bicycleBaseInfo?.bicycleModelId;
    if (query?.id && step === 2 && (!bicycleBrandId || !bicycleModelId)) {
      return true;
    }
    return false;
  }, [detailScoreCard, query, step]);

  const handleGetDefaultBBBRack = useCallback(
    async (id: string | string[]) => {
      try {
        let responseStepTwo: GetStepDetailStandardQuoteResponse;
        let email: string = '';
        let firstName: string = '';
        let lastName: string = '';
        let city: string = '';
        let address: string = '';
        let state: string = '';
        let zip_code: string = '';
        let phone: string = '';
        let bicycleYearName: string;
        let bicycleBrandName: string;
        let bicycleModelName: string;
        let tradeValue;
        let checkIsInstantPayout: boolean;

        if (!detailScoreCard) {
          responseStepTwo = await getStepSummaryStandardQuoteRequest(`${id}`);
          email = responseStepTwo?.owner?.email || '';
          firstName = responseStepTwo?.owner?.firstName || '';
          lastName = responseStepTwo?.owner?.lastName || '';
          city = responseStepTwo?.owner?.city || '';
          address = responseStepTwo?.owner?.address || '';
          state = responseStepTwo?.owner?.state || '';
          zip_code = responseStepTwo?.owner?.zipCode || '';
          phone = responseStepTwo?.owner?.phone || '';
          bicycleYearName = responseStepTwo?.bicycleBaseInfo?.bicycleYearName;
          bicycleBrandName = responseStepTwo?.bicycleBaseInfo?.bicycleBrandName;
          bicycleModelName = responseStepTwo?.bicycleBaseInfo?.bicycleModelName;
          tradeValue = responseStepTwo?.tradeValue;
          checkIsInstantPayout = responseStepTwo?.isInstantPayout;
        } else {
          email = detailScoreCard?.owner?.email;
          firstName = detailScoreCard?.owner?.firstName;
          lastName = detailScoreCard?.owner?.lastName;
          city = detailScoreCard?.owner?.city;
          address = detailScoreCard?.owner?.address;
          state = detailScoreCard?.owner?.state;
          zip_code = detailScoreCard?.owner?.zipCode;
          phone = detailScoreCard?.owner?.phone || '';
          bicycleYearName = detailScoreCard?.bicycleBaseInfo?.bicycleYearName || '';
          bicycleBrandName = detailScoreCard?.bicycleBaseInfo?.bicycleBrandName || '';
          bicycleModelName = detailScoreCard?.bicycleBaseInfo?.bicycleModelName || '';
          tradeValue = detailScoreCard?.tradeValue;
          checkIsInstantPayout = detailScoreCard?.isInstantPayout;
        }

        const responseCustomerExist: CheckCustomerExistResponse = await checkCustomerExistRequest(email);
        const isCustomerExists = responseCustomerExist.is_exists;
        let data: any = pick(responseCustomerExist.data, [
          '_id',
          'first_name',
          'last_name',
          'email',
          'city',
          'address',
          'state',
          'zip_code',
          'phone',
        ]);
        if (!isNil(isCustomerExists) && email !== '' && tradeValue && !checkIsInstantPayout) {
          if (!isCustomerExists) {
            const customer = await createCustomerRequest({
              first_name: firstName,
              last_name: lastName,
              email,
              city,
              address,
              state,
              zip_code,
              phone,
            });
            data = pick(customer, [
              '_id',
              'first_name',
              'last_name',
              'email',
              'city',
              'address',
              'state',
              'zip_code',
              'phone',
            ]);
          }
          setdataModalStepFiveTradeInCredit({
            visibleModal: true,
            value: tradeValue,
            data,
            isExists: isCustomerExists,
            bicycleInfo: {
              bicycleYearName,
              bicycleBrandName,
              bicycleModelName,
            },
          });
        }
      } catch (error) {
        toastError(error);
      }
    },
    [detailScoreCard],
  );

  const handleGetDefaultStepFour = useCallback(
    async (id: string | string[]) => {
      dispatch(scoreCardAction.getStepShippingAndCompleteStandardQuote(id));
    },
    [dispatch],
  );

  const handleGetDefaultStepFive = useCallback(
    async (id: string | string[]) => {
      dispatch(scoreCardAction.getStepShippingAndCompleteStandardQuote(id));
      dispatch(scoreCardAction.getStepSummaryStandardQuote(id));
    },
    [dispatch],
  );

  const handleGetDefaultStepThree = useCallback(async (id: string | string[]) => {
    try {
      const dataImage: GetTradeInByIdResponseStepThreeResponse = await getTradeInByIdRequestStepImage({
        id: `${id}`,
        indexStep: 2,
      });

      const listImages = dataImage?.tradeInImages || [];
      setOldImageStepThree([...listImages]);
      setFormStepThree({
        ...dataImage,
        tradeInImages: [...listImages]?.map((it: ImageUpload) => {
          return {
            ...it,
            id: `${it?.imageId}`,
            url: it?.fullLink,
          };
        }),
      });
    } catch (error) {
      toastError(error);
    }
  }, []);

  const handleGetDefaultStepSummary = useCallback(
    async (id: string | string[]) => {
      dispatch(scoreCardAction.getStepSummaryStandardQuote(`${id}`));
    },
    [dispatch],
  );

  const handleMappingDefaultValue = useCallback(() => {
    const { brandId, familyName, bicycleId, yearId, modelId, condition } = query;
    setFormStepDetails({
      ...formStepDetails,
      brand: brandId,
      familyName,
      condition,
    });
    setFormStepOneSubStepThree({
      ...formStepOneSubStepThree,
      brandId: `${brandId}`,
      bicycleId: Number(bicycleId),
      yearId: Number(yearId),
      modelId: Number(modelId),
    });
    setSubStep(5);
  }, [formStepOneSubStepThree, formStepDetails, query]);

  const handleGetDefaultStepDetails = useCallback(async () => {
    if (dataStepDetailStandardQuote) {
      setFormStepDetails({
        brand: `${dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleBrandId}`,
        familyName: dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleProductFamily
          ? `${dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleProductFamily}`
          : 'Allant',
        frameSize:
          dataStepDetailStandardQuote?.tradeInComponents?.length > 0 &&
          dataStepDetailStandardQuote.tradeInComponents.filter((item) => item.id.inventoryCompTypeId === 178).length > 0
            ? dataStepDetailStandardQuote.tradeInComponents.filter((item) => item.id.inventoryCompTypeId === 178)[0]
                .value
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
        isEbike: null,
        modelId: `${dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleModelId}`,
        yearId: dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleYearId,
        bicycleId: dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleId,
      });
      if (query?.editStepDetailOfQuote) {
        if (query?.subStepFive) {
          return setSubStep(5);
        }
        return setSubStep(2);
      }
      if (query?.step && query?.subStep) {
        return setSubStep(2);
      }
      if (
        !dataStepDetailStandardQuote ||
        !dataStepDetailStandardQuote?.condition ||
        !dataStepDetailStandardQuote?.tradeInComponents ||
        dataStepDetailStandardQuote?.tradeInComponents?.length === 0
      ) {
        return setSubStep(5);
      }
      if (step) {
        setSubStep(6);
      }
    }
  }, [dataStepDetailStandardQuote, query, step]);

  const handleCheckOutOfStepParams = useCallback((res: CheckTradeInCompleteStepResponse) => {
    switch (res.status) {
      case ScorecardStatuses.INCOMPLETE_DETAIL: {
        return 1;
      }
      case ScorecardStatuses.INCOMPLETE_SUMMARY: {
        return 2;
      }
      case ScorecardStatuses.INCOMPLETE_UPLOAD_IMAGES: {
        return 3;
      }
      case ScorecardStatuses.SHIPPING: {
        return 4;
      }
      case ScorecardStatuses.COMPLETED: {
        return 5;
      }
      default: {
        return 0;
      }
    }
  }, []);

  const handleCheckCompleteStep = useCallback(async () => {
    const res: CheckTradeInCompleteStepResponse = await checkTradeInCompleteStepRequest(`${query?.id}`);
    if (
      res.status === statusToTextHistoryQuotes.EXPIRED_QUOTE ||
      res.status === statusToTextHistoryQuotes.CONVERTED_QUOTE ||
      res.status === statusToTextHistoryQuotes.CLOSED_QUOTE
    ) {
      setIsDisabledStepByStatusQuote(true);
      setStatusHistoryQuote(res.status);
    } else if (res.status === statusToTextHistoryQuotes.OPEN_QUOTE) {
      setIsDisabledStepByStatusQuote(false);
      setStatusHistoryQuote(res.status);
    } else {
      setIsDisabledStepByStatusQuote(false);
      setStatusHistoryQuote('');
    }
    const currentStepNumber: number = await handleCheckOutOfStepParams(res);
    if (currentStepNumber && Number(`${query?.step}`) > currentStepNumber) {
      return gotoStep(currentStepNumber);
    }
    setCompletedStep(
      res.status === ScorecardStatuses.COMPLETED || res.status === ScorecardStatuses.CANCELED_COMPLETE
        ? 4
        : res.indexStep + 1,
    );
    setIsCompleted(res.status === ScorecardStatuses.COMPLETED || res.status === ScorecardStatuses.RETURNED_TO_SHOP);
    setIsCancelled(res.status.indexOf(ScorecardStatuses.CANCEL) > -1 || res.status === ScorecardStatuses.DECLINED);
    setIsExpired(res.status === ScorecardStatuses.EXPIRED);
    setHideNextBackStatusDeclined(res.status === ScorecardStatuses.DECLINED);
  }, [query]);

  const checkEditQuery = useMemo(() => {
    return query?.isEdit ? { isEdit: true } : {};
  }, [query]);

  const gotoStep = useCallback(
    (stepNumber: number, subStepNumber?: number | string) => {
      let _query: any = {
        step: stepNumber,
        ...checkEditQuery,
      };
      if (subStepNumber) {
        _query = {
          ..._query,
          subStep: subStepNumber,
        };
      }
      if (statusHistoryQuote !== '') {
        _query = {
          ..._query,
          isQuote: true,
        };
      }
      router.push({
        pathname: `/trade-in-account/trade-in/${query?.id}`,
        query: _query,
      });
    },
    [checkEditQuery, query, router, statusHistoryQuote],
  );

  // eslint-disable-next-line no-shadow
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

  const onRestartStandard = useCallback(() => {
    if (step === 1) {
      setSubStep(2);
      setPopupEligible(false);
      setFormStepDetails({
        brand: null,
        familyName: null,
        frameSize: null,
        upgradeCompIds: [],
        condition: null,
        tradeInValue: undefined,
      });
    }
  }, [step]);

  const onReturn = useCallback(() => {
    dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
    router.push(`/trade-in-account/tp-dashboard`);
  }, [dispatch, router]);

  const handleFirstMapDataAddNewScorecard = useCallback(
    async (id: string) => {
      try {
        const _data = await getStepSummaryStandardQuoteRequest(id);
        if (_data?.owner?.firstName) {
          const selectedStorecard = [
            {
              dataStepSummary: {
                address: _data?.owner?.address,
                city: _data?.owner?.city,
                email: _data?.owner?.email,
                employeeEmail: _data?.employeeEmail,
                employeeLocation: _data?.employeeLocation,
                employeeName: _data?.employeeName,
                firstName: _data?.owner?.firstName,
                lastName: _data?.owner?.lastName,
                licenseOrPassport: _data?.owner?.licenseOrPassport,
                paypalEmail: _data?.paypalEmail || _data?.owner?.paypalEmail,
                confirmEmail: _data?.confirmEmail || _data?.owner?.confirmEmail,
                phone: _data?.owner?.phone,
                proofDate:
                  _data?.proof?.date && dayjs(_data?.proof?.date).isValid() ? new Date(_data?.proof?.date) : new Date(),
                proofName: _data?.proof?.name,
                serial: _data?.owner?.serial,
                state: _data?.owner?.state,
                zipCode: _data?.owner?.zipCode,
              },
              indexStepComplete: Number(query?.step),
              isDefaultFillDataStepSummary: true,
              step: Number(query?.step),
              id,
            },
          ];
          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              createScorecardQuantity: createScorecardQuantity <= 1 ? 1 : createScorecardQuantity,
              listDataStepStandardQuote: selectedStorecard,
              type: 'standard',
            }),
          );
        }
      } catch (error) {
        toastError(error);
      }
    },
    [createScorecardQuantity, dispatch, query],
  );

  const handleDataBarcodeScoreCard = useCallback(() => {
    dispatch(scoreCardAction.getBarcodeInventory({ inventoryId: `${query?.id}` }));
  }, [query]);

  const getMessageFeedbackScoreCard = useCallback(() => {
    dispatch(scoreCardAction.getPartnerFeedbackByScorecard({ scoreCardId: `${query?.id}` }));
  }, [dispatch]);

  useEffect(() => {
    if (query.id && createScorecardQuantity <= 1) {
      handleFirstMapDataAddNewScorecard(`${query.id}`);
    }
  }, [createScorecardQuantity, handleFirstMapDataAddNewScorecard, query.id]);

  useEffect(() => {
    if (userInfo) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
    }
    if (!query.id && query?.bicycleId && !isMappingParams) {
      setIsMappingParams(true);
      handleMappingDefaultValue();
    }
    if (query?.id) {
      handleCheckCompleteStep();
      switch (step) {
        case 1: {
          handleGetDefaultStepDetails();
          break;
        }
        case 2: {
          handleDataBarcodeScoreCard();
          handleGetDefaultStepSummary(query?.id);
          break;
        }
        case 3: {
          handleGetDefaultStepThree(query?.id);
          break;
        }
        case 4: {
          handleGetDefaultStepFour(query?.id);
          break;
        }
        case 5: {
          handleDataBarcodeScoreCard();
          getMessageFeedbackScoreCard();
          handleGetDefaultStepFive(query?.id);
          break;
        }
        default:
          handleGetDefaultStepDetails();
          break;
      }
    }
  }, [dispatch, query, step, userInfo, isMappingParams, dataStepDetailStandardQuote]);

  const checkDisabledButtonCountinues = useMemo(() => {
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

  const checkDisabledButtonCountinuesStepTwo = useMemo(() => {
    return step === 1 && subStep === 2 && formStepDetails.brand === '';
  }, [formStepDetails.brand, step, subStep]);

  const isCompleteStepOne = useMemo(() => {
    return completedStep >= 2 || isCompleted || isCancelled || isExpired || isDisabledStepByStatusQuote;
  }, [completedStep, isCancelled, isCompleted, isDisabledStepByStatusQuote, isExpired]);

  const isCompleteStepSummaryImageShipping = useMemo(() => {
    return isCompleted || isCancelled || isExpired || isDisabledStepByStatusQuote;
  }, [isCancelled, isCompleted, isDisabledStepByStatusQuote, isExpired]);

  const hideSaveAndRestart = useMemo(() => {
    return isCompleteStepSummaryImageShipping || step === 5;
  }, [isCompleteStepSummaryImageShipping, step]);

  const disabledStepperStepDetailsOfCustomQuoteApproved = !!detailScoreCard?.customQuoteId;

  const isDisabledStepOne = useMemo(() => {
    if (query?.editStepDetailOfQuote === 'true') {
      return false;
    }
    if (statusHistoryQuote !== '') {
      return true;
    }
    if (isCompleteStepOne) {
      return true;
    }
    if (
      listDataStepStandardQuote[indexScorecardSelected]?.indexStepComplete >= 1 ||
      listDataStepStandardQuote[indexScorecardSelected]?.isDecline
    ) {
      return true;
    }
    return false;
  }, [indexScorecardSelected, isCompleteStepOne, listDataStepStandardQuote, query, statusHistoryQuote]);

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
    setSubStep(1);
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
      isEbike: null,
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

  const handleAddTradeInDropOffRequest = useCallback(async () => {
    await addTradeInDropOffRequest({
      brandId: formStepOneSubStepThree.brandId,
      modelId: formStepOneSubStepThree.modelId,
      partnerId: userInfo?.partner,
      step: 'VIEW_CONDITION',
      yearId: formStepOneSubStepThree.yearId,
    });
  }, [formStepOneSubStepThree.brandId, formStepOneSubStepThree.modelId, formStepOneSubStepThree.yearId, userInfo]);

  const handleSubmitStepThreeStart = useCallback(() => {
    if (!formStepThree || formStepThree?.tradeInImages?.filter((it) => !it.isDeleted)?.length < 4) {
      return toastError(t('partnerPortal.scorecard.validate.image'), t('seoTitle.invalid'));
    }
    setVisibleModalSubmitStepThree(true);
  }, [formStepThree]);

  const getDropOfDay = useCallback(() => {
    const { dateDrop, timeDrop } = formStepFourSelectFour;
    const diff = dayjs(timeDrop, 'HH:mm').diff(dayjs('00:00', 'HH:mm'), 'h', true);
    const dropOfDay = dayjs(dateDrop).add(diff, 'h');
    return dropOfDay;
  }, [formStepFourSelectFour]);

  const gotoTradeInhistory = useCallback(() => {
    router.push({
      pathname: `/trade-in-account/trade-in/history`,
    });
  }, [router]);

  const handlePrintScorecard = useCallback(async () => {
    const target = await document.getElementById('PrintScoreCard');
    if (target && !loadingBarcode) {
      printContent(target.innerHTML);
    }
  }, [loadingBarcode]);

  const handleUploadStepCompleteListCreateScorecardQuantity = useCallback(
    (stepp: number) => {
      const cloneArr = cloneDeep(listDataStepStandardQuote);
      cloneArr[indexScorecardSelected] = {
        ...cloneArr[indexScorecardSelected],
        indexStepComplete: stepp,
        step: stepp !== 4 ? stepp : 2,
      };
      dispatch(
        scoreCardAction.setCreateScorecardQuantity({
          listDataStepStandardQuote: cloneArr,
        }),
      );
    },
    [dispatch, indexScorecardSelected, listDataStepStandardQuote],
  );

  const handleSubmitStepFour = useCallback(
    async (isSave?: boolean) => {
      if (isCompleteStepSummaryImageShipping) {
        gotoStep(5);
        return;
      }
      const valueSelectOne = formStepForSelectOneRef?.current?.values;
      const { fromAddress, fromCity, fromState, fromZipCode, height, length, weight, width } = valueSelectOne || {};

      const valueSelectTwo = formStepForSelectTwoRef?.current?.values;
      const { carrier, carrierTrackingNumber } = valueSelectTwo || {};

      const { dateDrop, dropOffContactEmail, timeDrop } = formStepFourSelectFour;

      const payloadSelectOne: CalculateShippingRequest = {
        fromAddress: fromAddress ? fromAddress.trim() : '',
        fromCity: fromCity ? fromCity.trim() : '',
        fromState: fromState ? fromState.trim() : '',
        fromZipCode: fromZipCode ? fromZipCode.trim() : '',
        height,
        length,
        weight,
        width,
        shippingType: 'BICYCLE_BLUE_BOOK_TYPE',
        tradeInId: `${query?.id}`,
      };

      const payloadSelectTwo: CompleteShippingShippingSelectTwoRequest = {
        carrier: trim(carrier) || '',
        carrierTrackingNumber: trim(carrierTrackingNumber) || '',
        shippingType: 'MY_ACCOUNT_TYPE',
        tradeInId: `${query?.id}`,
      };

      const payloadSelectThree: CompleteShippingShippingSelectThreeRequest = {
        tradeInId: `${query?.id}`,
        shippingType: 'DROP_OFF_BICYCLE_BLUE_BOOK_TYPE',
        dropOffTime: getDropOfDay().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        dropOffContactEmail,
      };

      // Save Function
      if (isSave) {
        const payload = {
          ...payloadSelectOne,
          ...payloadSelectTwo,
          ...payloadSelectThree,
          isSave: true,
        };
        delete payload.shippingType;
        delete payload.dropOffTime;
        await saveShippingShippingSelectThreeRequest(payload);
        gotoTradeInhistory();
        return;
      }

      switch (activeShip) {
        case 1: {
          if (
            trim(payloadSelectOne.fromAddress) !== '' &&
            trim(payloadSelectOne.fromCity) !== '' &&
            trim(payloadSelectOne.fromState) !== '' &&
            trim(payloadSelectOne.fromZipCode) !== '' &&
            payloadSelectOne.height !== '' &&
            payloadSelectOne.length !== '' &&
            payloadSelectOne.weight !== '' &&
            payloadSelectOne.width !== ''
          ) {
            try {
              setLoadingButton(true);
              await handlePrintScorecard();
              await completeShippingShippingSelectOneRequest(payloadSelectOne);
              await handleUploadStepCompleteListCreateScorecardQuantity(4);
              setLoadingButton(false);
              gotoStep(5);
            } catch (error) {
              setLoadingButton(false);
              toastError(error);
            }
          } else {
            formStepForSelectOneRef?.current?.handleSubmit();
          }
          break;
        }

        case 2: {
          if (payloadSelectTwo.carrier !== '' && payloadSelectTwo.carrierTrackingNumber !== '') {
            try {
              setLoadingButton(true);
              await handlePrintScorecard();
              await completeShippingShippingSelectTwoRequest(payloadSelectTwo);
              await handleUploadStepCompleteListCreateScorecardQuantity(4);
              setLoadingButton(false);
              gotoStep(5);
            } catch (error) {
              setLoadingButton(false);
              toastError(error);
            }
          } else {
            formStepForSelectTwoRef?.current?.handleSubmit();
          }
          break;
        }

        case 3: {
          try {
            let checkError: boolean = false;
            let error = {
              dropOffContactEmail: '',
              dateDrop: '',
              timeDrop: '',
            };
            if (trim(dropOffContactEmail) === '') {
              error = {
                ...error,
                dropOffContactEmail: t('common.validate.emailRequired'),
              };
              checkError = true;
            }
            if (trim(dropOffContactEmail) !== '' && !emailValidate(trim(dropOffContactEmail))) {
              error = {
                ...error,
                dropOffContactEmail: t('common.validate.emailInvalid'),
              };
              checkError = true;
            }
            if (!dateDrop) {
              error = {
                ...error,
                dateDrop: 'Please select your date.',
              };
              checkError = true;
            }
            if (!timeDrop) {
              error = {
                ...error,
                timeDrop: 'Please select your time.',
              };
              checkError = true;
            }

            if (checkError) {
              setFormStepFourSelectFour({
                ...formStepFourSelectFour,
                error,
              });
              return;
            }

            setLoadingButton(true);
            await handlePrintScorecard();
            await completeShippingShippingSelectThreeRequest(payloadSelectThree);
            await handleUploadStepCompleteListCreateScorecardQuantity(4);

            setLoadingButton(false);
            gotoStep(5);
          } catch (error) {
            setLoadingButton(false);
            toastError(error);
          }
          break;
        }
        default:
          break;
      }

      if (isBBBRack) {
        handleGetDefaultBBBRack(query?.id);
      }
    },
    [
      activeShip,
      formStepFourSelectFour,
      getDropOfDay,
      gotoStep,
      gotoTradeInhistory,
      handleGetDefaultBBBRack,
      handlePrintScorecard,
      handleUploadStepCompleteListCreateScorecardQuantity,
      isBBBRack,
      isCompleteStepSummaryImageShipping,
      query,
    ],
  );

  const handleSubmitStepThree = useCallback(
    async (isSave?: boolean) => {
      if (
        detailPartnerLocation?._id === TREK_PARTNER_PARENT_ID ||
        detailPartnerLocation?.partner_parent?._id === TREK_PARTNER_PARENT_ID
      ) {
        setActiveShip(2);
      }

      if (isCompleteStepSummaryImageShipping) {
        gotoStep(4);
        return;
      }

      let listOldImageIdsNewOrder: any = [];
      let listDeleted: any = [];

      for (const item of oldImageStepThree) {
        listOldImageIdsNewOrder = [...listOldImageIdsNewOrder, ...[item.imageId]];

        if (!formStepThree?.tradeInImages.some((it: any) => it.imageId === item.imageId)) {
          listDeleted = [...listDeleted, ...[item.imageId]];
        }
      }

      const formData: FormData = new FormData();
      formStepThree?.tradeInImages
        .filter((it) => it.file)
        .forEach((item) => {
          formData.append('images', item?.file);
        });

      try {
        if (query?.id) {
          setLoadingButton(true);
          if (listDeleted?.length === 0) {
            await updateTradeInImageRequest(`${query?.id}`, formData, {
              isSave: isSave || false,
              oldImageIdsNewOrder: listOldImageIdsNewOrder,
            });
          } else {
            await updateTradeInImageRequest(`${query?.id}`, formData, {
              isSave: isSave || false,
              oldImageIdsNewOrder: listOldImageIdsNewOrder,
            });
            await deleteTradeInImageRequest(`${query?.id}`, {
              isSave: isSave || false,
              oldImageIdsNewOrder: listOldImageIdsNewOrder,
              imageIds: listDeleted,
            });
            setVisibleModalSubmitStepThree(false);
          }
          setLoadingButton(false);
          if (isSave) {
            gotoTradeInhistory();
            return;
          }
          handleUploadStepCompleteListCreateScorecardQuantity(3);
          gotoStep(4);
        }
      } catch (error) {
        setLoadingButton(false);
        toastError(error);
      }
    },
    [
      detailPartnerLocation,
      formStepThree,
      gotoStep,
      gotoTradeInhistory,
      handleUploadStepCompleteListCreateScorecardQuantity,
      isCompleteStepSummaryImageShipping,
      oldImageStepThree,
      query,
    ],
  );

  const handleSetSubStepList = useCallback(
    (numbSubStep: number) => {
      const cloneArr = cloneDeep(listDataStepStandardQuote);
      cloneArr[indexScorecardSelected] = {
        ...cloneArr[indexScorecardSelected],
        subStep: numbSubStep,
      };
      dispatch(
        scoreCardAction.setCreateScorecardQuantity({
          listDataStepStandardQuote: cloneArr,
        }),
      );
    },
    [dispatch, indexScorecardSelected, listDataStepStandardQuote],
  );

  const currentCondition = useCallback(
    (data: any) => {
      if (query?.condition) {
        return data?.conditions?.find((it: any) => it.condition === query?.condition);
      }
      return null;
    },
    [query],
  );

  const handleCheckSelecteBikeTypeEbikeKidBike400 = useCallback(
    async (newFormStepOneSubStepThree?: GetListTradeInBicycleParams) => {
      try {
        setLoadingButton(true);
        const response: any = await getListTradeInBicycleRequest(newFormStepOneSubStepThree || formStepOneSubStepThree);
        const findFairCondition = currentCondition(response);
        if (
          response?.bicycleTypeName === 'Kids' ||
          response?.bicycleTypeName === 'E-Bike' ||
          findFairCondition?.tradeInValue < 400
        ) {
          setPopupEligible({
            typeBike: response?.bicycleTypeName,
            fairCondition: findFairCondition?.tradeInValue,
          });
          setLoadingButton(false);
          return;
        }
        setLoadingButton(false);
        setSubStep(4);
      } catch (error) {
        setLoadingButton(false);
        toastError(error);
      }
    },
    [currentCondition, formStepOneSubStepThree],
  );

  const handleCheckPopupCondition400 = useMemo(() => {
    if (formStepDetails?.condition) {
      const conditionSelected = dataTradeInBicycle?.conditions?.filter(
        (it: any) => it?.condition === formStepDetails?.condition,
      )[0];
      if (
        dataTradeInBicycle?.bicycleTypeName === 'Kids' ||
        dataTradeInBicycle?.bicycleTypeName === 'E-Bike' ||
        conditionSelected?.tradeInValue < 400
      ) {
        if (subStep === 5) {
          setPopupEligible({
            typeBike: dataTradeInBicycle?.bicycleTypeName,
            fairCondition: conditionSelected?.tradeInValue,
          });
          return true;
        }
        return false;
      }
    }
    return false;
  }, [dataTradeInBicycle, formStepDetails, subStep]);

  const handleCountinues = useCallback(
    async (newFormStepOneSubStepThree?: GetListTradeInBicycleParams) => {
      setLoadingButton(true);
      if (popupNotEligible) {
        setPopupEligible(null);
      }
      if (step === 1) {
        switch (subStep) {
          case 2: {
            formStepOneStepTwoRef?.current?.handleSubmit();
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
            if (!isDisabledStepOne) {
              handleCheckSelecteBikeTypeEbikeKidBike400(newFormStepOneSubStepThree);
              return;
            }
            setSubStep(4);
            break;
          }
          case 4: {
            handleSetSubStepList(5);
            setSubStep(5);
            break;
          }
          case 5: {
            if (formStepDetails?.condition) {
              handleCheckPopupCondition400;
            }
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
      if (step === 3) {
        handleSubmitStepThreeStart();
      }
      if (step === 4) {
        handleSubmitStepFour();
      }
      setTimeout(() => {
        setLoadingButton(false);
      }, 0);
    },
    [
      popupNotEligible,
      step,
      subStep,
      formStepDetails,
      handleSetSubStepList,
      isDisabledStepOne,
      handleCheckSelecteBikeTypeEbikeKidBike400,
      handleCheckPopupCondition400,
      gotoStep,
      handleSubmitStepThreeStart,
      handleSubmitStepFour,
    ],
  );

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
        condition ? Number(condition.tradeInValue) : 0,
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
    (response: CreateNewTradeInResponse, type: string) => {
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
            pathname: `/trade-in-account/trade-in/new`,
          });
          return;
        }

        // find complete
        const findIndexComplele = cloneArr.findIndex((it) => it.indexStepComplete >= 1);
        if (findIndexComplele !== -1) {
          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              listDataStepStandardQuote: cloneArr,
              indexScorecardSelected: findIndexComplele,
            }),
          );
          return router.push({
            pathname: `/trade-in-account/trade-in/${cloneArr[findIndexComplele]?.id}`,
            query: {
              step: listDataStepStandardQuote[findIndexComplele]?.step,
            },
          });
        }
        dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
        setSubStep(1);
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
        pathname: `/trade-in-account/trade-in/${response?.id}`,
        query: {
          step: 2,
        },
      });
    },
    [dispatch, indexScorecardSelected, listDataStepStandardQuote, router],
  );

  const handleSubmitStandardQuoteStepOneNextToStepTwo = useCallback(
    async (isInstantPayoutsss: boolean, action?: string) => {
      const { isEdit } = checkEditQuery;
      try {
        setLoadingButton(true);
        let params: CreateNewTradeInParams = { isInstantPayout: isInstantPayoutsss };
        if (isEdit) {
          params = {
            ...params,
            id: query?.id,
          };
        }
        // const params = {
        //   isInstantPayout: isInstantPayoutsss,
        // };
        let payload: CreateNewTradeInBody = {
          bicycleId: formStepOneSubStepThree.bicycleId,
          chargerIncluded: false,
          clean: null,
          compRequests: [{ compId: '178', value: formStepDetails.frameSize }],
          condition: formStepDetails.condition,
          hasDiagnosticReport: false,
          hasKey: false,
          isEbike: false,
          isTamperedWith: false,
          upgradeCompIds: formStepDetails?.upgradeCompIds?.length
            ? formStepDetails?.upgradeCompIds?.filter((it: any) => !!it.value).map((it: any) => it.value)
            : [],
          value: Number(tradeInValue) || 0,
        };

        if (action === 'isSave') {
          payload = {
            ...payload,
            save: true,
          };
        }

        const response: CreateNewTradeInResponse = await (isEdit
          ? updateNewTradeIn(payload, params)
          : createNewTradeIn(payload, params));
        // const response: CreateNewTradeInResponse = await createNewTradeIn(payload, params);
        switch (action) {
          case 'isSave': {
            if (listDataStepStandardQuote.length > 1) {
              const _data = listDataStepStandardQuote[indexScorecardSelected];
              toastSuccess('Saved.');
              router.push({
                pathname: `/trade-in-account/trade-in/${response?.id}`,
                query: {
                  step: _data?.step,
                  ...checkEditQuery,
                },
              });
            } else {
              gotoTradeInhistory();
            }
            break;
          }
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
    [
      checkEditQuery,
      formStepDetails,
      formStepOneSubStepThree.bicycleId,
      gotoTradeInhistory,
      handleListCreateScorecardQuantity,
      indexScorecardSelected,
      listDataStepStandardQuote,
      query,
      router,
      tradeInValue,
    ],
  );

  const handleSubmitStepSummary = useCallback(
    async (isSave: boolean, formSummary?: FormSummary) => {
      if (isCompleteStepSummaryImageShipping) {
        gotoStep(3);
        return;
      }
      const values = formSummary || formStepTwoRef?.current?.values;
      if ((!formSummary && trim(values.firstName) === '') || trim(values.lastName) === '') {
        return toastError('First Name, Last Name are required.');
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
        save: isSave,
      };
      try {
        setLoadingButton(true);
        await createTradeInSummaryRequest(payload);

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
          step: 3,
          indexStepComplete: 2,
        };

        if (isSave) {
          gotoTradeInhistory();
          return;
        }
        setLoadingButton(false);

        if (checkUncreateScorecard) {
          const indexUncreateScorecard = listDataStepStandardQuote.findIndex(
            (it) => !it.isDecline && (!it.indexStepComplete || it.indexStepComplete < 1),
          );
          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              listDataStepStandardQuote: cloneArr,
              indexScorecardSelected: indexUncreateScorecard,
            }),
          );
          if (listDataStepStandardQuote[indexUncreateScorecard]?.id) {
            return router.push({
              pathname: `/trade-in-account/trade-in/${listDataStepStandardQuote[indexUncreateScorecard]?.id}`,
              query: {
                step: 2,
                ...checkEditQuery,
              },
            });
          }
          return router.push(`/trade-in-account/trade-in/new`);
        }
        dispatch(
          scoreCardAction.setCreateScorecardQuantity({
            listDataStepStandardQuote: cloneArr,
          }),
        );
        gotoStep(3);
      } catch (error) {
        setLoadingButton(false);
        toastError(error);
      }
    },
    [
      checkEditQuery,
      checkUncreateScorecard,
      dispatch,
      gotoStep,
      gotoTradeInhistory,
      indexScorecardSelected,
      isCompleteStepSummaryImageShipping,
      listDataStepStandardQuote,
      query,
      router,
    ],
  );

  const handleDeclineStepOne = useCallback(
    async (values: ModalDeclineStepOneFormValue) => {
      try {
        const response: CreateNewTradeInResponse = await handleSubmitStandardQuoteStepOneNextToStepTwo(
          false,
          'noAction',
        );
        let payload: TradeInDetailDeclineBody = {
          comment: values?.comment,
          reasonDeclineId: values?.reasonDeclineId,
          tradeInId: response?.id,
        };
        if (values?.reasonDeclineId === '3') {
          payload = {
            ...payload,
            priceExpected: values?.priceExpected,
          };
        }
        await tradeInDetailDecline(payload);
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

  const onSave = useCallback(() => {
    if (visibleSaveStep) {
      switch (step) {
        case 1: {
          handleSubmitStandardQuoteStepOneNextToStepTwo(false, 'isSave');
          break;
        }
        case 2: {
          handleSubmitStepSummary(true, null);
          break;
        }
        case 3: {
          handleSubmitStepThree(true);
          break;
        }
        case 4: {
          handleSubmitStepFour(true);
          break;
        }
        default:
          break;
      }
    }
  }, [
    visibleSaveStep,
    step,
    handleSubmitStandardQuoteStepOneNextToStepTwo,
    handleSubmitStepSummary,
    handleSubmitStepThree,
    handleSubmitStepFour,
  ]);

  const gotoCustomQuote = useCallback(() => {
    router.push({
      pathname: `/trade-in-account/trade-in/custom-quote`,
    });
  }, [router]);

  const gotoCustomRedBarnQuote = useCallback(() => {
    router.push({
      pathname: `/trade-in-account/trade-in/custom-red-barn-quote`,
    });
  }, [router]);

  const gotoEBikeQuote = useCallback(() => {
    router.push({
      pathname: `/trade-in-account/trade-in/ebike-quote`,
    });
  }, [router]);

  const gotoRedBarnQuote = useCallback(() => {
    router.push({
      pathname: `/trade-in-account/trade-in/red-barn-quote`,
    });
  }, [router]);

  const handleSubmitModalSaveAsQuote = useCallback(
    async (modalFormQuoteData: SaveAsQuoteData) => {
      const params = {
        isInstantPayout: false,
      };
      const payload: CreateNewTradeInBody = {
        bicycleId: formStepOneSubStepThree.bicycleId,
        chargerIncluded: false,
        clean: null,
        compRequests: [{ compId: '178', value: formStepDetails.frameSize }],
        condition: formStepDetails.condition,
        hasDiagnosticReport: false,
        hasKey: false,
        isEbike: false,
        isTamperedWith: false,
        upgradeCompIds: formStepDetails?.upgradeCompIds?.length
          ? formStepDetails?.upgradeCompIds?.filter((it: any) => !!it.value).map((it: any) => it.value)
          : [],
        value: Number(tradeInValue) || 0,
        tradeInSaveAsQuoteRequest: {
          customerEmail: modalFormQuoteData?.customer_email,
          customerName: modalFormQuoteData?.customer_name,
          ownerFirstName: modalFormQuoteData?.owner_first_name,
          ownerLastName: modalFormQuoteData?.owner_last_name,
          customerPhone: modalFormQuoteData?.customer_phone,
          notes: modalFormQuoteData?.notes,
          shopEmployee: modalFormQuoteData?.shop_employee,
        },
      };
      try {
        const response: any = await saveAsQuote(payload, params);

        if (query?.editStepDetailOfQuote && query?.isQuote === 'true') {
          toastSuccess('Updated Successfully');
          return router.replace({
            pathname: `/trade-in-account/trade-in/history/`,
            query: {
              tab: 'quotes',
            },
          });
        }

        const cloneArr = cloneDeep(listDataStepStandardQuote);
        cloneArr[indexScorecardSelected].isSaveQuote = true;
        const findAnotherSaveQuote = cloneArr.findIndex(
          (it, index) => !it.isSaveQuote && index !== indexScorecardSelected,
        );

        setIsOpenModalSuccessSaveAsQuote(true);
        dispatch(
          scoreCardAction.setCreateScorecardQuantity({
            listDataStepStandardQuote: cloneArr,
          }),
        );
        if (findAnotherSaveQuote !== -1) {
          setTimeout(() => {
            router.push({
              pathname: `/trade-in-account/trade-in/${response?.id}`,
              query: {
                step: 2,
                editStepDetailOfQuote: true,
                ...checkEditQuery,
              },
            });
          }, 1000);
          return;
        }
        setTimeout(() => {
          router.replace({
            pathname: `/trade-in-account/trade-in/history/`,
            query: {
              tab: 'quotes',
            },
          });
        }, 2000);
      } catch (_error) {
        toastError(_error);
      }
    },
    [
      checkEditQuery,
      dispatch,
      formStepDetails,
      formStepOneSubStepThree.bicycleId,
      indexScorecardSelected,
      listDataStepStandardQuote,
      query,
      router,
      tradeInValue,
    ],
  );

  const renderForm = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <StepDetail
            handleSubmitModalSaveAsQuote={handleSubmitModalSaveAsQuote}
            form={formStepDetails}
            subStep={subStep}
            activeCard={activeCard}
            formStepOneStepTwoRef={formStepOneStepTwoRef}
            formStepOneSubStepThree={formStepOneSubStepThree}
            onChangeForm={onChangeForm}
            setActiveCard={setActiveCard}
            handleSubmitStepOneSubStepTwo={handleSubmitStepOneSubStepTwo}
            setFormStepOneSubStepThree={setFormStepOneSubStepThree}
            handleAddTradeInDropOffRequest={handleAddTradeInDropOffRequest}
            handleSubmitStandardQuoteStepOneNextToStepTwo={handleSubmitStandardQuoteStepOneNextToStepTwo}
            handleDeclineStepOne={handleDeclineStepOne}
            isCompleted={isDisabledStepOne}
            gotoCustomQuote={gotoCustomQuote}
            handleCountinues={handleCountinues}
            setSubStep={setSubStep}
            statusHistoryQuote={statusHistoryQuote}
          />
        );

      case 2:
        return (
          <StepSummary
            handleSubmitStepSummary={handleSubmitStepSummary}
            handleBackPreviousStep={handleBackPreviousStep}
            isCompleted={isCompleteStepSummaryImageShipping}
            statusHistoryQuote={statusHistoryQuote}
            formStepTwoRef={formStepTwoRef}
            hideBackStepSummary={hideBackStepSummary}
            hideNextBackStatusDeclined={hideNextBackStatusDeclined}
          />
        );

      case 3:
        return (
          <StepImages
            handleBackPreviousStep={handleBackPreviousStep}
            isCompleted={isCompleteStepSummaryImageShipping}
            formStepThree={formStepThree}
            setFormStepThree={setFormStepThree}
          />
        );

      case 4:
        return (
          <StepShipping
            activeShip={activeShip}
            setActiveShip={setActiveShip}
            formStepForSelectOneRef={formStepForSelectOneRef}
            formStepForSelectTwoRef={formStepForSelectTwoRef}
            formStepFourSelectFour={formStepFourSelectFour}
            setFormStepFourSelectFour={setFormStepFourSelectFour}
            isCompleted={isCompleteStepSummaryImageShipping}
          />
        );

      case 5:
        return <StepComplete dataModalStepFiveTradeInCredit={dataModalStepFiveTradeInCredit} />;

      default:
        return null;
    }
  }, [
    step,
    handleSubmitModalSaveAsQuote,
    formStepDetails,
    subStep,
    activeCard,
    formStepOneSubStepThree,
    onChangeForm,
    handleSubmitStepOneSubStepTwo,
    handleAddTradeInDropOffRequest,
    handleSubmitStandardQuoteStepOneNextToStepTwo,
    handleDeclineStepOne,
    isDisabledStepOne,
    gotoCustomQuote,
    handleCountinues,
    statusHistoryQuote,
    handleSubmitStepSummary,
    handleBackPreviousStep,
    isCompleteStepSummaryImageShipping,
    hideBackStepSummary,
    hideNextBackStatusDeclined,
    formStepThree,
    activeShip,
    formStepFourSelectFour,
    dataModalStepFiveTradeInCredit,
  ]);

  const handleBackScreen = useCallback(() => {
    if (popupNotEligible) {
      setPopupEligible(null);
    }
    if (step === 1 && subStep === 1) {
      handleSetSubStepList(1);
      return;
    }
    if (step === 1 && subStep === 2.5) {
      handleSetSubStepList(2);
      setSubStep(2);
      return;
    }
    if (step === 1 && subStep === 5 && statusHistoryQuote === '') {
      setFormStepDetails({
        ...formStepDetails,
        condition: '',
        tradeInValue: undefined,
      });
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
  }, [popupNotEligible, step, subStep, statusHistoryQuote, gotoStep, query, handleSetSubStepList, formStepDetails]);

  const closeModalSuccessSaveAsQuote = useCallback(() => {
    setIsOpenModalSuccessSaveAsQuote(false);
    router.replace({
      pathname: `/trade-in-account/trade-in/history/`,
      query: {
        tab: 'quotes',
      },
    });
  }, [router]);

  const handleCountinuesSubStepOne = useCallback(() => {
    const arr = [];
    for (let i = 0; i < createScorecardQuantity; i++) {
      if (activeCard === 1 || activeCard === 3) {
        arr.push({ subStep: 2, step: 1 });
      } else {
        arr.push({ subStep: 1, step: 1 });
      }
    }
    if (activeCard === 2) {
      dispatch(
        scoreCardAction.setCreateScorecardQuantity({
          listDataStepCustomQuote: arr,
          type: 'custom',
        }),
      );
      gotoCustomQuote();
      return;
    }
    // if (activeCard === 3) {
    //   dispatch(
    //     scoreCardAction.setCreateScorecardQuantity({
    //       listDataStepEbikeQuote: arr,
    //       type: 'ebike',
    //     }),
    //   );
    //   gotoEBikeQuote();
    //   return;
    // }
    if (activeCard === 3) {
      dispatch(
        scoreCardAction.setCreateScorecardQuantity({
          listDataStepStandardQuote: arr,
          type: 'red-barn',
        }),
      );
      gotoRedBarnQuote();
      return;
    }
    if (activeCard === 4) {
      dispatch(
        scoreCardAction.setCreateScorecardQuantity({
          listDataStepStandardQuote: arr,
          type: 'custom-red-barn',
        }),
      );
      gotoCustomRedBarnQuote();
      return;
    }
    dispatch(
      scoreCardAction.setCreateScorecardQuantity({
        listDataStepStandardQuote: arr,
        type: 'standard',
      }),
    );
    setSubStep(subStep + 1);
  }, [
    activeCard,
    createScorecardQuantity,
    dispatch,
    gotoCustomQuote,
    gotoCustomRedBarnQuote,
    gotoRedBarnQuote,
    subStep,
  ]);

  const isShowButtonNextStepCountinues = useMemo(() => {
    if (statusHistoryQuote !== '') {
      return true;
    }
    if (
      subStep !== 6 ||
      (subStep === 6 && isCompleteStepOne && !listDataStepStandardQuote[indexScorecardSelected]?.isDecline)
    ) {
      return true;
    }
    return false;
  }, [indexScorecardSelected, isCompleteStepOne, listDataStepStandardQuote, statusHistoryQuote, subStep]);

  const renderButtonSession = useMemo(() => {
    const disableBtn =
      checkDisabledButtonCountinues ||
      loadingButton ||
      checkDisabledButtonCountinuesStepTwo ||
      handleCheckPopupCondition400;

    if (step === 1 && subStep === 1) {
      return (
        <div className={cx(classes.wrapButtonfixed, classes.wrapButton)}>
          <Button
            disabled={true}
            buttonType="outline"
            onClick={handleBackScreen}
            className={cx(classes.btnBack, classes.customButtonSize, classes.disableBtn)}>
            <img src={images.messages.icArrowLeftGrey} alt="icon_next" className="mr-4" />
            Back
          </Button>
          <Button disabled={loadingButton} className={classes.customButtonSize} onClick={handleCountinuesSubStepOne}>
            Continue
            <img src={images.iconNextWhite} alt="icon_next" className="ml-4" />
          </Button>
        </div>
      );
    }

    if (
      (step === 1 &&
        (subStep === 2 || subStep === 2.5 || subStep === 3 || subStep === 4 || subStep === 5 || subStep === 6)) ||
      step === 3 ||
      step === 4
    ) {
      return (
        <>
          <div className={cx(classes.wrapButton, classes.wrapButtonfixed)}>
            {isCompleteStepOne && step === 1 && subStep === 2 ? null : (
              <Button
                buttonType="outline"
                onClick={handleBackScreen}
                className={cx(classes.btnBack, classes.customButtonSize)}>
                <img src={images.messages.icArrowLeftGrey} alt="icon_next" className="mr-4" />
                Back
              </Button>
            )}
            {isShowButtonNextStepCountinues ? (
              <Button
                disabled={disableBtn}
                className={classes.customButtonSize}
                onClick={() => !disableBtn && handleCountinues()}>
                {step === 4 && !isCompleteStepSummaryImageShipping ? 'Submit and Print Scorecard' : 'Continue'}
                {(step !== 4 || isCompleteStepSummaryImageShipping) && (
                  <img src={images.iconNextWhite} alt="icon_next" className="ml-4" />
                )}
              </Button>
            ) : null}
          </div>
          <div className={classes.wrapButtonSupportFixed} />
        </>
      );
    }
    return null;
  }, [
    checkDisabledButtonCountinues,
    checkDisabledButtonCountinuesStepTwo,
    handleBackScreen,
    handleCheckPopupCondition400,
    handleCountinues,
    handleCountinuesSubStepOne,
    isCompleteStepOne,
    isCompleteStepSummaryImageShipping,
    isShowButtonNextStepCountinues,
    loadingButton,
    step,
    subStep,
  ]);

  return (
    <div className={cx(classes.tradeInLayout, classes.container)}>
      <Head>
        <title>New Trade In Scorecard</title>
      </Head>
      <Header
        hideSave={hideSaveAndRestart}
        hideRestart={hideSaveAndRestart}
        onRestart={onRestart}
        onSave={onSave}
        visibleSaveStep={visibleSaveStep}
        loadingButton={loadingButton}
        isCompleted={
          (step === 1 && isCompleteStepOne && query?.editStepDetailOfQuote !== 'true') ||
          (step !== 1 && isCompleteStepSummaryImageShipping)
        }
        setFormStepDetails={setFormStepDetails}
        setSubStep={setSubStep}
        setFormStepOneSelectImage={setFormStepOneSubStepThree}
      />
      <div className={classes.tradeInContent}>
        <div className={classes.container}>
          <Stepper
            total={5}
            active={step}
            subActive={subStep}
            showComplete={true}
            stepList={['Details', 'Summary', 'Images', 'Shipping', 'Complete']}
            deactiveStepOne={true}
            handleChangeStep={handleChangeStep}
            isCompleted={isCompleted}
            completedStep={completedStep}
            numberActiveStep={Number(query?.step)}
            disabledStepperStepDetailsOfCustomQuoteApproved={disabledStepperStepDetailsOfCustomQuoteApproved}
          />
          <section className={classes.formRequestSection}>{renderForm}</section>
          <div className={classes.wrapButton}>{renderButtonSession}</div>
        </div>
      </div>

      {visibleModalSubmitStepThree && (
        <Suspense fallback={null}>
          <ModalSubmitStepThree
            isOpen={visibleModalSubmitStepThree}
            onClose={() => setVisibleModalSubmitStepThree(false)}
            onSubmit={handleSubmitStepThree}
          />
        </Suspense>
      )}
      {isOpenModalSuccessSaveAsQuote && (
        <Suspense fallback={null}>
          <ModalSuccessSaveAsQuote isOpen={isOpenModalSuccessSaveAsQuote} onClose={closeModalSuccessSaveAsQuote} />
        </Suspense>
      )}

      {popupNotEligible && (
        <Suspense fallback={null}>
          <PopupNotEligibleModel
            isOpen={popupNotEligible}
            onClose={() => setPopupEligible(null)}
            typeBike={popupNotEligible.typeBike}
            fairCondition={popupNotEligible?.fairCondition}
            onRestart={onRestartStandard}
            onReturn={onReturn}
            isShowButtonControlScoreCard
          />
        </Suspense>
      )}

      {!loadingBarcode && <PrintScoreCard />}
    </div>
  );
};

export default StandardQuote;
