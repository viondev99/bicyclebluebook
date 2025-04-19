import React, { FC } from 'react';
import Container from 'reactstrap/lib/Container';
import SearchBar from '@ui/SearchBar/SearchBar';
import classes from './search.module.scss';

type Props = React.ComponentProps<typeof SearchBar>;

const Search: FC<Props> = ({ currentQuery }) => {
  return (
    <Container className={classes.container}>
      <SearchBar currentQuery={currentQuery} />
    </Container>
  );
};

export default Search;
