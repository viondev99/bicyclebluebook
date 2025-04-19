/* eslint-disable import/named */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
import Modal from '@ui/Modal/Modal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React, { FC, memo } from 'react';
import moment from 'moment';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Select from '@ui/Select/Select';
import { selectTimeOptions } from 'components/PartnerPortal/TradeInScoreCard/StandardQuote/Step/StepShipping/WithDropOff';
import { HOLIDAYS } from 'components/PartnerPortal/TradeInScoreCard/StandardQuote/constraint';
import useScreenDetect from 'hooks/useScreenDetect';
import { FormStepFourSelectThree } from 'components/PartnerPortal/TradeInScoreCard/StandardQuote/formDefaultValue';
import classes from './modal-with-drop-off-show-date-and-time.module.scss';

interface Props {
  isOpen: boolean;
  formStepFourSelectFour: FormStepFourSelectThree;
  handleCancelDate: () => void;
  handleConfirmFormDate: () => void;
  handleChangeForm: (key: string, value: string | Date) => void;
}

const ModalWithDropOffShowDateAndTime: FC<Props> = ({
  isOpen,
  formStepFourSelectFour,
  handleCancelDate,
  handleConfirmFormDate,
  handleChangeForm,
}) => {
  const { currentWidthScreen } = useScreenDetect();
  const { dateDrop, timeDrop, error } = formStepFourSelectFour || {};
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancelDate}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalSize}
      contentClassName={classes.paddingContentClassName}
      bodyProps={{
        className: classes.customModalBody,
      }}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      hideButtonClose={true}
      header={<span>{` `}</span>}>
      <div className={classes.wraFormDateTime}>
        <div className={classes.formDateTime}>
          <div className={classes.wrapCalendar}>
            <Calendar
              onChange={(value: any) => handleChangeForm('dateDrop', value)}
              value={dateDrop}
              tileDisabled={({ date }: any) => {
                return (
                  moment(date).isBefore(moment().startOf('days')) ||
                  HOLIDAYS.indexOf(moment(date).format('M/D/YYYY')) > -1 ||
                  moment(date).isoWeekday() === 6 ||
                  moment(date).isoWeekday() === 7
                );
              }}
            />
            {error?.dateDrop !== '' && <p className={classes.errorMessage}>{error?.dateDrop}</p>}
          </div>
          <hr className={classes.customHrFormDate} />

          <div className={classes.wrapSelect}>
            <Row className={classes.wrapRow}>
              <Col xs={4} className={classes.wrapTime}>
                <div>Time</div>
                <span>(GMT-7)</span>
              </Col>
              <Col xs={8} className={classes.colWrapSelect}>
                <div className={classes.wrapSelect}>
                  <Select
                    inputId={'select-state'}
                    value={timeDrop}
                    onChange={(value: any) => handleChangeForm('timeDrop', value?.value)}
                    options={selectTimeOptions}
                    className={classes.formSize}
                    name="partner"
                    isSearchable={true}
                    selectStyles={{
                      control: {
                        minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                        border: error?.timeDrop !== '' && '1px solid red',
                      },
                    }}
                  />
                </div>
                {error?.timeDrop !== '' && <p className={classes.errorMessage}>{error?.timeDrop}</p>}
              </Col>
            </Row>
          </div>
          <div className={classes.wrapFormBottom}>
            <div className={classes.actionCancel} onClick={handleCancelDate}>
              Cancel
            </div>
            <div className={classes.actionConfirm} onClick={handleConfirmFormDate}>
              Confirm
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalWithDropOffShowDateAndTime);
