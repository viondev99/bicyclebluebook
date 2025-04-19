import React, { FC } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import FormikRadio from 'components/Formik/Radio/FormikRadio';
import FormikInput from 'components/Formik/Input/FormikInput';
import classes from './bicycle-detail-section.module.scss';

interface Props {}

const FormEbike: FC<Props> = (props) => {
  return (
    <Row className={classes.formEbike}>
      <Col xs={12} lg={6}>
        <div>
          <h4 className={classes.label}>Odometer Reading</h4>
          <FormikInput name={'odometerReading'} type="number" />
        </div>
        <div>
          <h4 className={classes.label}>Hours</h4>
          <FormikInput name={'eBikeHours'} type="number" />
        </div>
        <div>
          <h4 className={classes.label}>Full charge cycles</h4>
          <FormikInput name={'chargeCycles'} type="number" />
        </div>
      </Col>
      <Col xs={12} lg={6}>
        <div>
          <h4 className={classes.label}>Diagnostic Report</h4>
          <div className={classes.wrapRadio}>
            <FormikRadio name="hasDiagnosticReport" value={'true'} label={<span>Yes</span>} className={classes.radio} />
            <FormikRadio name="hasDiagnosticReport" value={'false'} label={<span>No</span>} className={classes.radio} />
          </div>
        </div>
        <div>
          <h4 className={classes.labelRadio}>Charger included</h4>
          <div className={classes.wrapRadio}>
            <FormikRadio name="chargerIncluded" value={'true'} label={<span>Yes</span>} className={classes.radio} />
            <FormikRadio name="chargerIncluded" value={'false'} label={<span>No</span>} className={classes.radio} />
          </div>
        </div>
        <div>
          <h4 className={classes.labelRadio}>Key included</h4>
          <div className={classes.wrapRadio}>
            <FormikRadio name="hasKey" value={'true'} label={<span>Yes</span>} className={classes.radio} />
            <FormikRadio name="hasKey" value={'false'} label={<span>No</span>} className={classes.radio} />
          </div>
        </div>
        <div>
          <h4 className={classes.labelRadio}>Tampered with</h4>
          <div className={classes.wrapRadio}>
            <FormikRadio name="isTamperedWith" value={'true'} label={<span>Yes</span>} className={classes.radio} />
            <FormikRadio name="isTamperedWith" value={'false'} label={<span>No</span>} className={classes.radio} />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default FormEbike;
