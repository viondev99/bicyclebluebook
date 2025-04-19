import React, { FC, useMemo } from 'react';
import Textarea from '@ui/Textarea';
import { FormStepTwo } from '.';
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
interface Props {
  formStepTwo: FormStepTwo;
  handleChangeStepTwoForm: (key: string, value: string | number | File) => void;
}
const inputFileRef: React.RefObject<HTMLInputElement> = React.createRef();

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
          <div className={classes.listCasesImageContainer}>
            <div className={classes.titleUploadResponse}>Upload file</div>
            <div className="d-flex align-items-center">
              <span className={classes.imgText}>{formStepTwo?.fileUpload?.name}</span>
              <img
                src={images.icDeleteUpload}
                alt="Del"
                className={classes.cp}
                onClick={() => handleChangeStepTwoForm('fileUpload', undefined)}
              />
            </div>
          </div>
        )}
      </>
    );
  }, [formStepTwo, handleChangeStepTwoForm]);

  return (
    <>
      <div className={classes.fieldContainer}>
        <div className={classes.modalRespondFormTitleChoiceTwo}>Note</div>
        <Textarea
          value={formStepTwo?.note}
          rows={6}
          onChange={(e) => handleChangeStepTwoForm('note', e.target.value)}
        />
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
    </>
  );
};

export default React.memo(RespondStepTwoChoiceTwo);
