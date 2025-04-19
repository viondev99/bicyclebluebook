import React, { FC, useCallback, useMemo, useState } from 'react';
import { RatingModel } from 'model/store/value-guide.model';
import Rating from 'components/ValueGuide/Product/ProductSection/Rating/Rating';
import Progress from 'reactstrap/lib/Progress';
import Button from '@ui/Buttons/Primary/Button';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { toastError } from 'helpers/utils.helper';
import t from 'helpers/language';
import get from 'lodash/get';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { getLoginLinkProps } from 'helpers/common.helper';
import classes from './ratingSection.module.scss';
import ReviewModal from '../../../../ReviewModal/ReviewModal';
import ReviewFormModal from '../ReviewFormModal/ReviewFormModal';

interface Props {
  rating: RatingModel;
}

const RatingSection: FC<Props> = ({ rating }) => {
  const loading = useSelector((state: StoreState) => state.valueGuide.rating.loading);
  const token = useSelector((store: StoreState) => store.authenticate.token);
  const [reviewModalVisible, setReviewModalVisible] = useState<boolean>(false);
  const [reviewFormModalVisible, setReviewFormModalVisible] = useState<boolean>(false);
  const router = useRouter();
  const ratingPerStar = useMemo(() => {
    return [
      { label: '5 stars', value: 'fiveStars' },
      { label: '4 stars', value: 'fourStars' },
      { label: '3 stars', value: 'threeStars' },
      { label: '2 stars', value: 'twoStars' },
      { label: '1 star', value: 'oneStar' },
    ].map((star) => ({
      label: star.label,
      value: star.value,
      percentage: (get(rating.rateValueDetail, star.value) / rating.totalRating) * 100,
    }));
  }, [rating.rateValueDetail, rating.totalRating]);

  const handleOpenReviewForm = useCallback(() => {
    if (!token) {
      const loginProps = getLoginLinkProps(router);
      router.push(loginProps.href, loginProps.as, {
        shallow: loginProps.shallow,
      });
      toastError(t('authenticate.requireLogin'), t('seoTitle.loginRequired'));
    } else {
      setReviewFormModalVisible(true);
    }
  }, [router, token]);

  return (
    <>
      <div>
        <h1>{rating.avgRating}</h1>
        <h4>based on {rating.totalRating} ratings</h4>
        <div className={classes.rating}>
          {loading ? <Skeleton /> : <Rating initialRating={rating.avgRating} readonly={true} />}
        </div>

        <div>
          {ratingPerStar.map((star) => (
            <div key={star.value} className={classes.star}>
              <div className={classes.label}>{star.label}</div>

              {loading ? (
                <div className={classes.progress}>
                  <Skeleton />
                </div>
              ) : (
                <Progress barClassName={classes.progressBar} value={star.percentage} className={classes.progress} />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-column">
          {rating.ratingResponse.data.length === 0 || (
            <Button buttonType="outline" className={classes.btn} onClick={() => setReviewModalVisible(true)}>
              View all Reviews
            </Button>
          )}

          <div className={classes.writeReview}>
            <Button buttonType="transparent" onClick={handleOpenReviewForm}>
              <span className={classes.text}>Write a review</span>
            </Button>
          </div>
        </div>
      </div>
      <ReviewModal isOpen={reviewModalVisible} onClose={() => setReviewModalVisible(false)} />
      <ReviewFormModal isOpen={reviewFormModalVisible} onClose={() => setReviewFormModalVisible(false)} />
    </>
  );
};

export default RatingSection;
