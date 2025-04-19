import React, { FC, CSSProperties, InputHTMLAttributes } from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import { Field, FieldProps } from 'formik';

import Radio, { Props as RadioProps } from '@ui/Radio';

interface Props {
  name: string;
  containerStyle?: CSSProperties;
  containerClass?: string;
}

const FormikRadio: FC<Props & RadioProps & InputHTMLAttributes<any>> = (props) => {
  const { containerClass, containerStyle, name, ...other } = props;

  return (
    <Field name={name}>
      {({ field, form: { touched, errors, setFieldValue } }: FieldProps<any>) => {
        const isError: boolean = has(touched, field.name) && has(errors, field.name);

        return (
          <div className={containerClass} style={containerStyle}>
            <Radio
              checked={field.value === props.value}
              onChange={(e) => setFieldValue(name, e.target.checked)}
              isError={isError}
              name={name}
              {...field}
              {...other}
            />
            {isError ? <p className={'error-message'}>{get(errors, field.name)}</p> : null}
          </div>
        );
      }}
    </Field>
  );
};

export default FormikRadio;
