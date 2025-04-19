import React, { FC, useMemo } from 'react';
import Textarea from '@ui/Textarea';
import { FormStepTwo } from '.';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { Form, Formik, FormikProps } from 'formik';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import FormikInput from 'components/Formik/Input/FormikInput';
import cx from 'classnames';
import { pxToRem } from 'helpers/common.helper';
import images from '../../../../assets/images';
import classes from './modal-respond.module.scss';

interface Files {
  lastModified?: number;
  lastModifiedDate?: Date;
  name?: string;
  size?: number;
  type?: number | string;
  webkitRelativePath?: string;
  // src?: string;
}

const selectStyle: any = {
  singleValue: {
    fontSize: pxToRem(22),
    lineHeight: '120%',
    fontWeight: '500',
    color: '#2F3642',

    '@media (max-width: 991px)': {
      fontSize: pxToRem(18),
    },
  },
  placeholder: {
    color: '#2F3642',
  },
  control: {
    height: '65px',
    '@media (max-width: 991px)': {
      height: '55px',
    },
    '@media (max-width: 575px)': {
      height: '50px',
    },
  },
};
interface Props {
  formStepTwo: FormStepTwo;
  handleChangeStepTwoForm: (key: string, value: string | number | File) => void;
}
const inputFileRef: React.RefObject<HTMLInputElement> = React.createRef();
const CarrierOptions = [
  {
    label: 'SELECT',
    value: '',
  },
  {
    label: 'UPS',
    value: 'UPS',
  },
  {
    label: 'FEDEX',
    value: 'FEDEX',
  },
  {
    label: 'OTHER',
    value: 'OTHER',
  },
];

const RespondStepTwoChoiceTwo: FC<Props> = ({ formStepTwo, handleChangeStepTwoForm }) => {
  const handleFileUpload = (event: { target: HTMLInputElement }) => {
    const target = event.target as HTMLInputElement;
    const listFileSelected: Files[] = Array.from(target.files);
    let fileSelected: any = listFileSelected?.length > 0 ? listFileSelected[0] : null;
    if (fileSelected) {
      // fileSelected.src = URL.createObjectURL(fileSelected);
      handleChangeStepTwoForm('fileUpload', fileSelected);
    }
  };

  const renderImage = useMemo(() => {
    return (
      <>
        {formStepTwo?.fileUpload?.name && (
          <Row>
            <Col className={classes.fieldTitleChoiceThree} sm={4}>
              <div className={classes.listCasesImageContainer}>
                <div className={classes.titleUploadResponse}>Upload Shipping Label</div>
              </div>
            </Col>
            <Col>
              <div className={classes.listCasesImageContainer}>
                <span className={classes.imgText}>{formStepTwo?.fileUpload?.name}</span>
                <img
                  src={images.icDeleteUpload}
                  alt="Del"
                  className={classes.cp}
                  onClick={() => handleChangeStepTwoForm('fileUpload', undefined)}
                />
              </div>
            </Col>
          </Row>
        )}
      </>
    );
  }, [formStepTwo, handleChangeStepTwoForm]);

  return (
    <Formik enableReinitialize={true} initialValues={{ carrier: '' }} onSubmit={null}>
      {({ values, handleSubmit }: FormikProps<any>) => (
        <Form onSubmit={handleSubmit}>
          <div className={classes.fieldContainer42}>
            <div className={classes.modalRespondFormTitleChoiceThree}>Note</div>
            <Textarea
              value={formStepTwo?.note}
              rows={6}
              onChange={(e) => handleChangeStepTwoForm('note', e.target.value)}
            />
          </div>
          <div className={classes.fieldContainer36}>
            <div className={cx(classes.modalRespondFormTitleChoiceTwo, classes.titleChoiceThree)}>Shipping info</div>
            <Row className={'mb-3'}>
              <Col sm={4} className={cx(classes.fieldTitleChoiceThree, classes.mobileMb16)}>
                Carrier:
              </Col>
              <Col>
                <FormikSelect
                  inputId={'select-carrier'}
                  options={CarrierOptions}
                  placeholder="Select Carrier"
                  name={'carrier'}
                  onChangeValue={(value) => handleChangeStepTwoForm('carrier', value)}
                  selectStyles={selectStyle}
                />
              </Col>
            </Row>
            <Row>
              <Col className={cx(classes.fieldTitleChoiceThree, classes.mobileMb16)} sm={4}>
                Tracking number:
              </Col>
              <Col>
                <FormikInput
                  name={'trackingNumber'}
                  onChange={(e) => handleChangeStepTwoForm('trackingNumber', e.target.value)}
                  className={classes.responsiveInput}
                />
              </Col>
            </Row>
          </div>
          <div className={classes.fieldContainer}>
            {!formStepTwo.fileUpload && (
              <div>
                <div
                  onClick={() => {
                    inputFileRef.current.click();
                  }}
                  className={classes.listCasesAreaUpload}>
                  Upload File
                </div>
                <input ref={inputFileRef} type="file" onChange={handleFileUpload} hidden accept="image/*" />
              </div>
            )}
            {formStepTwo.fileUpload && renderImage}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(RespondStepTwoChoiceTwo);
