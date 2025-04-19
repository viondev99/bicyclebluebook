import React, { useState, useMemo, FC } from 'react';
import FormikInput from 'components/Formik/Input/FormikInput';
import { Formik, FormikProps, Form } from 'formik';
import { OptionsType } from 'react-select';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import { useListCommonState } from 'hooks/useListCommonState';
import * as Yup from 'yup';
import t from 'helpers/language';
import _pick from 'lodash/pick';
import _get from 'lodash/get';
import _find from 'lodash/find';
import images from 'assets/images';
import Divider from '@ui/Divider';
import FormikRadio from 'components/Formik/Radio/FormikRadio';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { useListCommonComponent } from 'hooks/useListCommonComponent';
import { CommonComponents, CommonComponentModel } from 'model/store/common.model';
import FormikTextMask from 'components/Formik/TextMask/FormikTextMask';
import { FormType } from '../../FormType';
import classes from './stepTwo.module.scss';

const RegisterSchema = Yup.object().shape({
  shop: Yup.object().shape({
    name: Yup.string()
      .required(t('authenticate.validate.storeNameRequired'))
      .max(250, t('authenticate.validate.storeNameLength')),
    phone: Yup.string()
      .required(t('common.validate.phoneNumberRequired'))
      .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, t('common.validate.phoneInvalid')),
    zip_code: Yup.string()
      .required(t('common.validate.zipCodeRequired'))
      .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
    address: Yup.string().required(t('common.validate.addressRequired')),
    city: Yup.string().required(t('common.validate.cityRequired')),
    state: Yup.string().required(t('common.validate.stateRequired')),
    mailing_address: Yup.boolean(),
    address_mailing: Yup.object().when('mailing_address', {
      is: false,
      then: Yup.object({
        address: Yup.string().required(t('common.validate.addressRequired')),
        city: Yup.string().required(t('common.validate.cityRequired')),
        state: Yup.string().required(t('common.validate.stateRequired')),
        zip_code: Yup.string()
          .required(t('common.validate.zipCodeRequired'))
          .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
      }),
    }),
  }),
  brand_selected: Yup.string().required(t('authenticate.validate.brandCarried')),
});

interface Props {
  form: FormType;
  handleNextStep: () => void;
  hasIsSameAsOnlineOption?: boolean;
  setForm: (form: FormType) => void;
}
interface FormValue {
  shop: {
    website: string;
    tell_about: string;
    name: string;
    email: string;
    city: string;
    state: string;
    address: string;
    zip_code: string;
    phone: string;
    smart_tailing: string;
    mailing_address: string;
    address_mailing: {
      city: string;
      state: string;
      address: string;
      zip_code: string;
    };
  };
  brand_selected: string;
}

