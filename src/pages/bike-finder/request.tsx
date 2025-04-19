import React, { FC, useState, useMemo, useCallback, Suspense } from 'react';
import Head from 'next/head';
import cx from 'classnames';
import Container from 'reactstrap/lib/Container';
import Stepper from '@ui/Stepper/Stepper';
import { ComponentStatic } from 'model/common';
import { useRouter } from 'next/router';
import ClientSide from '@ui/Common/ClientSide';
import { BodyQueryModel } from 'model/store/bike-finder.model';
// import Step1 from 'components/BikeFinder/FormRequest/Steps/Step1';
// import Step2 from 'components/BikeFinder/FormRequest/Steps/Step2';
// import Step2ForKids from 'components/BikeFinder/FormRequest/Steps/Step2ForKids';
// import Step3 from 'components/BikeFinder/FormRequest/Steps/Step3';
// import Step4 from 'components/BikeFinder/FormRequest/Steps/Step4';
// import Step5 from 'components/BikeFinder/FormRequest/Steps/Step5';
import { TypeFinderBike } from 'constants/bike-finder';
import CompleteStep from 'components/BikeFinder/FormRequest/Steps/CompleteStep';
import StepStarted2 from 'components/BikeFinder/FormRequest/Steps/StepStarted2';
import StepStarted1 from 'components/BikeFinder/FormRequest/Steps/StepStarted1';
import { isProduction } from 'helpers/utilities.helper';
import { DEFAULT_SEO_IMAGE_BBB, DEFAULT_SEO_TWITTER_IMAGE_BBB } from 'helpers/constraint.helper';
import classes from '../../components/BikeFinder/FormRequest/bike-finder.module.scss';
import Header from '../../components/BikeFinder/FormRequest/Header';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

const Step1 = React.lazy(() => import('components/BikeFinder/FormRequest/Steps/Step1'));
const Step2 = React.lazy(() => import('components/BikeFinder/FormRequest/Steps/Step2'));
const Step2ForKids = React.lazy(() => import('components/BikeFinder/FormRequest/Steps/Step2ForKids'));
const Step3 = React.lazy(() => import('components/BikeFinder/FormRequest/Steps/Step3'));
const Step4 = React.lazy(() => import('components/BikeFinder/FormRequest/Steps/Step4'));
const Step5 = React.lazy(() => import('components/BikeFinder/FormRequest/Steps/Step5'));

const RequestBikeFinder: FC & ComponentStatic = () => {
  const [typeBike, setBikeType] = useState<TypeFinderBike.Adult | TypeFinderBike.Kids>(TypeFinderBike.Adult);
  const { query, replace, pathname } = useRouter();
  const step = useMemo(() => {
    return query?.step ? Number(query?.step) : -1;
  }, [query]);

  const onChangeForm = useCallback(
    (newQuery: BodyQueryModel) => {
      replace({
        pathname,
        query: {
          ...query,
          ...newQuery,
        },
      });
    },
    [pathname, query, replace],
  );

  const onChangeTypeBike = useCallback(
    (type: TypeFinderBike.Adult | TypeFinderBike.Kids) => {
      setBikeType(type);
      replace({
        pathname,
        query: {
          step: 1,
          t: type,
        },
      });
    },
    [replace, pathname],
  );

  const onRestart = useCallback(() => {
    setBikeType(TypeFinderBike.Adult);
    replace({
      pathname,
      query: {
        step: -1,
      },
    });
  }, [pathname, replace]);

  const renderFormAdult = useCallback(() => {
    switch (step) {
      case -1:
        return <StepStarted1 />;
      case 0:
        return <StepStarted2 />;
      case 1:
        return <Step1 onChangeForm={onChangeForm} onChangeTypeBike={onChangeTypeBike} />;

      case 2:
        return <Step2 onChangeForm={onChangeForm} />;

      case 3:
        return <Step3 onChangeForm={onChangeForm} />;

      case 4:
        return <Step4 onChangeForm={onChangeForm} />;

      case 5:
        return <Step5 onChangeForm={onChangeForm} />;

      case 6:
        return <CompleteStep onRestart={onRestart} />;

      default:
        return null;
    }
  }, [step, onChangeForm, onChangeTypeBike, onRestart]);

  const renderFormKids = useCallback(() => {
    switch (step) {
      case -1:
        return <StepStarted1 />;
      case 0:
        return <StepStarted2 />;
      case 1:
        return <Step1 onChangeForm={onChangeForm} onChangeTypeBike={onChangeTypeBike} />;

      case 2:
        return <Step2ForKids onChangeForm={onChangeForm} />;

      case 5:
        return <Step5 onChangeForm={onChangeForm} />;

      case 6:
        return <CompleteStep onRestart={onRestart} />;

      default:
        return null;
    }
  }, [step, onChangeForm, onChangeTypeBike, onRestart]);

  return (
    <>
      <Head>
        <title>Bike finder - Bicyclebluebook.com</title>
        <meta name="og:title" content="Bike finder - Bicyclebluebook.com" />
        <meta name="keywords" content="Bike finder - Bicyclebluebook.com" />
        <meta name="description" content="Bike finder - Bicyclebluebook.com" />
        <meta name="og:description" content="Bike finder - Bicyclebluebook.com" />
        <meta name="author" content="" />
        <meta name="og:image" content={DEFAULT_SEO_IMAGE_BBB} />
        <meta name="og:image:type" content="image/png" />
        <meta name="og:image:width" content="1200" />
        <meta name="og:image:height" content="630" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@handle" />
        <meta property="twitter:image" content={DEFAULT_SEO_TWITTER_IMAGE_BBB} />
        <meta property="twitter:url" content={DEFAULT_SEO_TWITTER_IMAGE_BBB} />
        <meta property="twitter:title" content="Bike finder - Bicyclebluebook.com" />
        <meta property="twitter:description" content="Bike finder - Bicyclebluebook.com" />
        <meta name="robots" content={isProduction() ? 'index, follow' : 'noindex'} />
      </Head>
      <div className={cx(classes.bikeFinderLayout, classes.container)}>
        <Header onRestart={onRestart} />
        <div
          className={cx(classes.bikeFinderContent, {
            [classes.resizeContent]: step !== 6,
            [classes.paddingTopStepStarted]: step === -1,
          })}>
          <Container
            className={cx(
              {
                [classes.wrapMarketplace]: step === 6,
              },
              classes.wrapperForMobile,
            )}>
            {step !== 6 && step !== -1 && (
              <Stepper
                total={typeBike === TypeFinderBike.Kids ? 3 : 5}
                active={step}
                showComplete={false}
                blurStepNotActivated={true}
              />
            )}
            <section className={classes.formRequestSection}>
              <ClientSide>
                <Suspense fallback={null}>
                  {typeBike === TypeFinderBike.Kids ? renderFormKids() : renderFormAdult()}
                </Suspense>
              </ClientSide>
            </section>
          </Container>
        </div>
      </div>
    </>
  );
};

RequestBikeFinder.getInitialProps = async () => {
  return {};
};

export default withInjectAllSaga(RequestBikeFinder);
