import React, { FC, useCallback } from 'react';
import cx from 'classnames';
import Link from 'next/link';
import Card from '@ui/Cards';
import SafeImage from '../../../Image/SafeImage';
import classes from './compare-card.module.scss';
import { slugifyId } from '../../../../helpers/string.helper';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import images from '@images';

interface Props {
  image: string;
  name: string;
  id: number;
  onRemove?: (id: number) => void;
  sticky: boolean;
}

const CompareCard: FC<Props> = ({ name, sticky, image, id, onRemove }) => {
  const handleClickRemove = useCallback(() => {
    onRemove && onRemove(id);
  }, [onRemove, id]);
  const href = `/marketplace/buy-now/[id]`;
  const as = `/marketplace/buy-now/${slugifyId(name, id)}`;
  return (
    <Card className={cx(classes.item, { [classes.sticky]: sticky })}>
      <Link href={href} as={as}>
        <div className={classes.imageContainer}>
          <SafeImage src={image} size="s" className={cx(classes.image, 'img-fluid')} />
        </div>
      </Link>
      <div className={classes.cardContent}>
        <Link href={href} as={as}>
          <a className={classes.name}>{name}</a>
        </Link>
        <div className={classes.actionRow}>
          <Link href={href} as={as}>
            <a className={classes.view}>View Listing</a>
          </Link>
          <button type="button" className={classes.remove} onClick={handleClickRemove}>
            <img src={images.compare.icRemoveCompare} alt="remove-compare" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CompareCard;
