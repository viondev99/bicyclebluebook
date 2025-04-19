import React, { FC, useCallback, useState, useEffect, useMemo, Suspense } from 'react';
import { LineItemModel, OrderDetailModel } from 'model/store/account/personal/orders.model';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import { Form, Formik, FormikProps } from 'formik';
import Link from 'next/link';
import t from 'helpers/language';
import iconDollar from 'assets/img/common/ic_dollar.svg';
import trim from 'lodash/trim';
import FormikRadio from 'components/Formik/Radio/FormikRadio';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import { getUserInfo } from 'api/common.api';
import { getReturnDetail } from 'api/account/personal/order.api';
import { ReturnDetailResponse } from 'model/api/account/personal/orders.model';
import cx from 'classnames';
import Card from '@ui/Cards/index';
import { RefundItemModel, SendEmailItemReturnParams } from 'model/api/account/personal/listings.model';
import FormikInput from 'components/Formik/Input/FormikInput';
import Button from '@ui/Buttons/Primary/Button';
import { sendEmailItemReturn, sendRefundItem } from 'api/account/personal/listings.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { useRouter } from 'next/router';
import { defaultLinkImage } from 'helpers/constraint.helper';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import Skeleton from 'react-loading-skeleton';
import { getInventoryAge } from 'api/store-front/listings.api';
import { RefundGA, triggerGA4ECommerceEvent } from 'helpers/ga4.helper';
import classes from './refund-item.module.scss';

const ReturnModalConfirmSendEmail = React.lazy(() => import('./ReturnModalConfirmSendEmail'));

interface FormRefund {
  reason: string;
  otherReason: string;
  amount: string;
  note: string;
}

interface Props {
  item: LineItemModel;
  orderDetail: OrderDetailModel;
}

const LIST_REASON = ['Seller cancelled', 'Buyer returned', 'other'];

const initialValues = {
  reason: '',
  otherReason: '',
  amount: '',
  note: '',
};

