import React, { useState } from 'react';
import cx from 'classnames';
import Card from '@ui/Cards';
import { useRouter } from 'next/router';
import Radio from '@ui/Radio';
import Divider from '@ui/Divider';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import RegisterHeading from '../Heading';
import classes from './onlineStoreForm.module.scss';
import BackButton from '../BackButton';
import NeedHelpCard from '../Card/NeedHelpCard/NeedHelpCard';
import RegisterOnlyOnlineStore from './Form/RegisterOnlyOnlineStore';
import { FormType } from './Form/FormType';
import StepOne from './Form/RegisterPartnerOnlineStore/StepOne';
import RegisterPartnerOnlineStore from './Form/RegisterPartnerOnlineStore';
import Stepper from '../Stepper';

const steps = [
  { title: 'Account Information', step: 1 },
  { title: 'Shop Information', step: 2 },
  { title: 'Account Admin', step: 3 },
  { title: 'Partner Directory', step: 4 },
];

const RegisterOnlineStore = () => {
  const [isPartner, setIsPartner] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [maxStep, setMaxStep] = useState(1);
  const router = useRouter();
  const [form, setForm] = useState<FormType>({
    online_store: {
      name: '',
      email: '',
      zip_code: '',
      city: '',
      state: '',
      address: '',
      phone: '',
      contact_name: '',
      website_url: '',
      reseller_number: '',
      description: '',
    },
    shop: {
      website: '',
      tell_about: '',
      name: '',
      email: '',
      city: '',
      state: '',
      address: '',
      zip_code: '',
      phone: '',
      smart_tailing: 'true',
      mailing_address: 'true',
      brands_carried: [],
      address_mailing: {
        city: '',
        state: '',
        address: '',
        zip_code: '',
      },
    },
    pdf_upload: null,
    email: '',
    first_name: '',
    last_name: '',
    same_as_online: false,
    brand_selected: '',
    token_captcha: '',
  });
  const handleChangeStep = (nextStep: number) => {
    if (nextStep > maxStep) {
      setMaxStep(nextStep);
    }
    setStep(nextStep);
  };
  return (
    <Container className={classes.online_store}>
      <div className="d-flex">
        <BackButton
          onClick={() => {
            router.push('/register');
          }}
        />

        {/* <NeedHelpCardMobile className="ml-auto" /> */}
      </div>
      <RegisterHeading title="Online Store" />
      {isPartner ? (
        <Stepper
          steps={steps}
          step={step}
          maxStep={maxStep}
          handleChangeStep={(currentStep) => setStep(currentStep)}
          className={cx(classes.stepper)}
        />
      ) : null}
      <Row className={classes.online_store__wrapper}>
        <Col lg={9} className={cx('pl-md-2', classes.online_store__wrapper_content)}>
          <Card className={cx(classes.left_card)}>
            {step === 1 ? (
              <>
                <h3>Do you want to be a trade in partner?</h3>
                <div className={cx('d-flex', classes.selectPartner)}>
                  <Radio label="Yes" name="is_partner" checked={isPartner} onClick={() => setIsPartner(true)} />
                  <Radio
                    label="No"
                    className="ml-4"
                    name="is_partner"
                    checked={!isPartner}
                    onClick={() => setIsPartner(false)}
                  />
                </div>
                <Divider className={cx(classes.online_store__divider)} />
                {isPartner ? (
                  <StepOne setForm={setForm} form={form} handleChangeStep={handleChangeStep} />
                ) : (
                  <RegisterOnlyOnlineStore />
                )}
              </>
            ) : (
              <RegisterPartnerOnlineStore
                step={step}
                form={form}
                setForm={setForm}
                handleChangeStep={handleChangeStep}
              />
            )}
          </Card>
        </Col>
        <Col lg={3} className="pl-2 d-none d-lg-block">
          <NeedHelpCard />
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterOnlineStore;
