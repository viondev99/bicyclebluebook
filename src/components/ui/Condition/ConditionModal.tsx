import React, { FC, memo, useState, useCallback, useMemo, useEffect } from 'react';
import toUpper from 'lodash/toUpper';
import { normalizeServerConstant } from 'helpers/string.helper';
import { Condition } from 'model/common';
import classes from './condition.module.scss';
import Modal from '../Modal/Modal';
import Tabs from '../Tabs/Tabs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  condition?: string;
  showLikeNewCondition?: boolean;
}

const ConditionModal: FC<Props> = (props) => {
  const { isOpen, onClose, condition, showLikeNewCondition } = props;

  const conditionTabs = useMemo(() => {
    const defaultCondition = [
      { label: normalizeServerConstant(Condition.Excellent).toLowerCase(), value: Condition.Excellent },
      { label: normalizeServerConstant(Condition.VeryGood).toLowerCase(), value: Condition.VeryGood },
      { label: normalizeServerConstant(Condition.Good).toLowerCase(), value: Condition.Good },
      { label: normalizeServerConstant(Condition.Fair).toLowerCase(), value: Condition.Fair },
    ];
    const likeNewCondition = [
      {
        label: normalizeServerConstant(Condition.LikeNew).toLowerCase(),
        value: Condition.LikeNew,
      },
    ];
    return showLikeNewCondition ? [...likeNewCondition, ...defaultCondition] : defaultCondition;
  }, [showLikeNewCondition]);

  const defaultCondition = useMemo(() => {
    return condition || Condition.Excellent;
  }, [condition]);

  useEffect(() => {
    if (condition) {
      setCurrentTab(condition);
    }
  }, [condition]);

  const [currentTab, setCurrentTab] = useState(defaultCondition);

  const onChangeTab = useCallback((value: Condition) => {
    setCurrentTab(value);
  }, []);

  const renderConditionDescription = useCallback(() => {
    switch (toUpper(currentTab)) {
      case Condition.Excellent:
        return (
          <ul>
            <li>The bicycle looks new and is in like-new mechanical condition.</li>
            <li>
              The frame, fork, parts, and accessories are clean, may have minor blemishes, and may have signs of light
              use.
            </li>
            <li>No service is required on any component, part, or accessory.</li>
          </ul>
        );
      case Condition.VeryGood:
        return (
          <ul>
            <li>
              The bicycle looks good, may have minimal cosmetic (only) blemishes on the frame, fork, components, parts
              and/or accessories.
            </li>
            <li>
              The bicycle may require minimal service adjustments without the need of replacing any parts. (Service
              adjustments are typically easy and fast to make. Usually required in the first 6-12 months of ownership
              when the bike was new.)
            </li>
            <li>The braking surface is clean with some signs of usage yet free from grooves and pitting.</li>
            <li>The brake pads may show signs of usage yet have a majority of their life remaining.</li>
            <li>
              Front and or rear shock(s) (if applicable) are clean with some signs of usage yet free from grooves and
              pitting. May include slight discoloration on stanchion(s) from activation alone.
            </li>
            <li>
              Tires may show signs of usage but have a majority of their life remaining. No dry rot or cracking
              Grips/Handlebar tape may show slight signs of usage, no dry rot, cracking or hardening.
            </li>
          </ul>
        );
      case Condition.Good:
        return (
          <ul>
            <li>The frame or fork or components or accessories have cosmetic blemishes.</li>
            <li>The frame (if metal) may have minor dings.</li>
            <li>Paint is faded slightly and/or slightly discolored and scratched.</li>
            <li>
              Bicycle is free of major mechanical issues but may require some service, a tune up is recommended. Some
              parts may require replacing, not to include front or rear shocks, wheel(s), shifters, front or rear
              derailleurs, braking systems, crank set or chainrings.
            </li>
            <li>
              Items to consider replacing include: tires, tubes, grips/handlebar tape, brake pads, brake hoods, chain
              and cassette, brake cables, gear cables, any/all housing, brake fluid (if applicable) and shock oil (if
              applicable). *This is a partial list of suggested items to replace, your bike may not need all of or any
              of these items.
            </li>
            <li>Braking surfaces may have minor grooves or discoloration.</li>
            <li>Front and/or Rear Shock may need to be serviced.</li>
            <li>Front and/or Rear hydraulic brakes may need to be bled (if applicable).</li>
          </ul>
        );
      case Condition.Fair:
        return (
          <ul>
            <li>The frame or fork or components or accessories has cosmetic blemishes.</li>
            <li>The frame (if metal) has minor dings.</li>
            <li>Front and/or Rear shock needs to be serviced.</li>
            <li>Paint is faded slightly and/or slightly discolored and scratched.</li>
            <li>The bicycle has some mechanical issues and a tune up is necessary.</li>
            <li>An overhaul is recommended.</li>
            <li>Multiple parts need to be replaced.</li>
            <li>Front and Rear hydraulic brakes need to be bled (if applicable).</li>
          </ul>
        );
      case Condition.LikeNew:
        return (
          <ul>
            <li>
              The item is brand new, unused, unopened, undamaged, and in its original packaging (where packaging is
              applicable). Packaging should be the same as what is found in a retail store.
            </li>
          </ul>
        );
      default:
        return '';
    }
  }, [currentTab]);

  return (
    <Modal
      className={classes.conditionModal}
      centered={true}
      isOpen={isOpen}
      onClose={onClose}
      title={'Bicycle Condition'}>
      <div className={classes.description} style={{ marginBottom: 30 }}>
        Our value ranges are based on current market trends for bicycles sold in “stock” condition. Any modifications to
        the bicycle must be accounted for independently. Secondary retailers offer additional tuning and warranties that
        can increase the value of a used bicycle and must be considered when transacting through them.
      </div>
      <Tabs
        tabs={conditionTabs}
        value={currentTab}
        onChange={onChangeTab}
        tabBarStyle={{
          textTransform: 'capitalize',
        }}
        className={classes.customTabs}
      />
      <div className={classes.description} style={{ marginTop: 30 }}>
        {renderConditionDescription()}
      </div>
    </Modal>
  );
};

export default memo(ConditionModal);
