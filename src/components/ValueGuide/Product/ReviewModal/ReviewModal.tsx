import React, { FC, useCallback, useMemo, useState } from 'react';
import Modal from '@ui/Modal';
import MobileModalHeader from '@ui/Modal/MobileModalHeaderCommon';
import images from 'assets/images';
import cx from 'classnames';
import Select from '@ui/Select/Select';
import { OptionsType } from 'react-select';
import { RatingSortType } from 'constants/valueGuide';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getRating } from 'store/value-guide/value-guide.action';
import StoreState from 'model/store';
import { toastError } from 'helpers/utils.helper';
import ListComment from '../ListComment/ListComment';
import classes from './reviewModal.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const options: OptionsType<any> = [
  { value: RatingSortType.DESC, label: 'Most Recent' },
  { value: RatingSortType.ASC, label: 'Most Oldest' },
];
const ReviewModal: FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { query } = router;
  const [sortBy, setSortBy] = useState(options[0].value);
  const dispatch = useDispatch();
  const product = useSelector((state: StoreState) => state.valueGuide.bicycle.detail.bicycle);
  const rating = useSelector((state: StoreState) => state.valueGuide.rating.rating);
  const comments = useMemo(() => {
    return rating.ratingResponse;
  }, [rating.ratingResponse]);
  const disabledSelect = useMemo(() => {
    return !comments?.data || comments?.data?.length === 0;
  }, [comments]);

  const handleSelectChange = useCallback(
    (e) => {
      if (!product.id) {
        return toastError('Sorry, something’s wrong.');
      }
      setSortBy(e.value);
      dispatch(
        getRating({
          bicycleId: product?.id,
          page: 1,
          sortType: e.value,
        }),
      );
    },
    [dispatch, product],
  );

  const handleChangePage = useCallback(
    (page) => {
      dispatch(
        getRating({
          bicycleId: query.id,
          page,
          sortType: sortBy,
        }),
      );
    },
    [dispatch, query.id, sortBy],
  );

  const renderHeader = useMemo(() => {
    return (
      <>
        <div className={cx('d-flex flex-column flex-md-row', classes.wrapHeader)}>
          <h2 className={classes.title}>All Reviews</h2>
          <Select
            inputId={'select-review'}
            options={options}
            className={classes.select}
            value={sortBy}
            onChange={handleSelectChange}
            isDisabled={disabledSelect}
          />
          <button
            className={cx(classes.btnClose, 'close_btn', 'ml-auto', 'd-none d-md-block')}
            onClick={onClose}
            type="button">
            <img className={'close_icon'} src={images.iconClose} alt="Close icon" />
          </button>
        </div>
        <div className="d-block d-md-none">
          <MobileModalHeader onClose={() => onClose()} className={classes.modalCloseBtn} />
        </div>
      </>
    );
  }, [disabledSelect, handleSelectChange, onClose, sortBy]);

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      className={classes.modal}
      contentClassName={classes.content}
      bodyClassName={classes.body}
      showClose={false}
      header={<>{renderHeader}</>}>
      <ListComment handleChangePage={handleChangePage} />
    </Modal>
  );
};

export default ReviewModal;
