/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cx from 'classnames';
import images from 'assets/images';
import InvisibleBackdrop from '@ui/Backdrop/InvisibleBackdrop';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import scoreCardAction from 'store/partner/scorecard/score-card.action';
import { DATA_RESET_CREATE_SCORECARD_QUANTITY } from 'helpers/utilities.helper';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import cloneDeep from 'lodash/cloneDeep';
import { constHistoryPartnerTradeInTabName } from 'components/PartnerPortal/CostCalculator/constraint';
import classes from './trade-in.module.scss';
import ModalConfirmChange from '../Modal/ModalConfirmChange';

const ModalConfirmCustom = React.lazy(() => import('../Modal/ModalConfirmCustom'));

interface Props {
  onRestart: (isRestartOnly?: boolean) => void;
  onSave: () => void;
  visibleSaveStep: boolean;
  loadingButton: boolean;
  hideSave?: boolean;
  hideRestart?: boolean;
  isCompleted?: boolean;
  createType?: string;
  setSubStep?: (value: number) => void;
  setFormStepDetails?: (formStepDetails?: any) => void;
  setFormStepOneSelectImage?: (formStepOneSelectImage?: GetListTradeInBicycleParams) => void;
}

const Header: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const {
    visibleSaveStep,
    loadingButton,
    hideSave,
    hideRestart,
    setFormStepDetails,
    setSubStep,
    setFormStepOneSelectImage,
    isCompleted,
    onSave,
    onRestart,
  } = props;
  const {
    createScorecardQuantity,
    indexScorecardSelected,
    type,
    listDataStepStandardQuote,
    listDataStepCustomQuote,
    listDataStepEbikeQuote,
  } = useSelector((state: StoreState) => state.partner.scorecard.createScoreCardQuantityData);

  const [visibleMenuRight, setVisibleMenuRight] = useState(false);
  const [visibleListNumberScorecard, setVisibleListNumberScorecard] = useState(false);
  const [visibleModalConfirmBacktoScorecardHistory, setVisibleModalConfirmBacktoScorecardHistory] = useState(false);
  const [visibleModalConfirmChangeScorecard, setVisibleModalConfirmChangeScorecard] = useState<number>(-1);
  const [visibleModalConfirmChangeCustomQuote, setVisibleModalConfirmChangeCustomQuote] = useState<number>(-1);

  const router = useRouter();
  const { query } = useRouter();

  const isEdit = useMemo(() => {
    return query?.isEdit;
  }, [query]);

  const isView = useMemo(() => {
    return query?.isView;
  }, [query]);

  const listNumberScorecard = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= createScorecardQuantity; i++) {
      arr.push(i);
    }
    return arr;
  }, [createScorecardQuantity]);

  useEffect(() => {
    if (
      (type === 'standard' || type === 'red-barn') &&
      listDataStepStandardQuote?.length >= indexScorecardSelected + 1
    ) {
      const data: any = listDataStepStandardQuote[indexScorecardSelected];
      setFormStepDetails({
        brand: data?.brand || '',
        familyName: data?.familyName || '',
        frameSize: data?.frameSize || '',
        upgradeCompIds: data?.upgradeCompIds || [],
        condition: data?.condition || '',
        tradeInValue: data?.tradeInValue || '',
      });
      setFormStepOneSelectImage({
        brandId: data?.brandId || '',
        chargerIncluded: data?.chargerIncluded || null,
        ebikeSubtypeId: data?.ebikeSubtypeId || -1,
        hasKey: data?.hasKey || null,
        isEbike: data?.isEbike || null,
        modelId: data?.modelId || '',
        yearId: data?.yearId || '',
        bicycleId: data?.bicycleId || '',
      });
      setSubStep(data?.subStep || 2);
    } else if (type === 'ebike' && listDataStepEbikeQuote?.length >= indexScorecardSelected + 1) {
      const data: any = listDataStepEbikeQuote[indexScorecardSelected];
      setFormStepDetails({
        brand: data?.brand || '',
        familyName: data?.familyName || '',
        frameSize: data?.frameSize || '',
        upgradeCompIds: data?.upgradeCompIds || [],
        condition: data?.condition || '',
        tradeInValue: data?.tradeInValue || '',
      });
      setFormStepOneSelectImage({
        brandId: data?.brandId || '',
        chargerIncluded: data?.chargerIncluded || null,
        ebikeSubtypeId: data?.ebikeSubtypeId || -1,
        hasKey: data?.hasKey || null,
        isEbike: data?.isEbike || null,
        modelId: data?.modelId || '',
        yearId: data?.yearId || '',
        bicycleId: data?.bicycleId || '',
      });
      setSubStep(data?.subStep || 2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexScorecardSelected]);

  const onExit = useCallback(() => {
    dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
    if (router.pathname.includes('red-barn-quote')) {
      return router.push({
        pathname: `/trade-in-account/trade-in/history`,
        query: {
          tab: constHistoryPartnerTradeInTabName.RED_BARN_QUOTE,
        },
      });
    }
    router.push(`/trade-in-account/tp-dashboard`);
  }, [dispatch, router]);

  const handleDeleteScorecardQuantity = useCallback(
    (e, index: number) => {
      e.preventDefault();

      switch (type) {
        case 'ebike':
        case 'red-barn':
        case 'standard': {
          const cloneArr =
            type === 'standard' || type === 'red-barn'
              ? cloneDeep(listDataStepStandardQuote)
              : cloneDeep(listDataStepEbikeQuote);
          const bikeType =
            type === 'standard' || type === 'red-barn' ? 'listDataStepStandardQuote' : 'listDataStepEbikeQuote';
          if (index === indexScorecardSelected) {
            dispatch(
              scoreCardAction.setCreateScorecardQuantity({
                createScorecardQuantity: createScorecardQuantity - 1,
                indexScorecardSelected: indexScorecardSelected !== 0 ? indexScorecardSelected - 1 : 0,
                [bikeType]: [...cloneArr.slice(0, index), ...cloneArr.slice(index + 1, cloneArr.length)],
              }),
            );
            if (cloneArr[index - 1]?.id) {
              router.push({
                pathname: `/trade-in-account/trade-in/${type === 'red-barn' ? 'red-barn-quote/' : ''}${
                  cloneArr[index - 1]?.id
                }`,
                query: { step: cloneArr[index - 1]?.step },
              });
            }
            return;
          }

          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              createScorecardQuantity: createScorecardQuantity - 1,
              [bikeType]: [...cloneArr.slice(0, index), ...cloneArr.slice(index + 1, cloneArr.length)],
            }),
          );
          break;
        }

        case 'custom':
        case 'custom-red-barn': {
          const cloneArr = cloneDeep(listDataStepCustomQuote);
          if (index === indexScorecardSelected) {
            dispatch(
              scoreCardAction.setCreateScorecardQuantity({
                createScorecardQuantity: createScorecardQuantity - 1,
                listDataStepCustomQuote: [...cloneArr.slice(0, index), ...cloneArr.slice(index + 1, cloneArr.length)],
                indexScorecardSelected: indexScorecardSelected !== 0 ? indexScorecardSelected - 1 : 0,
              }),
            );
            const scorecardSelected = listDataStepCustomQuote[indexScorecardSelected - 1];
            if (scorecardSelected?.id) {
              return router.push({
                pathname: `/trade-in-account/trade-in/${type === 'custom' ? 'custom-quote' : 'custom-red-barn-quote'}/${
                  scorecardSelected?.id
                }`,
                query: {
                  step: scorecardSelected?.step,
                  subStep: scorecardSelected?.subStep,
                },
              });
            }
          }
          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              createScorecardQuantity: createScorecardQuantity - 1,
              listDataStepCustomQuote: [...cloneArr.slice(0, index), ...cloneArr.slice(index + 1, cloneArr.length)],
            }),
          );
          break;
        }

        default: {
          if (index === indexScorecardSelected && indexScorecardSelected > 0) {
            dispatch(
              scoreCardAction.setCreateScorecardQuantity({
                createScorecardQuantity: createScorecardQuantity - 1,
                indexScorecardSelected: indexScorecardSelected - 1,
              }),
            );
            return;
          }

          dispatch(
            scoreCardAction.setCreateScorecardQuantity({
              createScorecardQuantity: createScorecardQuantity - 1,
            }),
          );
          break;
        }
      }
    },
    [
      createScorecardQuantity,
      dispatch,
      indexScorecardSelected,
      listDataStepCustomQuote,
      listDataStepEbikeQuote,
      listDataStepStandardQuote,
      router,
      type,
    ],
  );

  const renderListMenuRight = useMemo(() => {
    return (
      <div className={classes.wrapListMenuRight}>
        {!hideSave && !query?.isViewQuote && (
          <div
            className={cx(classes.item, (!visibleSaveStep || loadingButton) && classes.disabled)}
            onClick={() => onSave()}>
            Save Scorecard
          </div>
        )}
        {!hideRestart && (
          <div className={cx(classes.item, loadingButton && classes.disabled)} onClick={() => onRestart()}>
            Restart Scorecard
          </div>
        )}
        <div className={cx(classes.item, classes.danger, loadingButton && classes.disabled)} onClick={onExit}>
          Return to Partner Portal
        </div>
      </div>
    );
  }, [hideRestart, hideSave, loadingButton, onExit, onRestart, onSave, query, visibleSaveStep]);

  const handleChangeScorecardSelected = useCallback(
    (index: number, ignoreCheckShowModal?: boolean) => {
      if (type !== 'custom') {
        if (query?.id && (query?.step === '2' || query?.step === '4') && !ignoreCheckShowModal && !isCompleted) {
          setVisibleModalConfirmChangeScorecard(index);
          return;
        }

        setVisibleModalConfirmChangeScorecard(-1);
        dispatch(
          scoreCardAction.setCreateScorecardQuantity({
            indexScorecardSelected: index,
          }),
        );
        setVisibleListNumberScorecard(false);
      }

      // handle Step 1
      if (type === 'standard') {
        if (listDataStepStandardQuote[index]?.id) {
          return router.push(
            `/trade-in-account/trade-in/${listDataStepStandardQuote[index]?.id}?step=${listDataStepStandardQuote[index]?.step}`,
          );
        }
        return router.push(`/trade-in-account/trade-in/new`);
      }

      if (type === 'red-barn') {
        if (listDataStepStandardQuote[index]?.id) {
          return router.push(
            `/trade-in-account/trade-in/red-barn-quote/${listDataStepStandardQuote[index]?.id}?step=${listDataStepStandardQuote[index]?.step}`,
          );
        }
        return router.push(`/trade-in-account/trade-in/red-barn-quote`);
      }
      if (type === 'ebike') {
        if (listDataStepEbikeQuote[index]?.id) {
          return router.push(
            `/trade-in-account/trade-in/${listDataStepEbikeQuote[index]?.id}?step=${listDataStepEbikeQuote[index]?.step}`,
          );
        }
        return router.push(`/trade-in-account/trade-in/ebike-quote`);
      }
      if (type === 'custom' || type === 'custom-red-barn') {
        const _data = listDataStepCustomQuote[index];
        if (
          visibleModalConfirmChangeCustomQuote === -1 &&
          !listDataStepCustomQuote[indexScorecardSelected].indexStepComplete
        ) {
          setVisibleModalConfirmChangeCustomQuote(index);
          return;
        }
        dispatch(
          scoreCardAction.setCreateScorecardQuantity({
            indexScorecardSelected: index,
          }),
        );
        if (!_data?.indexStepComplete) {
          onRestart(true);
        }
        if (_data?.id) {
          return router.push({
            pathname: `/trade-in-account/trade-in/${type === 'custom' ? 'custom-quote' : 'custom-red-barn-quote'}/${
              _data?.id
            }`,
            query: {
              step: _data?.indexStepComplete === 4 ? 1 : _data?.step,
              subStep: _data?.indexStepComplete === 4 ? 1 : _data?.subStep,
            },
          });
        }
        setVisibleModalConfirmChangeCustomQuote(-1);
        return router.push(
          `/trade-in-account/trade-in/${type === 'custom' ? 'custom-quote' : 'custom-red-barn-quote'}`,
        );
      }
    },
    [
      dispatch,
      indexScorecardSelected,
      isCompleted,
      listDataStepCustomQuote,
      listDataStepEbikeQuote,
      listDataStepStandardQuote,
      onRestart,
      query,
      router,
      type,
      visibleModalConfirmChangeCustomQuote,
    ],
  );

  const checkLeftIcon = useCallback(
    (index: number) => {
      if (type === 'red-barn')
        return listDataStepStandardQuote[index]?.isDecline || listDataStepStandardQuote[index]?.indexStepComplete === 2;
      const listArr =
        type === 'standard'
          ? listDataStepStandardQuote
          : type === 'ebike'
          ? listDataStepEbikeQuote
          : listDataStepCustomQuote;
      return listArr[index]?.isDecline || listArr[index]?.indexStepComplete === 4;
    },
    [listDataStepCustomQuote, listDataStepEbikeQuote, listDataStepStandardQuote, type],
  );

  const checkDelIcon = useCallback(
    (index: number) => {
      const listArr =
        type === 'standard' || type === 'red-barn'
          ? listDataStepStandardQuote
          : type === 'ebike'
          ? listDataStepEbikeQuote
          : listDataStepCustomQuote;
      return (
        !(index === 0 && createScorecardQuantity <= 1) &&
        !listArr[index]?.isDecline &&
        (!listArr[index]?.indexStepComplete || listArr[index]?.indexStepComplete < 1)
      );
    },
    [createScorecardQuantity, listDataStepCustomQuote, listDataStepEbikeQuote, listDataStepStandardQuote, type],
  );

  const renderListNumberScorecard = useMemo(() => {
    return listNumberScorecard.map((it, index: number) => {
      return (
        <div
          className={cx(classes.item, index === indexScorecardSelected && classes.hovered, classes.activeHover)}
          key={it}>
          <div className={classes.wrapLeft} onClick={() => handleChangeScorecardSelected(index)}>
            {checkLeftIcon(index) && <img src={images.tradeIn.icCheckBlue} alt={'check-icon'} />}
            <span>Scorecard {index + 1}</span>
          </div>
          {checkDelIcon(index) && (
            <img src={images.common.icCloseGrey} alt="" onClick={(e) => handleDeleteScorecardQuantity(e, index)} />
          )}
        </div>
      );
    });
  }, [
    checkDelIcon,
    checkLeftIcon,
    handleChangeScorecardSelected,
    handleDeleteScorecardQuantity,
    indexScorecardSelected,
    listNumberScorecard,
  ]);

  const handleAddScorecardQuantity = useCallback(() => {
    switch (type) {
      case 'ebike':
      case 'red-barn':
      case 'standard': {
        let newObj: any = {
          subStep: type === 'standard' || type === 'red-barn' ? 2 : 1,
          step: 1,
        };
        const listArr = type === 'standard' || type === 'red-barn' ? listDataStepStandardQuote : listDataStepEbikeQuote;
        const typeListArr =
          type === 'standard' || type === 'red-barn' ? 'listDataStepStandardQuote' : 'listDataStepEbikeQuote';
        const indexDefaultFillDataStepSummary = listArr.findIndex((it) => it.isDefaultFillDataStepSummary);
        if (indexDefaultFillDataStepSummary !== -1) {
          newObj = {
            ...newObj,
            dataStepSummary: listArr[indexDefaultFillDataStepSummary]?.dataStepSummary,
          };
        }
        dispatch(
          scoreCardAction.setCreateScorecardQuantity({
            createScorecardQuantity: createScorecardQuantity + 1,
            [typeListArr]: [...listArr, ...[newObj]],
          }),
        );
        break;
      }
      case 'custom':
      case 'custom-red-barn': {
        const cloneErr = cloneDeep(listDataStepCustomQuote);
        const findDefaultFillDataStepContact = cloneErr.find((it) => it.isDefaultFillDataStepContact);
        const listAdded = findDefaultFillDataStepContact
          ? [{ subStep: 1, step: 1, dataStepContact: findDefaultFillDataStepContact?.dataStepContact }]
          : [{ subStep: 1, step: 1 }];

        dispatch(
          scoreCardAction.setCreateScorecardQuantity({
            createScorecardQuantity: createScorecardQuantity + 1,
            listDataStepCustomQuote: [...listDataStepCustomQuote, ...listAdded],
          }),
        );
        break;
      }
      default: {
        dispatch(
          scoreCardAction.setCreateScorecardQuantity({
            createScorecardQuantity: createScorecardQuantity + 1,
          }),
        );
        break;
      }
    }
  }, [
    createScorecardQuantity,
    dispatch,
    listDataStepCustomQuote,
    listDataStepEbikeQuote,
    listDataStepStandardQuote,
    type,
  ]);

  const gotoScorecardHistory = useCallback(() => {
    dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY));
    setVisibleModalConfirmBacktoScorecardHistory(false);
    router.push(`/trade-in-account/trade-in/history`);
  }, [dispatch, router]);

  return (
    <>
      <div className={classes.headerContainer}>
        <Link href={'/'}>
          <a className={cx('d-none', 'd-sm-block', classes.logo)}>
            <img
              className={classes.logo}
              src={images.common.icLogoV2}
              alt={'tradein-logo1'}
              onClick={() => dispatch(scoreCardAction.setCreateScorecardQuantity(DATA_RESET_CREATE_SCORECARD_QUANTITY))}
            />
          </a>
        </Link>
        <div className={classes.title} onClick={() => setVisibleListNumberScorecard(true)}>
          <span>
            {`${!isEdit ? `Scorecard ${indexScorecardSelected + 1}` : 'Scorecard'}`}
            {`  `}
            {!isEdit && (
              <img
                src={images.common.icDropDown}
                alt=""
                className={!visibleListNumberScorecard && classes.isRotate180}
              />
            )}
          </span>
        </div>
        {visibleListNumberScorecard && !isEdit && !isView && (
          <InvisibleBackdrop
            onClick={() => {
              setTimeout(() => {
                setVisibleListNumberScorecard(false);
              }, 100);
            }}>
            <div className={classes.wrapListNumberScorecard}>
              <div className={classes.wrapItem}>{renderListNumberScorecard}</div>
              <div className={classes.wrapItemLast}>
                <div className={classes.itemLast} onClick={handleAddScorecardQuantity}>
                  <img src={images.tradeIn.icAddNumberScorecard} alt="" />
                  <span>Add New Scorecard</span>
                </div>
              </div>
            </div>
          </InvisibleBackdrop>
        )}
        <div
          className={classes.wrapMenuRight}
          onClick={(e) => {
            e.preventDefault();
            setVisibleMenuRight(!visibleMenuRight);
          }}>
          <img
            className={classes.logoMenuRight}
            src={images.icMenuCreateScorecard}
            alt={'icMenuCreateScorecard-logo'}
          />
          <span>Menu</span>
        </div>
        {visibleMenuRight && (
          <InvisibleBackdrop
            onClick={() => {
              setTimeout(() => {
                setVisibleMenuRight(false);
              }, 100);
            }}>
            {renderListMenuRight}
          </InvisibleBackdrop>
        )}

        {visibleModalConfirmBacktoScorecardHistory && (
          <Suspense fallback={null}>
            <ModalConfirmCustom
              isOpen={visibleModalConfirmBacktoScorecardHistory}
              onClose={() => setVisibleModalConfirmBacktoScorecardHistory(false)}
              title="Do you want to delete this process?"
              onSubmit={gotoScorecardHistory}
            />
          </Suspense>
        )}

        {visibleModalConfirmChangeScorecard !== -1 && (
          <ModalConfirmChange
            isOpen={visibleModalConfirmChangeScorecard !== -1}
            onClose={() => setVisibleModalConfirmChangeScorecard(-1)}
            title="This step is incomplete. All data in this step has been lost if you select another scorecard ?"
            onSubmit={() => handleChangeScorecardSelected(visibleModalConfirmChangeScorecard, true)}
          />
        )}
        {visibleModalConfirmChangeCustomQuote !== -1 && (
          <ModalConfirmChange
            isOpen={visibleModalConfirmChangeCustomQuote !== -1}
            onClose={() => setVisibleModalConfirmChangeCustomQuote(-1)}
            title="This step is incomplete. All data in this step has been lost if you select another scorecard ?"
            onSubmit={() => handleChangeScorecardSelected(visibleModalConfirmChangeCustomQuote, true)}
          />
        )}
      </div>
    </>
  );
};

export default Header;
