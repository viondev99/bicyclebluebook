import React, { CSSProperties, FC } from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import { Field, FieldProps } from 'formik';
import Switch, { Props as SwitchProps } from '@ui/Switch/Switch';

interface Props {
  name: string;
  containerStyle?: CSSProperties;
  containerClass?: string;
  handleChange?: (value: boolean) => void;
}

const FormikSwitch: FC<Props & Omit<SwitchProps, 'checked' | 'onChange'>> = (props) => {
  const { containerClass, containerStyle, name, ...other } = props;

  return (
    <Field name={name}>
      {({ field, form: { touched, errors, setFieldValue, setFieldTouched } }: FieldProps<any>) => {
        const isError: boolean = has(touched, field.name) && has(errors, field.name);
        const handleChange = (value: boolean) => {
          setFieldTouched(name, true);
          setFieldValue(name, value);
          if (props.handleChange) {
            props.handleChange(value);
          }
        };

        return (
          <div className={containerClass} style={containerStyle}>
            <Switch checked={field.value} isError={isError} onChange={handleChange} {...other} />
            {isError ? <p className={'error-message'}>{get(errors, field.name)}</p> : null}
          </div>
        );
      }}
    </Field>
  );
};

export default FormikSwitch;
