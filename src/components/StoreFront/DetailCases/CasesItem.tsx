import React, { FC, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Button from '@ui/Buttons/Primary/Button';
import { toastError } from 'helpers/utils.helper';
import t from 'helpers/language';
import { StorefrontDetailCasesModel } from 'model/store/store-front/account.model';
import dayjs from 'dayjs';
import cx from 'classnames';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { Form, Formik, FormikProps } from 'formik';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import capitalize from 'lodash/capitalize';
import { updateStorefrontDetailCases } from 'store/store-front/account/account.action';
import classes from './cases.module.scss';
import { TypeOptions } from './interface';

interface Props {
  listAssigns: object[];
  dataDetailCases: StorefrontDetailCasesModel;
  id: any;
  onOpenModalRespond: () => void;
}
interface Forms {
  status: string;
  assign: string;
}

const statusOptions: TypeOptions[] = [
  { label: 'New', value: 'new' },
  { label: 'Open', value: 'open' },
  { label: 'Pending', value: 'pending' },
  { label: 'Closed', value: 'closed' },
  { label: 'Rejected', value: 'rejected' },
];

const CasesItem: FC<Props> = ({ listAssigns, dataDetailCases, id, onOpenModalRespond }) => {
  const router = useRouter();
  const formRef: { current: any } = useRef();
  const dispatch = useDispatch();

  function handleFormSubmit(values: Forms): void {
    const { assign, status } = values;
    if (!assign || assign === '') {
      return toastError(t('cases.assign.empty'));
    }
    let newStatus = assign !== '' && status === 'new' ? 'open' : status;
    formRef?.current?.setFieldValue('status', newStatus, false);

    const payload = {
      id,
      assign,
      status: newStatus,
    };
    dispatch(updateStorefrontDetailCases(payload));
  }

  const initialValues = useMemo(() => {
    return {
      status: dataDetailCases?.status || 'new',
      assign: dataDetailCases?.assignee_storefront?.id || '',
    };
  }, [dataDetailCases]);

  const listCardItem = useMemo(() => {
    return [
      { title: 'Buyer', description: dataDetailCases?.buyer_name || '' },
      { title: 'Order No.', description: dataDetailCases?.order_code || '' },
      { title: 'Date', description: dayjs(dataDetailCases?.date_created).format('DD MMM YYYY') },
      {
        title: 'Reason',
        description: capitalize(String(dataDetailCases?.reason_case?.reason).replace(/_/g, ' ')),
      },
      {
        title: 'Comments',
        description: dataDetailCases?.reason_case?.description || '',
      },
    ];
  }, [dataDetailCases]);

  const listFormItem = useMemo(() => {
    return [
      { title: 'Status', description: 'mattboudreaux4', key: 'status' },
      { title: 'Assign', description: 'jkf7984', key: 'assign' },
    ];
  }, []);

  const renderListFormItem = useMemo(() => {
    return listFormItem.map((it, idx) => {
      return (
        <Row key={it.title} className={classes.casesCardHeaderLeftItem}>
          <Col sm={3} className={classes.cardTitle}>
            {it.title}
          </Col>
          <Col sm={9}>
            <FormikSelect
              inputId={it.key}
              options={idx === 0 ? statusOptions : listAssigns}
              disabled={dataDetailCases?.status === 'closed'}
              name={it.key}
              className={cx(classes.input)}
              placeholder="Select"
              isSearchable={true}
            />
          </Col>
        </Row>
      );
    });
  }, [listAssigns]);

  const gotoPage = (index: number) => {
    switch (index) {
      case 1: {
        return router.push(`/store-front/order-history/${dataDetailCases?.order}`);
      }
      case 2: {
        return router.push(`/marketplace/seller/${dataDetailCases?.buyer_id}`);
      }
      default:
        break;
    }
  };

  const renderListCardItem = useMemo(() => {
    return listCardItem.map((it, idx) => {
      return (
        <Row key={it.title} className={classes.casesCardHeaderLeftItem}>
          <Col sm={3} className={classes.cardTitle}>
            {it.title}
          </Col>
          <Col
            sm={9}
            className={cx(classes.cardDescription, idx === 1 && classes.cardLink)}
            onClick={() => gotoPage(idx)}>
            {it.description}
          </Col>
        </Row>
      );
    });
  }, [listCardItem]);
  return (
    <>
      <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={handleFormSubmit} innerRef={formRef}>
        {({ handleSubmit }: FormikProps<any>) => (
          <Form onSubmit={handleSubmit}>
            <div className={classes.formCaseDetail}>
              <div className={classes.casesCardHeader}>
                <div className={classes.casesCardHeaderLeft}>{renderListCardItem}</div>
              </div>
              <div className={classes.casesCardHeader}>
                <div className={classes.casesCardHeaderLeft}>{renderListFormItem}</div>
              </div>
              {dataDetailCases?.status !== 'closed' && (
                <div className={classes.footerCard}>
                  <Button type="submit" className={classes.btnSave}>
                    Save
                  </Button>
                  {dataDetailCases?.send_reponses?.length === 0 && (
                    <Button onClick={onOpenModalRespond} className={classes.btnSave}>
                      Respond
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default React.memo(CasesItem);
