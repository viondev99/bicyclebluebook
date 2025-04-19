/* eslint-disable no-unused-expressions */
/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-new-wrappers */
/* eslint-disable import/no-cycle */
import Button from '@ui/Buttons/Primary/Button';
import { addTradeInDropOffRequest } from 'api/partner/account.api';
import {
  CreateNewTradeInBody,
  CreateNewTradeInResponse,
  saveAsQuote,
  tradeInDetailDecline,
  TradeInDetailDeclineBody,
  UpdateTradeInAppPayload,
  updateTradeInAppRequest,
  updateTradeInStatusStageRequest,
  uploadImageTradeInAppRequest,
} from 'api/partner/scorecard.api';
import cx from 'classnames';
import { getTradeInPrice } from 'helpers/utilities.helper';
import { toastError } from 'helpers/utils.helper';
import StoreState from 'model/store';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import { IsInstantPayout, submitTradeInRequest } from 'api/partner/trade-in-request.api';
import {
  stagesToTextHistoryTradeIn,
  statusToTextHistoryLead,
} from 'components/PartnerPortal/CostCalculator/constraint';
import { ImageUpload } from 'model/api/account/personal/listings.model';
import images from '@images';
import Header from './Header/index';
import { ModalDeclineStepOneFormValue } from '../TradeInScoreCardComponent/Modal/ModalDeclineStepOne';
import Stepper from '../TradeInScoreCardComponent/Stepper/Stepper';
import {
  FormStepDetailsDefaultValue,
  FormStepOneSubStepThreeDefaultValue,
  TradeInScoreCardsProps,
} from './formDefaultValue';
import StepDetail from './Step/StepDetail';
import classes from './trade-in.module.scss';
import { SaveAsQuoteData } from '../StandardQuote/formDefaultValue';

