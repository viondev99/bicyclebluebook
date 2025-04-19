import React, { FC, useCallback, useState } from 'react';
import Card from '@ui/Cards';
import { useSelector } from 'react-redux';
import StoreState from 'model/store/index';
import { Form, Formik, FormikProps } from 'formik';
import Divider from '@ui/Divider';
import { useRouter } from 'next/router';
import { toastError } from 'helpers/utils.helper';
import { CreateListingDraftResponse, PostImageResponse } from 'model/api/account/personal/listings.model';
import { finishDraftListing } from 'api/store-front/listings.api';
import { saveDraftListing, updateImagesListingDraft, deleteImageListingDraft } from 'api/account/personal/listings.api';
import PhotoSection from 'components/Account/Personal/MyListing/Form/Sections/PhotoSection/PhotoSection';
import PriceSection from 'components/Account/Personal/MyListing/Form/Sections/PriceSection/PriceSection';
import ItemLocationSection from 'components/Account/Personal/MyListing/Form/Sections/ItemLocationSection';
import ShippingSection from 'components/Account/Personal/MyListing/Form/Sections/ShippingSection/ShippingSection';
import FooterSection from 'components/Account/Personal/MyListing/Form/Sections/FooterSection';
import ReturnSection from 'components/Account/Personal/MyListing/Form/Sections/ReturnSection/ReturnSection';
import ListingTitleSection from 'components/Account/Personal/MyListing/Form/Sections/ListingTitleSection';
import ListingDescriptionSection from 'components/Account/Personal/MyListing/Form/Sections/ListingDescriptionSection';
import PreviewModal from 'components/Account/Personal/MyListing/Form/PreviewModal/PreviewModal';
import { useConnectStripe } from 'hooks/useConnectStripe';
import classes from './listing-form.module.scss';
import { FormSchema, FormListingPartsAccessoriesValue, ProcessHandleCreate, prepareData } from './form-accessories';
import ProcessVerify from './Sections/ProcessCreate/ProcessCreate';
import StripeAccountSection from './Sections/StripeAccountSection/StripeAccountSection';
import ConfirmStripeModal from './ConfirmStripeModal/ConfirmStripeModal';

interface Props {
  initValues: FormListingPartsAccessoriesValue;
}

