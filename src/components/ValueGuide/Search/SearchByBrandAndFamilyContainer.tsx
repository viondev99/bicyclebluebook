import React from 'react';
import Container from 'reactstrap/lib/Container';
import { useRouter } from 'next/router';
import { capitalizeEachFirstLetter } from 'helpers/string.helper';
import classes from './search.module.scss';
import BackButton from './BackButton';
import ValueGuideHeading from './Heading';
import SelectBicycle from './SelectBicycle/SelectBicycle';

const SearchByBrandAndFamilyContainer = () => {
  const router = useRouter();

  const handleOnBack = () => {
    router.back();
  };

  const renderSelect = () => {
    return (
      <>
        <BackButton onClick={handleOnBack} />
        <ValueGuideHeading
          title={`${router?.query?.familyName || ''}`}
          name={capitalizeEachFirstLetter(`${router?.query?.brandName || ''}`)}
        />
        <SelectBicycle />
      </>
    );
  };

  return <Container className={classes.container}>{renderSelect()}</Container>;
};

export default SearchByBrandAndFamilyContainer;
