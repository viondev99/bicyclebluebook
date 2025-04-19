import React, { FC, InputHTMLAttributes, FormEvent, FocusEvent, ChangeEvent, ElementRef } from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import { Field, FieldProps } from 'formik';

import Input, { Props as InputProps } from '@ui/Inputs/Input';

interface Props {
  name: string;
  disabled?: boolean;
  formInputRef?: ElementRef<any>;
}

const FormikInput: FC<Props & InputHTMLAttributes<HTMLInputElement> & InputProps> = (props) => {
  const { name, onChange, onBlur, formInputRef, ...other } = props;

  return (
    <Field name={name}>
      {({ field, form: { touched, errors, handleBlur } }: FieldProps<any>) => {
        const isError: boolean = has(touched, field.name) && has(errors, field.name);

        const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
          field.onChange(e);
          if (onChange) {
            onChange(e);
          }
        };
        const handleOnblur = (e: any) => {
          field.onBlur(e);
          if (onBlur) {
            onBlur(e);
          }
        };
        return (
          <>
            <Input
              type="text"
              formInputRef={formInputRef}
              {...other}
              {...field}
              isError={isError}
              onChange={handleOnChange}
              onBlur={handleOnblur}
            />
            {isError ? <p className={'error-message'}>{get(errors, field.name)}</p> : null}
          </>
        );
      }}
    </Field>
  );
};

export default FormikInput;
