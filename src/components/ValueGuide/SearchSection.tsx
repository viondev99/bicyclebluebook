import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '@ui/Cards';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import { Form, Formik } from 'formik';
import Button from '@ui/Buttons/Primary/Button';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { OptionsType } from 'react-select';
import cx from 'classnames';
import { useRouter } from 'next/router';
import { toastError } from 'helpers/utils.helper';
import t from 'helpers/language';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBaseComponent,
  saveBrandIdSearchValueGuide,
  trackingEventController,
} from 'store/value-guide/value-guide.action';
import StoreState from 'model/store';
import { sortFilterBrand } from 'helpers/utilities.helper';
import { TrackingEventControllerParams } from 'model/api/value-guide.model';
import { TrackingEvent } from 'model/store/value-guide.model';
import classes from './valueGuide.module.scss';
import ModelSelect from './SearchSection/ModelSelect';

interface FormValues {
  brand: string;
  model: string;
}

const initialValues: FormValues = {
  brand: '',
  model: '',
};

const Search = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const brands = useSelector((store: StoreState) => store.valueGuide.baseComponent?.baseComponent.bicycleBrands);
  // const models = useSelector((store: StoreState) => store.valueGuide.model.list.models);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(
      getBaseComponent({
        isVGService: true,
      }),
    );
  }, [dispatch]);

  const brandOptions: OptionsType<any> = useMemo(() => {
    return brands?.length > 0 ? sortFilterBrand(brands) : [];
  }, [brands]);

  const handleFormSubmit = useCallback(
    (values: FormValues) => {
      if (values.brand === '' && values.model === '') {
        toastError(t('valueGuide.noResult'), t('seoTitle.uhOh'));
        return;
      }
      const findBrand = brands.find((it) => `${it.id}` === `${values.brand}`);
      if (findBrand) {
        let bodyParams: TrackingEventControllerParams = {};
        setLoading(true);
        dispatch(saveBrandIdSearchValueGuide(values.brand));
        if (values.model === '') {
          bodyParams = {
            brandId: findBrand?.id,
            event: TrackingEvent.SearchBrand,
          };
          dispatch(trackingEventController(bodyParams));
          router.push(`/value-guide/${encodeURIComponent(findBrand?.name)}`);
          return;
        }
        bodyParams = {
          brandId: findBrand.id,
          event: TrackingEvent.SearchProductFamily,
          productFamily: values.model,
        };
        dispatch(trackingEventController(bodyParams));
        router.push(`/value-guide/${encodeURIComponent(findBrand?.name)}/${encodeURIComponent(values.model)}`);
      }
    },
    [brands, dispatch, router],
  );

  return (
    <section className={classes.section}>
      <Container className={classes.search}>
        <div id={'browse'} className={classes.title}>
          <h4>Alternatively, browse our database.</h4>
        </div>
        <Card className={classes.searchForm}>
          <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
            {({ handleSubmit, values }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={5}>
                    <Row className={classes.wrapperInput}>
                      <Col sm={12}>
                        <div className={classes.label}>
                          <h4>Brand</h4>
                        </div>
                      </Col>
                      <Col sm={12}>
                        <FormikSelect
                          inputId={'brand-select-vg-search'}
                          options={brandOptions}
                          name="brand"
                          isSearchable={true}
                          placeholder="Select brand"
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col md={5}>
                    {/* <Row className={classes.wrapperInput}>
                      <Col sm={12}>
                        <div className={classes.label}>
                          <h4>Product Family</h4>
                        </div>
                      </Col>
                      <Col sm={12}> */}
                    <ModelSelect brand={values.brand} />
                    {/* </Col>
                    </Row> */}
                  </Col>
                  <Col md={2} className="pl-md-0">
                    <Button
                      isLoading={loading}
                      type="submit"
                      className={cx(classes.btnSave, 'ml-lg-2 ')}
                      disabled={values.brand === ''}>
                      Search
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
          <div className={classes.description}>
            Not sure of the exact model?
            <br />
            Enter the brand to see a list of product families and the years they were made.
          </div>
        </Card>
      </Container>
    </section>
  );
};

export default Search;
