import React, { FC, useState, useCallback } from 'react';

import icEyeOn from 'assets/img/authenticate/ic_eye_on.svg';
import icEyeOff from 'assets/img/authenticate/ic_eye_off.svg';
import FormikInput from 'components/Formik/Input/FormikInput';
import classes from '../reset-password-full-screen.module.scss';

interface Props {
  name: string;
  placeholder: string;
}

const InputPassword: FC<Props> = ({ name, placeholder }) => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleShow = useCallback(
    (e) => {
      e.preventDefault();
      setVisible(!visible);
    },
    [visible],
  );

  return (
    <FormikInput
      name={name}
      type={visible ? 'text' : 'password'}
      placeholder={placeholder}
      renderSuffix={
        <button className={classes.buttonSuffix} type={'button'} onClick={toggleShow}>
          <img src={visible ? icEyeOff : icEyeOn} style={{ width: 25, height: 25 }} alt={'error-icon'} />
        </button>
      }
    />
  );
};

export default InputPassword;
