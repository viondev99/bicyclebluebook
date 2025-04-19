import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { registerOnlinePartnerStore } from 'store/authenticate/authenticate.action';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import { FormType } from '../FormType';

interface Props {
  step?: Number;
  form: FormType;
  handleChangeStep: (step: number) => void;
  setForm: (form: any) => void;
}

const RegisterPartnerOnlineStore: FC<Props> = ({ step, form, handleChangeStep, setForm }) => {
  const dispatch = useDispatch();
  const handleSubmitForm = (data: FormType) => {
    dispatch(registerOnlinePartnerStore(data));
  };

  switch (step) {
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
          disableEmail={true}
          form={form}
          setForm={setForm}
        />
      );

    case 4:
      return <StepFour form={form} setForm={setForm} handleSubmitForm={handleSubmitForm} />;

    default:
      return null;
  }
};

export default RegisterPartnerOnlineStore;
