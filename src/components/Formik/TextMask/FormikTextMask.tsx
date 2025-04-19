import React, { FC, InputHTMLAttributes, useMemo } from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import { Field, FieldProps } from 'formik';
import MaskedInput from 'react-text-mask';
import Input, { Props as InputProps } from '@ui/Inputs/Input';

export enum MaskInput {
  Phone = 'PHONE',
  Currency = 'CURRENCY',
}

interface Props {
  name: string;
  placeholder?: string;
  typeMask: 'phone' | '';
}

const FormikTextMask: FC<Props & InputHTMLAttributes<HTMLInputElement> & InputProps> = (props) => {
  const { name, className, typeMask = '', placeholder = '', ...other } = props;
  const mask = useMemo(() => {
    switch (typeMask.toUpperCase()) {
      case MaskInput.Phone:
        return [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

      default:
        return [];
    }
  }, [typeMask]);

  return (
    <Field name={name}>
      {({ field, form: { touched, errors } }: FieldProps<any>) => {
        const isError: boolean = has(touched, field.name) && has(errors, field.name);

        return (
          <>
            <MaskedInput
              mask={mask}
              showMask={false}
              placeholder={placeholder}
              render={(inputRef, inputProps) => (
                <Input type="text" className={className} {...inputProps} ref={inputRef} isError={isError} />
              )}
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

export default FormikTextMask;
