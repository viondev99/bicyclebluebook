import React, { FC } from 'react';
import { RatingDataModel } from 'model/store/value-guide.model';
import cx from 'classnames';
import images from 'assets/images';
import SafeImage from 'components/Image/SafeImage';
import classes from './comment.module.scss';

interface Props {
  comment: RatingDataModel;
}

const CommentItem: FC<Props> = ({ comment }) => {
  return (
    <div className={classes.commentItem}>
      <div className={'d-flex'}>
        <div className={cx(classes.avatar, 'rounded-circle')}>
          <SafeImage
            src={comment.avatar}
            alt={'Avatar'}
            className="img-fluid rounded-circle w-100"
            size="l"
            fallback={images.iconProfile}
          />
        </div>
        <div
          className={cx('ml-4', {
            'd-flex align-items-center': !comment.city && !comment.state,
          })}>
          <h4 className={classes.name}>{comment.nameDisplay}</h4>
          {!!(comment.city || comment.state) && (
            <p>
              {comment.city}
              {!!comment.state && `, ${comment.state}`}
            </p>
          )}
        </div>
      </div>
      <div className="d-flex align-content-center align-items-center mt-2">
        {comment.title && <h4 className={classes.comment}>{comment.title} </h4>}
        <div className={classes.rating}>
          <img src={images.valueGuide.iconStarWhite} alt={'Star'} />
          <span>{comment.rate}</span>
        </div>
      </div>

      <p className={cx('mt-2', classes.paragraph)}>{comment.comment}</p>
    </div>
  );
};

export default CommentItem;
