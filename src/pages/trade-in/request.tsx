import React, { FC, useState, useCallback, useRef, Suspense, useMemo } from 'react';
import Head from 'next/head';
import cx from 'classnames';
import Container from 'reactstrap/lib/Container';
import Stepper from '@ui/Stepper/Stepper';
import { ComponentStatic } from 'model/common';
import Header from 'components/TradeIn/Header';
// import Step1 from 'components/TradeIn/FormRequest/Step1';
// import Step2 from 'components/TradeIn/FormRequest/Step2';
// import Step3 from 'components/TradeIn/FormRequest/Step3';
// import Step4 from 'components/TradeIn/FormRequest/Step4';
// import Step5 from 'components/TradeIn/FormRequest/Step5';
// import Step6 from 'components/TradeIn/FormRequest/Step6';
// import Complete from 'components/TradeIn/FormRequest/Complete';
import DownloadModal from 'components/TradeIn/FormRequest/Modal/DownloadModal';
import classes from 'components/TradeIn/trade-in.module.scss';
import ClientSide from '@ui/Common/ClientSide';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const Step1 = React.lazy(() => import('components/TradeIn/FormRequest/Step1'));
const Step2 = React.lazy(() => import('components/TradeIn/FormRequest/Step2'));
const Step3 = React.lazy(() => import('components/TradeIn/FormRequest/Step3'));
const Step4 = React.lazy(() => import('components/TradeIn/FormRequest/Step4'));
const SubStep2 = React.lazy(() => import('components/TradeIn/FormRequest/SubStep2'));
const Step5 = React.lazy(() => import('components/TradeIn/FormRequest/Step5'));
const Step6 = React.lazy(() => import('components/TradeIn/FormRequest/Step6'));
const Complete = React.lazy(() => import('components/TradeIn/FormRequest/Complete'));

export interface TradeInValues {
  [key: string]: string;
}

export interface TradeInForm {
  make: { value: string; label: string } | null;
  model: { value: string; label: string } | null;
  year: { value: string; label: string } | null;
  id?: number;
  tradeInValues?: Partial<TradeInValues>;
  type: { value: string; label: string } | null;
  brand: { value: string; label: string } | null;
  name: string;
  email: string;
  zip: string;
  phone: string;
  familyName: string;
  bicycleId: string;
  isIgnoreStep2: boolean;
  condition?: string;
  tradeInValue?: number;
  tradeInValueMin?: number;
}

