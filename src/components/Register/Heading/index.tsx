import React, { FC } from 'react';
import cx from 'classnames';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import classes from './heading.module.scss';

interface Props {
  title?: string;
}

const RegisterHeading: FC<Props> = ({ title }) => {
  return (
    <Row className={classes.heading}>
      <Col>
        <div className="d-flex flex-column flex-md-row">
          <h2 className={classes.name}>Create an account </h2>
          <h4 className={cx('ml-md-4 mt-md-2 ', classes.title)}>{title ?? ''}</h4>
        </div>
      </Col>
    </Row>
  );
};

export default RegisterHeading;
