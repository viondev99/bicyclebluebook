/* eslint-disable no-unused-expressions */
/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-new-wrappers */
/* eslint-disable import/no-cycle */
import Button from '@ui/Buttons/Primary/Button';
import { addTradeInDropOffRequest } from 'api/partner/account.api';
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
} from 'helpers/utilities.helper';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import CookieBrowser from 'js-cookie';
import isNil from 'lodash/isNil';
import pick from 'lodash/pick';
import trim from 'lodash/trim';
import cloneDeep from 'lodash/cloneDeep';
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
  FormStepDetailsDefaultValue,
  FormStepOneSubStepThreeDefaultValue,
  FormSummary,
  TradeInScoreCardsProps,
} from './formDefaultValue';
import StepComplete from './Step/StepComplete';
import StepDetail from './Step/StepDetail';
import StepImages from './Step/StepImages';
import StepShipping from './Step/StepShipping';
import { FormStepFourSelectOne } from './Step/StepShipping/WithBicycleBlueBook';
import { FormStepFourSelectTwo } from './Step/StepShipping/WithMyAccount';
import StepSummary from './Step/StepSummary';
import { SaveAsQuoteData } from '../StandardQuote/formDefaultValue';
import ModalSuccessSaveAsQuote from '../StandardQuote/ModalSaveAsQuote/modalSuccessSaveAsQuote';
import classes from './trade-in.module.scss';

