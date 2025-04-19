import React, { FC, useCallback, useState } from 'react';
import Card from '@ui/Cards';
import { useSelector } from 'react-redux';
import StoreState from 'model/store/index';
import t from 'helpers/language';
import { Form, Formik, FormikProps } from 'formik';
import Divider from '@ui/Divider';
import { useRouter } from 'next/router';
import { useConnectStripe } from 'hooks/useConnectStripe';
import { toastError } from 'helpers/utils.helper';
import { CreateListingDraftResponse, PostImageResponse } from 'model/api/account/personal/listings.model';
import { finishDraftListing } from 'api/store-front/listings.api';
import { createDraftListing, postImagesToListingDraft } from 'api/account/personal/listings.api';
import PhotoSection from 'components/Account/Personal/MyListing/Form/Sections/PhotoSection/PhotoSection';
import PriceSection from 'components/Account/Personal/MyListing/Form/Sections/PriceSection/PriceSection';
import ItemLocationSection from 'components/Account/Personal/MyListing/Form/Sections/ItemLocationSection';
import ShippingSection from 'components/Account/Personal/MyListing/Form/Sections/ShippingSection/ShippingSection';
import FooterSection from 'components/Account/Personal/MyListing/Form/Sections/FooterSection';
import ReturnSection from 'components/Account/Personal/MyListing/Form/Sections/ReturnSection/ReturnSection';
import ListingTitleSection from 'components/Account/Personal/MyListing/Form/Sections/ListingTitleSection';
import ListingDescriptionSection from 'components/Account/Personal/MyListing/Form/Sections/ListingDescriptionSection';
import PreviewModal from 'components/Account/Personal/MyListing/Form/PreviewModal/PreviewModal';
import { handleClickReactGA } from 'helpers/constraint.helper';
import { FormSchema, FormListingPartsAccessoriesValue, ProcessHandleCreate, prepareData } from './form-accessories';
import ProcessVerify from './Sections/ProcessCreate/ProcessCreate';
import StripeAccountSection from './Sections/StripeAccountSection/StripeAccountSection';
import ConfirmStripeModal from './ConfirmStripeModal/ConfirmStripeModal';
import classes from './listing-form.module.scss';

interface Props {
  initValues: FormListingPartsAccessoriesValue;
}

const FormCreateListingPartsAccessories: FC<Props> = ({ initValues }) => {
  const [loading, setLoading] = useState<boolean>(false);
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
    [isStorefront, router],
  );
  const finishCreateListing = useCallback(
    (idDraft: number) => {
      setPercentUploadFile(0);
      setProcessCreate(ProcessHandleCreate.Completing);
      finishDraftListing(idDraft)
        .then((res: string) => {
          setProcessCreate(ProcessHandleCreate.None);
          redirectByRole();
        })
        .catch((error) => {
          toastError(error);
          setProcessCreate(ProcessHandleCreate.None);
        });
    },
    [redirectByRole],
  );
  const onUploadProgress = useCallback((processEvent: any) => {
    setPercentUploadFile(Math.round((processEvent.loaded * 100) / processEvent.total));
  }, []);

  const listImageUploadable = useCallback((values: FormListingPartsAccessoriesValue) => {
    return values.fileList
      .filter((img) => !!img.file && !img.id && !img.isDeleted && !img.isEdited)
      .map((img: { id: string; url: string; file: File }) => img.file);
  }, []);

  const onClose = useCallback(() => {
    setIsShowModal(false);
  }, []);

  const processPostingImage = useCallback(
    (idDraft: number, values: FormListingPartsAccessoriesValue, isJustCreateDraft: boolean = false) => {
      setProcessCreate(ProcessHandleCreate.SendingFiles);
      // just get new img to upload. just new img have url
      const listImage = listImageUploadable(values);
      if (listImage.length) {
        postImagesToListingDraft({ id: idDraft, images: listImage }, onUploadProgress)
          .then((res: PostImageResponse[]) => {
            // if create draft not finish listing
            if (isJustCreateDraft) {
              redirectByRole(true);
            } else {
              finishCreateListing(idDraft);
            }
          })
          .catch((error) => {
            toastError(error);
            setProcessCreate(ProcessHandleCreate.None);
          });
      } else if (isJustCreateDraft) {
        redirectByRole(true);
      } else {
        finishCreateListing(idDraft);
      }
    },
    [finishCreateListing, listImageUploadable, onUploadProgress, redirectByRole],
  );
  const isSellSimilarAndHaveNewImg = useCallback(
    (values: FormListingPartsAccessoriesValue): boolean => {
      const isSellSimilar = router?.pathname?.includes('sell-similar');
      const haveAtLeastOneInitialImg = values.fileList.find((img) => img.file && !img.isDeleted && !img.isEdited);
      if (isSellSimilar && haveAtLeastOneInitialImg) {
        return true;
      }
      return false;
    },
    [router],
  );
  const processCreateListing = useCallback(
    (values: FormListingPartsAccessoriesValue, isJustCreateDraft: boolean = false) => {
      setLoading(true);
      const isCreateListing = router?.pathname?.includes('mylistings/create');
      const bodyParams = prepareData(values, isStorefront);
      if (isJustCreateDraft) {
        bodyParams.needValidate = false;
      }

      setProcessCreate(ProcessHandleCreate.Submitting);
      createDraftListing(bodyParams)
        .then((res: CreateListingDraftResponse) => {
          // if create draft listing => post img if have at least one
          handleClickReactGA('Create a Listing', 'Create a Listing', true);
          if (isJustCreateDraft) {
            values?.fileList?.length > 0 && processPostingImage(res?.id, values, isJustCreateDraft);
            !values?.fileList?.length && redirectByRole(true);
            setLoading(false);
            return;
          }
          if (isCreateListing) {
            processPostingImage(res?.id, values);
            setLoading(false);
            return;
          }
          // if create sell similar listing => Post img if have at least one. If not finish listing
          if (!isSellSimilarAndHaveNewImg(values)) {
            finishCreateListing(res?.id);
            setLoading(false);
            return;
          }
          processPostingImage(res?.id, values);
          setLoading(false);
        })
        .catch((error) => {
          toastError(error);
          setProcessCreate(ProcessHandleCreate.None);
          setLoading(false);
          if (error?.response?.data?.errorCode === 'ACCOUNT_STRIPE_NOT_EXIST') {
            setIsShowModal(true);
          }
        });
    },
    [finishCreateListing, isSellSimilarAndHaveNewImg, isStorefront, processPostingImage, redirectByRole, router],
  );

  const onSubmit = useCallback(
    async (values: FormListingPartsAccessoriesValue, { setErrors }) => {
      if (!errBestOffer && !errMinPrice) {
        setLoading(true);
        try {
          const listImage = values.fileList.filter((item) => !item.isDeleted);
          if (listImage.length === 0) {
            toastError('Please select at least one image.');
            setLoading(false);
            return;
          }
          processCreateListing(values);
          setLoading(false);
        } catch (error) {
          setProcessCreate(ProcessHandleCreate.None);
          toastError(error);
          setLoading(false);
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
                <PhotoSection listImages={values?.fileList} setValues={handleChangeValue} />
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
                  loading={loading}
                  showPreviewModal={showPreviewModal}
                  formValue={values}
                  saveAsDraft={() => processCreateListing(values, true)}
                  isStorefront={isStorefront}
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

export default FormCreateListingPartsAccessories;
