import React, { FC, useCallback } from 'react';
import Card from '@ui/Cards';
import cx from 'classnames';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import StoreState from 'model/store';
import { DATA_RESET_CREATE_SCORECARD_QUANTITY, exceptionHasDotKeyInputNumber } from 'helpers/utilities.helper';
import classes from './modal-number-scorecard.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalNumberScorecard: FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createScorecardQuantity } = useSelector(
    (state: StoreState) => state.partner.scorecard.createScoreCardQuantityData,
  );
  const router = useRouter();

  const handleChangeQuanity = useCallback(
    (type: string, value?: string) => {
      const formatValue: number = value && Number(value) > 1 ? Number(value) : 1;

      switch (type) {
        case 'up': {
          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              createScorecardQuantity: createScorecardQuantity + 1,
            }),
          );
          break;
        }
        case 'down': {
          if (createScorecardQuantity > 1) {
            dispatch(
              scoreCardAction.setCreateScorecardQuantity({
                createScorecardQuantity: createScorecardQuantity - 1,
              }),
            );
            return;
          }
          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              createScorecardQuantity: 1,
            }),
          );
          break;
        }
        default: {
          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              createScorecardQuantity: formatValue,
            }),
          );
          break;
        }
      }
    },
    [createScorecardQuantity, dispatch],
  );

  const gotoPartnerDashboard = useCallback(() => {
    dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
    router.push(`/trade-in-account/tp-dashboard`);
  }, [dispatch, router]);

  return (
    <>
      <Modal
        hideToggle
        isOpen={isOpen}
        onClose={onClose}
        centered={true}
        titleClassName={classes.titleClassName}
        className={classes.customModalSize}
        contentClassName={classes.paddingContentClassName}
        bodyProps={{
          className: classes.customModalBody,
        }}
        hideButtonClose
        title={`How many bikes are you trading in?`}>
        <Card className={classes.wrapCard}>
          <div className={classes.description}>Don’t worry, you can change this later if you change your mind.</div>
          <div className={classes.wrapQuantity}>
            <div onClick={() => handleChangeQuanity('down')} className={classes.quantityButton}>
              -
            </div>

            <input
              type="number"
              value={createScorecardQuantity}
              className={classes.quantity}
              onChange={(e) => handleChangeQuanity('', e.target.value)}
              onKeyDown={(e) => {
                if (exceptionHasDotKeyInputNumber.includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <div onClick={() => handleChangeQuanity('up')} className={classes.quantityButton}>
              +
            </div>
          </div>
          <div className={classes.wrapButton}>
            <Button onClick={onClose} className={cx(classes.customButtonSize, classes.spaceMobile)}>
              Get Started
            </Button>
            <Button className={classes.customButtonSize} onClick={gotoPartnerDashboard} buttonType="outline">
              Return to Partner Portal
            </Button>
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default ModalNumberScorecard;
