import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import Pagination from '@ui/Pagination/Pagination';
import CommentItem from './CommentItem';
import CommentSkeleton from './CommentSkeleton';

interface Props {
  handleChangePage: (page: number) => void;
}

const ListComment: FC<Props> = ({ handleChangePage }) => {
  const rating = useSelector((state: StoreState) => state.valueGuide.rating.rating);
  const comments = useMemo(() => {
    return rating.ratingResponse;
  }, [rating.ratingResponse]);

  const loading = useSelector((state: StoreState) => state.valueGuide.rating.loading);

  const renderLoading = useMemo(() => {
    return new Array(2).fill(0).map((_, index) => <CommentSkeleton key={String(index)} />);
  }, []);

  const renderListComments = useMemo(() => {
    if (!comments?.data || comments?.data?.length === 0) {
      return (
        <div>
          <h1>0</h1>
          <h4>based on 0 ratings</h4>
        </div>
      );
    }
    return comments?.data?.map((comment: any) => {
      return <CommentItem key={comment.title} comment={comment} />;
    });
  }, [comments]);

  return (
    <div>
      {loading ? (
        <>{renderLoading}</>
      ) : (
        <>
          {renderListComments}
          <div className={'mt-5'}>
            <Pagination onChangePage={handleChangePage} totalPage={comments.total_page} page={comments.page} />
          </div>
        </>
      )}
    </div>
  );
};

export default ListComment;
