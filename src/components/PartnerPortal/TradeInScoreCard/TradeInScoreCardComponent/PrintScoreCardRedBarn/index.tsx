/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-find-dom-node */
/* eslint-disable no-nested-ternary */
import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { changeNameCondition } from 'helpers/utilities.helper';
import { formatCurrency } from 'helpers/string.helper';
import { formatDateNoTime } from 'helpers/date.helper';

interface Props {
  dataFormStepSummary?: any;
}

const PrintScoreCardRedBarn: FC<Props> = ({ dataFormStepSummary }) => {
  const dataStepSummaryStandardQuote = useSelector(
    (state: StoreState) => state.partner.scorecard.dataStepSummaryStandardQuote,
  );
  const dataStepDetailStandardQuote = useSelector(
    (state: StoreState) => state.partner.scorecard.dataStepDetailStandardQuote,
  );
  const detailPartnerLocation = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);
  const dataFeedbackByScoreCard = useSelector((state: StoreState) => state.partner.scorecard.dataFeedbackByScoreCard);
  const dataDetailStandardQuote = useSelector((state: StoreState) => state.partner.scorecard.dataDetailStandardQuote);
  const dataDetailCustomQuote = useSelector((state: StoreState) => state.partner.scorecard.dataDetailCustomQuote);
  // const state = useMemo(() => {
  //   return detailPartnerLocation?.state;
  // }, [detailPartnerLocation]);
  const isCustomQuote = useMemo(() => !!dataDetailStandardQuote?.redBarnCustomQuotesId, [dataDetailStandardQuote]);

  const detailScoreCard = useMemo(() => {
    if (dataFormStepSummary) {
      return {
        ...dataStepSummaryStandardQuote,
        owner: {
          address: dataFormStepSummary?.address,
          city: dataFormStepSummary?.city,
          email: dataFormStepSummary?.email,
          firstName: dataFormStepSummary?.firstName,
          lastName: dataFormStepSummary?.lastName,
          licenseOrPassport: dataFormStepSummary?.licenseOrPassport,
          name: dataFormStepSummary?.employeeName,
          phone: dataFormStepSummary?.phone,
          serial: dataFormStepSummary?.serial,
          state: dataFormStepSummary?.state,
          zipCode: dataFormStepSummary?.zipCode,
        },
        proof: {
          date: dataFormStepSummary?.proofDate,
          name: dataFormStepSummary?.proofName,
        },
      };
    }
    return dataFormStepSummary || dataStepSummaryStandardQuote || dataStepDetailStandardQuote;
  }, [dataFormStepSummary, dataStepDetailStandardQuote, dataStepSummaryStandardQuote]);

  // useEffect(() => {
  //   JsBarcode('#code128', `${dataBarcodeInventory?.name}`, {
  //     format: 'CODE128',
  //     text: ` `,
  //     height: 80,
  //     width: 2,
  //   });
  // }, [dataBarcodeInventory]);

  const renderWheelDriverTrain: any = useMemo(() => {
    let obj = {};
    if (detailScoreCard?.upgradeComps?.length) {
      for (const item of detailScoreCard?.upgradeComps) {
        if (item.name === 'Wheels' || item.name === 'Drivetrain') {
          obj = {
            ...obj,
            [item.name]: item?.up ? 'up' : 'down',
          };
        }
      }
    }
    return obj;
  }, [detailScoreCard]);

  const renderCustomerName = useMemo(() => {
    if (!detailScoreCard?.owner?.firstName && !detailScoreCard?.owner?.lastName) {
      return '-';
    }
    return (
      <span
        style={{
          fontSize: '0.625rem',
          lineHeight: '13px',
          color: '#000000',
        }}>
        {detailScoreCard && detailScoreCard?.owner?.firstName ? `${detailScoreCard?.owner?.firstName} ` : ''}
        {detailScoreCard && detailScoreCard?.owner?.lastName ? `${detailScoreCard?.owner?.lastName} ` : ''}
      </span>
    );
  }, [detailScoreCard]);

  const renderCustomerAddress = useMemo(() => {
    if (
      !detailScoreCard?.owner?.address &&
      !detailScoreCard?.owner?.city &&
      !detailScoreCard?.owner?.state &&
      !detailScoreCard?.owner?.zipCode
    ) {
      return '-';
    }
    return (
      <span style={{ fontSize: '0.625rem', lineHeight: '13px', color: '#000000' }}>
        {detailScoreCard && detailScoreCard?.owner?.address ? `${detailScoreCard?.owner?.address}, ` : ' '}
        {detailScoreCard && detailScoreCard?.owner?.city ? `${detailScoreCard?.owner?.city}, ` : ' '}
        {detailScoreCard && detailScoreCard?.owner?.state ? `${detailScoreCard?.owner?.state}, ` : ' '}
        {detailScoreCard && detailScoreCard?.owner?.zipCode ? `${detailScoreCard?.owner?.zipCode} ` : ' '}
      </span>
    );
  }, [detailScoreCard]);

  return (
    <div
      id="PrintScoreCardRedBarn"
      style={{
        width: '80%',
        display: 'none',
        margin: '50px auto',
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <img src="https://i.imgur.com/pS1gRpy.png" style={{ width: '300px' }} />
        </div>
        <div style={{ textAlign: 'center' }}>{/* <svg id="code128" /> */}</div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: 60 }}>
          <div style={{ marginBottom: 29, display: 'flex' }}>
            <strong
              style={{
                marginRight: 30,
                fontSize: '0.625rem',
                lineHeight: '13px',
                color: '#000000',
                fontWeight: 'bold',
              }}>
              Licensing Scorecard ID
            </strong>
            <span style={{ fontSize: '0.625rem', lineHeight: '13px', color: '#000000' }}>
              {detailScoreCard?.redBarnScorecardId}
            </span>
          </div>

          <div style={{ marginBottom: 7, display: 'flex' }}>
            <strong
              style={{
                minWidth: 30,
                marginRight: 30,
                fontSize: '0.625rem',
                lineHeight: '13px',
                color: '#000000',
                fontWeight: 'bold',
              }}>
              Make
            </strong>
            <span style={{ fontSize: '0.625rem', lineHeight: '13px', color: '#000000' }}>
              {isCustomQuote
                ? dataDetailCustomQuote?.brandName
                : detailScoreCard?.bicycleBaseInfo?.bicycleBrandName || ''}
            </span>
          </div>

          <div style={{ marginBottom: 7, display: 'flex' }}>
            <strong
              style={{
                minWidth: 30,
                marginRight: 30,
                fontSize: '0.625rem',
                lineHeight: '13px',
                color: '#000000',
                fontWeight: 'bold',
              }}>
              Model
            </strong>
            <span style={{ fontSize: '0.625rem', lineHeight: '13px', color: '#000000' }}>
              {isCustomQuote
                ? dataDetailCustomQuote?.modelName
                : detailScoreCard?.bicycleBaseInfo?.bicycleModelName || ''}
            </span>
          </div>

          <div style={{ display: 'flex' }}>
            <strong
              style={{
                minWidth: 30,
                marginRight: 30,
                fontSize: '0.625rem',
                lineHeight: '13px',
                color: '#000000',
                fontWeight: 'bold',
              }}>
              Year
            </strong>
            <span style={{ fontSize: '0.625rem', lineHeight: '13px', color: '#000000' }}>
              {isCustomQuote ? dataDetailCustomQuote?.yearName : detailScoreCard?.bicycleBaseInfo?.bicycleYearId || ''}
            </span>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 29, display: 'flex' }}>
            <strong
              style={{
                marginRight: 30,
                fontSize: '0.625rem',
                lineHeight: '13px',
                color: '#000000',
                fontWeight: 'bold',
              }}>
              Serial Number
            </strong>
            <span style={{ fontSize: '0.625rem', lineHeight: '13px', color: '#000000', wordBreak: 'break-word' }}>
              {detailScoreCard?.owner?.serial || ''}
            </span>
          </div>

          <div style={{ marginBottom: 7, display: 'flex' }}>
            <strong
              style={{
                minWidth: 65,
                marginRight: 30,
                fontSize: '0.625rem',
                lineHeight: '13px',
                color: '#000000',
                fontWeight: 'bold',
              }}>
              Condition
            </strong>
            <span style={{ fontSize: '0.625rem', lineHeight: '13px', color: '#000000' }}>
              {changeNameCondition(detailScoreCard?.condition)}
            </span>
          </div>

          <div style={{ marginBottom: 7, display: 'flex' }}>
            <strong
              style={{
                minWidth: 65,
                marginRight: 30,
                fontSize: '0.625rem',
                lineHeight: '13px',
                color: '#000000',
                fontWeight: 'bold',
              }}>
              Modifications
            </strong>
            <span style={{ fontSize: '0.625rem', lineHeight: '13px', color: '#000000' }}>
              {renderWheelDriverTrain?.Wheels || renderWheelDriverTrain?.Drivetrain ? (
                <>
                  {renderWheelDriverTrain?.Wheels ? <div>Wheels: {renderWheelDriverTrain?.Wheels}</div> : null}
                  {renderWheelDriverTrain?.Drivetrain ? (
                    <div>Drivetrain: {renderWheelDriverTrain?.Drivetrain}</div>
                  ) : null}
                </>
              ) : (
                'None'
              )}
            </span>
          </div>

          <div style={{ display: 'flex' }}>
            <strong
              style={{
                minWidth: 65,
                marginRight: 30,
                fontSize: '0.625rem',
                lineHeight: '13px',
                color: '#000000',
                fontWeight: 'bold',
              }}>
              Trade-in Value
            </strong>
            <span style={{ fontSize: '0.625rem', lineHeight: '13px', color: '#000000' }}>
              {formatCurrency(detailScoreCard?.tradeValue)}
            </span>
          </div>
        </div>
      </div>
      <hr style={{ border: '1px solid #E2E2E2', margin: '28px 0' }} />
      <div style={{ display: 'flex' }}>
        <div>
          <div style={{ marginBottom: 7, display: 'flex' }}>
            <strong
              style={{
                minWidth: 70,
                marginRight: 30,
                fontSize: '0.625rem',
                lineHeight: '13px',
                color: '#000000',
                fontWeight: 'bold',
              }}>
              Customer Name
            </strong>
            {renderCustomerName}
          </div>

          <div style={{ marginBottom: 7, display: 'flex' }}>
            <strong
              style={{
                minWidth: 70,
                marginRight: 20,
                fontSize: '0.625rem',
                lineHeight: '13px',
                color: '#000000',
                fontWeight: 'bold',
              }}>
              Customer Address
            </strong>
            {renderCustomerAddress}
          </div>

          <div style={{ display: 'flex' }}>
            <strong
              style={{
                minWidth: 70,
                marginRight: 30,
                fontSize: '0.625rem',
                lineHeight: '13px',
                color: '#000000',
                fontWeight: 'bold',
              }}>
              Employee Name
            </strong>
            <span style={{ fontSize: '0.625rem', lineHeight: '13px', color: '#000000' }}>
              {detailPartnerLocation?.name || '-'}
            </span>
          </div>
        </div>
      </div>
      <hr style={{ border: '1px solid #E2E2E2', margin: '28px 0' }} />
      {/* <div style={{ marginBottom: 16, fontSize: '0.625rem', lineHeight: '13px', color: '#000000', fontWeight: 'bold' }}>
        Packaging Checklist
      </div>
      <div>{renderPackageCheckList}</div> */}

      {/* <div style={{ marginBottom: 26, fontSize: '0.625rem', lineHeight: '13px', color: '#000000' }}>
        Please ship trade-in to Bicycle Blue Book within seven (7) days of{' '}
        {detailScoreCard?.proof?.date ? formatDateNoTime(new Date()) : `${detailScoreCard?.proof?.date}`.slice(0, 10)}.
      </div> */}
      {/* <hr style={{ border: '1px solid #E2E2E2', margin: '28px 0' }} /> */}
      <div>
        <span style={{ fontSize: '0.625rem', lineHeight: '28px', color: '#000000', fontWeight: 'bold' }}>
          Comments/feedback
        </span>
        <p style={{ fontSize: '0.625rem', lineHeight: '13px', color: '#000000' }}>{dataFeedbackByScoreCard?.message}</p>
      </div>
      {/* {detailScoreCard?.bbbReviewNote}</div> */}

      {/* <p
        style={{
          fontSize: '13px',
          marginBottom: '0',
          marginTop: '5px',
        }}>
        ® Copyright 2008-2019
      </p>
      <p style={{ fontSize: '13px', marginBottom: '5px' }}>BicycleBlueBook. All Rights Reserved</p> */}
    </div>
  );
};

export default PrintScoreCardRedBarn;
