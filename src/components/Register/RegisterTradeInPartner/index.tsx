import React, { useState } from 'react';
import cx from 'classnames';
import Card from '@ui/Cards';
import { useRouter } from 'next/router';
import Radio from '@ui/Radio';
import Divider from '@ui/Divider';
import { useDispatch } from 'react-redux';
import { registerOnlinePartnerStore, registerTradeInPartner } from 'store/authenticate/authenticate.action';
import RegisterHeading from '../Heading';
import classes from './registerTradeInPartner.module.scss';
import BackButton from '../BackButton';
import NeedHelpCard from '../Card/NeedHelpCard/NeedHelpCard';
import Stepper from '../Stepper';
import NeedHelpCardMobile from '../Card/NeedHelpCardMobile/NeedHelpCard';
import { FormType } from '../RegisterOnlineStore/Form/FormType';
import StepOne from '../RegisterOnlineStore/Form/RegisterPartnerOnlineStore/StepOne';
import StepTwo from '../RegisterOnlineStore/Form/RegisterPartnerOnlineStore/StepTwo';
import StepThree from '../RegisterOnlineStore/Form/RegisterPartnerOnlineStore/StepThree';
import StepFour from '../RegisterOnlineStore/Form/RegisterPartnerOnlineStore/StepFour';

const RegisterTradeInPartner = () => {
  const dispatch = useDispatch();
  const [hasOnline, setHasOnline] = useState(false);
  const steps = hasOnline
    ? [
        { title: 'Account Information', step: 1 },
        { title: 'Shop Information', step: 2 },
        { title: 'Account Admin', step: 3 },
        { title: 'Partner Directory', step: 4 },
      ]
    : [
        { title: 'Account Information', step: 1 },
        { title: 'Account Admin', step: 2 },
        { title: 'Partner Directory', step: 3 },
      ];
  const [step, setStep] = useState<number>(1);
  const [maxStep, setMaxStep] = useState<number>(1);
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
    isOnlinePartner: false,
  });

  const handleChangeStep = (nextStep: number) => {
    if (nextStep > maxStep) {
      setMaxStep(nextStep);
    }
    setStep(nextStep);
  };

  const handleRegisterTradeInWithOnlineStore = (data: FormType) => {
    dispatch(registerOnlinePartnerStore(data));
  };

  const handleRegisterTradeIn = (data: FormType) => {
    dispatch(registerTradeInPartner(data));
  };

  const handleRenderStepForm = (currentStep: number) => {
    if (hasOnline) {
      switch (currentStep) {
        case 2:
          return (
            <StepTwo
              handleNextStep={() => {
                handleChangeStep(3);
              }}
              form={form}
              setForm={setForm}
            />
          );

        case 3:
          return (
            <StepThree
              handleNextStep={() => {
                handleChangeStep(4);
              }}
              form={form}
              setForm={setForm}
            />
          );

        case 4:
          return <StepFour form={form} setForm={setForm} handleSubmitForm={handleRegisterTradeInWithOnlineStore} />;
        default:
          return null;
      }
    }

    switch (currentStep) {
      case 2:
        return (
          <StepThree
            handleNextStep={() => {
              handleChangeStep(3);
            }}
            form={form}
            setForm={setForm}
          />
        );

      case 3:
        return <StepFour form={form} setForm={setForm} handleSubmitForm={handleRegisterTradeIn} />;

      default:
        return null;
    }
  };
  return (
    <div className={cx('container', classes.section)}>
      <div className="d-flex">
        <BackButton
          onClick={() => {
            router.push('/register');
          }}
        />

        {/* <NeedHelpCardMobile className="ml-auto" /> */}
      </div>
      <RegisterHeading title="Trade in Partner" />

      <Stepper
        steps={steps}
        step={step}
        maxStep={maxStep}
        handleChangeStep={(currentStep) => setStep(currentStep)}
        className={cx(classes.stepper)}
      />

      <div className={cx('row', classes.wrapper)}>
        <div className={cx('col-md-8 col-lg-9 pl-md-2', classes.content)}>
          <Card className={cx(classes.leftCard)}>
            {step === 1 ? (
              <>
                <h3>Do you want to have an online store with us?</h3>
                <div className={cx('d-flex', classes.selectPartner)}>
                  <Radio label="Yes" name="is_partner" checked={hasOnline} onClick={() => setHasOnline(true)} />
                  <Radio
                    label="No"
                    className="ml-4"
                    name="is_partner"
                    checked={!hasOnline}
                    onClick={() => setHasOnline(false)}
                  />
                </div>
                <Divider className={cx(classes.divider)} />
                {hasOnline ? (
                  <StepOne setForm={setForm} form={form} handleChangeStep={handleChangeStep} isTradeInForm={true} />
                ) : (
                  <StepTwo
                    setForm={setForm}
                    form={form}
                    handleNextStep={() => {
                      setStep(2);
                    }}
                    hasIsSameAsOnlineOption={false}
                  />
                )}
              </>
            ) : (
              <>{handleRenderStepForm(step)}</>
            )}
          </Card>
        </div>
        <div className="col-md-4 col-lg-3 pl-2 d-none d-md-block">
          <NeedHelpCard />
        </div>
      </div>
    </div>
  );
};

export default RegisterTradeInPartner;
