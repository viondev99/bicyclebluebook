import t from 'helpers/language';
import * as Yup from 'yup';

export const FormSchema = () =>
  Yup.object().shape({
    reason: Yup.string().required(`Topic is required.`).max(250, `Topic cannot exceed 250 characters.`),
    shop_name: Yup.string()
      .required(t('myAccount.profile.validate.shopName'))
      .max(250, t('partnerPortal.profile.validate.shopNameLength')),
    name: Yup.string().required(`Contact Name is required`).max(250, `Contact Name cannot exceed 250 characters.`),
    email: Yup.string().required(t('contactUs.validate.emailRequired')).email(t('common.validate.emailInvalid')),
    message: Yup.string()
      .required(`Message is required.`)
      .min(30, t('common.validate.messageInvalid'))
      .max(250, `Message cannot exceed 500 characters.`),
  });
