import t from 'helpers/language';
import * as Yup from 'yup';

export const FormSchema = () =>
  Yup.object().shape({
    make: Yup.string().required(t('common.validate.make')),
    model: Yup.string().required(t('common.validate.modelRequired')),
    value: Yup.string().required(t('common.validate.valueRequired')),
  });
