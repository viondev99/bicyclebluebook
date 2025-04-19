/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// import { getSeoHelmet } from 'helpers/constraint.helper';
import React from 'react';
import SEOPageMKP from 'components/Marketplace/List/SEOPageMKP';
import { capitalizeFirstLetter } from 'helpers/string.helper';
import { useRouter } from 'next/router';
import Container from 'reactstrap/lib/Container';
import BackButton from './BackButton';
import ValueGuideHeading from './Heading';
import classes from './search.module.scss';
import SelectFamily from './SelectFamily/SelectFamily';

const SearchFamilyContainer = () => {
  const router = useRouter();
  const { query } = router;

  // const brandName = useMemo(() => {
  //   return `${query?.brandName}` || '';
  // }, [query]);

  const handleOnBack = () => {
    router.back();
  };

  // const renderTitleSeoH1 = useMemo(() => {
  //   let seoH1Name = '';
  //   switch (brandName) {
  //     case 'Trek': {
  //       seoH1Name = getSeoHelmet().VALUE_GUIDE.Trek.h;
  //       break;
  //     }
  //     case 'Gary Fisher': {
  //       seoH1Name = getSeoHelmet().VALUE_GUIDE.Gary_Fisher.h;
  //       break;
  //     }
  //     case 'Schwinn': {
  //       seoH1Name = getSeoHelmet().VALUE_GUIDE.Schwinn.h;
  //       break;
  //     }
  //     default:
  //       break;
  //   }
  //   return seoH1Name;
  // }, [brandName]);

  return (
    <Container className={classes.container}>
      <BackButton onClick={handleOnBack} />
      <ValueGuideHeading
        title="Select Product Family"
        name={query?.brandName ? capitalizeFirstLetter(`${query?.brandName}`) : ''}
      />
      <SelectFamily />
      {/* <h1 className={classes.customSeoH1}>{renderTitleSeoH1}</h1> */}

      <SEOPageMKP />
    </Container>
  );
};

export default SearchFamilyContainer;