const EBikeQuote: FC = () => {
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

  const formStepForSelectOneRef = useRef<FormikProps<FormStepFourSelectOne>>();
  const formStepForSelectTwoRef = useRef<FormikProps<FormStepFourSelectTwo>>();
  const formStepTwoRef = useRef<FormikProps<FormSummary>>();

  const [loadingButton, setLoadingButton] = useState(false);
  const formStepDetailsSubStepOneRef = useRef(null);
  const formStepDetailsSubStepThreeRef = useRef(null);
  const [subStep, setSubStep] = useState(1);
  const [activeShip, setActiveShip] = useState(1);
  const [formStepFourSelectFour, setFormStepFourSelectFour] = useState<FormStepFourSelectThree>(
    FormStepFourSelectThreeDefaultValue,
  );
  const [formStepDetails, setFormStepDetails] = useState(FormStepDetailsDefaultValue);
  const [formStepDetailSubStepTwo, setFormStepDetailSubStepTwo] = useState<GetListTradeInBicycleParams>(
    FormStepOneSubStepThreeDefaultValue,
  );
  const [formStepThree, setFormStepThree] = useState<GetTradeInByIdResponseStepThreeResponse>(null);
  const [oldImageStepThree, setOldImageStepThree] = useState<any[]>([]);
  const [completedStep, setCompletedStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [visibleModalSubmitStepThree, setVisibleModalSubmitStepThree] = useState<boolean>(false);
  const [dataModalStepFiveTradeInCredit, setdataModalStepFiveTradeInCredit] = useState(null);
  const [hideNextBackStatusDeclined, setHideNextBackStatusDeclined] = useState<boolean>(false);
  const [isOpenModalSuccessSaveAsQuote, setIsOpenModalSuccessSaveAsQuote] = useState<boolean>(false);
  const [isMappingParams, setIsMappingParams] = useState<boolean>(false);
  const { listDataStepEbikeQuote, indexScorecardSelected } = useSelector(
    (state: StoreState) => state.partner.scorecard.createScoreCardQuantityData,
  );

  const checkUncreateScorecard = useMemo(() => {
    const findUncreateScorecard = listDataStepEbikeQuote.find(
      (it) => !it.isDecline && (!it.indexStepComplete || it.indexStepComplete < 1),
    );
    return !!findUncreateScorecard;
  }, [listDataStepEbikeQuote]);

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
            const customer = createCustomerRequest({
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
    setFormStepDetailSubStepTwo({
      ...formStepDetailSubStepTwo,
      brandId: `${brandId}`,
      bicycleId: Number(yearId) >= 2018 ? Number(bicycleId) : '',
      yearId: Number(yearId),
      modelId: Number(modelId),
      isEbike: true,
    });
  }, [formStepDetailSubStepTwo, formStepDetails, query]);

  const handleGetDefaultStepDetails = useCallback(async () => {
    if (dataStepDetailStandardQuote) {
      setFormStepDetailSubStepTwo({
        bicycleId: dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleId || '',
        brandId: dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleBrandId
          ? `${dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleBrandId}`
          : '',
        chargerIncluded: dataStepDetailStandardQuote?.chargerIncluded || null,
        ebikeSubtypeId: dataStepDetailStandardQuote?.bicycleTypeId || -1,
        hasKey: dataStepDetailStandardQuote?.hasKey,
        isEbike: dataStepDetailStandardQuote?.isEbike,
        modelId: dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleModelId || '',
        yearId: dataStepDetailStandardQuote?.bicycleBaseInfo?.bicycleYearId || '',
      });
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

        chargerIncluded: dataStepDetailStandardQuote?.chargerIncluded || false,
        hasKey: dataStepDetailStandardQuote?.hasKey || false,
        isTamperedWith: dataStepDetailStandardQuote?.isTamperedWith || false,
        hasDiagnosticReport: dataStepDetailStandardQuote?.hasDiagnosticReport || false,
        eBikeHours: dataStepDetailStandardQuote?.eBikeHours || '',
        eBikeMileage: dataStepDetailStandardQuote?.eBikeMileage || '',
        ebikeSubtypeId: dataStepDetailStandardQuote?.ebikeSubtypeId
          ? `${dataStepDetailStandardQuote?.ebikeSubtypeId}`
          : '-1',
      });
      if (query?.editStepDetailOfQuote) {
        if (query?.subStepFour) {
          return setSubStep(4);
        }
        return setSubStep(1);
      }
      if (step) {
        setSubStep(6);
      }
    }
  }, [dataStepDetailStandardQuote, query, step]);

  const handleCheckCompleteStep = useCallback(async () => {
    const res: CheckTradeInCompleteStepResponse = await checkTradeInCompleteStepRequest(`${query?.id}`);
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
          handleGetDefaultStepFive(query?.id);
          break;
        }
        default:
          handleGetDefaultStepDetails();
          break;
      }
    }
  }, [dispatch, query, step, userInfo, dataStepDetailStandardQuote, isMappingParams]);

  const checkDisabledButtonCountinues = useMemo(() => {
    return (
      (subStep === 6 && formStepDetails.condition === '') ||
      (subStep === 3 && formStepDetailSubStepTwo.brandId === '') ||
      (subStep === 5 && formStepDetails.frameSize === '') ||
      (subStep === 2 && formStepDetailSubStepTwo.bicycleId === '') ||
      (subStep === 1.5 && step === 1 && (!formStepDetails.familyName || formStepDetails.familyName === ''))
    );
  }, [
    subStep,
    formStepDetails.condition,
    formStepDetails.frameSize,
    formStepDetails.familyName,
    formStepDetailSubStepTwo.brandId,
    formStepDetailSubStepTwo.bicycleId,
    step,
  ]);

  const checkDisabledButtonCountinuesStepDetailsSubStepOne = useMemo(() => {
    return step === 1 && subStep === 1 && formStepDetails.brand === '';
  }, [formStepDetails.brand, step, subStep]);

  const isCompleteStepOne = useMemo(() => {
    return completedStep >= 2 || isCompleted || isCancelled || isExpired;
  }, [completedStep, isCancelled, isCompleted, isExpired]);

  const isCompleteStepSummaryImageShipping = useMemo(() => {
    return isCompleted || isCancelled || isExpired;
  }, [isCancelled, isCompleted, isExpired]);

  const hideSaveAndRestart = useMemo(() => {
    return isCompleteStepSummaryImageShipping || step === 6;
  }, [isCompleteStepSummaryImageShipping, step]);

  const onChangeFormStepSummary = useCallback(
    (values: TradeInScoreCardsProps) => {
      setFormStepDetails({
        ...formStepDetails,
        ...values,
      });
    },
    [formStepDetails],
  );

  const checkEditQuery = useMemo(() => {
    return query?.isEdit ? { isEdit: true } : {};
  }, [query]);

  const gotoStep = useCallback(
    (stepNumber: number) => {
      router.push({
        pathname: `/trade-in-account/trade-in/${query?.id}`,
        query: {
          step: stepNumber,
          ...checkEditQuery,
        },
      });
    },
    [checkEditQuery, query, router],
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
    setFormStepDetails({
      brand: '',
      familyName: '',
      frameSize: '',
      upgradeCompIds: [],
      condition: '',
      tradeInValue: undefined,
    });
    dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
    setTimeout(() => {
      gotoStandardQuote();
    }, 0);
  }, [dispatch, gotoStandardQuote, gotoStep, query, step]);

  const handleSubmitStepSummarySubStepOne = useCallback(async () => {
    // setSubStep(2);
  }, []);

  const handleSubmitStepSummarySubStepFour = useCallback(async () => {
    const values = formStepDetailsSubStepThreeRef?.current?.values;
    const payload = {
      chargerIncluded: values.chargerIncluded === 'true',
      hasKey: values.hasKey === 'true',
      isTamperedWith: values.isTamperedWith === 'true',
      hasDiagnosticReport: values.hasDiagnosticReport === 'true',
      eBikeHours: values.eBikeHours,
      eBikeMileage: values.eBikeMileage,
      ebikeSubtypeId: values.ebikeSubtypeId,
    };
    setFormStepDetailSubStepTwo({
      ...formStepDetailSubStepTwo,
      ...payload,
      isEbike: true,
    });
    setFormStepDetails({
      ...formStepDetails,
      ...payload,
    });
    setSubStep(5);
  }, [formStepDetailSubStepTwo, formStepDetails]);

  const handleAddTradeInDropOffRequest = useCallback(async () => {
    await addTradeInDropOffRequest({
      brandId: formStepDetailSubStepTwo.brandId,
      modelId: formStepDetailSubStepTwo.modelId,
      partnerId: userInfo?.partner,
      step: 'VIEW_CONDITION',
      yearId: formStepDetailSubStepTwo.yearId,
    });
  }, [formStepDetailSubStepTwo.brandId, formStepDetailSubStepTwo.modelId, formStepDetailSubStepTwo.yearId, userInfo]);

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
    if (target) {
      printContent(target.innerHTML);
    }
  }, []);

  const handleUploadStepCompleteListCreateScorecardQuantity = useCallback(
    (stepp: number) => {
      const cloneArr = cloneDeep(listDataStepEbikeQuote);
      cloneArr[indexScorecardSelected] = {
        ...cloneArr[indexScorecardSelected],
        indexStepComplete: stepp,
        step: stepp !== 4 ? stepp : 2,
      };
      dispatch(
        scoreCardAction.setCreateScorecardQuantity({
          listDataStepEbikeQuote: cloneArr,
        }),
      );
    },
    [dispatch, indexScorecardSelected, listDataStepEbikeQuote],
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
      const cloneArr = cloneDeep(listDataStepEbikeQuote);
      cloneArr[indexScorecardSelected] = {
        ...cloneArr[indexScorecardSelected],
        subStep: numbSubStep,
      };
      dispatch(
        scoreCardAction.setCreateScorecardQuantity({
          listDataStepEbikeQuote: cloneArr,
        }),
      );
    },
    [dispatch, indexScorecardSelected, listDataStepEbikeQuote],
  );

  const handleCountinues = useCallback(async () => {
    setLoadingButton(true);
    if (step === 1) {
      switch (subStep) {
        case 1: {
          formStepDetailsSubStepOneRef?.current?.handleSubmit();
          setLoadingButton(false);
          if (!formStepDetails.familyName || formStepDetails.familyName === '') {
            handleSetSubStepList(1.5);
            setSubStep(1.5);
            return;
          }
          handleSetSubStepList(2);
          setSubStep(2);
          break;
        }
        case 1.5: {
          handleSetSubStepList(2);
          setSubStep(2);
          break;
        }
        case 2: {
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
          handleSubmitStepSummarySubStepFour();
          break;
        }
        case 5: {
          handleSetSubStepList(5);
          setSubStep(6);
          break;
        }
        case 6: {
          handleSetSubStepList(6);
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
  }, [
    formStepDetails.familyName,
    gotoStep,
    handleSetSubStepList,
    handleSubmitStepFour,
    handleSubmitStepSummarySubStepFour,
    handleSubmitStepThreeStart,
    step,
    subStep,
  ]);

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
      const cloneArr = cloneDeep(listDataStepEbikeQuote);
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
              listDataStepEbikeQuote: cloneArr,
              indexScorecardSelected: findIndex,
            }),
          );
          router.push({
            pathname: `/trade-in-account/trade-in/ebike-quote`,
          });
          return;
        }

        // find complete
        const findIndexComplele = cloneArr.findIndex((it) => it.indexStepComplete >= 1);
        if (findIndexComplele !== -1) {
          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              listDataStepEbikeQuote: cloneArr,
              indexScorecardSelected: findIndexComplele,
            }),
          );
          return router.push({
            pathname: `/trade-in-account/trade-in/${response?.id}`,
            query: {
              step: listDataStepEbikeQuote[findIndexComplele]?.step,
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
          listDataStepEbikeQuote: cloneArr,
        }),
      );
      router.push({
        pathname: `/trade-in-account/trade-in/${response?.id}`,
        query: {
          step: 2,
        },
      });
    },
    [dispatch, indexScorecardSelected, listDataStepEbikeQuote, router],
  );

  const handleSubmitStandardQuoteStepOneNextToStepTwo = useCallback(
    async (isInstantPayoutsss: boolean, action?: string) => {
      const { isEdit } = checkEditQuery;
      try {
        setLoadingButton(true);
        let params: CreateNewTradeInParams = {
          isInstantPayout: isInstantPayoutsss,
        };
        if (isEdit) {
          params = {
            ...params,
            id: query?.id,
          };
        }
        let payload: CreateNewTradeInBody = {
          bicycleId: formStepDetailSubStepTwo.bicycleId,
          chargerIncluded: formStepDetails.chargerIncluded || false,
          clean: null,
          compRequests: [{ compId: '178', value: formStepDetails.frameSize }],
          condition: formStepDetails.condition,
          hasDiagnosticReport: formStepDetails.hasDiagnosticReport || false,
          hasKey: formStepDetails.hasKey || false,
          isEbike: true,
          isTamperedWith: formStepDetails.isTamperedWith || false,
          upgradeCompIds: formStepDetails?.upgradeCompIds?.length
            ? formStepDetails?.upgradeCompIds?.filter((it: any) => !!it.value).map((it: any) => it.value)
            : [],
          value: Number(tradeInValue),
        };
        if (formStepDetails.ebikeSubtypeId !== '' && formStepDetails.ebikeSubtypeId !== '-1') {
          payload = {
            ...payload,
            ebikeSubtypeId: formStepDetails.ebikeSubtypeId,
          };
        }
        if (formStepDetails.eBikeHours !== '') {
          payload = {
            ...payload,
            eBikeHours: Number(formStepDetails.eBikeHours),
          };
        }
        if (formStepDetails.eBikeMileage !== '') {
          payload = {
            ...payload,
            eBikeMileage: Number(formStepDetails.eBikeMileage),
          };
        }

        if (action === 'isSave') {
          payload = {
            ...payload,
            save: true,
          };
        }

        const response: CreateNewTradeInResponse = await (isEdit
          ? updateNewTradeIn(payload, params)
          : createNewTradeIn(payload, params));
        switch (action) {
          case 'isSave': {
            if (listDataStepEbikeQuote.length > 1) {
              const _data = listDataStepEbikeQuote[indexScorecardSelected];
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
      formStepDetailSubStepTwo.bicycleId,
      formStepDetails,
      tradeInValue,
      query,
      handleListCreateScorecardQuantity,
      listDataStepEbikeQuote,
      indexScorecardSelected,
      router,
      gotoTradeInhistory,
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

        let cloneArr = cloneDeep(listDataStepEbikeQuote);
        // find isDefaultFillDataStepSummary
        const findFillData = listDataStepEbikeQuote.find((it) => it.dataStepSummary);
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

        if (isSave) {
          gotoTradeInhistory();
          return;
        }
        setLoadingButton(false);

        if (checkUncreateScorecard) {
          const indexUncreateScorecard = listDataStepEbikeQuote.findIndex(
            (it) => !it.isDecline && (!it.indexStepComplete || it.indexStepComplete < 1),
          );
          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              listDataStepEbikeQuote: cloneArr,
              indexScorecardSelected: indexUncreateScorecard,
            }),
          );
          if (listDataStepEbikeQuote[indexUncreateScorecard]?.id) {
            return router.push({
              pathname: `/trade-in-account/trade-in/${listDataStepEbikeQuote[indexUncreateScorecard]?.id}`,
              query: {
                step: 2,
                ...checkEditQuery,
              },
            });
          }
          return router.push(`/trade-in-account/trade-in/ebike-quote`);
        }

        dispatch(
          scoreCardAction.setCreateScorecardQuantity({
            listDataStepEbikeQuote: cloneArr,
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
      listDataStepEbikeQuote,
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
        if (listDataStepEbikeQuote?.length > 1) {
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
      listDataStepEbikeQuote,
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

  const handleSubmitModalSaveAsQuote = useCallback(
    async (value: SaveAsQuoteData) => {
      const params = {
        isInstantPayout: false,
      };
      const payload: CreateNewTradeInBody = {
        bicycleId: formStepDetailSubStepTwo.bicycleId,
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
        value: Number(tradeInValue),
        tradeInSaveAsQuoteRequest: {
          customerEmail: value?.customer_email,
          customerName: value?.customer_name,
          customerPhone: value?.customer_phone,
          ownerFirstName: value?.owner_first_name,
          ownerLastName: value?.owner_last_name,
          notes: value?.notes,
          shopEmployee: value?.shop_employee,
        },
      };
      try {
        const response: any = await saveAsQuote(payload, params);

        const cloneArr = cloneDeep(listDataStepEbikeQuote);
        cloneArr[indexScorecardSelected].isSaveQuote = true;
        const findAnotherSaveQuote = cloneArr.findIndex(
          (it, index) => !it.isSaveQuote && index !== indexScorecardSelected,
        );
        setIsOpenModalSuccessSaveAsQuote(true);
        dispatch(
          scoreCardAction.setCreateScorecardQuantity({
            listDataStepEbikeQuote: cloneArr,
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
          router.push({
            pathname: `/trade-in-account/trade-in/history`,
          });
        }, 2000);
      } catch (_error) {
        toastError(_error);
      }
    },
    [
      formStepDetailSubStepTwo.bicycleId,
      formStepDetails,
      tradeInValue,
      listDataStepEbikeQuote,
      indexScorecardSelected,
      dispatch,
      router,
      checkEditQuery,
    ],
  );

  const renderForm = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <StepDetail
            form={formStepDetails}
            handleSubmitModalSaveAsQuote={handleSubmitModalSaveAsQuote}
            subStep={subStep}
            formStepDetailsSubStepOneRef={formStepDetailsSubStepOneRef}
            formStepDetailsSubStepThreeRef={formStepDetailsSubStepThreeRef}
            formStepDetailSubStepTwo={formStepDetailSubStepTwo}
            onChangeForm={onChangeFormStepSummary}
            handleSubmitStepSummarySubStepOne={handleSubmitStepSummarySubStepOne}
            handleSubmitStepSummarySubStepFour={handleSubmitStepSummarySubStepFour}
            setFormStepDetailSubStepTwo={setFormStepDetailSubStepTwo}
            handleAddTradeInDropOffRequest={handleAddTradeInDropOffRequest}
            handleSubmitStandardQuoteStepOneNextToStepTwo={handleSubmitStandardQuoteStepOneNextToStepTwo}
            handleDeclineStepOne={handleDeclineStepOne}
            isCompleted={
              (isCompleteStepOne && query?.editStepDetailOfQuote !== 'true') ||
              listDataStepEbikeQuote[indexScorecardSelected]?.indexStepComplete >= 1 ||
              listDataStepEbikeQuote[indexScorecardSelected]?.isDecline
            }
            gotoCustomQuote={gotoCustomQuote}
            handleCountinues={handleCountinues}
          />
        );

      case 2:
        return (
          <StepSummary
            handleSubmitStepSummary={handleSubmitStepSummary}
            handleBackPreviousStep={handleBackPreviousStep}
            isCompleted={isCompleteStepSummaryImageShipping}
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
    formStepDetails,
    handleSubmitModalSaveAsQuote,
    subStep,
    formStepDetailSubStepTwo,
    onChangeFormStepSummary,
    handleSubmitStepSummarySubStepOne,
    handleSubmitStepSummarySubStepFour,
    handleAddTradeInDropOffRequest,
    handleSubmitStandardQuoteStepOneNextToStepTwo,
    handleDeclineStepOne,
    isCompleteStepOne,
    query,
    listDataStepEbikeQuote,
    indexScorecardSelected,
    gotoCustomQuote,
    handleCountinues,
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
    if (step === 1 && subStep === 1) {
      handleSetSubStepList(1);
      router.push(`/trade-in-account/trade-in/new`);
      return;
    }
    if (step === 1 && subStep === 1.5) {
      handleSetSubStepList(1);
      setSubStep(1);
      return;
    }
    if (step === 1) {
      handleSetSubStepList(subStep - 1);
      setSubStep(subStep - 1);
      return;
    }
    gotoStep(Number(query?.step) - 1);
  }, [gotoStep, handleSetSubStepList, query, router, step, subStep]);

  const closeModalSuccessSaveAsQuote = useCallback(() => {
    setIsOpenModalSuccessSaveAsQuote(false);
    router.push(`/trade-in-account/trade-in/history`);
  }, [router]);

  const renderButtonSession = useMemo(() => {
    if (
      (step === 1 &&
        (subStep === 1 ||
          subStep === 1.5 ||
          subStep === 2 ||
          subStep === 3 ||
          subStep === 4 ||
          subStep === 5 ||
          subStep === 6)) ||
      step === 3 ||
      step === 4
    ) {
      return (
        <>
          <div className={cx(classes.wrapButton, classes.wrapButtonfixed)}>
            {isCompleteStepOne && step === 1 && subStep === 1 ? null : (
              <Button
                buttonType="outline"
                onClick={handleBackScreen}
                className={cx(classes.btnBack, classes.customButtonSize)}>
                <img src={images.messages.icArrowLeftGrey} alt="icon_next" className="mr-4" />
                Back
              </Button>
            )}
            {(subStep !== 6 ||
              (subStep === 6 && isCompleteStepOne && !listDataStepEbikeQuote[indexScorecardSelected]?.isDecline)) && (
              <Button
                disabled={
                  checkDisabledButtonCountinues || loadingButton || checkDisabledButtonCountinuesStepDetailsSubStepOne
                }
                className={classes.customButtonSize}
                onClick={handleCountinues}>
                {step === 4 && !isCompleteStepSummaryImageShipping ? 'Submit and Print Scorecard' : 'Continue'}
                {(step !== 4 || isCompleteStepSummaryImageShipping) && (
                  <img src={images.iconNextWhite} alt="icon_next" className="ml-4" />
                )}
              </Button>
            )}
          </div>
          <div className={classes.wrapButtonSupportFixed} />
        </>
      );
    }
    return null;
  }, [
    checkDisabledButtonCountinues,
    checkDisabledButtonCountinuesStepDetailsSubStepOne,
    handleBackScreen,
    handleCountinues,
    indexScorecardSelected,
    isCompleteStepOne,
    isCompleteStepSummaryImageShipping,
    listDataStepEbikeQuote,
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
        setFormStepOneSelectImage={setFormStepDetailSubStepTwo}
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

      <PrintScoreCard />
    </div>
  );
};

export default EBikeQuote;
