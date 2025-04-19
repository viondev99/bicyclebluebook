import React, { FC } from 'react';
import Progress from 'reactstrap/lib/Progress';
import { ProcessHandleCreate } from '../../form';
import classes from './process.module.scss';

interface Props {
  process: ProcessHandleCreate;
  percentUploadFile?: number;
}

const ProcessVerify: FC<Props> = ({ process, percentUploadFile }) => {
  return process ? (
    <div className={classes.container}>
      <div className={classes.content}>
        {process === ProcessHandleCreate.ValidatingEmail && `Validating your paypal`}
        {process === ProcessHandleCreate.Submitting && `Saving your information`}
        {process === ProcessHandleCreate.SendingFiles && (
          <span>
            <div>Uploading your images {`${percentUploadFile} %`}</div>
            <Progress value={percentUploadFile ? Number(percentUploadFile) : 0} className={classes.processBar} />
          </span>
        )}
        {process === ProcessHandleCreate.Completing && `Completing your listing`}
        {process === ProcessHandleCreate.SaveDraft && `Saving draft`}
      </div>
    </div>
  ) : null;
};
export default ProcessVerify;
