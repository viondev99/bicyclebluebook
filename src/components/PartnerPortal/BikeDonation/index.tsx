import Card from '@ui/Cards';
import React, { FC, useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import cx from 'classnames';
import {
  BikeDetail,
  BikeDonationPayload,
  getBrandRequest,
  getInfoPartnerRequest,
  postBikeDonationRequested,
} from 'api/partner/bike-donation';
import images from 'assets/images';
import { toastError } from 'helpers/utils.helper';
import { Option } from 'react-select/src/filters';
import Button from '@ui/Buttons/Primary/Button';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import Modal from '@ui/Modal/Modal';
import cloneDeep from 'lodash/cloneDeep';
import RenderSelect from './RenderSelect';
import classes from './bike-donation.module.scss';
import { FormSchema } from './bikeDonateValidate';

interface FormValueDonation {
  make: string;
  model: string;
  value: string;
}

const initialValues = {
  make: '',
  model: '',
  value: '',
};

const BikeDonation: FC = () => {
  const { partnerId } = useSelector((store: StoreState) => ({
    partnerId: store.authenticate.user?.partner,
  }));
  const [brandOption, setbrandOptions] = useState<Option[]>(null);
  const [bikeDetails, setBikeDetails] = useState<BikeDonationPayload>({
    bikes: [],
  });
  const [valueForm, setValueForm] = useState<FormValueDonation>(null);
  const [partnerInfo, setPartnerInfo] = useState<any>();
  const [show, setShow] = useState<boolean>(false);
  const [isAddBike, setIsAddBike] = useState<boolean>(false);
  const [isErrBike, setIsErrBike] = useState<boolean>(false);
  const [modelOption, setModelOptions] = useState<Option[]>(null);
  const formRef = useRef(null);

  const handleAddBike = useCallback(() => {
    if (bikeDetails?.bikes?.length === 10) {
      setIsErrBike(true);
    } else {
      const make = brandOption?.filter((e: Option) => e?.value === valueForm?.make);
      const model = modelOption?.filter((e: Option) => e?.value === valueForm?.model);
      const bikeDetail: BikeDetail = {
        make: {
          id: make && Number(make[0]?.value),
          name: make && make[0]?.label,
        },
        model: {
          id: model && Number(model[0]?.value),
          name: model && model[0]?.label,
        },
        value: valueForm?.value,
      };
      const newBike = cloneDeep(bikeDetails.bikes);
      newBike.push(bikeDetail);
      setBikeDetails({
        ...bikeDetails,
        bikes: newBike,
      });
      setIsAddBike(true);
    }
  }, [bikeDetails, brandOption, modelOption, valueForm]);

  const getInfoPartner = useCallback(async () => {
    try {
      const response: any = await getInfoPartnerRequest(partnerId);
      setPartnerInfo(response);
    } catch (error) {
      toastError(error);
    }
  }, [partnerId]);

  const getListBranch = useCallback(async () => {
    try {
      const response: any = await getBrandRequest();
      const brandOptions: Option[] = response?.allBrandBicycle?.map((item: any) => ({
        value: item?.id?.toString(),
        label: item?.name,
      }));
      setbrandOptions(brandOptions);
    } catch (error) {
      toastError(error);
    }
  }, []);

  useEffect(() => {
    if (bikeDetails?.bikes?.length !== 10) {
      setIsErrBike(false);
    }
  }, [bikeDetails]);

  useEffect(() => {
    getListBranch();
    getInfoPartner();
  }, [getInfoPartner, getListBranch]);

  const onSubmit = useCallback(async () => {
    postBikeDonationRequested(bikeDetails)
      .then((res) => {
        setShow(true);
      })
      .catch((error) => toastError(error));
  }, [bikeDetails]);

  const handleRemoveBike = useCallback(
    (bike: BikeDetail) => {
      const bikeAfterRemove = bikeDetails?.bikes?.filter((item: BikeDetail) => item !== bike);
      setBikeDetails({
        bikes: bikeAfterRemove,
      });
    },
    [bikeDetails],
  );

  const renderPartnerDetail = useMemo(() => {
    return (
      <>
        <Row className={classes.wrapItem}>
          <Col md={3} className={classes.title}>
            Shop Details
          </Col>
          <Col md={9} className={classes.customForm}>
            <div>{partnerInfo?.name}</div>
            <div>
              {partnerInfo?.address_mailing?.address}, {partnerInfo?.address_mailing?.city},{' '}
              {partnerInfo?.address_mailing?.state}, {partnerInfo?.address_mailing?.zip_code}
            </div>
          </Col>
        </Row>
        <Row className={classes.wrapItem}>
          <Col md={3} className={classes.title}>
            Employee Details
          </Col>
          <Col md={9} className={classes.customForm}>
            <div>{partnerInfo?.admin_manager?.name}</div>
            <div>{partnerInfo?.admin_manager?.email}</div>
          </Col>
        </Row>
      </>
    );
  }, [partnerInfo]);

  return (
    <>
      <Card className={classes.wrapContainer}>
        <div className={classes.header}>Bicycle Donation Program</div>

        <ul className={classes.customDescription}>
          <li>Supports the VietNam Veterans Association</li>
          <li>Will be picked up within one week</li>
          <li>Charitable Donation Tax receipt will be issued by driver</li>
          <li>Shop will determine donation value and store credit at their sole discretion</li>
          <li>Donation Store Credits are not reimbursed by Bicycle Blue Book</li>
          <li>Please donate only working bicycles</li>
          <li>
            Contact <a href="mailto: donations@bicyclebluebook.com">donations@bicyclebluebook.com</a> with questions
          </li>
        </ul>

        <div className={classes.headerDescription}>Make a Donation</div>
        <Formik
          innerRef={formRef}
          onSubmit={handleAddBike}
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={FormSchema}>
          {({ handleSubmit }: FormikProps<FormValueDonation>) => {
            return (
              <Form onSubmit={handleSubmit}>
                {renderPartnerDetail}
                <RenderSelect
                  brandOption={brandOption}
                  setValueForm={setValueForm}
                  setModelOptions={setModelOptions}
                  modelOption={modelOption}
                  isAddBike={isAddBike}
                  bikeDetails={bikeDetails}
                  setIsAddBike={setIsAddBike}
                  isErrBike={isErrBike}
                />
                {bikeDetails?.bikes?.length > 0 && (
                  <>
                    {bikeDetails?.bikes?.map((item, index) => {
                      return (
                        <div className={classes.wrapBike}>
                          <Row
                            className={cx(classes.rowTitle, {
                              'd-md-none': index !== 0,
                            })}>
                            <Col md={4} className={classes.title}>
                              Make
                            </Col>
                            <Col md={4} className={classes.title}>
                              Model
                            </Col>
                            <Col md={2} className={classes.title}>
                              Value
                            </Col>
                            <Col md={2} className={classes.title} />
                          </Row>
                          <Row className={classes.description}>
                            <Col md={4} className={classes.description}>
                              {item.make.name}
                            </Col>
                            <Col md={4} className={classes.description}>
                              {item.model.name}
                            </Col>
                            <Col md={2} className={classes.description}>
                              ${item.value}
                            </Col>
                            <Col md={2} className={classes.descriptionRemove}>
                              <button type="button" className={classes.btnClose} onClick={() => handleRemoveBike(item)}>
                                <img
                                  className={classes.icClose}
                                  height={18}
                                  width={18}
                                  src={images.common.icCloseCircle}
                                  alt={'close-icon'}
                                />
                                <img
                                  className={classes.icCloseRed}
                                  height={18}
                                  width={18}
                                  src={images.messages.icCloseCircleRed}
                                  alt={'close-icon'}
                                />
                                <span className={cx('ml-2', 'd-md-none', 'd-block', classes.textRemove)}>
                                  Remove Bike
                                </span>
                              </button>
                            </Col>
                          </Row>
                        </div>
                      );
                    })}
                  </>
                )}
                {bikeDetails?.bikes?.length > 0 && (
                  <Button className={classes.btnSize} type={'button'} onClick={onSubmit}>
                    Schedule Pick Up
                  </Button>
                )}
              </Form>
            );
          }}
        </Formik>
      </Card>
      <Modal
        className={classes.modalConfirm}
        isOpen={show}
        centered={true}
        contentClassName={classes.modelConfirmContent}
        showButtonCloseXBlackLeft={true}
        hideButtonClose={true}
        titleClassName={classes.titleModal}
        title="Thank you for your donation"
        onClose={() => {
          setShow(false);
          setBikeDetails({ bikes: [] });
        }}>
        <div>
          A driver from the Vietnam Veterans Association will collect your donation bikes within one week. Email{' '}
          <a href="mailto: donations@bicyclebluebook.com">donations@bicyclebluebook.com</a> if you have any questions.
        </div>
      </Modal>
    </>
  );
};

export default BikeDonation;
