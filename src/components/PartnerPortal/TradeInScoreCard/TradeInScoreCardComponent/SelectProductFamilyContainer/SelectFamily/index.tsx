import React, { FC, useCallback } from 'react';
import Card from '@ui/Cards';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import useScreenDetect from 'hooks/useScreenDetect';
import cx from 'classnames';
import { TradeInScoreCardsProps } from 'components/PartnerPortal/TradeInScoreCard/StandardQuote/formDefaultValue';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import SelectFamilyMobile from '../SelectFamilyMobile';
import classes from './select-family.module.scss';

interface Props {
  familyName: string;
  onChangeForm: (values: Partial<TradeInScoreCardsProps>) => void;
  onChangeFormSelectBicycle: (data: GetListTradeInBicycleParams) => void;
  handleCountinues: () => void;
}

const SelectFamily: FC<Props> = ({ familyName, onChangeForm, onChangeFormSelectBicycle, handleCountinues }) => {
  const families = useSelector((store: StoreState) => store.valueGuide.family.families);
  const { currentWidthScreen } = useScreenDetect();

  const handleSelectModel = useCallback(
    (name: string) => {
      onChangeFormSelectBicycle({
        brandId: '',
        chargerIncluded: null,
        ebikeSubtypeId: -1,
        hasKey: null,
        isEbike: null,
        modelId: '',
        yearId: '',
        bicycleId: '',
      });
      onChangeForm({
        familyName: name,
      });
      handleCountinues();
    },
    [handleCountinues, onChangeForm, onChangeFormSelectBicycle],
  );

  return (
    <>
      {currentWidthScreen <= 767 ? (
        <SelectFamilyMobile families={families} familyName={familyName} handleSelectModel={handleSelectModel} />
      ) : (
        <Card className={classes.wrapper}>
          <Row>
            {families.map((item: string) => (
              <Col lg={3} md={4} key={item} className={classes.family} onClick={() => handleSelectModel(item)}>
                <h4 className={cx(classes.name, familyName === item && classes.active)}>{item}</h4>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </>
  );
};

export default SelectFamily;
