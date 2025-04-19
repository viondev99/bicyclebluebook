import React, { FC, useCallback, useRef, useEffect, useState } from 'react';
import Container from 'reactstrap/lib/Container';
import images from 'assets/images';
import StoreState from 'model/store';
import { geoCodeByZipCode } from 'api/common.api';
import { useSelector } from 'react-redux';
import { ListPartnerResponse, getListPartner } from 'api/dealer-locator';
import { InstantPayoutRequestForm } from 'model/store/instant-payout.model';
import { Formik } from 'formik';
import { PositionPartner } from 'model/store/dealer-locator';
import * as yup from 'yup';
import classes from './instant-payout.module.scss';
import Section1 from './Sections/Section1';
import Section2 from './Sections/Section2';
import Section3 from './Sections/Section3';
import Section4 from './Sections/Section4';
import Section5 from './Sections/Section5';
import Section6 from './Sections/Section6';
import ModelZipCodeInValid from './Modal/ModalZipCodeInValid';
import PartnerNearYou from './PartnerNearYou/PartnerNearYou';

const ValidateSchema = yup.object().shape({});

const InitialValue: InstantPayoutRequestForm = {
  model: '',
  brand: '',
  year: '',
  newType: '',
  newBrand: '',
  zipCode: '',
  condition: '',
  bikeInfo: null,
  miles: '10',
};
interface Props {}

const InstantPayoutLandingPage: FC<Props> = () => {
  const section1Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const listNewPartner = useSelector((store: StoreState) => store.dealerLocator.listPartner);
  const [locationResult, setLocationResult] = useState<PositionPartner>({
    lat: 37.37024,
    lng: -121.87744,
  });
  const [listPartner, setListPartner] = useState<ListPartnerResponse>(null);
  const [modalZipCodeInvalidVisible, setModalZipCodeInvalidVisible] = useState<boolean>(false);
  const [zipCodeValid, setZipCodeValid] = useState<boolean>(false);
  const [section4Complete, setSection4Complete] = useState<boolean>(false);
  const [section5Complete, setSection5Complete] = useState<boolean>(false);

  useEffect(() => {
    if (listNewPartner) {
      setListPartner(listNewPartner);
    }
  }, [listNewPartner]);
  const onSubmit = useCallback((values: InstantPayoutRequestForm) => {
    // eslint-disable-next-line no-console
  }, []);
  const checkTabIsActive = useCallback(
    (tabNumber: number, values: InstantPayoutRequestForm): boolean => {
      const { brand, model, year, condition } = values;
      const allowSection2 = zipCodeValid === true;
      const allowSection3 = allowSection2 && brand && model && year;
      const allowSection4 = allowSection3 && condition;
      const allowSection5 = allowSection4 && section4Complete;
      const allowSection6 = allowSection5 && section5Complete;

      switch (tabNumber) {
        case 2:
          if (allowSection2) {
            return true;
          }
          break;
        case 3:
          if (allowSection3) {
            return true;
          }
          break;
        case 4:
          if (allowSection4) {
            return true;
          }
          break;
        case 5:
          if (allowSection5) {
            return true;
          }
          break;
        case 6:
          if (allowSection6) {
            return true;
          }
          break;
        default:
          return false;
      }
      return false;
    },
    [section4Complete, section5Complete, zipCodeValid],
  );

  const checkZipCodeIsExist = useCallback(async (zipCode: string, finalSection?: boolean, distance: number = 10) => {
    if (!zipCode) {
      setZipCodeValid(false);
      setModalZipCodeInvalidVisible(true);
      return;
    }
    try {
      const location = await geoCodeByZipCode(zipCode.trim());
      const lat = location[0].geometry.location.lat();
      const lng = location[0].geometry.location.lng();
      setLocationResult({
        lat,
        lng,
      });
      const response: ListPartnerResponse = await getListPartner({
        lat,
        lng,
        distance,
        is_instant_payout: true,
      });
      if (response?.length > 0) {
        setZipCodeValid(true);
        finalSection && setSection5Complete(true);
        setListPartner(response);
      } else {
        setZipCodeValid(false);
        setModalZipCodeInvalidVisible(true);
        setListPartner(null);
      }
    } catch (error) {
      if (finalSection) {
        setModalZipCodeInvalidVisible(true);
      } else {
        setModalZipCodeInvalidVisible(true);
        setZipCodeValid(false);
      }
    }
  }, []);
  const handleScroll = useCallback((position: any) => {
    let clientHeader: number = 53;
    if (window.innerWidth > 1159) {
      clientHeader = 71;
    }
    const topOfElement: number = position - clientHeader;
    window.scroll({ top: topOfElement, behavior: 'smooth' });
    setSection4Complete(true);
  }, []);
  const onAcceptSection4 = useCallback(() => {
    handleScroll(section5Ref.current.offsetTop);
  }, [handleScroll]);
  const scrollToStep1 = useCallback(() => {
    setModalZipCodeInvalidVisible(false);
    setZipCodeValid(false);
    handleScroll(section1Ref.current.offsetTop);
  }, [handleScroll]);
  return (
    <Container className={classes.container}>
      <Formik initialValues={InitialValue} onSubmit={onSubmit} validationSchema={ValidateSchema}>
        {({ handleSubmit, errors, values, setValues }) => {
          const handleChangeValue = (data: object) => setValues({ ...values, ...data });
          return (
            <form onSubmit={handleSubmit}>
              <div ref={section1Ref} key={1} />
              <Section1 checkZipCodeIsExist={checkZipCodeIsExist} values={values} />
              <Section2 isActive={checkTabIsActive(2, values)} setValues={handleChangeValue} values={values} />
              <div className={classes.nextStep}>
                <img src={images.sell.icLightGreyArrowDown} alt="arrowDown" />
              </div>
              <Section3 isActive={checkTabIsActive(3, values)} setValues={handleChangeValue} values={values} />
              <div className={classes.nextStep}>
                <img src={images.sell.icLightGreyArrowDown} alt="arrowDown" />
              </div>
              <Section4
                isActive={checkTabIsActive(4, values)}
                onAccept={onAcceptSection4}
                setValues={handleChangeValue}
                values={values}
              />
              <div className={classes.nextStep}>
                <img src={images.sell.icLightGreyArrowDown} alt="arrowDown" />
              </div>
              <div ref={section5Ref} key={5} />
              <Section5
                checkZipCodeIsExist={checkZipCodeIsExist}
                isActive={checkTabIsActive(5, values)}
                setValues={handleChangeValue}
                values={values}
              />
              <PartnerNearYou
                isActive={checkTabIsActive(5, values)}
                listPartner={listPartner}
                distance={Number(values.miles)}
                newPosition={locationResult}
              />
              <Section6 isActive={checkTabIsActive(6, values)} />
            </form>
          );
        }}
      </Formik>
      <ModelZipCodeInValid onClose={scrollToStep1} open={modalZipCodeInvalidVisible} />
    </Container>
  );
};

export default InstantPayoutLandingPage;
