/* eslint-disable no-unused-expressions */
/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-new-wrappers */
/* eslint-disable import/no-cycle */
import Button from '@ui/Buttons/Primary/Button';
import {
  checkTradeInCompleteStepRequest,
  CheckTradeInCompleteStepResponse,
  CompleteCustomQuoteRequest,
  CompleteCustomRedBarnQuoteResponse,
  completeCustomRedBarnQuoteUploadImageRequest,
  deleteCustomRedBarnQuoteUploadImageRequest,
  saveCustomRedBarnQuoteRequest,
  saveFirstCustomRedBarnQuoteRequest,
} from 'api/partner/scorecard.api';
import cx from 'classnames';
import { FormikProps } from 'formik';
import { DATA_RESET_CREATE_SCORECARD_QUANTITY, emailValidate, phoneValidate } from 'helpers/utilities.helper';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import cloneDeep from 'lodash/cloneDeep';
import trim from 'lodash/trim';
import { ImageUpload } from 'model/api/account/personal/listings.model';
import { CommonComponents } from 'model/store/common.model';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComponents } from 'store/common/common.action';
import { getBaseComponent } from 'store/value-guide/value-guide.action';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import StoreState from 'model/store';
import { ScorecardStatuses } from 'constants/scorecard';
import t from 'helpers/language';
import images from '@images';
import Header from '../TradeInScoreCardComponent/Header';
import Stepper from '../TradeInScoreCardComponent/Stepper/Stepper';
import {
  FormStepContact,
  formStepContactDefaultData,
  FormStepDetailSubStepFour,
  FormStepDetailSubStepFourDefaultData,
  FormStepDetailSubStepOne,
  FormStepDetailSubStepOneDefaultData,
  FormStepDetailSubStepTwo,
  FormStepDetailSubStepTwoDefaultData,
} from './formDefaultValue';
import StepComplete from './Step/StepComplete';
import StepContact from './Step/StepContact';
import StepDetail from './Step/StepDetail';
import StepImages from './Step/StepImages';
import classes from './trade-in.module.scss';
import ModalValueProvided from '../TradeInScoreCardComponent/Modal/ModalValueProvided';

interface Props {
  isCreateNewCustomQuote?: boolean;
}

