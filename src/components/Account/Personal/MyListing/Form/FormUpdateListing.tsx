import React, { FC, useCallback, useState } from 'react';
import Card from '@ui/Cards';
import { useSelector } from 'react-redux';
import StoreState from 'model/store/index';
import { ComponentsModel } from 'model/store/common.model';
import { Form, Formik, FormikProps } from 'formik';
import Divider from '@ui/Divider';
import { useRouter } from 'next/router';
import has from 'lodash/has';
import { toastError } from 'helpers/utils.helper';
import { useConnectStripe } from 'hooks/useConnectStripe';
import { PostImageResponse, UpdateListingResponse } from 'model/api/account/personal/listings.model';
import { deleteImageListing, updateImagesListing, updateListingListed } from 'api/account/personal/listings.api';
import ModelSection from 'components/Account/Personal/MyListing/Form/Sections/ModelSection/ModelSection';
import BicycleDetailSection from 'components/Account/Personal/MyListing/Form/Sections/BicycleDetailSection/BicycleDetailSection';
import PhotoSection from 'components/Account/Personal/MyListing/Form/Sections/PhotoSection/PhotoSection';
import PriceSection from 'components/Account/Personal/MyListing/Form/Sections/PriceSection/PriceSection';
import ItemLocationSection from 'components/Account/Personal/MyListing/Form/Sections/ItemLocationSection';
import ShippingSection from 'components/Account/Personal/MyListing/Form/Sections/ShippingSection/ShippingSection';
import FooterSection from 'components/Account/Personal/MyListing/Form/Sections/FooterSection';
import ReturnSection from 'components/Account/Personal/MyListing/Form/Sections/ReturnSection/ReturnSection';
import BicycleDescriptionSection from 'components/Account/Personal/MyListing/Form/Sections/BicycleDescriptionSection/BicycleDescriptionSection';
import PreviewModal from 'components/Account/Personal/MyListing/Form/PreviewModal/PreviewModal';
import { useCheckPersonalRole } from 'hooks/useCheckPersonalRole';
import { handleClickReactGA } from 'helpers/constraint.helper';
import classes from './listing-form.module.scss';
import { FormSchema, FormValue, ProcessHandleCreate, prepareDataUpdateListed } from './form';
import ProcessVerify from './Sections/ProcessCreate/ProcessCreate';
import StripeAccountSection from './Sections/StripeAccountSection/StripeAccountSection';
import ConfirmStripeModal from './ConfirmStripeModal/ConfirmStripeModal';

interface Props {
  initValues: FormValue;
  listFilter: Partial<ComponentsModel>;
}

