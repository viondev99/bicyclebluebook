import React, { FC, TextareaHTMLAttributes } from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import { Field, FieldProps } from 'formik';

import Textarea, { Props as TextareaProps } from '@ui/Textarea';

interface Props {
  name: string;
}

const FormikTextarea: FC<Props & TextareaHTMLAttributes<any> & TextareaProps> = (props) => {
  const { name, ...other } = props;

  return (
    <Field name={name}>
      {({ field, form: { touched, errors } }: FieldProps<any>) => {
        const isError: boolean = has(touched, field.name) && has(errors, field.name);

        return (
          <>
            <Textarea {...field} {...other} isError={isError} />
            {isError ? <p className={'error-message'}>{get(errors, field.name)}</p> : null}
          </>
        );
      }}
    </Field>
  );
};

export default FormikTextarea;
