import React, { FC } from 'react';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import iconLocation from 'assets/img/marketplace/ic_location.svg';
import classes from './title-section.module.scss';

interface Props {
  formData: FormValue;
}

const TitleSection: FC<Props> = ({ formData }) => {
  const renderShippingType = () => {
    if (!formData.shippingMethod) {
      return 'Free local pickup';
    }
    return null;
  };
  return (
    <div>
      <h1 className={classes.bikeName}>
        {formData?.listingType === 'PART_ACCESSORIES'
          ? formData?.listingTitle
          : `${formData.year} ${formData.brand} ${formData.model}`}
      </h1>
      <div className={classes.headInformation}>
        <div className={'d-flex my-2'}>
          <div className={classes.location}>
            <img src={iconLocation} alt={'location'} />
            {formData.city}, {formData.state}
          </div>
          <div className={classes.shippingType}>{renderShippingType()}</div>
        </div>
      </div>
    </div>
  );
};

export default TitleSection;
