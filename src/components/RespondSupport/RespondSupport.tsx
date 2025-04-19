import Button from '@ui/Buttons/Primary/Button';
import Card from '@ui/Cards';
import * as Yup from 'yup';
import React, { useCallback } from 'react';
import classes from './respondSupport.module.scss';
import { useRouter } from 'next/router';
import { replyEmail } from 'api/respond-support';
import { Form, Formik, FormikProps } from 'formik';
import t from 'helpers/language';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import { toastError, toastSuccess } from 'helpers/utils.helper';

interface FormValue {
  message: string;
}

function RespondSupport() {
  const params = useRouter();
  const SendComplaintSchema = Yup.object().shape({
    message: Yup.string().required(t('common.validateRequired')),
  });

  const handleReply = useCallback(async (values: FormValue) => {
    await replyEmail(String(params?.query?.id), values.message)
      .then((res) => {
        toastSuccess(res?.message);
        values.message = '';
      })
      .catch((err) => toastError(err));
  }, []);

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>Respond on "Value Guide, Website, and Other"</h3>
      <div className={classes.boxCard}>
        <Formik
          onSubmit={handleReply}
          initialValues={{ message: '' }}
          validationSchema={SendComplaintSchema}
          validateOnChange={true}>
          {({ handleSubmit }: FormikProps<any>) => (
            <Form onSubmit={handleSubmit} className={classes.card}>
              <Card>
                <div className={classes.topItem}>
                  <FormikTextarea rows={6} name={'message'} placeholder={'Message'} className={classes.textBox} />
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

export default RespondSupport;
