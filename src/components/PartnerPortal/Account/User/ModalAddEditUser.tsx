import React, { FC, memo, useCallback, useEffect, useMemo, useRef } from 'react';

import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import classes from './modal-add-edit-user.module.scss';
import FormikInput from 'components/Formik/Input/FormikInput';
import t from 'helpers/language';
import FormikRadio from 'components/Formik/Radio/FormikRadio';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { useDispatch, useSelector } from 'react-redux';
import { getPartners } from 'store/common/common.action';
import StoreState from 'model/store';
import { StorefrontRole } from 'constants/roles';
import { addPartnerUser, updatePartnerUser } from 'store/partner/account/account.action';
import { ItemPartnerUsers } from 'model/store/partner/account.model';
import useScreenDetect from 'hooks/useScreenDetect';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recordEdit: ItemPartnerUsers;
}

const FormSchema = Yup.object().shape({
  email: Yup.string()
    .required(t('common.validate.emailRequired'))
    .max(250, 'Email Address cannot exceed 250 characters.')
    .matches(
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      t('authenticate.validate.emailInvalid'),
    ),
  first_name: Yup.string()
    .required(t('common.validate.firstNameRequired'))
    .max(250, t('common.validate.firstNameLength')),
  last_name: Yup.string().required(t('common.validate.lastNameRequired')).max(250, t('common.validate.lastNameLength')),
  partner: Yup.string().required(t('partnerPortal.profile.validate.location')),
});

interface FormValues {
  email: string;
  first_name: string;
  last_name: string;
  partner: string;
  role: string;
}

const defaultLocationOptions = [
  {
    id: '',
    name: ' Select Your Location',
  },
];

const ModalAddEditUser: FC<Props> = (props) => {
  const { isOpen, onClose, recordEdit } = props;
  const formRef = useRef<FormikProps<FormValues>>();
  const dispatch = useDispatch();
  const partners = useSelector((store: StoreState) => store.common.partners);
  const { currentWidthScreen } = useScreenDetect();

  const initialValues: FormValues = {
    email: recordEdit?.email || '',
    first_name: recordEdit?.account?.first_name || '',
    last_name: recordEdit?.account?.last_name || '',
    partner: recordEdit?.partner?._id || '',
    role: recordEdit?.role || StorefrontRole.Administrator,
  };

  const locationOptions = useMemo(() => {
    return Array.isArray(partners) && partners.length
      ? [...defaultLocationOptions, ...partners].map((it) => {
          return {
            value: it.id,
            label: it.name,
          };
        })
      : [];
  }, [partners]);

  useEffect(() => {
    dispatch(getPartners({ page_size: -1 }));
  }, [dispatch]);

  const handleFormSubmit = (values: FormValues) => {
    if (recordEdit) {
      const payload = {
        id: recordEdit?.account?._id,
        ...values,
      };
      if (values.email === recordEdit?.email) {
        delete payload.email;
      }
      dispatch(updatePartnerUser(payload));
      return;
    }
    dispatch(addPartnerUser(values));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalConfirmDelete}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      showImageLeft={true}
      hideButtonClose={true}
      title={`${recordEdit ? 'Edit' : 'Add New'} User`}>
      <div>
        <Formik
          innerRef={formRef}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={FormSchema}>
          {({ handleSubmit }: FormikProps<FormValues>) => (
            <Form onSubmit={handleSubmit} className={'mt-4'}>
              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>First Name</div>
                </Col>
                <Col md={9}>
                  <FormikInput name="first_name" className={classes.formSize} />
                </Col>
              </Row>
              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>Last Name</div>
                </Col>
                <Col md={9}>
                  <FormikInput name="last_name" className={classes.formSize} />
                </Col>
              </Row>
              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>Email Address</div>
                </Col>
                <Col md={9}>
                  <FormikInput name="email" className={classes.formSize} />
                </Col>
              </Row>
              <Row className={classes.mb22}>
                <Col md={3}>
                  <div className={classes.titleField}>Role</div>
                </Col>
                <Col md={9}>
                  <div className={classes.wrapRadio}>
                    <FormikRadio
                      name="role"
                      value={StorefrontRole.Administrator}
                      className={classes.radio}
                      label="Administrator"
                    />
                    <FormikRadio name="role" value={StorefrontRole.Manager} className={classes.radio} label="Manager" />
                    <FormikRadio
                      name="role"
                      value={StorefrontRole.Employee}
                      className={classes.radio}
                      label="Employee"
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <div className={classes.titleField}>Location</div>
                </Col>
                <Col md={9}>
                  <div className={classes.wrapSelect}>
                    <FormikSelect
                      inputId={'select-state'}
                      options={locationOptions}
                      className={classes.formSize}
                      name="partner"
                      isSearchable={true}
                      selectStyles={{
                        control: {
                          minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                        },
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
      <div className={cx(classes.wrapButton, classes.bottomRight)}>
        <Button className={classes.btnSubmit} buttonType="primary" onClick={() => formRef.current.handleSubmit()}>
          {recordEdit ? 'Save Changes' : 'Add User'}
        </Button>
        {currentWidthScreen > 767 && (
          <Button className={classes.btnCancel} buttonType="outline" onClick={onClose} style={{ marginLeft: 20 }}>
            Cancel
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default memo(ModalAddEditUser);
