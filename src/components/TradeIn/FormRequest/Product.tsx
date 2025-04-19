import React, { FC, useState, useCallback } from 'react';
import cx from 'classnames';
import SafeImage from 'components/Image/SafeImage';
import Card from '@ui/Cards';
import { BicycleModel } from 'model/store/value-guide.model';
import Tooltip from 'reactstrap/lib/Tooltip';
import classes from './selectBicycle.module.scss';

interface Props {
  bicycle: BicycleModel;
  selectedBicycleId: number | string;
  totalItem: number;
  index: number;
}

const Product: FC<Props> = ({ bicycle, selectedBicycleId, totalItem, index }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = useCallback(() => {
    setTooltipOpen(!tooltipOpen);
  }, [tooltipOpen]);

  return (
    <Card
      className={cx(
        classes.cardPartnerPortalTradeInProduct,
        classes.item,
        selectedBicycleId === `${bicycle.bicycleId}` && classes.active,
      )}
      style={{ marginBottom: totalItem === index + 1 && 'unset' }}
      key={bicycle?.bicycleId}>
      <div className={classes.imageContainer}>
        <SafeImage
          src={bicycle.bicycleImageDefault || bicycle.imageDefault}
          size="s"
          className={cx(classes.image, 'img-fluid')}
        />
      </div>
      <a
        className={classes.name}
        id={`Tooltip-${bicycle.bicycleId}`}
        href={`/value-guide/${bicycle.bicycleId}`}
        onClick={(e) => {
          e.preventDefault();
        }}>
        {bicycle.bicycleName || bicycle.name}
      </a>
      <Tooltip isOpen={tooltipOpen} target={`Tooltip-${bicycle.bicycleId}`} toggle={toggle}>
        {bicycle.bicycleName || bicycle.name}
      </Tooltip>
    </Card>
  );
};

export default Product;