const StepTwo: FC<Props> = ({ handleNextStep, setForm, form, hasIsSameAsOnlineOption = true }) => {
  const stateOptions = useListCommonState();
  const component = useListCommonComponent(CommonComponents.AllBrandBicycle);
  const brandOptions: OptionsType<any> = useMemo(() => {
    const brands: CommonComponentModel[] = _get(component, 'allBrandBicycle', []);

    return brands.map((brand: CommonComponentModel) => ({
      label: brand.name,
      value: String(brand.id),
    }));
  }, [component]);

  const handleFormSubmit = (values: FormValue) => {
    const data: FormType = {
      ...form,
      same_as_online: sameSettingOnlineStore,
      brand_selected: values.brand_selected,
      shop: {
        ...values.shop,
        brands_carried: [
          {
            name: _find(brandOptions, (brand) => brand.value === values.brand_selected).label,
            id: values.brand_selected,
          },
        ],
      },
    };

    setForm(data);
    handleNextStep();
  };

  const [sameSettingOnlineStore, setSameSettingOnlineStore] = useState<boolean>(form.same_as_online);

  const handleChangeUsingOnlineData = () => {
    if (!sameSettingOnlineStore) {
      setForm({
        ...form,
        shop: {
          ...form.shop,
          ..._pick(form.online_store, ['name', 'email', 'phone', 'address', 'city', 'state', 'zip_code']),
        },
      });
    } else {
      setForm({
        ...form,
        shop: {
          ...form.shop,
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zip_code: '',
          address_mailing: {
            city: '',
            state: '',
            zip_code: '',
            address: '',
          },
        },
      });
    }
    setSameSettingOnlineStore(!sameSettingOnlineStore);
  };

  return (
    <Formik initialValues={form} onSubmit={handleFormSubmit} validationSchema={RegisterSchema} enableReinitialize>
      {(props: FormikProps<any>) => (
        <Form onSubmit={props.handleSubmit}>
          {hasIsSameAsOnlineOption ? (
            <>
              <div>
                <h3>Business Information</h3>
              </div>
              <div className={cx(classes.selectQuestion, 'row')}>
                <div className="col-12 d-flex">
                  <FormikRadio
                    name="same_as_online"
                    label="Same as online store"
                    checked={sameSettingOnlineStore}
                    onClick={handleChangeUsingOnlineData}
                    labelClassName={classes.radioLabel}
                  />
                </div>
              </div>
            </>
          ) : null}

          <div>
            {hasIsSameAsOnlineOption || <h3 className={cx(classes.contentTitle)}>Business Information</h3>}
            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Business Name</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="shop.name" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Phone Number</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikTextMask className={cx(classes.input)} name="shop.phone" typeMask="phone" />
              </div>
            </div>
          </div>

          <div>
            <h3 className={cx(classes.contentTitle)}>Physical Address</h3>
            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Address</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="shop.address" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>City</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="shop.city" />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>State</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikSelect
                  inputId={'state-select-step2-register-partner'}
                  options={stateOptions}
                  name="shop.state"
                  isSearchable={true}
                />
              </div>
            </div>

            <div className={cx('form-group row', classes.formItem)}>
              <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Zip code</h4>
              <div className={cx('col-sm-8', classes.input_col)}>
                <FormikInput className={cx(classes.input)} name="shop.zip_code" />
              </div>
            </div>
          </div>

          <div className={cx(classes.selectQuestion, 'row')}>
            <div className="col-12 ">
              <h4>Is your physical address the same as your mailing address?</h4>
            </div>
            <div className={cx('col-12 d-flex', classes.radioWrapper)}>
              <FormikRadio name="shop.mailing_address" label="Yes" value="true" labelClassName={classes.radioLabel} />
              <FormikRadio
                name="shop.mailing_address"
                label="No"
                value="false"
                className="ml-5"
                labelClassName={classes.radioLabel}
              />
            </div>
          </div>
          {props.values.shop.mailing_address === 'false' ? (
            <>
              <div className={cx('form-group row', classes.formItem)}>
                <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Mailing Address</h4>
                <div className={cx('col-sm-8', classes.input_col)}>
                  <FormikInput className={cx(classes.input)} name="shop.address_mailing.address" />
                </div>
              </div>

              <div className={cx('form-group row', classes.formItem)}>
                <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>City</h4>
                <div className={cx('col-sm-8', classes.input_col)}>
                  <FormikInput className={cx(classes.input)} name="shop.address_mailing.city" />
                </div>
              </div>

              <div className={cx('form-group row', classes.formItem)}>
                <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>State</h4>
                <div className={cx('col-sm-8', classes.input_col)}>
                  <FormikSelect
                    inputId={'state-select-step2-register-partner'}
                    options={stateOptions}
                    name="shop.address_mailing.state"
                    className={cx(classes.input)}
                  />
                </div>
              </div>

              <div className={cx('form-group row', classes.formItem)}>
                <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Zip code</h4>
                <div className={cx('col-sm-8', classes.input_col)}>
                  <FormikInput className={cx(classes.input)} name="shop.address_mailing.zip_code" />
                </div>
              </div>
            </>
          ) : null}
          <Divider className={cx(classes.divider)} />

          <div className={cx(classes.selectQuestion, 'row')}>
            <div className="col-12">
              <h4>Does SmartEtailing host your website?</h4>
            </div>
            <div className={cx('col-12 d-flex', classes.radioWrapper)}>
              <FormikRadio name="shop.smart_tailing" label="Yes" value="true" labelClassName={classes.radioLabel} />
              <FormikRadio
                name="shop.smart_tailing"
                label="No"
                value="false"
                className="ml-5"
                labelClassName={classes.radioLabel}
              />
            </div>
          </div>

          <div className={cx('form-group row', classes.brandItem, classes.formItem)}>
            <h4 className={cx('col-sm-4', classes.label_col, classes.required)}>Brand Carried</h4>
            <div className={cx('col-sm-8', classes.input_col)}>
              <FormikSelect
                inputId={'brand-carrier-select-step2-register-partner'}
                className={cx(classes.input)}
                name="brand_selected"
                options={brandOptions}
                placeholder="Select Brand"
                isSearchable={true}
              />
            </div>
          </div>
          <Button type="submit" className={cx(classes.btn)}>
            Continue <img src={images.iconNextWhite} alt="icon_next" className="ml-4" />
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default StepTwo;
