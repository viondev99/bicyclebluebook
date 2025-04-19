import React from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import StoreState from 'model/store';
import { useSelector } from 'react-redux';
import RatingSection from './RatingSection/RatingSection';
import ListComment from './CommentSection/ListComment';

const ReviewSection = () => {
  const rating = useSelector((state: StoreState) => state.valueGuide.rating.rating);

  return (
    <Row className={'my-5'}>
      <Col xs={12} lg={6}>
        <RatingSection rating={rating} />
      </Col>
      <Col lg={6} className="d-lg-block d-none pl-4">
        <ListComment />
      </Col>
    </Row>
  );
};

export default ReviewSection;
