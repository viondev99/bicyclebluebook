import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import StoreState from 'model/store';
import { updateStorefrontDetail } from 'api/store-front/account.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import { getStorefrontDetailSucceeded } from 'store/store-front/account/account.action';
import classes from './shop-branding-section.module.scss';
import UploadLogo from './UploadLogo';
import UploadCover from './UploadCover';

const ShopBrandingSection: React.FC = () => {
  const dispatch = useDispatch();
  const { detail } = useSelector((store: StoreState) => ({
    detail: store.storeFront.account.detail,
  }));
  const [logo, setLogo] = useState(null);
  const [cover, setCover] = useState(null);

  const handleChangeLogo = useCallback((file: File): void => {
    setLogo(file);
  }, []);

  const handleUploadLogo = useCallback(
    (file: File) => {
      if (detail?.id && file) {
        const form = new FormData();
        form.append('logo', file);
        updateStorefrontDetail(detail.id, form)
          .then((response) => {
            dispatch(getStorefrontDetailSucceeded({ logo: response.logo }));
            toastSuccess(t('storeFront.account.updateAccount'), t('seoTitle.success'));
          })
          .catch((error) => {
            toastError(error);
          });
      }
    },
    [detail, dispatch],
  );

  const handleChangeCover = useCallback((file: File): void => {
    setCover(file);
  }, []);

  const handleUploadCover = useCallback(
    (file: File) => {
      if (detail?.id && file) {
        const form = new FormData();
        form.append('gallery', file);
        updateStorefrontDetail(detail.id, form)
          .then((response) => {
            dispatch(getStorefrontDetailSucceeded({ gallery: response.gallery }));
            toastSuccess(t('storeFront.account.updateAccount'), t('seoTitle.success'));
          })
          .catch((error) => {
            toastError(error);
          });
      }
    },
    [detail, dispatch],
  );

  return (
    <div className={classes.storefrontInfo}>
      <div className={classes.headerForm}>
        <div className={classes.subTitle}>Shop Branding</div>
      </div>
      <Row className={classes.wrapperInput}>
        <Col xs={12} sm={3}>
          <div className={classes.label}>Shop Logo</div>
        </Col>
        <Col xs={12} sm={9}>
          <UploadLogo
            logoUrl={logo || detail?.logo || ''}
            src={logo}
            onChange={handleChangeLogo}
            onChangeData={() => {}}
            handleUploadLogo={handleUploadLogo}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ShopBrandingSection;
