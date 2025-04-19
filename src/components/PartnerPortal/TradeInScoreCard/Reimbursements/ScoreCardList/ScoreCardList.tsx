import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import Pagination from '@ui/Pagination/Pagination';
import Card from '@ui/Cards';
import scorecardAction, { GetListReimbursementPayload } from 'store/partner/scorecard/score-card.action';
import StoreState from 'model/store';
import ScoreCardItem, { ScorecardSkeleton } from './ScoreCardItem/ScoreCordItem';
import classes from './score-card-list.module.scss';

function isSameDate(prev: string, current: string) {
  return dayjs(prev).isSame(dayjs(current), 'days');
}

interface Props {
  sortValue?: string;
}

const ScoreCardList: FC<Props> = ({ sortValue }) => {
  const { query, replace, pathname } = useRouter();
  const dispatch = useDispatch();
  // const [statusSelected, setStatusSelected] = useState<string>('');
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const reimbursementList = useSelector((state: StoreState) => state.partner.scorecard.reimbursementList);
  const loading = useSelector((state: StoreState) => state.partner.scorecard.loading);

  const handleGetListReimbursement = useCallback(() => {
    if (userInfo) {
      const body: GetListReimbursementPayload = {
        page: Number(query.page || 1),
        size: Number(query.size || 10),
        sortType: 'DESC',
        sortField: sortValue,
      };
      dispatch(scorecardAction.getListReimbursement(body));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query.page, query.size, userInfo]);

  useEffect(() => {
    handleGetListReimbursement();
  }, [dispatch, handleGetListReimbursement, query.page, query.size, userInfo]);

  const handleChangePage = useCallback(
    (page) => {
      replace({
        pathname,
        query: {
          ...query,
          page,
        },
      });
    },
    [replace, pathname, query],
  );

  const renderLoading = useMemo(() => {
    return (
      <div>
        {new Array(4).fill(0).map((_, index) => (
          <ScorecardSkeleton key={String(index)} />
        ))}
      </div>
    );
  }, []);

  const renderScoreCardList = useMemo(() => {
    return reimbursementList?.data?.length ? (
      reimbursementList.data.map((item, index, array) => {
        const prev = index > 0 ? array[index - 1] : null;
        const renderHeader = !prev || !isSameDate(prev.dateReceived, item.dateReceived);

        return (
          <ScoreCardItem
            renderHeader={renderHeader}
            location={item.partnerName}
            tradeId={item?.tradeInId}
            poNumber={item?.poNumber}
            Total={item?.total}
            status={item?.status}
            id={item.tradeInId}
            key={item.tradeInId}
            createdTime={item.dateReceived}
          />
        );
      })
    ) : (
      <Card className={classes.notFoundText}>There’s no data.</Card>
    );
  }, [reimbursementList]);

  return (
    <div>
      {loading ? renderLoading : renderScoreCardList}
      {!loading && reimbursementList?.data?.length ? (
        <div style={{ marginTop: 50 }}>
          <Pagination
            onChangePage={handleChangePage}
            totalPage={reimbursementList.total_page}
            page={+String(query.page || '') || reimbursementList.page}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ScoreCardList;
