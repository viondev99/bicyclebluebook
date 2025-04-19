import React from 'react';
import Container from 'reactstrap/lib/Container';
import SearchBar from './SearchBar/SearchBar';
import classes from './search.module.scss';
import SelectBicycleContent from './SelectBicycle/SelectBicycleContent';
import ContentHeading from './Heading/ContentHeading';

const SearchContainer = () => {
  const renderSelect = () => {
    return (
      <>
        <SearchBar />
        <ContentHeading />
        <SelectBicycleContent selectByContent={true} />
      </>
    );
  };

  return <Container className={classes.container}>{renderSelect()}</Container>;
};

export default SearchContainer;