const ListingForm: FC<Props> = ({ initValues, listFilter }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowPreview, setIsShowPreview] = useState<boolean>(false);
  const [percentUploadFile, setPercentUploadFile] = useState<number>(0);
  const router = useRouter();
  const [errBestOffer, setErrBestOffer] = useState<boolean>(false);
  const [errMinPrice, setErrMinPrice] = useState<boolean>(false);
  const [processCreate, setProcessCreate] = useState<ProcessHandleCreate>(ProcessHandleCreate.None);
  const baseComponent = useSelector((store: StoreState) => store.valueGuide.baseComponent.baseComponent);
  const isStorefront = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const { account, onConnect } = useConnectStripe();
  const isPersonal = useCheckPersonalRole();

  const redirectByRole = useCallback(() => {
    if (!isStorefront) {
      router.push(`/account/mylistings/listings`);
    } else {
      router.push(`/store-front/mylistings`);
    }
  }, [isStorefront, router]);

  const onUploadProgress = useCallback((processEvent: any) => {
    setPercentUploadFile(Math.round((processEvent.loaded * 100) / processEvent.total));
  }, []);

  const listImageDeleted = useCallback((values: FormValue): Array<number> => {
    return values.fileList
      .filter((image) => image.isDeleted === true && image.initialImage)
      .map((img) => Number(img?.id));
  }, []);

  const deleteImageProcess = useCallback(
    async (values: FormValue) => {
      try {
        await deleteImageListing(Number(router?.query?.id), { inventoryImageIds: listImageDeleted(values) });
        setProcessCreate(ProcessHandleCreate.None);
        redirectByRole();
      } catch (error) {
        setProcessCreate(ProcessHandleCreate.None);
        toastError(error);
      }
    },
    [listImageDeleted, redirectByRole, router],
  );

  const listImageUpload = useCallback((values: FormValue) => {
    return values.fileList
      .filter((image) => !!image.file && !image.isDeleted && !image.isEdited)
      .map((image) => image.file);
  }, []);

  const oldImageIdNewOrder = useCallback((values: FormValue) => {
    let oldImageIdsNewOrderQuery = '';
    values.fileList
      .filter((image) => image.initialImage)
      .forEach((image) => {
        oldImageIdsNewOrderQuery += `oldImageIdsNewOrder=${image.id}&`;
      });
    return oldImageIdsNewOrderQuery;
  }, []);

  const processPostingImage = useCallback(
    (values: FormValue) => {
      setProcessCreate(ProcessHandleCreate.SendingFiles);
      updateImagesListing(
        listImageUpload(values),
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
          } else {
            setProcessCreate(ProcessHandleCreate.None);
            redirectByRole();
          }
        })
        .catch((error) => {
          toastError(error);
          setProcessCreate(ProcessHandleCreate.None);
        });
    },
    [
      deleteImageProcess,
      listImageDeleted,
      listImageUpload,
      oldImageIdNewOrder,
      onUploadProgress,
      redirectByRole,
      router,
    ],
  );

  const processUpdateListing = useCallback(
    (values: FormValue) => {
      const bodyParams = prepareDataUpdateListed(values);
      setProcessCreate(ProcessHandleCreate.Submitting);
      updateListingListed(Number(router?.query?.id), bodyParams)
        .then((res: UpdateListingResponse) => {
          handleClickReactGA('Create a Listing', 'Create a Listing', true);
          processPostingImage(values);
        })
        .catch((error) => {
          toastError(error);
          setProcessCreate(ProcessHandleCreate.None);
          if (error?.response?.data?.errorCode === 'ACCOUNT_STRIPE_NOT_EXIST') {
            setIsShowModal(true);
          }
        });
    },
    [processPostingImage, router],
  );

  const onClose = useCallback(() => {
    setIsShowModal(false);
  }, []);

  const onSubmit = useCallback(
    (values: FormValue, { setErrors }) => {
      if (!errBestOffer && !errMinPrice) {
        setLoading(true);
        try {
          setProcessCreate(ProcessHandleCreate.ValidatingEmail);
          processUpdateListing(values);
          setLoading(false);
        } catch (error) {
          setProcessCreate(ProcessHandleCreate.None);
          toastError(error);
          setLoading(false);
        }
      }
    },
    [processUpdateListing, errBestOffer, errMinPrice],
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
          validationSchema={() => FormSchema(isPersonal)}>
          {({ values, setValues, validateField, errors, touched }: FormikProps<FormValue>) => {
            const handleChangeValue = (data: object) => setValues({ ...values, ...data });
            return (
              <Form>
                <ModelSection
                  brands={baseComponent?.bicycleBrands || []}
                  years={baseComponent?.bicycleYears}
                  formValue={values}
                  // setValues={handleChangeValue}
                />
                <Divider className={classes.divider} />
                <BicycleDetailSection
                  listFilterDetailComp={listFilter?.bicycleDetailComp?.comps}
                  types={listFilter.type}
                  formValue={values}
                />
                <Divider className={classes.divider} />
                <BicycleDescriptionSection
                  errorCondition={
                    has(touched, 'selectedCondition') && has(errors, 'selectedCondition')
                      ? errors.selectedCondition
                      : ''
                  }
                  conditions={listFilter.condition}
                  formValue={values}
                  setValues={handleChangeValue}
                />
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
                {!isPersonal && (
                  <>
                    <ReturnSection formValue={values} />
                    <Divider className={classes.divider} />
                  </>
                )}
                <ItemLocationSection />
                <Divider className={classes.divider} />
                {!isPersonal && (
                  <>
                    <ShippingSection
                      formValue={values}
                      validateField={validateField}
                      touched={touched}
                      errors={errors}
                      setValues={handleChangeValue}
                    />
                    <Divider className={classes.divider} />
                  </>
                )}
                <FooterSection loading={loading} showPreviewModal={showPreviewModal} formValue={values} />
                <PreviewModal isOpen={isShowPreview} onClose={() => setIsShowPreview(false)} formData={values} />
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

export default ListingForm;