const FormDraftListingPartsAccessories: FC<Props> = ({ initValues }) => {
  const [isShowPreview, setIsShowPreview] = useState<boolean>(false);
  const [percentUploadFile, setPercentUploadFile] = useState<number>(0);
  const router = useRouter();
  const [errBestOffer, setErrBestOffer] = useState<boolean>(false);
  const [errMinPrice, setErrMinPrice] = useState<boolean>(false);
  const [processCreate, setProcessCreate] = useState<ProcessHandleCreate>(ProcessHandleCreate.None);
  const isStorefront = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const { account, onConnect } = useConnectStripe();

  const redirectByRole = useCallback(
    (draft: boolean = false) => {
      if (draft) {
        if (!isStorefront) {
          router.push(`/account/mylistings/draft`);
        } else {
          router.push({ pathname: `/store-front/mylistings`, query: { statuses: 'DRAFT', page: 1 } });
        }
      } else if (!isStorefront) {
        router.push(`/account/mylistings/listings`);
      } else {
        router.push({ pathname: `/store-front/mylistings`, query: { statuses: 'LISTED', page: 1 } });
      }
    },
    [router, isStorefront],
  );
  const finishCreateListing = useCallback(() => {
    setPercentUploadFile(0);
    setProcessCreate(ProcessHandleCreate.Completing);
    finishDraftListing(Number(router.query.id))
      .then((res: string) => {
        setProcessCreate(ProcessHandleCreate.None);
        redirectByRole(true);
      })
      .catch((error) => {
        toastError(error);
        setProcessCreate(ProcessHandleCreate.None);
        if (error?.response?.data?.errorCode === 'ACCOUNT_STRIPE_NOT_EXIST') {
          setIsShowModal(true);
        }
      });
  }, [redirectByRole, router.query]);
  const onUploadProgress = useCallback((processEvent: any) => {
    setPercentUploadFile(Math.round((processEvent.loaded * 100) / processEvent.total));
  }, []);

  const listImageDeleted = useCallback((values: FormListingPartsAccessoriesValue): Array<number> => {
    return values.fileList
      .filter((image) => image.isDeleted === true && image.initialImage)
      .map((img) => Number(img?.id));
  }, []);

  const deleteImageProcess = useCallback(
    async (values: FormListingPartsAccessoriesValue) => {
      try {
        await deleteImageListingDraft(Number(router?.query?.id), { inventoryImageIds: listImageDeleted(values) });
        setProcessCreate(ProcessHandleCreate.None);
        redirectByRole(true);
      } catch (error) {
        setProcessCreate(ProcessHandleCreate.None);
        toastError(error);
      }
    },
    [listImageDeleted, redirectByRole, router],
  );

  const onClose = useCallback(() => {
    setIsShowModal(false);
  }, []);

  const listImageUploadable = useCallback((values: FormListingPartsAccessoriesValue) => {
    return values.fileList
      .filter((img) => !!img.file && !img.id && !img.isDeleted && !img.isEdited)
      .map((img: { id: string; url: string; file: File }) => img.file);
  }, []);

  const oldImageIdNewOrder = useCallback((values: FormListingPartsAccessoriesValue) => {
    let oldImageIdsNewOrderQuery = '';
    values.fileList
      .filter((image) => image.initialImage)
      .forEach((image) => {
        oldImageIdsNewOrderQuery += `oldImageIdsNewOrder=${image.id}&`;
      });
    return oldImageIdsNewOrderQuery;
  }, []);

  const processPostingImage = useCallback(
    (values: FormListingPartsAccessoriesValue, isJustCreateDraft: boolean = false) => {
      setProcessCreate(ProcessHandleCreate.SendingFiles);
      // just get new img to upload. just new img have url
      const listImage = listImageUploadable(values);
      if (listImage.length) {
        updateImagesListingDraft(
          listImage,
          {
            id: Number(router?.query?.id),
            newImageIndexes: '',
            oldImageIdsNewOrder: oldImageIdNewOrder(values),
          },
          onUploadProgress,
        )
          .then((res: PostImageResponse[]) => {
            if (listImageDeleted(values).length > 0) {
              deleteImageProcess(values);
              if (isJustCreateDraft) {
                redirectByRole(true);
              } else {
                finishCreateListing();
              }
            } else if (isJustCreateDraft) {
              setProcessCreate(ProcessHandleCreate.None);
              redirectByRole(true);
            } else {
              finishCreateListing();
            }
          })
          .catch((error) => {
            toastError(error);
            setProcessCreate(ProcessHandleCreate.None);
          });
      } else if (isJustCreateDraft) {
        redirectByRole(true);
      } else {
        finishCreateListing();
      }
    },
    [
      finishCreateListing,
      listImageUploadable,
      onUploadProgress,
      redirectByRole,
      router,
      deleteImageProcess,
      listImageDeleted,
      oldImageIdNewOrder,
    ],
  );
  const hasNewImg = useCallback((values: FormListingPartsAccessoriesValue): boolean => {
    const hasAtLeastOneInitialImg = values.fileList.find((img) => img.file && !img.isDeleted && !img.isEdited);
    if (hasAtLeastOneInitialImg) {
      return true;
    }
    return false;
  }, []);
  const processCreateListing = useCallback(
    (values: FormListingPartsAccessoriesValue, isJustCreateDraft: boolean = false) => {
      const bodyParams = prepareData(values, isStorefront);
      if (isJustCreateDraft) {
        bodyParams.needValidate = false;
      }
      setProcessCreate(ProcessHandleCreate.Submitting);
      saveDraftListing(Number(router.query.id), bodyParams)
        .then((res: CreateListingDraftResponse) => {
          // if create draft listing => post img if have at least one
          if (isJustCreateDraft) {
            if (hasNewImg(values)) {
              processPostingImage(values, isJustCreateDraft);
            } else {
              redirectByRole(true);
            }
          } else if (hasNewImg(values)) {
            processPostingImage(values);
          } else {
            finishCreateListing();
          }
        })
        .catch((error) => {
          setIsShowModal(true);
          toastError(error);
          setProcessCreate(ProcessHandleCreate.None);
        });
    },
    [finishCreateListing, processPostingImage, redirectByRole, hasNewImg, router.query],
  );

  const onSubmit = useCallback(
    async (values: FormListingPartsAccessoriesValue, { setErrors }) => {
      if (!errBestOffer && !errMinPrice) {
        try {
          const listImage = values.fileList.filter((item) => !item.isDeleted);
          if (listImage.length === 0) {
            toastError('Photos must be not empty.');
            return;
          }
          processCreateListing(values);
          // setProcessCreate(ProcessHandleCreate.ValidatingEmail);
          // const response = await verifyEmailPaypal(values?.emailPaypal);
          // if (response?.accountValid) {
          //   processCreateListing(values);
          // } else {
          //   setProcessCreate(ProcessHandleCreate.None);
          //   setErrors({ emailPaypal: t('common.validate.emailInvalid') });
          // }
        } catch (error) {
          setProcessCreate(ProcessHandleCreate.None);
          toastError(error);
        }
      }
    },
    [processCreateListing, errBestOffer, errMinPrice],
  );

  const showPreviewModal = useCallback(() => {
    setIsShowPreview(true);
  }, []);

  const handleValidateBestOfferPrice = useCallback((err) => {
    setErrBestOffer(err);
  }, []);
  const handleValidateMinPrice = useCallback((err) => {
    setErrMinPrice(err);
  }, []);

  return (
    <>
      <Card className={classes.card}>
        <Formik
          onSubmit={onSubmit}
          initialValues={initValues}
          enableReinitialize={true}
          validationSchema={() => FormSchema(isStorefront)}
          validateOnChange={true}
          validateOnBlur={false}>
          {({ values, setValues, validateField, errors, touched }: FormikProps<FormListingPartsAccessoriesValue>) => {
            const handleChangeValue = (data: object) => setValues({ ...values, ...data });
            return (
              <Form>
                <ListingTitleSection />
                <Divider className={classes.divider} />
                <ListingDescriptionSection />
                <Divider className={classes.divider} />
                <PhotoSection listImages={values?.fileList} setValues={handleChangeValue} isEdit={true} />
                <Divider className={classes.divider} />
                <PriceSection
                  formValue={values}
                  setValues={handleChangeValue}
                  isStorefront={isStorefront}
                  touched={touched}
                  handleValidateBestOfferPrice={handleValidateBestOfferPrice}
                  handleValidateMinPrice={handleValidateMinPrice}
                />
                <Divider className={classes.divider} />
                {isStorefront && <StripeAccountSection account={account} onConnect={onConnect} />}
                {isStorefront && <Divider className={classes.divider} />}
                {isStorefront && <ReturnSection formValue={values} />}
                {isStorefront && <Divider className={classes.divider} />}
                <ItemLocationSection />
                <Divider className={classes.divider} />
                {isStorefront && (
                  <ShippingSection
                    formValue={values}
                    touched={touched}
                    validateField={validateField}
                    errors={errors}
                    setValues={handleChangeValue}
                  />
                )}
                {isStorefront && <Divider className={classes.divider} />}
                <FooterSection
                  showPreviewModal={showPreviewModal}
                  formValue={values}
                  saveAsDraft={() => processCreateListing(values, true)}
                  isEdit={true}
                />
                <PreviewModal
                  isOpen={isShowPreview}
                  onClose={() => setIsShowPreview(false)}
                  formData={values}
                  isAccessories={true}
                />
              </Form>
            );
          }}
        </Formik>
        <ProcessVerify process={processCreate} percentUploadFile={percentUploadFile} />
        <ConfirmStripeModal isOpen={isShowModal} onConnect={onConnect} onClose={onClose} />
      </Card>
    </>
  );
};

export default FormDraftListingPartsAccessories;