const ReturnForm: FC<Props> = ({ item, orderDetail }) => {
  const [buyerName, setBuyerName] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [visibleReturnModalConfirmSendEmail, setvisibleReturnModalConfirmSendEmail] = useState(false);
  const [detailReturn, setDetailReturn] = useState<ReturnDetailResponse>(null);
  const { query, pathname } = useRouter();
  const router = useRouter();
  const loading = useSelector((state: StoreState) => state.account.personal.orders.detail?.loading);

  const isBuyerReturn = useMemo(() => {
    const { marketListing } = query;
    return (
      item?.is_buyer_return ||
      item?.market_listings.find((mkItem) => mkItem?.market_listing_id === Number(marketListing))?.is_buyer_return
    );
  }, [item, query]);

  useEffect(() => {
    if (item && orderDetail?.user !== null) {
      getUserInfo(item?.buyer_id)
        .then((res) => {
          setBuyerName(res?.user_name ? res.user_name : res.display_name);
        })
        .catch((err) => toastError(err));
    }
    if (isBuyerReturn) {
      const { inventory, marketListing, itemId, id } = query;
      getReturnDetail({
        inventory_id: Number(inventory),
        market_listing_id: Number(marketListing),
        master_listing_id: Number(itemId),
        order_id: String(id),
      })
        .then((res: ReturnDetailResponse) => {
          setDetailReturn(res);
        })
        .catch((err) => toastError(err));
    }
    getInventoryAge(String(query?.inventory)).then((res) => setAge(res));
  }, [isBuyerReturn, item, orderDetail, query]);

  const handleCloseReturnModalConfirmSendEmail = useCallback(() => {
    const { id, itemId, marketListing, inventory } = query;
    setvisibleReturnModalConfirmSendEmail(false);
    const isOrder = pathname?.includes('order');
    if (pathname?.includes('store-front')) {
      router.push(
        `/store-front/return-detail/${isOrder ? 'order-history' : 'mylistings'}/${itemId}/${String(
          id,
        )}?inventory=${inventory}&marketListing=${marketListing}`,
      );
    } else {
      router.push(
        `/account/return-detail/${
          isOrder ? 'order' : 'mylistings'
        }/${itemId}/${id}?inventory=${inventory}&marketListing=${marketListing}`,
      );
    }
  }, [pathname, query, router]);

  const handleSendMail = useCallback(async () => {
    try {
      const { marketListing, inventory, id, itemId } = query;
      const bodyPatch: SendEmailItemReturnParams = {
        order_id: String(id),
        master_listing_id: Number(itemId),
        market_listing_id: Number(marketListing),
        inventory_id: Number(inventory),
        is_send: true,
      };

      await sendEmailItemReturn(bodyPatch);
      toastSuccess('Shipping label sent');
      handleCloseReturnModalConfirmSendEmail();
    } catch (error) {
      toastError(error);
      handleCloseReturnModalConfirmSendEmail();
    }
  }, [query, handleCloseReturnModalConfirmSendEmail]);

  const handleFormSubmit = useCallback(
    async (values: FormRefund) => {
      try {
        const reason = values.reason !== 'other' ? values.reason : values.otherReason;
        const { id, itemId, marketListing, inventory } = query;
        const bodyParams: RefundItemModel = isBuyerReturn
          ? {
              order_id: String(id),
              master_listing_id: Number(itemId),
              note: values.note,
              amount: Number(values.amount),
              market_listing_id: Number(marketListing),
              inventory_id: Number(inventory),
            }
          : {
              order_id: String(id),
              master_listing_id: Number(itemId),
              reason,
              amount: Number(values.amount),
              market_listing_id: Number(marketListing),
              inventory_id: Number(inventory),
            };

        await sendRefundItem(bodyParams);

        triggerGA4ECommerceEvent('refund', {
          currency: orderDetail?.amount?.currency,
          value: orderDetail?.amount?.total,
          transaction_id: String(orderDetail?.order_code),
          coupon: orderDetail?.coupon?.code,
          shipping: orderDetail?.amount?.details?.shipping,
          tax: orderDetail?.amount?.details?.tax,
          items: [
            {
              item_id: String(item?.master_listing_id),
              item_name: item?.title,
              affiliation: '',
              coupon: '',
              discount: item?.current_listed_price - item?.discounted_price,
              index: 0,
              item_brand: item?.bicycle_brand_name,
              item_category: item?.bicycle_type_name,
              item_category2: '',
              item_category3: '',
              item_category4: '',
              item_category5: '',
              item_list_id: '',
              item_list_name: '',
              item_variant: `${item?.bicycle_model_name} ${item?.bicycle_size_name}`,
              location_id: String(item?.location),
              price: item?.current_listed_price,
              quantity: item?.quantity,
            },
          ],
        } as RefundGA);

        toastSuccess('Your request has been submitted');
        setvisibleReturnModalConfirmSendEmail(true);
      } catch (error) {
        toastError(error);
      }
    },
    [isBuyerReturn, item, orderDetail, query],
  );

  const validate = useCallback(
    (form: FormRefund) => {
      const errors: {
        [key: string]: string;
      } = {};
      if (!isBuyerReturn) {
        if (!form.reason) {
          errors.reason = t('myAccount.return.validate.reasonRequired');
        }
        if (form.reason === 'other') {
          if (!trim(form.otherReason)) errors.otherReason = t('myAccount.return.validate.otherReasonRequired');
          if (String(trim(form.otherReason)).length > 500)
            errors.otherReason = t('myAccount.return.validate.maxLengthOtherReason');
        }
      }
      if (String(trim(form.note)).length > 500) errors.note = t('myAccount.return.validate.maxLengthNote');
      if (!trim(form.amount)) {
        errors.amount = t('myAccount.return.validate.amountRequired');
      }
      if (String(trim(form.amount)).length > 13) {
        errors.amount = t('myAccount.return.validate.maxLengthAmount');
      }
      if (Number(form.amount) <= 0) {
        errors.amount = t('myAccount.return.validate.amountInvalid');
      }

      return errors;
    },
    [isBuyerReturn],
  );

  const renderRefundFromBuyer = useMemo(() => {
    return (
      <>
        <h3 className={'mb-3'}>Note to Buyer</h3>
        <FormikTextarea name={'note'} rows={6} />
      </>
    );
  }, []);
  const renderRefundFromSeller = useCallback((values: FormRefund) => {
    return (
      <>
        {LIST_REASON.map((reason) => (
          <div key={reason} className={'mt-3'}>
            <FormikRadio name={'reason'} value={reason} label={<span className={classes.reason}>{reason}</span>} />
          </div>
        ))}
        {values.reason === 'other' && (
          <div className={'mt-3'}>
            <FormikTextarea name={'otherReason'} rows={5} />
          </div>
        )}
      </>
    );
  }, []);
  const calculateSubTotal = useMemo(() => {
    return formatCurrency(Number(item?.fix_subtotal) + item?.fix_insurance + item?.fix_shipping + item?.fix_tax, false);
  }, [item]);
  // const calculateOrderTotal = useMemo(() => {
  //   let total = 0;
  //   if (orderDetail?.line_item) {
  //     orderDetail.line_item.map((lineItem: LineItemModel) => {
  //       total += lineItem.fix_subtotal;
  //     });
  //   }
  //   return total;
  // }, [orderDetail]);

  const renderContentBikeMobile = useMemo(() => {
    return (
      <div className={classes.contentBikeMobile}>
        <div className={'mt-3'}>
          <Link href={`/marketplace/buy-now/${slugifyId(item?.title, item?.master_listing_id)}/`}>
            <a className={classes.titleBike}>{item?.title}</a>
          </Link>
        </div>
        <div className={classes.boughtBy}>
          Bought by{' '}
          <Link href={`/marketplace/seller/${item?.buyer_id}`}>
            <a className={classes.boughtBy}>{orderDetail?.customer_name}</a>
          </Link>
        </div>
      </div>
    );
  }, [item, orderDetail]);

  const renderPage = useMemo(() => {
    if (loading) {
      return (
        <div className={'mt-3'}>
          <Card className={classes.container}>
            <div className={'position-relative'}>
              <div className={classes.refund}>
                <div>
                  <h2 className={classes.title}>Refund</h2>
                  <div className={classes.contentBike}>
                    <Skeleton width={170} height={50} />
                  </div>
                  <div className="mt-3">
                    <Skeleton width={170} height={50} />
                  </div>
                </div>
                <Skeleton width={100} height={100} />
              </div>
            </div>

            <div className={cx('d-flex', classes.wrapChip)}>
              <div className={classes.chip}>
                <div className={classes.titleChip}>Sub total</div>
                <div className={classes.contentChip}>
                  <Skeleton />
                </div>
              </div>
              <div className={classes.chip}>
                <div className={classes.titleChip}>Shipping</div>
                <div className={classes.contentChip}>
                  <Skeleton />
                </div>
              </div>
              <div className={classes.chip}>
                <div className={classes.titleChip}>Insurance</div>
                <div className={classes.contentChip}>
                  <Skeleton />
                </div>
              </div>
              <div className={classes.chip}>
                <div className={classes.titleChip}>Order total</div>
                <div className={cx(classes.orderTotal, classes.contentChip)}>
                  <Skeleton />
                </div>
              </div>
            </div>
            {isBuyerReturn && (
              <>
                <div className="d-flex">
                  <div className={classes.subTitle}>Buyer Reason</div>
                  <div className={classes.content}>
                    <Skeleton />
                  </div>
                </div>
                <div className="d-flex mt-3">
                  <div className={classes.subTitle}>Buyer Note</div>
                  <div className={classes.content}>
                    <Skeleton />
                  </div>
                </div>
              </>
            )}
            <Skeleton height={30} />
            <Skeleton height={30} />
            <Skeleton height={30} />
            <Skeleton height={30} />
            <Skeleton height={30} />
          </Card>
        </div>
      );
    }
    return (
      <div className={'mt-3'}>
        <Card className={classes.container}>
          <div className={'position-relative'}>
            <div className={classes.refund}>
              <div>
                <h2 className={classes.title}>Refund</h2>
                <div className={classes.refundInfo}>
                  <div className={classes.contentBikeDesktop}>
                    <div className={'mt-3'}>
                      <Link href={`/marketplace/buy-now/${slugifyId(item?.title, item?.master_listing_id)}/`}>
                        <a className={classes.titleBike}>{item?.title}</a>
                      </Link>
                    </div>
                    <div className={classes.boughtBy}>
                      Bought by{' '}
                      <Link href={`/marketplace/seller/${item?.buyer_id}`}>
                        <a className={classes.boughtBy}>{orderDetail?.customer_name}</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <img src={item?.image_default || defaultLinkImage} alt={'Product'} className={cx('img-fluid')} />
            </div>
            {renderContentBikeMobile}
          </div>

          <div className={cx('d-flex', classes.wrapChip)}>
            <div className={classes.chip}>
              <div className={classes.titleChip}>Sub total</div>
              <div className={classes.contentChip}>{formatCurrency(item?.fix_subtotal, false)}</div>
            </div>
            <div className={classes.chip}>
              <div className={classes.titleChip}>Shipping</div>
              <div className={classes.contentChip}>{formatCurrency(item?.fix_shipping, false)}</div>
            </div>
            <div className={classes.chip}>
              <div className={classes.titleChip}>Insurance</div>
              <div className={classes.contentChip}>{formatCurrency(item?.fix_insurance, false)}</div>
            </div>
            <div className={classes.chip}>
              <div className={classes.titleChip}>Order total</div>
              <div className={cx(classes.orderTotal, classes.contentChip)}>{calculateSubTotal}</div>
            </div>
          </div>
          {isBuyerReturn && (
            <>
              <div className="d-flex mt-3">
                <div className={classes.subTitle}>Age of Listing</div>
                <div className={classes.content}>{age}</div>
              </div>
              <div className="d-flex mt-3">
                <div className={classes.subTitle}>Buyer Reason</div>
                <div className={classes.content}>{item?.reason_buyer_return}</div>
              </div>
              <div className="d-flex mt-3">
                <div className={classes.subTitle}>Buyer Note</div>
                <div className={classes.content}>
                  {detailReturn?.note_to_seller ? detailReturn?.note_to_seller : '-'}
                </div>
              </div>
            </>
          )}
          {/* Refund the Buyer */}
          <Formik
            validate={validate}
            enableReinitialize={true}
            onSubmit={handleFormSubmit}
            initialValues={initialValues}>
            {({ handleSubmit, values, setFieldValue }: FormikProps<FormRefund>) => (
              <Form onSubmit={handleSubmit}>
                <Card className={'p-0 mt-2'}>
                  {!isBuyerReturn && (
                    <>
                      <h2 className={cx(classes.title)}>Reason For Refund</h2>
                      {renderRefundFromSeller(values)}
                    </>
                  )}
                  <h2 className={cx(classes.title, 'mt-2')}>Refund Amount</h2>
                  <FormikInput
                    name={'amount'}
                    type="number"
                    className={'mt-2'}
                    renderPrefix={<img src={iconDollar} alt={'Dollar Icon'} className="icon-button22" />}
                  />
                  {isBuyerReturn && renderRefundFromBuyer}
                </Card>
                <div className={'d-flex mt-5'}>
                  <Button type={'submit'}>Send Refund</Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card>

        {visibleReturnModalConfirmSendEmail && (
          <Suspense fallback={null}>
            <ReturnModalConfirmSendEmail
              isOpen={visibleReturnModalConfirmSendEmail}
              onSubmit={handleSendMail}
              onClose={handleCloseReturnModalConfirmSendEmail}
              name={buyerName || ''}
            />
          </Suspense>
        )}
      </div>
    );
  }, [
    age,
    buyerName,
    calculateSubTotal,
    detailReturn,
    handleCloseReturnModalConfirmSendEmail,
    handleFormSubmit,
    handleSendMail,
    isBuyerReturn,
    item,
    loading,
    orderDetail,
    renderContentBikeMobile,
    renderRefundFromBuyer,
    renderRefundFromSeller,
    validate,
    visibleReturnModalConfirmSendEmail,
  ]);

  return <div>{renderPage}</div>;
};

export default ReturnForm;
