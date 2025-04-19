import React, { FC, useRef, ReactElement } from 'react';
import Link, { LinkProps } from 'next/link';
import cx from 'classnames';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import bgBike from 'assets/img/trade-in/bg_bike.png';
import icMore from 'assets/img/account/personal/ic_more.svg';
import Button from '@ui/Buttons/Primary/Button';
import Card from '@ui/Cards';
import Dropdown from '@ui/Dropdown/Dropdown';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import SafeImage from '../../../Image/SafeImage';
import classes from './custom-card.module.scss';

export enum ImgType {
  COVER = 'cover',
  CONTAIN = 'contain',
}

interface Props {
  headerImgUrl?: string;
  imageLink?: LinkProps;
  typeImg?: ImgType | 'cover' | 'contain';
  header?: ReactElement;
  cardContent: ReactElement;
  cardActionText?: ReactElement;
  cardActionDropDown?: ReactElement;
  bodyClass?: string;
  actionClass?: string;
  customMenuClass?: string;
  bannerNowAvailable?: ReactElement;
}

const CustomCard: FC<Props> = ({
  headerImgUrl = '',
  typeImg = ImgType.COVER,
  header = '',
  cardContent,
  cardActionDropDown,
  cardActionText = '',
  bodyClass = '',
  actionClass = '',
  customMenuClass = '',
  imageLink,
  bannerNowAvailable,
}) => {
  const imgRef = useRef<HTMLImageElement>();

  return (
    <Card className={classes.customCard}>
      <Row className={cx('row', classes.cardContainer)}>
        {headerImgUrl &&
          (imageLink ? (
            <Link {...imageLink}>
              <>
                <SafeImage
                  ref={imgRef}
                  className={cx('col-xs-12 col-md-3', {
                    [classes.imgContain]: typeImg === ImgType.CONTAIN,
                    [classes.imgCover]: typeImg === ImgType.COVER,
                  })}
                  style={{ cursor: 'pointer' }}
                  src={headerImgUrl}
                  // onError={(e) => checkImageError(e)}
                  alt="img default"
                />
                {bannerNowAvailable}
              </>
            </Link>
          ) : (
            <>
              <SafeImage
                ref={imgRef}
                className={cx('col-xs-12 col-md-3', {
                  [classes.imgContain]: typeImg === ImgType.CONTAIN,
                  [classes.imgCover]: typeImg === ImgType.COVER,
                })}
                src={headerImgUrl || bgBike}
                alt="img default"
              />
              {bannerNowAvailable}
            </>
          ))}
        {header}
        <Col sm={12} md={6} className={cx(bodyClass, classes.contentCard)}>
          {cardContent}
        </Col>
        <Col sm={12} md={3} className={cx(actionClass, classes.cardAction)}>
          {cardActionDropDown && (
            <Dropdown
              className={'d-flex'}
              style={{ position: 'relative', width: 0 }}
              renderToggle={({ toggle }) => (
                <Button buttonType="clear" onClick={toggle}>
                  <img src={icMore} alt="icon more" />
                </Button>
              )}
              renderMenu={({ hide }) => (
                <MenuDropdown
                  className={cx(classes.dropDownContent, customMenuClass)}
                  style={{ position: 'absolute', top: 50, right: 0, zIndex: 9 }}
                  onClose={hide}>
                  {cardActionDropDown}
                </MenuDropdown>
              )}
            />
          )}
          {cardActionText}
        </Col>
      </Row>
    </Card>
  );
};

export default CustomCard;