const TradeInRequest: FC = () => {
  const router = useRouter();
  const { query } = useRouter();

  const dispatch = useDispatch();
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  const dataTradeInBicycle = useSelector((store: StoreState) => store.partner.account.dataTradeInBicycle);
  const detailPartnerLocation = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);
  const dataTradeInRequest = useSelector((store: StoreState) => store.partner.scorecard.dataTradeInRequest); // done
  const [loadingButton, setLoadingButton] = useState(false);
  const [upgradeCompIdsSelected, setUpgradeCompIdsSelected] = useState([]);
  const formStepDetailsSubStepOneRef = useRef(null);
  const formStepDetailsSubStepThreeRef = useRef(null);
  const [subStep, setSubStep] = useState(1);
  const [oldImageStepThree, setOldImageStepThree] = useState<any[]>([]);
  const [tradeInImages, setTradeInImages] = useState<ImageUpload[]>([]);
  const [formStepDetails, setFormStepDetails] = useState(FormStepDetailsDefaultValue);
  const [formStepDetailSubStepTwo, setFormStepDetailSubStepTwo] = useState<GetListTradeInBicycleParams>(
    FormStepOneSubStepThreeDefaultValue,
  );
  const [isOpenModalSuccessSaveAsQuote, setIsOpenModalSuccessSaveAsQuote] = useState(false);

  const step = useMemo(() => {
    return Number(query?.step) || 1;
  }, [query]);

  useEffect(() => {
    if (dataTradeInRequest) {
      setFormStepDetails({
        ...formStepDetails,
        brand: dataTradeInRequest?.bicycleBaseInfo?.bicycleBrandId
          ? `${dataTradeInRequest?.bicycleBaseInfo?.bicycleBrandId}`
          : '',
        familyName: dataTradeInRequest?.bicycleBaseInfo?.bicycleProductFamily
          ? `${dataTradeInRequest?.bicycleBaseInfo?.bicycleProductFamily}`
          : '',
        upgradeCompIds: dataTradeInRequest?.upgradeComps || [],
        condition: dataTradeInRequest?.condition || '',
        tradeInValue: dataTradeInRequest?.tradeValue || '',
        ownerDetails: {
          ownerPhone: dataTradeInRequest?.owner?.phone,
        },
      });
      setFormStepDetailSubStepTwo({
        ...formStepDetailSubStepTwo,
        brandId: dataTradeInRequest?.bicycleBaseInfo?.bicycleBrandId
          ? `${dataTradeInRequest?.bicycleBaseInfo?.bicycleBrandId}`
          : '',
        modelId: dataTradeInRequest?.bicycleBaseInfo?.bicycleModelId
          ? `${dataTradeInRequest?.bicycleBaseInfo?.bicycleModelId}`
          : '',
        yearId: dataTradeInRequest?.bicycleBaseInfo?.bicycleYearId
          ? `${dataTradeInRequest?.bicycleBaseInfo?.bicycleYearId}`
          : '',
        bicycleId: dataTradeInRequest?.bicycleBaseInfo?.bicycleId
          ? `${dataTradeInRequest?.bicycleBaseInfo?.bicycleId}`
          : '',
      });
      setOldImageStepThree(
        dataTradeInRequest?.images?.length
          ? [...dataTradeInRequest?.images].map((it: any) => {
              return {
                ...it,
                id: it?.id,
                url: it?.fullLink,
              };
            })
          : [],
      );
      setTradeInImages(
        dataTradeInRequest?.images?.length
          ? [...dataTradeInRequest?.images].map((it: any) => {
              return {
                ...it,
                id: it?.id,
                url: it?.fullLink,
              };
            })
          : [],
      );
    }
  }, [dataTradeInRequest]);

  useEffect(() => {
    if (query?.tradeInRequestId && query?.tradeInId) {
      dispatch(scoreCardAction.getStepDetailRequest(query.tradeInId));
    }
  }, [dispatch, query]);

  const checkDisabledButtonCountinues = useMemo(() => {
    return (
      (subStep === 6 && formStepDetails.condition === '') ||
      (subStep === 3 && formStepDetailSubStepTwo.brandId === '') ||
      (subStep === 2 && formStepDetailSubStepTwo.bicycleId === '')
    );
  }, [subStep, formStepDetails.condition, formStepDetailSubStepTwo.brandId, formStepDetailSubStepTwo.bicycleId]);

  const checkDisabledButtonCountinuesStepDetailsSubStepOne = useMemo(() => {
    return subStep === 1 && (formStepDetails.brand === '' || formStepDetails.familyName === '');
  }, [formStepDetails.brand, formStepDetails.familyName, subStep]);

  const onChangeFormStepSummary = useCallback(
    (values: TradeInScoreCardsProps) => {
      setFormStepDetails({
        ...formStepDetails,
        ...values,
      });
    },
    [formStepDetails],
  );

  const gotoStep = useCallback(
    (stepNumber: number) => {
      router.push({
        pathname: `/trade-in-account/trade-in/${query?.id}`,
        query: {
          step: stepNumber,
        },
      });
    },
    [query, router],
  );
  const gotoStandardQuote = useCallback(() => {
    router.push({
      pathname: `/trade-in-account/trade-in/new`,
    });
  }, [router]);

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
    setFormStepDetailSubStepTwo({
      brandId: '',
      chargerIncluded: null,
      ebikeSubtypeId: -1,
      hasKey: null,
      isEbike: null,
      modelId: '',
      yearId: '',
      bicycleId: '',
      eBikeHours: '',
      brand: '',
      familyName: '',
      frameSize: '',
      upgradeCompIds: [],
      condition: '',
      tradeInValue: undefined,
      isTamperedWith: false,
      hasDiagnosticReport: false,
      eBikeMileage: '',
      bicycleIndex: 1,
    });
    gotoStandardQuote();
  }, [gotoStandardQuote, gotoStep, query, step]);

  const handleSubmitStepSummarySubStepOne = useCallback(async () => {
    setSubStep(2);
  }, []);

  const handleSubmitStepSummarySubStepThree = useCallback(async () => {
    setSubStep(4);
  }, []);

  const handleAddTradeInDropOffRequest = useCallback(async () => {
    await addTradeInDropOffRequest({
      brandId: formStepDetailSubStepTwo.brandId,
      modelId: formStepDetailSubStepTwo.modelId,
      partnerId: userInfo?.partner,
      step: 'VIEW_CONDITION',
      yearId: formStepDetailSubStepTwo.yearId,
    });
  }, [formStepDetailSubStepTwo.brandId, formStepDetailSubStepTwo.modelId, formStepDetailSubStepTwo.yearId, userInfo]);

  const handleCountinues = useCallback(async () => {
    setLoadingButton(true);
    if (step === 1) {
      switch (subStep) {
        case 2: {
          setSubStep(3);
          break;
        }
        case 3: {
          handleSubmitStepSummarySubStepThree();
          break;
        }
        case 4: {
          setSubStep(5);
          break;
        }
        case 5: {
          setSubStep(6);
          break;
        }
        case 6: {
          setSubStep(7);
          break;
        }
        case 7: {
          setSubStep(8);
          break;
        }
        case 8: {
          gotoStep(2);
          break;
        }
        default:
          break;
      }
    }
    setTimeout(() => {
      setLoadingButton(false);
    }, 0);
  }, [gotoStep, handleSubmitStepSummarySubStepThree, step, subStep]);

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

  const formatName = useMemo(() => {
    return dataTradeInRequest?.owner?.name.split(' ');
  }, [dataTradeInRequest]);

  const handleUploadImageCustomQuote = useCallback(
    async (id: number) => {
      let listOldImageIdsNewOrder: any = [];
      let listDeleted: any = [];

      for (const item of oldImageStepThree) {
        listOldImageIdsNewOrder = [...listOldImageIdsNewOrder, ...[item.id]];

        if (!tradeInImages.some((it: any) => it.id === item.id)) {
          listDeleted = [...listDeleted, ...[item.id]];
        }
      }

      const formData: any = new FormData();
      tradeInImages
        .filter((it) => it.file)
        .forEach((item) => {
          formData.append('images', item?.file);
        });

      try {
        setLoadingButton(true);
        await uploadImageTradeInAppRequest({
          scorecardId: Number(id),
          newImages: formData,
          oldImageIdsNewOrder: listOldImageIdsNewOrder,
        });
      } catch (error) {
        setLoadingButton(false);
      }
    },
    [oldImageStepThree, tradeInImages],
  );

  const handleSubmitStepDetails = useCallback(
    async (isInstantPayoutsss: boolean, action?: string) => {
      try {
        setLoadingButton(true);
        const Wheels = upgradeCompIdsSelected?.filter((it) => it?.key === 'Wheels')[0]?.value;
        const Drivetrain = upgradeCompIdsSelected?.filter((it) => it?.key === 'Drivetrain')[0]?.value;
        const payloadTradeInApp: UpdateTradeInAppPayload = {
          id: dataTradeInRequest?.tradeInRequestId,
          bicycleId: String(formStepDetailSubStepTwo?.bicycleId),
          isDraft: true,
          condition: formStepDetails?.condition,
          value: Number(tradeInValue),
          ownerDetails: {
            ownerEmail: formStepDetails?.ownerDetails?.ownerEmail || dataTradeInRequest?.owner?.email || '',
            ownerFirstName: formStepDetails?.ownerDetails?.ownerFirstName || formatName?.length ? formatName[0] : '',
            ownerLastName:
              formStepDetails?.ownerDetails?.ownerLastName || formatName?.length > 1
                ? formatName.slice(1, formatName.length).join(' ')
                : '',
            ownerPhone: formStepDetails?.ownerDetails?.ownerPhone || dataTradeInRequest?.owner?.phone || '',
            ownerZipCode: dataTradeInRequest?.owner?.zipCode,
          },
          driveTrainsModificationId: Drivetrain || -1,
          wheelsModificationId: Wheels || -1,
        };
        await updateTradeInAppRequest(payloadTradeInApp);
        await handleUploadImageCustomQuote(dataTradeInRequest?.tradeInRequestId);
        if (!isInstantPayoutsss) {
          const payload: { id: string | number; stage: string } = {
            stage: stagesToTextHistoryTradeIn.CONVERTED,
            id: dataTradeInRequest?.tradeInRequestId,
          };
          await updateTradeInStatusStageRequest(payload);
        }
        const params: IsInstantPayout = {
          isInstantPayout: isInstantPayoutsss,
        };
        const response = await submitTradeInRequest(`${dataTradeInRequest?.tradeInRequestId}`, params);
        if (action !== 'noAction') {
          router.push(`/trade-in-account/trade-in/${dataTradeInRequest?.tradeInId}?step=2`);
          return;
        }
        setLoadingButton(false);
        return response;
      } catch (error) {
        toastError(error);
        setLoadingButton(false);
      }
    },
    [
      dataTradeInRequest,
      formStepDetailSubStepTwo,
      formStepDetails,
      formatName,
      handleUploadImageCustomQuote,
      router,
      tradeInValue,
      upgradeCompIdsSelected,
    ],
  );

  const handleDeclineStepOne = useCallback(
    async (values: ModalDeclineStepOneFormValue) => {
      try {
        const tradeRqInId = Number(query?.tradeInId);
        let payload: TradeInDetailDeclineBody = {
          comment: values?.comment,
          reasonDeclineId: values?.reasonDeclineId,
          tradeInId: null,
        };
        if (tradeRqInId) {
          payload = {
            ...payload,
            tradeInId: tradeRqInId,
          };
        } else {
          const response: CreateNewTradeInResponse = await handleSubmitStepDetails(false, 'noAction');
          payload = {
            ...payload,
            tradeInId: response?.id,
          };
        }
        if (values?.reasonDeclineId === '3') {
          payload = {
            ...payload,
            priceExpected: values?.priceExpected,
          };
        }
        await tradeInDetailDecline(payload);
        return onRestart();
      } catch (error) {
        toastError(error);
      }
    },
    [handleSubmitStepDetails, onRestart, query],
  );

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
        await saveAsQuote(payload, params);
        setIsOpenModalSuccessSaveAsQuote(true);
      } catch (_error) {
        toastError(_error);
      }
    },
    [formStepDetails, formStepDetailSubStepTwo.bicycleId, tradeInValue],
  );

  const isEdit = useMemo(() => {
    const status = dataTradeInRequest?.statusStage?.status;
    return status === statusToTextHistoryLead.NEW_LEAD || status === statusToTextHistoryLead.OPEN;
  }, [dataTradeInRequest]);

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
            handleSubmitStepSummarySubStepThree={handleSubmitStepSummarySubStepThree}
            setFormStepDetailSubStepTwo={setFormStepDetailSubStepTwo}
            handleAddTradeInDropOffRequest={handleAddTradeInDropOffRequest}
            handleSubmitStepDetails={handleSubmitStepDetails}
            handleDeclineStepOne={handleDeclineStepOne}
            gotoCustomQuote={gotoCustomQuote}
            setUpgradeCompIds={setUpgradeCompIdsSelected}
            upgradeCompIds={upgradeCompIdsSelected}
            isCompleted={isEdit}
            tradeInImages={tradeInImages}
            setTradeInImages={setTradeInImages}
          />
        );

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
    handleSubmitStepSummarySubStepThree,
    handleAddTradeInDropOffRequest,
    handleSubmitStepDetails,
    handleDeclineStepOne,
    gotoCustomQuote,
    upgradeCompIdsSelected,
    isEdit,
    tradeInImages,
  ]);

  const handleBackScreen = useCallback(() => {
    if (step === 1 && subStep === 1) {
      router.push(`/trade-in-account/trade-in/history?tab=trade-in-request`);
      return;
    }
    if (step === 1) {
      setSubStep(subStep - 1);
      return;
    }
    gotoStep(Number(query?.step) - 1);
  }, [gotoStep, query, router, step, subStep]);

  const renderButtonSession = useMemo(() => {
    if (step === 1 && subStep === 1) {
      return (
        <div className={classes.btnWidth100}>
          <div className={classes.wrapBottom}>
            <div className={classes.wrapButton}>
              <Button
                className={classes.customButtonSize}
                disabled={loadingButton}
                onClick={() => formStepDetailsSubStepOneRef?.current?.handleSubmit()}>
                Continue <img src={images.iconNextWhite} alt="icon_next" className="ml-4" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (
      (step === 1 &&
        (subStep === 2 ||
          subStep === 3 ||
          subStep === 4 ||
          subStep === 5 ||
          subStep === 6 ||
          subStep === 7 ||
          subStep === 8)) ||
      step === 3 ||
      step === 4
    ) {
      return (
        <div className={classes.wrapButton}>
          <div className={classes.btnBack} onClick={handleBackScreen}>
            Back
          </div>
          {subStep !== 8 && (
            <Button
              disabled={checkDisabledButtonCountinues || loadingButton}
              className={classes.customButtonSize}
              onClick={handleCountinues}>
              Continue
              <img src={images.iconNextWhite} alt="icon_next" className="ml-4" />
            </Button>
          )}
        </div>
      );
    }
    return null;
  }, [checkDisabledButtonCountinues, handleBackScreen, handleCountinues, loadingButton, step, subStep]);

  return (
    <div className={cx(classes.tradeInLayout, classes.container)}>
      <Head>
        <title>New Trade In Request</title>
      </Head>
      <Header hideSave={true} hideRestart={true} />
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
      {/* {isOpenModalSuccessSaveAsQuote && (
        <Suspense fallback={null}>
          <ModalSuccessSaveAsQuote isOpen={isOpenModalSuccessSaveAsQuote} onClose={closeModalSuccessSaveAsQuote} />
        </Suspense>
      )} */}
    </div>
  );
};
export default TradeInRequest;
