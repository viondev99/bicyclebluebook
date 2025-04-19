/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-target-blank */
import StoreState from 'model/store';
import cx from 'classnames';
import images from 'assets/images';
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListTrainings } from 'store/partner/training/training.action';
import Select from '@ui/Select/Select';
import { pxToRem } from 'helpers/common.helper';
import { checkImageLink } from 'helpers/utilities.helper';
import { DataFile } from '@ui/Modal/ModalViewImage';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import useScreenDetect from 'hooks/useScreenDetect';
import ListingSkeleton from './ListingSkeleton';
import classes from './print.module.scss';

const ModalViewImage = React.lazy(() => import('@ui/Modal/ModalViewImage'));
const ModalProgressUpload = React.lazy(() => import('@ui/Modal/ModalProgressUpload'));

const Print: FC = () => {
  const dispatch = useDispatch();
  const listDigitals = useSelector((store: StoreState) => store.partner.training.listTraings);
  const loading = useSelector((store: StoreState) => store.partner.training.loading);
  const { currentWidthScreen } = useScreenDetect();
  const [selectedCampain, setSelectedCampain] = useState('0');
  const [selectedImage, setSelectedImage] = useState(null);
  const [dataModalDownloadProgress, setDataModalDownloadProgress] = useState(null);

  const selectCampainOptions = [
    { value: '0', label: 'Trade in Sale' },
    { value: '1', label: 'Upgrade Your Ride' },
  ];

  useEffect(() => {
    handleGetListTrainings();
  }, []);

  const handleGetListTrainings = useCallback(() => {
    dispatch(getListTrainings('print'));
  }, [dispatch]);

  const handleOpenModal = (dataFile: DataFile) => {
    setSelectedImage(dataFile);
  };

  const handleDownload = (dataFile: DataFile) => {
    handleOpenModalDownloadProgress(dataFile);
  };

  const handleCloseModalDownloadProgress = () => {
    setDataModalDownloadProgress(null);
  };
  const handleOpenModalDownloadProgress = (data: DataFile) => {
    setDataModalDownloadProgress(data);
  };

  const renderLoading = useMemo(() => {
    return (
      <>
        {new Array(3).fill(0).map((item, index) => (
          <ListingSkeleton key={String(index)} />
        ))}
      </>
    );
  }, [loading]);

  const renderListResourse = useCallback(
    (listResources: any, title?: string, description?: string) => {
      return listResources?.map((item: any, index: number) => {
        return (
          <div className={classes.wrapBoxItem}>
            <Row className={classes.wrapContentItem}>
              <Col md={7} className={classes.wrapInfoLeft}>
                <div>{title}</div>
                <span>{item?.size}</span>
              </Col>

              <div className={cx(classes.itemDescription, classes.smallScreen)}>{description || ''}</div>

              {item.attachment && (
                <Col md={5} className={classes.documentAction}>
                  {checkImageLink(item.attachment.link) ? (
                    <a onClick={() => handleOpenModal({ name: item.attachment.file, url: item.attachment.link })}>
                      <img className={classes.icEyeBlue} src={images.account.partner.icEyeBlue} alt="icEyeBlue" />
                    </a>
                  ) : (
                    <a href={item.attachment.link} target="_blank">
                      <img className={classes.icEyeBlue} src={images.account.partner.icEyeBlue} alt="icEyeBlue" />
                    </a>
                  )}
                  {checkImageLink(item.attachment.link) ? (
                    <a
                      onClick={() => handleOpenModal({ name: item.attachment.file, url: item.attachment.link })}
                      className={classes.viewAction}>
                      View
                    </a>
                  ) : (
                    <a href={item.attachment.link} target="_blank" className={classes.viewAction}>
                      View
                    </a>
                  )}

                  <a
                    onClick={() =>
                      handleOpenModalDownloadProgress({ url: item.attachment.link, name: item.attachment.file })
                    }>
                    <img
                      className={classes.icDownloadBlue}
                      src={images.account.partner.icDownloadBlue}
                      alt="icDownloadBlue"
                    />
                  </a>
                  <a
                    onClick={() =>
                      handleOpenModalDownloadProgress({ url: item.attachment.link, name: item.attachment.file })
                    }
                    className={classes.downloadAction}>
                    Download
                  </a>
                </Col>
              )}
            </Row>
            {description && <div className={cx(classes.itemDescription, classes.largeScreen)}>{description || ''}</div>}
          </div>
        );
      });
    },
    [selectedCampain, listDigitals, currentWidthScreen],
  );

  const renderListGroupChildren = useCallback(
    (listGroupChildren: any) => {
      return listGroupChildren?.map((item: any, index: number) => {
        return <>{renderListResourse(item.resources, item.title, item.description)}</>;
      });
    },
    [selectedCampain, listDigitals],
  );

  const renderContent = useMemo(() => {
    if (listDigitals?.length === 0) {
      return null;
    }
    const itemSelectedResources =
      listDigitals?.length >= Number(selectedCampain) ? listDigitals[Number(selectedCampain)] : null;

    return (
      <>
        {itemSelectedResources?.resources?.length ? renderListResourse(itemSelectedResources.resources) : null}
        {itemSelectedResources?.group_children?.length
          ? renderListGroupChildren(itemSelectedResources.group_children)
          : null}
      </>
    );
  }, [selectedCampain, listDigitals]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapHeader}>
        <div className={classes.header}>Campaign</div>
        <div className={classes.wrapSelect}>
          <Select
            inputId={'filter-status'}
            selectStyles={{
              control: {
                backgroundColor: 'transparent',
                cursor: 'pointer',
                '@media (max-width: 767px)': {
                  paddingLeft: 0,
                },
              },
              singleValue: {
                color: '#4CB3E4',
                fontSize: pxToRem(24),
                fontWeight: 'bold',
                '@media (max-width: 1199px)': {
                  fontSize: pxToRem(24),
                },
                '@media (max-width: 767px)': {
                  fontSize: pxToRem(22),
                },
              },
            }}
            value={selectedCampain}
            options={selectCampainOptions}
            onChange={(options: any) => {
              setSelectedCampain(options.value);
            }}
          />
        </div>
      </div>
      <div className={classes.wrapContent}>{loading ? renderLoading : renderContent}</div>
      <hr className={classes.customHr} />
      <div className={classes.itemDescription}>
        We’ve included multiple sizes and variations when appropriate. To preserve the aspect ratios and legibility of
        the copy, we do not recommend resizing the graphics.
      </div>

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
    </div>
  );
};

export default Print;
