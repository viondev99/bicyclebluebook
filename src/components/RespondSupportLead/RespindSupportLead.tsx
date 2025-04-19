/* eslint-disable no-param-reassign */
import Button from '@ui/Buttons/Primary/Button';
import Card from '@ui/Cards';
import * as Yup from 'yup';
import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { supportLeadGen, SupportLeadGenResponse } from 'api/respond-support';
import { Form, Formik, FormikProps } from 'formik';
import t from 'helpers/language';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import classes from './respondSupportLead.module.scss';

interface FormValue {
  message: string;
}

function RespondSupportLead() {
  const { query } = useRouter();
  const SendComplaintSchema = Yup.object().shape({
    message: Yup.string().required(t('common.validateRequired')),
  });

  const handleReply = useCallback(
    async (values: FormValue) => {
      const payload = String(query?.id).slice(0, -1);
      await supportLeadGen(payload, values.message.trim())
        .then((res: SupportLeadGenResponse) => {
          toastSuccess(res?.message);
          values.message = '';
        })
        .catch((err) => toastError(err));
    },
    [query],
  );

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>Respond on Leadgen</h3>
      <div className={classes.boxCard}>
        <Formik
          onSubmit={handleReply}
          initialValues={{ message: '' }}
          validationSchema={SendComplaintSchema}
          validateOnChange={true}>
          {({ handleSubmit }: FormikProps<FormValue>) => (
            <Form onSubmit={handleSubmit} className={classes.card}>
              <Card>
                <div className={classes.topItem}>
                  <FormikTextarea
                    rows={6}
                    name={'message'}
                    placeholder={'Message'}
                    className={classes.textBox}
                    maxLength={500}
                  />
                </div>
                <Button type="submit" className={classes.buttonReply}>
                  Reply
                </Button>
              </Card>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default RespondSupportLead;
