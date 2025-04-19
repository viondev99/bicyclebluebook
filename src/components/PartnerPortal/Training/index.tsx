/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-target-blank */
import Card from '@ui/Cards';
import StoreState from 'model/store';
import cx from 'classnames';
import images from 'assets/images';
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListTrainings } from 'store/partner/training/training.action';
import { GetListTrainingsResponse, ItemResource } from 'model/store/partner/training.model';
import { constTraingVideo } from 'helpers/constraint.helper';
import { capitalizeEachFirstLetter } from 'helpers/string.helper';
import { checkImageLink } from 'helpers/utilities.helper';
import { DataFile } from '@ui/Modal/ModalViewImage';
import { handleChangeStepTour } from 'store/authenticate/authenticate.action';
import { useRouter } from 'next/router';
import useScreenDetect from 'hooks/useScreenDetect';
import { saveStatusShowPartnerTour } from 'store/partner/account/account.action';
import classes from './training.module.scss';
import ListingSkeleton from './ListingSkeleton';

const ModalViewImage = React.lazy(() => import('@ui/Modal/ModalViewImage'));
const ModalProgressUpload = React.lazy(() => import('@ui/Modal/ModalProgressUpload'));

const Training: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const listTraings = useSelector((store: StoreState) => store.partner.training.listTraings);
  const loading = useSelector((store: StoreState) => store.partner.training.loading);
  const [listData, setListData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dataModalDownloadProgress, setDataModalDownloadProgress] = useState(null);
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);
  const { currentWidthScreen } = useScreenDetect();
  const { replace } = useRouter();

  useEffect(() => {
    handleGetListTrainings();
  }, []);

  useEffect(() => {
    setListData(listTraings);
  }, [listTraings]);

  const handleGetListTrainings = useCallback(() => {
    dispatch(getListTrainings('training'));
  }, [dispatch]);

  const getImageFromYoutubeLink = (url: string) => {
    const urlImage = `https://img.youtube.com/vi/${url.replace('https://youtu.be/', '')}/3.jpg`;
    return urlImage;
  };

  const handleDownload = (dataFile: DataFile) => {
    handleOpenModalDownloadProgress(dataFile);
  };

  const handleOpenModal = (dataFile: DataFile) => {
    setSelectedImage(dataFile);
  };

  const handleCloseModalDownloadProgress = () => {
    setDataModalDownloadProgress(null);
  };
  const handleOpenModalDownloadProgress = (data: DataFile) => {
    setDataModalDownloadProgress(data);
  };

  const handleChangeVideo = (indexParent: number, index: number, i: number) => {
    const list = [...listData];
    list[indexParent].resources[index] = {
      ...list[indexParent].resources[index],
      videoSelected: i,
    };
    setListData(list);
  };

  const redirectDasboard = useCallback(() => {
    replace(`/trade-in-account/tp-dashboard/`);
    dispatch(saveStatusShowPartnerTour(true));
  }, [dispatch, replace]);

  const rendereResource = useCallback((data: ItemResource) => {
    if (!data.attachment) {
      return null;
    }
    return (
      <div key={data._id} className={classes.wrapDocument}>
        <div className={classes.documentTitle}>
          {data.attachment.original_name === '1-trade-in-program-faq-pdf'
            ? 'Trade-In Program FAQ'
            : data.attachment.original_name === '2-mobile-scorecard_faq_v2-1-pdf'
            ? 'Mobile Scorecard FAQ'
            : data.attachment.original_name === '3-website-cross-promo_faq_v2-1-pdf'
            ? 'Website Cross Promotion Program FAQ'
            : data.title}
        </div>
        <div className={classes.documentAction}>
          {checkImageLink(data.attachment.link) ? (
            <a onClick={() => handleOpenModal({ name: data.attachment.file, url: data.attachment.link })}>
              <img className={classes.icEyeBlue} src={images.account.partner.icEyeBlue} alt="icEyeBlue" />
            </a>
          ) : (
            <a href={data.attachment.link} target="_blank">
              <img className={classes.icEyeBlue} src={images.account.partner.icEyeBlue} alt="icEyeBlue" />
            </a>
          )}
          {checkImageLink(data.attachment.link) ? (
            <a
              onClick={() => handleOpenModal({ name: data.attachment.file, url: data.attachment.link })}
              className={classes.viewAction}>
              View
            </a>
          ) : (
            <a href={data.attachment.link} target="_blank" className={classes.viewAction}>
              View
            </a>
          )}

          <a onClick={() => handleOpenModalDownloadProgress({ url: data.attachment.link, name: data.attachment.file })}>
            <img className={classes.icDownloadBlue} src={images.account.partner.icDownloadBlue} alt="icDownloadBlue" />
          </a>
          <a
            onClick={() => handleOpenModalDownloadProgress({ url: data.attachment.link, name: data.attachment.file })}
            className={classes.downloadAction}>
            Download
          </a>
        </div>
      </div>
    );
  }, []);

  const renderFrame = useCallback(
    (data: ItemResource, indexParent: number, index: number) => {
      return (
        <div className={classes.iframeRight}>
          {data.src.map((res: string, i: number) => {
            return (
              <>
                {(data.videoSelected && data.videoSelected === i) || (!data.videoSelected && i === 0) ? (
                  <div
                    className={cx(classes.itemActive, classes.item)}
                    key={res}
                    style={{ background: `url(${getImageFromYoutubeLink(res)})` }}>
                    {` `}
                  </div>
                ) : (
                  <div
                    className={cx(classes.itemInActive, classes.item)}
                    key={res}
                    onClick={() => handleChangeVideo(indexParent, index, i)}
                    style={{ background: `url(${getImageFromYoutubeLink(res)})` }}>
                    <div className={classes.wrapContent}>
                      <img src={images.account.partner.icPlay} alt="icPlay" />
                      <span>{i === 0 ? 'Giant Bicycles Success Story' : 'How to pack a bike'}</span>
                    </div>
                  </div>
                )}
              </>
            );
          })}
        </div>
      );
    },
    [handleChangeVideo],
  );

  const renderBody = useMemo(() => {
    return listData && Array.isArray(listData) && listData?.length > 0
      ? listData
          .sort((a: any, b: any) => a.sorted - b.sorted)
          .map((item: GetListTrainingsResponse, indexParent: number) => {
            const checkExistResourceSrc = item.resources.filter((it1: ItemResource) => it1?.src?.length);
            if (item.title === constTraingVideo.TITLE.FREQUENTLY_ASKED_QUESTIONS) {
              return (
                <Card key={item._id} className={classes.wrapCard}>
                  <div className={cx(classes.header, classes.headerIframe)}>
                    {capitalizeEachFirstLetter(item.title) || ''}
                  </div>
                  {item.resources.map((data: ItemResource) => (
                    <>{rendereResource(data)}</>
                  ))}
                </Card>
              );
            }
            if (item.title === constTraingVideo.TITLE.MOBILE_SCORECARD_WALKTHROUGH) {
              return;
            }
            return (
              <Card
                key={item._id}
                className={cx(classes.wrapCard, checkExistResourceSrc?.length && classes.removeWrapCard)}>
                <div className={cx(classes.header, checkExistResourceSrc?.length && classes.headerIframe)}>
                  {capitalizeEachFirstLetter(item.title) || ''}
                </div>
                {item.title === constTraingVideo.TITLE.WELCOME_TO_THE_TRADE_IN_PARTNER_PROGRAM && (
                  <div className={classes.linkPartnerTutorial}>
                    View our{' '}
                    <span className={classes.clickTour} onClick={redirectDasboard}>
                      Partner Portal tutorial
                    </span>
                    .
                  </div>
                )}
                {item.resources.map((data: ItemResource, index: number) => {
                  return (
                    <>
                      {rendereResource(data)}
                      <div key={data._id}>
                        {data.src && checkExistResourceSrc?.length ? (
                          <div className={classes.wrapIrame}>
                            <div className={classes.iframeLeft}>
                              {data.src.length && (
                                <iframe
                                  src={`https://www.youtube.com/embed/${
                                    data.src[data.videoSelected || 0].split('/')[3]
                                  }?rel=0`}
                                  allowFullScreen={true}
                                />
                              )}
                            </div>
                            {renderFrame(data, indexParent, index)}
                          </div>
                        ) : null}
                      </div>
                    </>
                  );
                })}
              </Card>
            );
          })
      : null;
  }, [listData, rendereResource, renderFrame]);

  const renderLoading = useMemo(() => {
    return (
      <>
        {new Array(3).fill(0).map((item, index) => (
          <ListingSkeleton key={String(index)} />
        ))}
      </>
    );
  }, []);

  return (
    <>
      {loading ? renderLoading : renderBody}

      {stepTour === 6 && !loading && (
        <div className={classes.wrapModal}>
          {currentWidthScreen >= 768 && <div className={classes.arrowLeft} />}
          <div>
            In the training section you will find information on the trade-in program, FAQs, process documentation, and
            various sales tools.
          </div>
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              onClick={() => {
                dispatch(saveStatusShowPartnerTour(false));
                dispatch(handleChangeStepTour({ steps: 5 }));
                router.replace('/trade-in-account/marketing');
              }}
              className={classes.buttonBack}>
              Back
            </button>
            <button
              type="button"
              className={classes.buttonNext}
              onClick={() => {
                dispatch(saveStatusShowPartnerTour(false));
                dispatch(handleChangeStepTour({ steps: 7 }));
                router.replace('/trade-in-account/feedback');
              }}>
              Next
            </button>
          </div>
        </div>
      )}

      {selectedImage && (
        <Suspense fallback={null}>
          <ModalViewImage
            dataFile={selectedImage}
            isOpen={selectedImage && selectedImage !== ''}
            onClose={() => setSelectedImage(null)}
            onDownload={handleDownload}
          />
        </Suspense>
      )}

      {dataModalDownloadProgress && (
        <Suspense fallback={null}>
          <ModalProgressUpload
            isOpen={dataModalDownloadProgress !== null}
            urlUpload={dataModalDownloadProgress.url}
            fileName={dataModalDownloadProgress.name}
            onClose={handleCloseModalDownloadProgress}
          />
        </Suspense>
      )}
    </>
  );
};

export default Training;
