/* eslint-disable no-unused-expressions */
import React, { FC, useCallback } from 'react';
import Container from 'reactstrap/lib/Container';
import { useRouter } from 'next/router';
import { constHotBike } from 'helpers/constraint.helper';
import classes from './header-mkp.module.scss';

const HeaderMarketplace: FC = () => {
  const { query } = useRouter();

  const renderInfo = useCallback(
    (type: string) => {
      switch (query?.id) {
        case 'road-bikes': {
          return type === 'title' ? constHotBike.ROAD.title : constHotBike.ROAD.description;
        }
        case 'mountain-bikes': {
          return type === 'title' ? constHotBike.MOUNTAIN.title : constHotBike.MOUNTAIN.description;
        }
        case 'hybrid-bikes': {
          return type === 'title' ? constHotBike.HYBRID.title : constHotBike.HYBRID.description;
        }
        case 'kids-bikes': {
          return type === 'title' ? constHotBike.KIDS.title : constHotBike.KIDS.description;
        }
        case 'e-bikes': {
          return type === 'title' ? constHotBike.EBIKE.title : constHotBike.EBIKE.description;
        }
        default:
          return '';
      }
    },
    [query],
  );

  return (
    <Container className={classes.container}>
      <h1 className={classes.headerTitle}>{renderInfo('title')}</h1>
      <div className={classes.description}>{renderInfo('desciption')}</div>
    </Container>
  );
};

export default HeaderMarketplace;
