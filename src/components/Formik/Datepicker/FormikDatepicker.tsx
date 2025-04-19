import React, { FC, InputHTMLAttributes } from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import { Field, FieldProps } from 'formik';

import Input, { Props as InputProps } from '@ui/Inputs/Input';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  name: string;
  disabled?: boolean;
}

const FormikInput: FC<Props & InputHTMLAttributes<HTMLInputElement> & InputProps> = (props) => {
  const { name, onChange, ...other } = props;

  return (
    <Field name={name}>
      {({ field, form: { touched, errors, handleBlur } }: FieldProps<any>) => {
        const isError: boolean = has(touched, field.name) && has(errors, field.name);

        const handleOnChange = (e: any) => {
          field.onChange(e);
          if (onChange) {
            onChange(e);
          }
        };

        return (
          <>
            <DatePicker
              {...field}
              {...props}
              onChange={(value: any) => handleOnChange(value)}
              onSelect={() => null}
              selected={field?.value}
              customInput={<Input {...props} />}
            />
            {isError ? <p className={'error-message'}>{get(errors, field.name)}</p> : null}
          </>
        );
      }}
    </Field>
  );
};

export default FormikInput;
