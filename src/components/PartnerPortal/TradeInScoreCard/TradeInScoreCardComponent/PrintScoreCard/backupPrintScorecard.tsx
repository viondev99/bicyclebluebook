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

const PrintScoreCard: FC<Props> = ({ dataFormStepSummary }) => {
  const dataStepSummaryStandardQuote = useSelector(
    (state: StoreState) => state.partner.scorecard.dataStepSummaryStandardQuote,
  );
  const detailPartnerLocation = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);

  const state = useMemo(() => {
    return detailPartnerLocation?.state;
  }, [detailPartnerLocation]);

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
    return dataFormStepSummary || dataStepSummaryStandardQuote;
  }, [dataFormStepSummary, dataStepSummaryStandardQuote]);

  return (
    <div
      id="PrintScoreCard"
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
        <img src="https://i.imgur.com/pS1gRpy.png" style={{ width: '300px' }} />
        <h2 style={{ fontWeight: 'bold' }}>
          Trade in value <span style={{ color: '#1fbe63' }}>{formatCurrency(detailScoreCard?.tradeValue)}</span>
        </h2>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3>
          Your trade-in # is{` `}
          {detailScoreCard?.tradeInId}
        </h3>
      </div>
      <h4
        style={{
          margin: '15px 0',
          padding: '10px',
          fontSize: '14px',
          textTransform: 'uppercase',
          color: '#fff',
          background: '#2faae3',
          fontWeight: 'bold',
        }}>
        {`${detailScoreCard?.bicycleBaseInfo?.bicycleYearName || ''} ${
          detailScoreCard?.bicycleBaseInfo?.bicycleBrandName || ''
        } ${detailScoreCard?.bicycleBaseInfo?.bicycleModelName || ''}`}
      </h4>
      <div style={{ display: 'flex', marginBottom: '5px' }}>
        <div style={{ flex: '33% 0' }}>
          <strong style={{ fontSize: '14px' }}>Brand:</strong>
          <span
            style={{
              marginLeft: '5px',
              wordBreak: 'break-word',
              fontSize: '14px',
            }}>
            {detailScoreCard?.bicycleBaseInfo?.bicycleBrandName || ''}
          </span>
        </div>
        <div style={{ flex: '33% 0' }}>
          <strong style={{ fontSize: '14px' }}>Model:</strong>
          <span
            style={{
              marginLeft: '5px',
              wordBreak: 'break-word',
              fontSize: '14px',
            }}>
            {detailScoreCard?.bicycleBaseInfo?.bicycleModelName || ''}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '33% 0' }}>
          <strong style={{ fontSize: '14px' }}>Year:</strong>
          <span
            style={{
              marginLeft: '5px',
              wordBreak: 'break-word',
              fontSize: '14px',
            }}>
            {detailScoreCard?.bicycleBaseInfo?.bicycleYearId || ''}
          </span>
        </div>
        <div style={{ flex: '33% 0' }}>
          <strong style={{ fontSize: '14px' }}>Condition:</strong>
          <span
            style={{
              marginLeft: '5px',
              wordBreak: 'break-word',
              fontSize: '14px',
            }}>
            {changeNameCondition(detailScoreCard?.condition)}
          </span>
        </div>
      </div>
      <h4
        style={{
          margin: '20px 0',
          padding: '10px',
          textTransform: 'uppercase',
          color: '#fff',
          background: '#2faae3',
          fontWeight: 'bold',
          fontSize: '14px',
        }}>
        Component specs and modification
      </h4>
      <div
        style={{
          display: 'flex',
          flexFlow: 'row wrap',
          marginTop: '5px',
          paddingBottom: '20px',
          borderBottom: '1px solid #2faae3',
          marginBottom: '5px',
        }}>
        <div style={{ flex: '33% 0' }}>
          <strong style={{ fontSize: '14px' }}>Frame Size:</strong>
          <span
            style={{
              marginLeft: '5px',
              wordBreak: 'break-word',
              fontSize: '14px',
            }}>
            {detailScoreCard?.tradeInComponents?.length > 0 &&
            detailScoreCard.tradeInComponents.filter((item: any) => item.id.inventoryCompTypeId === 178).length > 0
              ? detailScoreCard.tradeInComponents.filter((item: any) => item.id.inventoryCompTypeId === 178)[0].value
              : ''}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: '33% 0', marginRight: '10px' }}>
          <strong style={{ fontSize: '13px' }}>Drivetrain:</strong>
          {detailScoreCard?.upgradeComps?.filter((item: any) => item.id === 4).length > 0 && (
            <span style={{ marginLeft: '5px', fontSize: '13px' }}>Downgraded</span>
          )}
          {detailScoreCard?.upgradeComps?.filter((item: any) => item.id === 2).length > 0 && (
            <span style={{ marginLeft: '5px', fontSize: '13px' }}>Upgraded</span>
          )}
          {detailScoreCard?.upgradeComps?.filter((item: any) => item.id === 4).length === 0 &&
            detailScoreCard?.upgradeComps?.filter((item: any) => item.id === 2).length === 0 && (
              <span style={{ marginLeft: '5px', fontSize: '13px' }}>None</span>
            )}
        </div>
        <div style={{ flex: '33% 0' }}>
          <strong style={{ fontSize: '13px' }}>Wheels:</strong>
          {detailScoreCard?.upgradeComps?.filter((item: any) => item.id === 3).length > 0 && (
            <span style={{ marginLeft: '5px', fontSize: '13px' }}>Downgraded</span>
          )}
          {detailScoreCard?.upgradeComps?.filter((item: any) => item.id === 1).length > 0 && (
            <span style={{ marginLeft: '5px', fontSize: '13px' }}>Upgraded</span>
          )}
          {detailScoreCard?.upgradeComps?.filter((item: any) => item.id === 1).length === 0 &&
            detailScoreCard?.upgradeComps?.filter((item: any) => item.id === 3).length === 0 && (
              <span style={{ marginLeft: '5px', fontSize: '13px' }}>None</span>
            )}
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: state === 'CA' ? '65% 0' : '100% 0' }}>
          <h4
            style={{
              margin: '14px 0',
              padding: '10px',
              textTransform: 'uppercase',
              color: '#fff',
              background: '#2faae3',
              fontWeight: 'bold',
              fontSize: '14px',
            }}>
            Note & Observations
          </h4>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        {' '}
        <div>{detailScoreCard?.bbbReviewNote}</div>{' '}
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: state === 'CA' ? '65% 0' : '100% 0' }}>
          <h4
            style={{
              margin: '14px 0',
              padding: '10px',
              textTransform: 'uppercase',
              color: '#fff',
              background: '#2faae3',
              fontWeight: 'bold',
              fontSize: '14px',
            }}>
            Owner details
          </h4>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <div style={{ flex: '50% 0' }}>
              <strong style={{ fontSize: '14px' }}>First Name: </strong>
              <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
                {detailScoreCard?.owner?.firstName || ''}
                {/* {detailScoreCard && detailScoreCard.owner && detailScoreCard.owner.name
                  ? detailScoreCard.owner.name.split(' ')[0]
                  : this.props.controls && this.props.controls.first_name.value} */}
              </span>
            </div>
            <div style={{ flex: '50% 0' }}>
              <strong style={{ fontSize: '14px' }}>Last Name: </strong>
              <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
                {detailScoreCard?.owner?.lastName || ''}
                {/* {detailScoreCard && detailScoreCard.owner && detailScoreCard.owner.name
                  ? detailScoreCard.owner.name.split(' ')[1]
                  : this.props.controls && this.props.controls.last_name.value} */}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <div style={{ flex: '50% 0' }}>
              <strong style={{ fontSize: '14px' }}>Email: </strong>
              <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
                {detailScoreCard?.owner?.email || ''}
                {/* {detailScoreCard && detailScoreCard.owner && detailScoreCard.owner.email
                  ? detailScoreCard.owner.email
                  : this.props.controls && this.props.controls.email.value} */}
              </span>
            </div>
            <div style={{ flex: '50% 0' }}>
              <strong style={{ fontSize: '14px' }}>Phone: </strong>
              <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
                {detailScoreCard?.owner?.phone || ''}
                {/* {detailScoreCard && detailScoreCard.owner && detailScoreCard.owner.phone
                  ? detailScoreCard.owner.phone
                  : this.props.controls && this.props.controls.phone.value} */}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <div style={{ flex: '50% 0' }}>
              <strong style={{ fontSize: '14px' }}>Address: </strong>
              <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
                {detailScoreCard?.owner?.address || ''}
                {/* {detailScoreCard && detailScoreCard.owner && detailScoreCard.owner.address
                  ? detailScoreCard.owner.address
                  : this.props.controls && this.props.controls.address.value} */}
              </span>
            </div>
            <div style={{ flex: '50% 0' }}>
              <strong style={{ fontSize: '14px' }}>City: </strong>
              <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
                {detailScoreCard?.owner?.city || ''}
                {/* {detailScoreCard && detailScoreCard.owner && detailScoreCard.owner.city
                  ? detailScoreCard.owner.city
                  : this.props.controls && this.props.controls.city.value} */}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <div style={{ flex: '50% 0' }}>
              <strong style={{ fontSize: '14px' }}>State: </strong>
              <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
                {detailScoreCard?.owner?.state || ''}
                {/* {detailScoreCard && detailScoreCard.owner && detailScoreCard.owner.state
                  ? detailScoreCard.owner.state
                  : this.props.controls && this.props.controls.state.value} */}
              </span>
            </div>
            <div style={{ flex: '50% 0' }}>
              <strong style={{ fontSize: '14px' }}>Zip code: </strong>
              <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
                {detailScoreCard?.owner?.zipCode || ''}
                {/* {detailScoreCard && detailScoreCard.owner && detailScoreCard.owner.zipCode
                  ? detailScoreCard.owner.zipCode
                  : this.props.controls && this.props.controls.zip_code.value} */}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: '50% 0' }}>
              <strong style={{ fontSize: '14px' }}>Serial: </strong>
              <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
                {detailScoreCard?.owner?.serial || ''}
                {/* {detailScoreCard && detailScoreCard.owner && detailScoreCard.owner.serial
                  ? detailScoreCard.owner.serial
                  : this.props.controls && this.props.controls.serial.value} */}
              </span>
            </div>
            <div style={{ flex: '50% 0' }}>
              <strong style={{ fontSize: '14px' }}>Driver's License or Passport #:</strong>
              <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
                {detailScoreCard?.owner?.licenseOrPassport || ''}
                {/* {detailScoreCard && detailScoreCard.owner && detailScoreCard.owner.licenseOrPassport
                  ? detailScoreCard.owner.licenseOrPassport
                  : this.props.controls && this.props.controls.passport.value} */}
              </span>
            </div>
          </div>
        </div>
        {state === 'CA' && (
          <div style={{ flex: '35% 0' }}>
            <h4
              style={{
                margin: '14px 0',
                padding: '10px',
                textTransform: 'uppercase',
                color: '#fff',
                background: '#2faae3',
                fontWeight: 'bold',
                fontSize: '14px',
              }}>
              Right thumbprint
            </h4>
            <div style={{ padding: 10 }}>
              California Business and Professional Code; Section 21628 G: A legible finger print taken from attended
              seller as prescribed by the Department of Justice.
            </div>
            <div
              style={{
                width: '80%',
                height: 100,
                margin: 'auto',
                border: '3px solid #000 ',
              }}
            />
          </div>
        )}
      </div>
      <h4
        style={{
          margin: '15px 0',
          padding: '10px',
          textTransform: 'uppercase',
          color: '#fff',
          background: '#2faae3',
          fontWeight: 'bold',
          fontSize: '14px',
        }}>
        Proof of ownership declaration
      </h4>
      <p style={{ marginBottom: 0 }}>
        Under penalty of perjury, I attest I am the owner of the property listed on this report
      </p>
      <div
        style={{
          display: 'flex',
          marginTop: '15px',
          paddingBottom: '15px',
          borderBottom: '1px solid #2faae3',
          marginBottom: '5px',
        }}>
        <div style={{ flex: '25% 0' }}>
          <strong style={{ display: 'block', fontSize: '14px' }}>Name:</strong>
          <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
            {detailScoreCard?.proof?.name || ''}
            {/* {detailScoreCard && detailScoreCard.proof && detailScoreCard.proof.name
              ? detailScoreCard.proof.name
              : this.props.controls && this.props.controls.name.value} */}
          </span>
        </div>
        <div style={{ flex: '25% 0' }}>
          <strong style={{ display: 'block' }}>Date:</strong>
          <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
            {detailScoreCard?.proof?.date ? `${detailScoreCard.proof.date}`.slice(0, 10) : formatDateNoTime(new Date())}
            {/* {detailScoreCard && detailScoreCard.proof && detailScoreCard.proof.date
              ? detailScoreCard.proof.date.slice(0, 10)
              : this.props.controls && this.props.controls.date.value} */}
          </span>
        </div>
      </div>
      <h4
        style={{
          margin: '15px 0',
          padding: '10px',
          textTransform: 'uppercase',
          color: '#fff',
          background: '#2faae3',
          fontWeight: 'bold',
          fontSize: '14px',
        }}>
        Shop details
      </h4>
      <div style={{ display: 'flex', marginBottom: '5px' }}>
        <div style={{ flex: '33% 0' }}>
          <strong style={{ fontSize: '14px' }}>Employee Name: </strong>
          <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
            {detailScoreCard?.employeeName || ''}
            {/* {detailScoreCard && detailScoreCard.employeeName
              ? detailScoreCard.employeeName
              : this.props.controls && this.props.controls.employeeName.value} */}
          </span>
        </div>
        <div style={{ flex: '33% 0' }}>
          <strong style={{ fontSize: '14px' }}>Employee Email: </strong>
          <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
            {detailScoreCard?.employeeEmail || ''}
            {/* {detailScoreCard && detailScoreCard.employeeEmail
              ? detailScoreCard.employeeEmail
              : this.props.controls && this.props.controls.employeeEmail.value} */}
          </span>
        </div>
        <div style={{ flex: '33% 0' }}>
          <strong style={{ fontSize: '14px' }}>Shop Location: </strong>
          <span style={{ wordBreak: 'break-word', fontSize: '14px' }}>
            {detailScoreCard?.employeeLocation || ''}
            {/* {detailScoreCard && detailScoreCard.employeeLocation
              ? detailScoreCard.employeeLocation
              : this.props.controls && this.props.controls.employeeLocation.value} */}
          </span>
        </div>
      </div>
      <p
        style={{
          fontSize: '13px',
          marginBottom: '0',
          marginTop: '5px',
        }}>
        ® Copyright 2008-2019
      </p>
      <p style={{ fontSize: '13px', marginBottom: '5px' }}>BicycleBlueBook. All Rights Reserved</p>
    </div>
  );
};

export default PrintScoreCard;
