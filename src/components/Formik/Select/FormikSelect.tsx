import React, { FC } from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import { Field, FieldProps } from 'formik';
import { Option } from 'react-select/src/filters';
import Select, { Props as SelectProps } from '@ui/Select/Select';

interface Props {
  name: string;
  disabled?: boolean;
  onChangeValue?: (value: string) => void;
}

const FormikSelect: FC<Props & SelectProps> = (props) => {
  const { disabled, name, options, onChangeValue, className, ...other } = props;

  return (
    <Field name={name}>
      {({ field, form: { touched, errors, handleChange, setFieldTouched } }: FieldProps<any>) => {
        const isError = has(touched, field.name) && has(errors, field.name);

        return (
          <>
            <Select
              {...other}
              {...field}
              name={field.name}
              className={className}
              options={options}
              isDisabled={disabled}
              isError={isError}
              onChange={(option: Option) => {
                handleChange(field.name)(option?.value || '');
                onChangeValue && onChangeValue(option?.value);
                setTimeout(() => {
                  setFieldTouched(name, true);
                }, 0);
              }}
            />
            {isError ? <p className={'error-message'}>{get(errors, field.name)}</p> : null}
          </>
        );
      }}
    </Field>
  );
};

export default FormikSelect;
