import React, { useState, useMemo, useCallback } from 'react';
import trim from 'lodash/trim';
import FormikInput from 'components/Formik/Input/FormikInput';
import FormikCheckbox from 'components/Formik/CheckBox/FormikCheckbox';
import { Formik, FormikProps, Form } from 'formik';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from '@ui/Buttons/Primary/Button';
import t from 'helpers/language';
import cx from 'classnames';
import StoreState from 'model/store';
import { updatePartnerDetail } from 'api/partner/account.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import Modal from '@ui/Modal/Modal';
import classes from './settings-section.module.scss';

export const urlRegex: RegExp = new RegExp(
  `(?:^(?:(?:(?:[a-z]+:)?//)|www\.)(?:\S+(?::\S*)?@)?(?:localhost|(?:(?:[a-z\u00a1-\uffff0-9][-_]*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::[0-9]{2,5})?(?:[/?#][^\s"]*)?$)`,
  'i',
);

const SettingsSchema = Yup.object().shape({
  widgetUrl: Yup.string().matches(urlRegex, t('common.validate.websiteInvalid')),
});

interface FormSettings {
  enableLeadGen: boolean;
  leadGenEmail: string;
  enableWidget: boolean;
  widgetUrl: string;
  operation_redbarn?: boolean;
}

const SettingsSection: React.FC = () => {
  const { partnerId, detail, detailPartnerLocation } = useSelector((store: StoreState) => ({
    detail: store.partner.account.detail,
    partnerId: store.authenticate?.user?.partner,
    detailPartnerLocation: store.partner.account?.detailPartnerLocation,
  }));
  const [editable, setEditable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEnabledRedBarn, setIsEnabledRedBarn] = useState<boolean>(false);

  const initialValues = useMemo(() => {
    return {
      enableLeadGen: !!detail?.enableLeadGen,
      leadGenEmail: detail?.leadGenEmail || '',
      enableWidget: !!detail?.enableWidget,
      widgetUrl: detail?.widgetUrl || '',
      operation_redbarn: !!detailPartnerLocation?.operation_redbarn,
    };
  }, [detail, detailPartnerLocation]);

  const handleFormSubmit = useCallback(
    (form: FormSettings) => {
      if (partnerId) {
        setLoading(true);
        const payload = new FormData();
        if (!detail?.overrideBBB) {
          payload.append('is_send_mail_widget', form.enableLeadGen ? 'true' : 'false');
        }
        if (trim(form.leadGenEmail)) {
          payload.append('lead_email', trim(form.leadGenEmail));
        }
        payload.append('widget_enable', form.enableWidget ? 'true' : 'false');
        // payload.append('operation_redbarn', form.operation_redbarn ? 'true' : 'false');
        if (trim(form.widgetUrl) && !detail?.partnerParent) {
          payload.append('widget_url', trim(form.widgetUrl));
        }
        updatePartnerDetail(partnerId, payload)
          .then(() => {
            toastSuccess(t('partnerPortal.account.updateAccount'));
            setLoading(false);
            setEditable(false);
            setIsEnabledRedBarn(false);
          })
          .catch((error) => {
            toastError(error);
            setLoading(false);
            setIsEnabledRedBarn(false);
          });
      }
    },
    [partnerId, detail],
  );

  return (
    <div className={classes.shopInfo}>
      <div className={classes.headerForm}>
        <div className={classes.subTitle}>Shop Details</div>
        <Button
          disabled={editable}
          buttonType="clear"
          className={cx(classes.editForm, classes.activeEdit)}
          onClick={() => setEditable(true)}>
          Edit
        </Button>
      </div>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={SettingsSchema}>
        {({ isValid, handleSubmit, setFieldValue }: FormikProps<any>) => (
          <Form onSubmit={handleSubmit}>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={12}>
                <div className={classes.checkbox}>
                  <FormikCheckbox name="enableLeadGen" disabled={!editable || !!detail?.overrideBBB} />
                  <span className={classes.label}>Enable Lead Gen</span>
                </div>
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Lead Gen Email</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="leadGenEmail" disabled={!editable} />
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={12}>
                <div className={classes.checkbox}>
                  <FormikCheckbox name="enableWidget" disabled={!editable} />
                  <span className={classes.label}>Enable Widget</span>
                </div>
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={12}>
                <div className={classes.checkbox}>
                  <FormikCheckbox
                    name="operation_redbarn"
                    disabled={!editable}
                    onChange={() => {
                      setIsEnabledRedBarn(true);
                      setFieldValue('operation_redbarn', initialValues?.operation_redbarn);
                    }}
                  />
                  <span className={classes.label}>Red Barn Enabled</span>
                </div>
                <div className={cx(classes.messageRedBarn, { [classes.showMess]: isEnabledRedBarn })}>
                  Please contact your account rep to opt into the Red Barn Trade-in program
                </div>
              </Col>
            </Row>
            <Row className={classes.wrapperInput}>
              <Col xs={12} sm={3}>
                <div className={classes.label}>Widget URL</div>
              </Col>
              <Col xs={12} sm={9}>
                <FormikInput name="widgetUrl" disabled={!editable} />
              </Col>
            </Row>
            <Button
              isLoading={loading}
              type="submit"
              className={classes.btnSave}
              disabled={!editable || !isValid || loading}>
              Save Changes
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SettingsSection;
