import StoreState from 'model/store';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import classes from './heading.module.scss';

interface Props {
  title?: string;
  name: string;
}

const SelectFamilyHeading: FC<Props> = ({ title, name }) => {
  const dataLogoBrandValueGuide = useSelector(
    (store: StoreState) => store.valueGuide.model.list.dataLogoBrandValueGuide,
  );
  return (
    <Row className={classes.heading}>
      <Col className={classes.headerCol}>
        <div className="d-flex flex-column">
          <div className={classes.wrapHeading}>
            <h1 className={classes.name}>{name}</h1>
            {dataLogoBrandValueGuide?.brandLogo && <img src={dataLogoBrandValueGuide?.brandLogo} alt="" />}
          </div>
          <h3 className={classes.title}>{title ?? ''}</h3>
        </div>
      </Col>
    </Row>
  );
};

export default SelectFamilyHeading;
