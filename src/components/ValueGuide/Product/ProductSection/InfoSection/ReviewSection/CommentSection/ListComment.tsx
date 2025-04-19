import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import CommentItem from 'components/ValueGuide/Product/ListComment/CommentItem';
import CommentSkeleton from 'components/ValueGuide/Product/ListComment/CommentSkeleton';

const TOTAL_COMMENT_SHOW = 3;

const ListComment = () => {
  const ratingComments = useSelector((state: StoreState) => state.valueGuide.rating.rating.ratingResponse.data);
  const comments = useMemo(() => ratingComments.slice(0, TOTAL_COMMENT_SHOW), [ratingComments]);
  const loading = useSelector((state: StoreState) => state.valueGuide.rating.loading);

  const renderLoading = () => {
    return new Array(3).fill(0).map((_, index) => <CommentSkeleton key={String(index)} />);
  };

  return (
    <div>
      {loading ? (
        <>{renderLoading()}</>
      ) : (
        <>
          {comments.map((comment: any) => (
            <CommentItem key={comment.title} comment={comment} />
          ))}
        </>
      )}
    </div>
  );
};

export default ListComment;
