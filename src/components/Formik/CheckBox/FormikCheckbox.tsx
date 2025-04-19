import React, { FC, InputHTMLAttributes } from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import { Field, FieldProps } from 'formik';

import CheckBox, { Props as CheckBoxProps } from '@ui/CheckBox';

interface Props {
  name: string;
}

const FormikCheckbox: FC<Props & CheckBoxProps & InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const { name, ...other } = props;

  return (
    <Field name={name}>
      {({ field, form: { touched, errors, setFieldValue } }: FieldProps<any>) => {
        const isError: boolean = has(touched, field.name) && has(errors, field.name);
        return (
          <>
            <CheckBox
              checked={field.value}
              isError={isError}
              name={name}
              onChange={(e) => setFieldValue(name, e.target.checked)}
              {...field}
              {...other}
            />
            {isError ? <p className={'error-message'}>{get(errors, field.name)}</p> : null}
          </>
        );
      }}
    </Field>
  );
};

export default FormikCheckbox;