const CustomRedBarnQuote: FC<Props> = ({ isCreateNewCustomQuote }) => {
  const router = useRouter();
  const { query } = useRouter();

  const dataDetailCustomQuote = useSelector((state: StoreState) => state.partner.scorecard.dataDetailCustomQuote);

  const formStepDetailSubStepOneRef = useRef<FormikProps<FormStepDetailSubStepOne>>();
  const [formStepDetailSubStepOne, setFormStepDetailSubStepOne] = useState<FormStepDetailSubStepOne>(
    FormStepDetailSubStepOneDefaultData,
  );

  const formStepDetailSubStepTwoRef = useRef<FormikProps<FormStepDetailSubStepTwo>>();
  const [formStepDetailSubStepTwo, setFormStepDetailSubStepTwo] = useState<FormStepDetailSubStepTwo>(
    FormStepDetailSubStepTwoDefaultData,
  );

  const [upgradeCompIds, setUpgradeCompIds] = useState([]);

  const [formStepDetailSubStepFour, setFormStepDetailSubStepFour] = useState<FormStepDetailSubStepFour>(
    FormStepDetailSubStepFourDefaultData,
  );

  const [tradeInImages, setTradeInImages] = useState<ImageUpload[]>([]);
  const [oldImageStepThree, setOldImageStepThree] = useState<any[]>([]);

  const formStepContactTwoRef = useRef<FormikProps<FormStepContact>>();
  const [formStepContact, setFormStepContact] = useState<FormStepContact>(formStepContactDefaultData);

  const [step, setStep] = useState(Number(query?.step) || 1);
  const [subStep, setSubStep] = useState(Number(query?.subStep) || 1);
  const [visibleSaveStep, setVisibleSaveStep] = useState(false);

  const dispatch = useDispatch();
  const [loadingButton, setLoadingButton] = useState(false);

  const [isCompleteCustomQuote, setIsCompleteCustomQuote] = useState(false);
  const [visibleModalValueProvided, setVisibleModalValueProvided] = useState(false);
  const { createScorecardQuantity, listDataStepCustomQuote, indexScorecardSelected } = useSelector(
    (state: StoreState) => state.partner.scorecard.createScoreCardQuantityData,
  );
  const [completedStepCustomQuote, setCompletedStepCustomQuote] = useState(1);

  const checkEditQuery = useMemo(() => {
    return query?.isEdit ? { isEdit: true } : {};
  }, [query]);

  const gotoStep = useCallback(
    (stepNumber: number, subStepNumber?: number) => {
      const _query = {
        step: stepNumber,
        ...checkEditQuery,
      };
      if (query?.id) {
        router.push({
          pathname: `/trade-in-account/trade-in/custom-red-barn-quote/${query?.id}`,
          query: _query,
        });
      } else {
        router.push({
          pathname: `/trade-in-account/trade-in/custom-red-barn-quote/`,
          query: _query,
        });
      }
    },
    [query, router],
  );

  const handleChangeStepCustomQuote = useCallback((index: number) => {
    if (index === 0) {
      gotoStep(index + 1, 1);
      setSubStep(1);
      return;
    }
    if (checkEditQuery?.isEdit) {
      setCompletedStepCustomQuote(4);
    }
    gotoStep(index + 1);
  }, []);

  const handleCheckCompleteStep = useCallback(() => {
    if (dataDetailCustomQuote && subStep !== 4) {
      const status = dataDetailCustomQuote?.status;
      if (status === ScorecardStatuses.PROVIDED_VALUE) {
        setVisibleModalValueProvided(true);
      } else {
        setVisibleModalValueProvided(false);
      }
      const isComplete =
        status === ScorecardStatuses.COMPLETED || status === ScorecardStatuses.CUSTOM_QUOTE_VALUE_PROVIDED;
      setIsCompleteCustomQuote(isComplete);
    }
  }, [dataDetailCustomQuote, subStep]);

  const hideSaveAndRestart = useMemo(() => {
    return step === 4 || isCompleteCustomQuote;
  }, [isCompleteCustomQuote, step]);

  useEffect(() => {
    if (checkEditQuery?.isEdit) {
      setCompletedStepCustomQuote(4);
    }
  }, [checkEditQuery]);

  useEffect(() => {
    return () => setVisibleModalValueProvided(false);
  }, []);

  useEffect(() => {
    dispatch(scoreCardAction.saveDetailCustomQuote(null));
  }, [dispatch]);

  useEffect(() => {
    handleGetDefault();
    handleMapDefaultParams();
    if (query?.id) {
      handleGetDefaultCustomQuote();
    }
    if (query?.step) {
      setStep(Number(query?.step));
    }
    if (query?.subStep) {
      setSubStep(Number(query?.subStep));
    }
  }, [query]);

  useEffect(() => {
    if (dataDetailCustomQuote && !isCreateNewCustomQuote) {
      // subStep 1
      setFormStepDetailSubStepOne({
        brandName: dataDetailCustomQuote?.brandName || '',
        modelName: dataDetailCustomQuote?.modelName || '',
        yearName: dataDetailCustomQuote?.yearName || '',
        serialNumber: dataDetailCustomQuote?.scorecardRedBarn?.serialNumber || '',
        compCustomQuotes: dataDetailCustomQuote?.sizeName || '',
        typeId: dataDetailCustomQuote?.typeId ? `${dataDetailCustomQuote.typeId}` : '',
      });
      // subStep 2
      const formStepDetailSubStepTwoDefault: Partial<FormStepDetailSubStepTwo> = {};
      dataDetailCustomQuote?.comps.forEach((item) => {
        if (item.componentId === 11) {
          formStepDetailSubStepTwoDefault.frameMaterial = item.value;
        }
        if (item.componentId === 92) {
          formStepDetailSubStepTwoDefault.rearShock = item.value;
        }
        if (item.componentId === 108) {
          formStepDetailSubStepTwoDefault.handlebars = item.value;
        }
        if (item.componentId === 110) {
          formStepDetailSubStepTwoDefault.stem = item.value;
        }
        if (item.componentId === 112) {
          formStepDetailSubStepTwoDefault.frontDerailleur = item.value;
        }
        if (item.componentId === 113) {
          formStepDetailSubStepTwoDefault.rearDerailleur = item.value;
        }
        if (item.componentId === 114) {
          formStepDetailSubStepTwoDefault.frontShock = item.value;
        }
        if (item.componentId === 163) {
          formStepDetailSubStepTwoDefault.crankset = item.value;
        }
        if (item.componentId === 177) {
          formStepDetailSubStepTwoDefault.wheels = item.value;
        }
        if (item.componentId === 180) {
          formStepDetailSubStepTwoDefault.brakeType = item.value;
        }
        if (item.componentId === 182) {
          formStepDetailSubStepTwoDefault.casette = item.value;
        }
        if (item.componentId === 191) {
          formStepDetailSubStepTwoDefault.shifters = item.value;
        }
        if (item.componentId === 211) {
          formStepDetailSubStepTwoDefault.frontBrake = item.value;
        }
        if (item.componentId === 212) {
          formStepDetailSubStepTwoDefault.rearBrake = item.value;
        }
      });
      setFormStepDetailSubStepTwo({
        ...formStepDetailSubStepTwo,
        ...formStepDetailSubStepTwoDefault,
      });
      // subStep 3
      setUpgradeCompIds(
        dataDetailCustomQuote?.upgradeComps?.length
          ? dataDetailCustomQuote?.upgradeComps?.map((it) => {
              return {
                key: `${it.name}`,
                value: Number(it.id),
              };
            })
          : [],
      );
      // subStep4
      const findSelectedCondition = dataDetailCustomQuote?.conditions?.length
        ? dataDetailCustomQuote?.conditions?.find((it) => it.select)
        : null;
      setFormStepDetailSubStepFour({
        condition: findSelectedCondition?.condition || '',
        note: dataDetailCustomQuote?.note,
      });
      // step image
      setOldImageStepThree(
        dataDetailCustomQuote?.tradeInRedBarnImages?.length
          ? [...dataDetailCustomQuote?.tradeInRedBarnImages].map((it: any) => {
              return {
                ...it,
                id: it?.id,
                url: it?.fullLink,
              };
            })
          : [],
      );
      setTradeInImages(
        dataDetailCustomQuote?.tradeInRedBarnImages?.length
          ? [...dataDetailCustomQuote?.tradeInRedBarnImages].map((it: any) => {
              return {
                ...it,
                id: it?.id,
                url: it?.fullLink,
              };
            })
          : [],
      );
      // step contact
      setFormStepContact({
        employeeEmail: dataDetailCustomQuote?.scorecardRedBarn?.employeeEmail || '',
        employeeLocation: dataDetailCustomQuote?.scorecardRedBarn?.employeeLocation || '',
        employeeName: dataDetailCustomQuote?.scorecardRedBarn?.employeeName || '',
        ownerEmail: dataDetailCustomQuote?.scorecardRedBarn?.ownerEmail || '',
        ownerName: dataDetailCustomQuote?.scorecardRedBarn?.ownerName || '',
        ownerPhone: dataDetailCustomQuote?.scorecardRedBarn?.ownerPhone || '',
      });
      handleCheckCompleteStep();
      setVisibleSaveStep(true);
    }
  }, [dataDetailCustomQuote, query]);

  const handleGetDefaultCustomQuote = useCallback(async () => {
    dispatch(scoreCardAction.getDetailCustomRedBarnQuote(`${query?.id}`));
  }, [dispatch, query]);

  const gotoStandardQuote = useCallback(() => {
    router.push({
      pathname: `/trade-in-account/trade-in/new`,
    });
  }, [router]);

  const handleBackPreviousStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const onRestart = useCallback(
    (isRestartOnly?: boolean) => {
      setStep(1);
      setSubStep(1);
      setVisibleSaveStep(false);
      formStepDetailSubStepOneRef?.current?.setValues({
        brandName: '',
        modelName: '',
        yearName: '',
        serialNumber: '',
        compCustomQuotes: '',
        typeId: '',
      });
      setFormStepDetailSubStepOne(FormStepDetailSubStepOneDefaultData);
      setFormStepDetailSubStepTwo(FormStepDetailSubStepTwoDefaultData);
      setUpgradeCompIds([]);
      setFormStepDetailSubStepFour(FormStepDetailSubStepFourDefaultData);
      setTradeInImages([]);
      setOldImageStepThree([]);
      setFormStepContact(formStepContactDefaultData);
      router.push(`/trade-in-account/trade-in/custom-red-barn-quote`);

      if (!isRestartOnly) {
        dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
        gotoStandardQuote();
      }
    },
    [dispatch, gotoStandardQuote, router],
  );

  const handleMapDefaultParams = useCallback(() => {
    if (query?.brand && query?.model && query?.year) {
      setFormStepDetailSubStepOne({
        ...formStepDetailSubStepOne,
        brandName: query?.brand ? decodeURIComponent(`${query?.brand}`) : '',
        modelName: query?.model ? decodeURIComponent(`${query?.model}`) : '',
        yearName: query?.year ? `${query?.year}` : '',
      });
      return;
    }
    setFormStepDetailSubStepOne({
      ...formStepDetailSubStepOne,
    });
  }, [formStepDetailSubStepOne, query]);

  const handleGetDefault = useCallback(() => {
    dispatch(getBaseComponent());
    dispatch(
      getComponents([
        CommonComponents.DetailBicycleMyListing,
        CommonComponents.Condition,
        CommonComponents.ComponentTypeCustomQuote,
      ]),
    );
  }, [dispatch]);

  const handleUploadImageCustomQuote = useCallback(
    async (id: string, isDraft?: boolean) => {
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
      formData.append('isAddImage', true);

      try {
        setLoadingButton(true);
        const idCustomRedBarnQuote = {
          redBarnCustomQuotesId: id,
        };
        if (listDeleted?.length === 0) {
          await completeCustomRedBarnQuoteUploadImageRequest(idCustomRedBarnQuote, formData, {
            isDraft,
            oldImageIdsNewOrder: listOldImageIdsNewOrder,
          });
        } else {
          await completeCustomRedBarnQuoteUploadImageRequest(idCustomRedBarnQuote, formData, {
            isDraft,
            oldImageIdsNewOrder: listOldImageIdsNewOrder,
          });
          await deleteCustomRedBarnQuoteUploadImageRequest(id, {
            isDraft,
            oldImageIdsNewOrder: listOldImageIdsNewOrder,
            imageIds: listDeleted,
          });
        }
      } catch (error) {
        setLoadingButton(false);
      }
    },
    [oldImageStepThree, tradeInImages],
  );

  const onSave = useCallback(async () => {
    if (visibleSaveStep) {
      try {
        const { compCustomQuotes, brandName, modelName, serialNumber, typeId, yearName } =
          formStepDetailSubStepOneRef?.current?.values || {};

        const {
          shifters,
          rearShock,
          handlebars,
          frontDerailleur,
          rearDerailleur,
          frontShock,
          crankset,
          wheels,
          brakeType,
          casette,
          frontBrake,
          rearBrake,
          stem,
          frameMaterial,
        } = formStepDetailSubStepTwoRef?.current?.values || {};

        const { condition, note } = formStepDetailSubStepFour || {};

        const { employeeEmail, employeeLocation, employeeName, ownerEmail, ownerName, ownerPhone } =
          formStepContactTwoRef?.current?.values || {};

        let payload: Partial<CompleteCustomQuoteRequest> = {
          draft: true,
          brandName: formStepDetailSubStepOne?.brandName || '',
          modelName: formStepDetailSubStepOne?.modelName || '',
          serialNumber: formStepDetailSubStepOne?.serialNumber || '',
          typeId: Number(formStepDetailSubStepOne?.typeId),
          upgradeCompIds: upgradeCompIds.filter((it) => it.value !== '').map((it) => it.value),
          yearId: Number(formStepDetailSubStepOne?.yearName),
          compCustomQuotes: [],
        };

        if (brandName && trim(`${brandName}`) !== '') {
          payload = {
            ...payload,
            brandName: trim(brandName),
          };
        }
        if (modelName && trim(`${modelName}`) !== '') {
          payload = {
            ...payload,
            modelName: trim(modelName),
          };
        }
        if (serialNumber && trim(`${serialNumber}`) !== '') {
          payload = {
            ...payload,
            serialNumber: trim(serialNumber),
          };
        }
        if (typeId && trim(`${typeId}`) !== '') {
          payload = {
            ...payload,
            typeId: Number(typeId),
          };
        }
        if (yearName && trim(`${yearName}`) !== '') {
          payload = {
            ...payload,
            yearId: Number(yearName),
          };
        }
        if ((compCustomQuotes && trim(`${compCustomQuotes}`) !== '') || formStepDetailSubStepOne?.compCustomQuotes) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '178',
                  value: compCustomQuotes
                    ? trim(`${compCustomQuotes}`)
                    : `${formStepDetailSubStepOne?.compCustomQuotes}`,
                },
              ],
            ],
          };
        }

        if ((shifters && trim(`${shifters}`) !== '') || formStepDetailSubStepTwo?.shifters) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '191',
                  value: shifters ? trim(`${shifters}`) : `${formStepDetailSubStepTwo?.shifters}`,
                },
              ],
            ],
          };
        }

        if ((rearShock && trim(`${rearShock}`) !== '') || formStepDetailSubStepTwo?.rearShock) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '92',
                  value: rearShock ? trim(`${rearShock}`) : `${formStepDetailSubStepTwo?.rearShock}`,
                },
              ],
            ],
          };
        }

        if ((handlebars && trim(`${handlebars}`) !== '') || formStepDetailSubStepTwo?.handlebars) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '108',
                  value: handlebars ? trim(`${handlebars}`) : `${formStepDetailSubStepTwo?.handlebars}`,
                },
              ],
            ],
          };
        }

        if ((frontDerailleur && trim(`${frontDerailleur}`) !== '') || formStepDetailSubStepTwo?.frontDerailleur) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '112',
                  value: frontDerailleur ? trim(`${frontDerailleur}`) : `${formStepDetailSubStepTwo?.frontDerailleur}`,
                },
              ],
            ],
          };
        }

        if ((rearDerailleur && trim(`${rearDerailleur}`) !== '') || formStepDetailSubStepTwo?.rearDerailleur) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '113',
                  value: rearDerailleur ? trim(`${rearDerailleur}`) : `${formStepDetailSubStepTwo?.rearDerailleur}`,
                },
              ],
            ],
          };
        }

        if ((frontShock && trim(`${frontShock}`) !== '') || formStepDetailSubStepTwo?.frontShock) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '114',
                  value: frontShock ? trim(`${frontShock}`) : `${formStepDetailSubStepTwo?.frontShock}`,
                },
              ],
            ],
          };
        }

        if ((crankset && trim(`${crankset}`) !== '') || formStepDetailSubStepTwo?.crankset) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '163',
                  value: crankset ? trim(`${crankset}`) : `${formStepDetailSubStepTwo?.crankset}`,
                },
              ],
            ],
          };
        }

        if ((wheels && trim(`${wheels}`) !== '') || formStepDetailSubStepTwo?.wheels) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '177',
                  value: wheels ? trim(`${wheels}`) : `${formStepDetailSubStepTwo?.wheels}`,
                },
              ],
            ],
          };
        }

        if ((brakeType && trim(`${brakeType}`) !== '') || formStepDetailSubStepTwo?.brakeType) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '180',
                  value: brakeType ? trim(`${brakeType}`) : `${formStepDetailSubStepTwo?.brakeType}`,
                },
              ],
            ],
          };
        }

        if ((casette && trim(`${casette}`) !== '') || formStepDetailSubStepTwo?.casette) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '182',
                  value: casette ? trim(`${casette}`) : `${formStepDetailSubStepTwo?.casette}`,
                },
              ],
            ],
          };
        }

        if ((frontBrake && trim(`${frontBrake}`) !== '') || formStepDetailSubStepTwo?.frontBrake) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '211',
                  value: frontBrake ? trim(`${frontBrake}`) : `${formStepDetailSubStepTwo?.frontBrake}`,
                },
              ],
            ],
          };
        }

        if ((rearBrake && trim(`${rearBrake}`) !== '') || formStepDetailSubStepTwo?.rearBrake) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '212',
                  value: rearBrake ? trim(`${rearBrake}`) : `${formStepDetailSubStepTwo?.rearBrake}`,
                },
              ],
            ],
          };
        }

        if ((stem && trim(`${stem}`) !== '') || formStepDetailSubStepTwo?.stem) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '110',
                  value: stem ? trim(`${stem}`) : `${formStepDetailSubStepTwo?.stem}`,
                },
              ],
            ],
          };
        }

        if ((frameMaterial && trim(`${frameMaterial}`) !== '') || formStepDetailSubStepTwo?.frameMaterial) {
          payload = {
            ...payload,
            compCustomQuotes: [
              ...payload.compCustomQuotes,
              ...[
                {
                  compId: '11',
                  value: frameMaterial ? trim(`${frameMaterial}`) : `${formStepDetailSubStepTwo?.frameMaterial}`,
                },
              ],
            ],
          };
        }

        if (condition && trim(`${condition}`) !== '') {
          payload = {
            ...payload,
            condition: trim(`${condition}`),
          };
        }
        if (note && trim(`${note}`) !== '') {
          payload = {
            ...payload,
            note: trim(`${note}`),
          };
        }
        if ((employeeEmail && trim(`${employeeEmail}`) !== '') || formStepContact?.employeeEmail) {
          payload = {
            ...payload,
            employeeEmail: trim(`${employeeEmail}`),
          };
        }
        if ((employeeEmail && trim(`${employeeEmail}`) !== '') || formStepContact?.employeeEmail) {
          payload = {
            ...payload,
            employeeEmail: trim(`${employeeEmail}`),
          };
        }
        if ((employeeLocation && trim(`${employeeLocation}`) !== '') || formStepContact?.employeeLocation) {
          payload = {
            ...payload,
            employeeLocation: trim(`${employeeLocation}`),
          };
        }
        if ((employeeName && trim(`${employeeName}`) !== '') || formStepContact?.employeeName) {
          payload = {
            ...payload,
            employeeName: trim(`${employeeName}`),
          };
        }
        if ((ownerEmail && trim(`${ownerEmail}`) !== '') || formStepContact?.ownerEmail) {
          payload = {
            ...payload,
            ownerEmail: trim(`${ownerEmail}`),
          };
        }
        if ((ownerName && trim(`${ownerName}`) !== '') || formStepContact?.ownerName) {
          payload = {
            ...payload,
            ownerName: trim(`${ownerName}`),
          };
        }
        if ((ownerPhone && trim(`${ownerPhone}`) !== '') || formStepContact?.ownerPhone) {
          payload = {
            ...payload,
            ownerPhone: trim(`${ownerPhone}`),
          };
        }

        let response: CompleteCustomRedBarnQuoteResponse;
        if (!query?.id) {
          response = await saveFirstCustomRedBarnQuoteRequest(payload);
        } else {
          await saveCustomRedBarnQuoteRequest(`${query?.id}`, payload);
        }
        await handleUploadImageCustomQuote(`${response?.redBarnCustomQuotesId || query?.id}`, true);

        if (listDataStepCustomQuote.length > 1) {
          toastSuccess('Saved.');
          return router.push({
            pathname: `/trade-in-account/trade-in/custom-red-barn-quote/${`${
              response?.redBarnCustomQuotesId || query?.id
            }`}`,
            query: {
              step,
              subStep,
            },
          });
        }
        router.push({
          pathname: `/trade-in-account/trade-in/history`,
        });
      } catch (error) {
        toastError(error);
      }
    }
  }, [
    formStepContact,
    formStepDetailSubStepFour,
    formStepDetailSubStepOne,
    formStepDetailSubStepTwo,
    handleUploadImageCustomQuote,
    listDataStepCustomQuote.length,
    query,
    router,
    step,
    subStep,
    upgradeCompIds,
    visibleSaveStep,
  ]);

  const handleSubmitStepDetailSubStepOne = useCallback(() => {
    if (isCompleteCustomQuote) {
      setSubStep(2);
      return;
    }
    const values = formStepDetailSubStepOneRef?.current?.values;
    setFormStepDetailSubStepOne(values);
    const { brandName, compCustomQuotes, modelName, serialNumber, typeId, yearName } = values;
    if (
      trim(brandName) === '' ||
      compCustomQuotes.length === 0 ||
      trim(modelName) === '' ||
      trim(serialNumber) === '' ||
      typeId === '' ||
      trim(modelName) === '' ||
      trim(yearName) === ''
    ) {
      formStepDetailSubStepOneRef?.current?.handleSubmit();
      return;
    }
    setSubStep(2);
  }, [isCompleteCustomQuote]);

  const handleSubmitStepDetailSubStepTwo = useCallback(() => {
    if (isCompleteCustomQuote) {
      setSubStep(3);
      return;
    }
    const values = formStepDetailSubStepTwoRef?.current?.values;
    setFormStepDetailSubStepTwo(values);
    const {
      frameMaterial,
      brakeType,
      shifters,
      frontBrake,
      frontDerailleur,
      rearBrake,
      rearDerailleur,
      crankset,
      handlebars,
      stem,
      casette,
      wheels,
    } = values;
    if (
      trim(frameMaterial) === '' ||
      trim(brakeType) === '' ||
      trim(shifters) === '' ||
      trim(frontBrake) === '' ||
      trim(frontDerailleur) === '' ||
      trim(rearBrake) === '' ||
      trim(rearDerailleur) === '' ||
      trim(crankset) === '' ||
      trim(handlebars) === '' ||
      trim(stem) === '' ||
      trim(casette) === '' ||
      trim(wheels) === ''
    ) {
      formStepDetailSubStepTwoRef?.current?.handleSubmit();
      return;
    }
    setSubStep(3);
  }, [isCompleteCustomQuote]);

  const handleSubmitStepImages = useCallback(() => {
    if (tradeInImages?.filter((it) => !it.isDeleted)?.length < 4) {
      return toastError(t('partnerPortal.scorecard.validate.image'), t('seoTitle.invalid'));
    }
    setStep(3);
    setCompletedStepCustomQuote(completedStepCustomQuote + 1);
  }, [tradeInImages, completedStepCustomQuote]);

  const handleSubmitStepContact = useCallback(async () => {
    if (isCompleteCustomQuote) {
      setStep(4);
      setCompletedStepCustomQuote(completedStepCustomQuote + 1);
      return;
    }
    const values = formStepContactTwoRef?.current?.values;
    setFormStepContact(values);
    const { employeeEmail, employeeLocation, employeeName, ownerEmail, ownerName, ownerPhone } = values;
    if (
      trim(employeeEmail) === '' ||
      !emailValidate(trim(employeeEmail)) ||
      trim(employeeLocation) === '' ||
      trim(employeeName) === '' ||
      trim(ownerEmail) === '' ||
      !emailValidate(trim(ownerEmail)) ||
      trim(ownerName) === '' ||
      trim(ownerPhone) === '' ||
      !phoneValidate(trim(ownerPhone))
    ) {
      formStepContactTwoRef?.current?.handleSubmit();
      return;
    }

    const payload: CompleteCustomQuoteRequest = {
      draft: !!query?.id,
      brandName: formStepDetailSubStepOne.brandName,
      condition: formStepDetailSubStepFour.condition,
      employeeEmail: values.employeeEmail,
      employeeLocation: values.employeeLocation,
      employeeName: values.employeeName,
      modelName: formStepDetailSubStepOne.modelName,
      note: formStepDetailSubStepFour.note,
      ownerEmail: values.ownerEmail,
      ownerName: values.ownerName,
      ownerPhone: values.ownerPhone,
      serialNumber: formStepDetailSubStepOne.serialNumber,
      typeId: Number(formStepDetailSubStepOne.typeId),
      upgradeCompIds: upgradeCompIds.filter((it) => it.value !== '').map((it) => it.value),
      yearId: Number(formStepDetailSubStepOne.yearName),
      compCustomQuotes: [
        { compId: '178', value: `${formStepDetailSubStepOne.compCustomQuotes}` },
        { compId: '191', value: formStepDetailSubStepTwo.shifters },
        { compId: '92', value: formStepDetailSubStepTwo.rearShock },
        { compId: '108', value: formStepDetailSubStepTwo.handlebars },
        { compId: '112', value: formStepDetailSubStepTwo.frontDerailleur },
        { compId: '113', value: formStepDetailSubStepTwo.rearDerailleur },
        { compId: '114', value: formStepDetailSubStepTwo.frontShock },
        { compId: '163', value: formStepDetailSubStepTwo.crankset },
        { compId: '177', value: formStepDetailSubStepTwo.wheels },
        { compId: '180', value: formStepDetailSubStepTwo.brakeType },
        { compId: '182', value: formStepDetailSubStepTwo.casette },
        { compId: '211', value: formStepDetailSubStepTwo.frontBrake },
        { compId: '212', value: formStepDetailSubStepTwo.rearBrake },
        { compId: '110', value: formStepDetailSubStepTwo.stem },
        { compId: '11', value: formStepDetailSubStepTwo.frameMaterial },
      ].filter((it) => it.value !== ''),
    };

    try {
      setLoadingButton(true);
      let response: CompleteCustomRedBarnQuoteResponse;

      if (query?.id) {
        await saveCustomRedBarnQuoteRequest(`${query?.id}`, payload);
      } else {
        response = await saveFirstCustomRedBarnQuoteRequest(payload);
      }
      await handleUploadImageCustomQuote(query?.id ? `${query?.id}` : `${response?.redBarnCustomQuotesId}`);

      let cloneArr = cloneDeep(listDataStepCustomQuote);
      const findFillData = listDataStepCustomQuote.find((it) => it.dataStepContact);
      if (findFillData) {
        cloneArr[indexScorecardSelected] = {
          ...cloneArr[indexScorecardSelected],
          dataStepContact: values,
          id: response?.redBarnCustomQuotesId || query?.id,
          indexStepComplete: 4,
          step: 4,
        };
      } else {
        cloneArr[indexScorecardSelected] = {
          ...cloneArr[indexScorecardSelected],
          isDefaultFillDataStepContact: true,
          id: response?.redBarnCustomQuotesId || query?.id,
          indexStepComplete: 4,
          step: 4,
        };
        cloneArr = cloneArr.map((it) => {
          return {
            ...it,
            dataStepContact: values,
          };
        });
      }
      const findIndexUncreateScorecard = cloneArr.findIndex((it, index) => !it.id && index !== indexScorecardSelected);
      if (findIndexUncreateScorecard === -1) {
        dispatch(
          scoreCardAction.setCreateScorecardQuantity({
            listDataStepCustomQuote: cloneArr,
          }),
        );
        setStep(4);
        setCompletedStepCustomQuote(completedStepCustomQuote + 1);
      } else {
        dispatch(
          scoreCardAction.setCreateScorecardQuantity({
            listDataStepCustomQuote: cloneArr,
            indexScorecardSelected: findIndexUncreateScorecard,
          }),
        );
        onRestart(true);
      }
      setLoadingButton(false);
    } catch (error) {
      setLoadingButton(false);
    }
  }, [
    dispatch,
    completedStepCustomQuote,
    formStepDetailSubStepFour.condition,
    formStepDetailSubStepFour.note,
    formStepDetailSubStepOne.brandName,
    formStepDetailSubStepOne.compCustomQuotes,
    formStepDetailSubStepOne.modelName,
    formStepDetailSubStepOne.serialNumber,
    formStepDetailSubStepOne.typeId,
    formStepDetailSubStepOne.yearName,
    formStepDetailSubStepTwo.brakeType,
    formStepDetailSubStepTwo.casette,
    formStepDetailSubStepTwo.crankset,
    formStepDetailSubStepTwo.frameMaterial,
    formStepDetailSubStepTwo.frontBrake,
    formStepDetailSubStepTwo.frontDerailleur,
    formStepDetailSubStepTwo.frontShock,
    formStepDetailSubStepTwo.handlebars,
    formStepDetailSubStepTwo.rearBrake,
    formStepDetailSubStepTwo.rearDerailleur,
    formStepDetailSubStepTwo.rearShock,
    formStepDetailSubStepTwo.shifters,
    formStepDetailSubStepTwo.stem,
    formStepDetailSubStepTwo.wheels,
    handleUploadImageCustomQuote,
    indexScorecardSelected,
    isCompleteCustomQuote,
    listDataStepCustomQuote,
    onRestart,
    query,
    upgradeCompIds,
  ]);

  const renderForm = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <StepDetail
            formStepDetailSubStepOne={formStepDetailSubStepOne}
            formStepDetailSubStepTwo={formStepDetailSubStepTwo}
            formStepDetailSubStepOneRef={formStepDetailSubStepOneRef}
            formStepDetailSubStepTwoRef={formStepDetailSubStepTwoRef}
            upgradeCompIds={upgradeCompIds}
            setUpgradeCompIds={setUpgradeCompIds}
            formStepDetailSubStepFour={formStepDetailSubStepFour}
            setFormStepDetailSubStepFour={setFormStepDetailSubStepFour}
            subStep={subStep}
            setVisibleSaveStep={setVisibleSaveStep}
            isCompleteCustomQuote={isCompleteCustomQuote}
          />
        );

      case 2:
        return (
          <StepImages
            tradeInImages={tradeInImages}
            setTradeInImages={setTradeInImages}
            isCompleteCustomQuote={isCompleteCustomQuote}
          />
        );

      case 3:
        return (
          <StepContact
            formStepContactTwoRef={formStepContactTwoRef}
            formStepContact={formStepContact}
            isCompleteCustomQuote={isCompleteCustomQuote}
          />
        );

      case 4:
        return <StepComplete onRestart={() => onRestart()} />;

      default:
        return null;
    }
  }, [
    step,
    formStepDetailSubStepOne,
    formStepDetailSubStepTwo,
    upgradeCompIds,
    formStepDetailSubStepFour,
    subStep,
    isCompleteCustomQuote,
    tradeInImages,
    formStepContact,
    onRestart,
  ]);

  const handleBackScreen = useCallback(() => {
    if (step === 1 && subStep === 1) {
      gotoStandardQuote();
      return;
    }
    if (step === 1) {
      setSubStep(subStep - 1);
      return;
    }
    handleBackPreviousStep();
  }, [gotoStandardQuote, handleBackPreviousStep, step, subStep]);

  const handleCountinues = useCallback(
    async (stepNumber?: number, subStepNumber?: number) => {
      setLoadingButton(true);
      if (step === 1) {
        switch (subStep) {
          case 1: {
            handleSubmitStepDetailSubStepOne();
            break;
          }
          case 2: {
            handleSubmitStepDetailSubStepTwo();
            break;
          }
          case 3: {
            if (formStepDetailSubStepFour.condition === '') {
              return toastError(t('common.validate.condition'));
            }
            setStep(2);
            setCompletedStepCustomQuote(completedStepCustomQuote + 1);
            break;
          }
          default:
            break;
        }
      }
      if (step === 2) {
        handleSubmitStepImages();
      }
      if (step === 3) {
        handleSubmitStepContact();
      }
      setTimeout(() => {
        setLoadingButton(false);
      }, 0);
    },
    [
      formStepDetailSubStepFour.condition,
      handleSubmitStepContact,
      handleSubmitStepDetailSubStepOne,
      handleSubmitStepDetailSubStepTwo,
      handleSubmitStepImages,
      step,
      subStep,
      completedStepCustomQuote,
    ],
  );

  const handleSubmitValueProvided = useCallback(() => {
    setSubStep(4);
    setStep(1);
    setVisibleModalValueProvided(false);
  }, []);

  const isDisableSubStep = useMemo(() => {
    if (!formStepDetailSubStepFour?.condition && step === 1 && subStep === 3) {
      return true;
    }
    return false;
  }, [formStepDetailSubStepFour, step, subStep]);

  const renderButtonSession = useMemo(() => {
    if ((step === 1 && (subStep === 1 || subStep === 2 || subStep === 3)) || step === 2 || step === 3) {
      return (
        <>
          <div className={cx(classes.wrapButton, classes.wrapButtonfixed)}>
            <Button
              buttonType="outline"
              onClick={handleBackScreen}
              className={cx(classes.btnBack, classes.customButtonSize)}>
              <img src={images.messages.icArrowLeftGrey} alt="icon_next" className="mr-4" />
              Back
            </Button>
            {subStep !== 6 && (
              <Button
                disabled={loadingButton || isDisableSubStep}
                className={classes.customButtonSize}
                onClick={() => handleCountinues()}>
                {indexScorecardSelected + 1 !== createScorecardQuantity && step === 3 ? 'Next Scorecard' : 'Continue'}
                <img src={images.iconNextWhite} alt="icon_next" className="ml-4" />
              </Button>
            )}
          </div>
          <div className={classes.wrapButtonSupportFixed} />
        </>
      );
    }
    return null;
  }, [
    step,
    subStep,
    handleBackScreen,
    loadingButton,
    isDisableSubStep,
    handleCountinues,
    indexScorecardSelected,
    createScorecardQuantity,
  ]);

  return (
    <div className={cx(classes.tradeInLayout, classes.container)}>
      <Head>
        <title>New Trade In Scorecard</title>
      </Head>
      <Header
        hideSave={hideSaveAndRestart}
        onRestart={onRestart}
        onSave={() => onSave()}
        visibleSaveStep={visibleSaveStep}
        loadingButton={loadingButton}
      />
      <div className={classes.tradeInContent}>
        <div className={classes.container}>
          <Stepper
            total={4}
            active={step}
            subActive={subStep}
            showComplete={true}
            stepList={['Details', 'Images', 'Contact', 'Complete']}
            type="customQuote"
            handleChangeStepCustomQuote={handleChangeStepCustomQuote}
            isCompleteCustomQuote={isCompleteCustomQuote}
            completedStepCustomQuote={completedStepCustomQuote}
          />
          <section className={classes.formRequestSection}>{renderForm}</section>
          <div className={classes.wrapButton}>{renderButtonSession}</div>
        </div>
      </div>

      {/* {visibleModalValueProvided && (
        <ModalValueProvided
          isOpen={visibleModalValueProvided}
          onClose={() => {
            setVisibleModalValueProvided(false);
            setIsCompleteCustomQuote(true);
          }}
          onSubmit={handleSubmitValueProvided}
        />
      )} */}
    </div>
  );
};

export default CustomRedBarnQuote;