const RequestTradeIn: FC & ComponentStatic = () => {
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [form, setForm] = useState({
    make: null,
    familyName: '',
    bicycleId: '',
    model: null,
    year: null,
    id: null,
    tradeInValues: null,
    type: null,
    brand: null,
    name: '',
    email: '',
    zip: '',
    phone: '',
    isIgnoreStep2: true,
    condition: '',
    tradeInValue: null,
  });
  const [show, setShow] = useState<boolean>(true);
  const formRef = useRef(null);

  const onChangeStep = useCallback((steps: number, subSteps?: number) => {
    setStep(steps);
    setSubStep(subSteps);
  }, []);

  const onChangeForm = useCallback(
    (values: Partial<TradeInForm>) => {
      setForm({
        ...form,
        ...values,
      });
    },
    [form],
  );

  const onRestart = useCallback(() => {
    if (step === 1) {
      formRef.current.setFieldValue('make', null);
    }
    setStep(1);
    onChangeForm({
      make: null,
      model: null,
      year: null,
      id: null,
      tradeInValues: null,
      type: null,
      brand: null,
      name: '',
      email: '',
      zip: '',
      phone: '',
      familyName: '',
      bicycleId: '',
      condition: '',
      tradeInValue: null,
      isIgnoreStep2: true,
    });
  }, [onChangeForm, step]);

  const renderForm = useMemo(() => {
    switch (step) {
      case 1:
        switch (subStep) {
          case 1:
            return (
              <Step1
                form={form}
                isIgnoreStep2={form.isIgnoreStep2}
                onChangeStep={onChangeStep}
                onChangeForm={onChangeForm}
                formRef={formRef}
              />
            );

          case 2:
            return (
              <Suspense fallback={null}>
                <Step2
                  brand={form.make}
                  familyName={form.familyName}
                  onChangeStep={onChangeStep}
                  onChangeForm={onChangeForm}
                />
              </Suspense>
            );

          case 3:
            return (
              <Suspense fallback={null}>
                <Step3
                  brand={form.make}
                  familyName={form.familyName}
                  year={form.year}
                  bicycleId={form.bicycleId}
                  isIgnoreStep2={form.isIgnoreStep2}
                  onChangeStep={onChangeStep}
                  onChangeForm={onChangeForm}
                />
              </Suspense>
            );

          default:
            return (
              <Step1
                form={form}
                isIgnoreStep2={form.isIgnoreStep2}
                onChangeStep={onChangeStep}
                onChangeForm={onChangeForm}
                formRef={formRef}
              />
            );
        }

      // case 2:
      //   return (
      //     <Suspense fallback={null}>
      //       <Step2
      //         brand={form.make}
      //         familyName={form.familyName}
      //         onChangeStep={onChangeStep}
      //         onChangeForm={onChangeForm}
      //       />
      //     </Suspense>
      //   );

      // case 2:
      //   return (
      //     <Suspense fallback={null}>
      //       <Step3
      //         brand={form.make}
      //         familyName={form.familyName}
      //         year={form.year}
      //         bicycleId={form.bicycleId}
      //         isIgnoreStep2={form.isIgnoreStep2}
      //         onChangeStep={onChangeStep}
      //         onChangeForm={onChangeForm}
      //       />
      //     </Suspense>
      //   );

      case 2:
        switch (subStep) {
          case 1:
            return (
              <Suspense fallback={null}>
                <Step4
                  form={form}
                  brand={form.make}
                  model={form.model}
                  year={form.year}
                  onChangeStep={onChangeStep}
                  onChangeForm={onChangeForm}
                />
              </Suspense>
            );

          case 2:
            return (
              <Suspense fallback={null}>
                <SubStep2 form={form} onChangeStep={onChangeStep} onChangeForm={onChangeForm} />
              </Suspense>
            );

          default:
            return (
              <Suspense fallback={null}>
                <Step4
                  form={form}
                  brand={form.make}
                  model={form.model}
                  year={form.year}
                  onChangeStep={onChangeStep}
                  onChangeForm={onChangeForm}
                />
              </Suspense>
            );
        }

      case 3:
        return (
          <Suspense fallback={null}>
            <Step5 form={form} onChangeStep={onChangeStep} onChangeForm={onChangeForm} />
          </Suspense>
        );

      case 4:
        return (
          <Suspense fallback={null}>
            <Step6 form={form} onChangeStep={onChangeStep} onChangeForm={onChangeForm} />
          </Suspense>
        );

      case 5:
        return (
          <Suspense fallback={null}>
            <Complete />
          </Suspense>
        );

      default:
        return null;
    }
  }, [step, subStep, form, onChangeStep, onChangeForm]);

  return (
    <>
      <Head>
        <title>Trade in your bike - Bicyclebluebook.com</title>
      </Head>
      <div className={cx(classes.tradeInLayout, classes.container)}>
        <Header onRestart={onRestart} />
        <div className={classes.tradeInContent}>
          <Container>
            <Stepper total={5} active={step} showComplete={true} />
            <section className={cx(classes.formRequestSection, classes.tradeInRequestContainer)}>
              <ClientSide>
                <Suspense fallback={null}>{renderForm}</Suspense>
              </ClientSide>
            </section>
          </Container>
        </div>
      </div>
      {show && <DownloadModal isOpen={show} onClose={() => setShow(false)} />}
    </>
  );
};

RequestTradeIn.getInitialProps = async () => {
  return {};
};

export default withInjectAllSaga(RequestTradeIn);
