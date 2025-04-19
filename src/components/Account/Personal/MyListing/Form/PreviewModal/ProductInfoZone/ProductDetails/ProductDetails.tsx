import React, { FC, useState, useMemo, useCallback } from 'react';
import upperFirst from 'lodash/upperFirst';
import cx from 'classnames';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import iconInfo from 'assets/img/marketplace/ic_info.svg';
import { HTMLTagOnString, normalizeServerConstant } from 'helpers/string.helper';
import Button from '@ui/Buttons/Primary/Button';
import ConditionModal from '@ui/Condition/ConditionModal';
import FrameSizeModal from '@ui/FrameSize/FrameSizeModal';
import classes from 'components/Marketplace/Detail/ProductInfoZone/ProductDetails/product-details.module.scss';
import StoreState from 'model/store';
import { useSelector } from 'react-redux';
import { pxToRem } from 'helpers/common.helper';
import { safelySetHtml } from '../../../../../../../../helpers/html.helper';

interface DetailRow {
  label: string;
  value: string;
  note?: boolean;
}
interface formDataRow {
  label: string;
  value: string;
  note?: boolean;
}

interface Props {
  formData: FormValue;
  isAccessories?: boolean;
}

const ProductFormData: FC<Props> = ({ formData, isAccessories }) => {
  const commonComponents = useSelector((store: StoreState) => store.common.components);

  const typeBikeName = useMemo(() => {
    return commonComponents?.type?.find((item) => String(item.id) === String(formData.selectedType))?.name;
  }, [commonComponents, formData.selectedType]);

  const [openModal, setOpenModal] = useState('');
  const details = useMemo(() => {
    return [
      { label: 'Brand', value: formData?.brand || '-' },
      { label: 'Model', value: formData?.model || '-' },
      { label: 'Year', value: formData?.year || '-' },
      { label: 'Frame Size', value: JSON.parse(formData?.frameSize)?.value || 'N/A', note: true },
      { label: 'Suspension', value: formData?.suspensions || '-' },
      {
        label: 'Frame Material',
        value: JSON.parse(formData?.frameMaterial)?.value || '-',
      },
      { label: 'Brake Type', value: JSON.parse(formData?.brakeType)?.value || '-' },
      { label: 'Wheel Size', value: JSON.parse(formData?.wheelSizes)?.value || '-' },
      { label: 'Inventory ID', value: '-' }, // -- none --
      { label: 'Serial Number', value: formData?.serialNumber || '-' },
      { label: 'Bottom Bracket', value: '-' }, // -- none --
      { label: 'Gender', value: JSON.parse(formData?.gender)?.value || '-' },
      { label: 'Location', value: '-' }, // -- none --
      { label: 'Type', value: typeBikeName || '-' },
      { label: 'Colors', value: '-' }, // -- none --
      {
        label: 'Condition',
        value: upperFirst(normalizeServerConstant(formData?.selectedCondition).toLowerCase()) || '-',
        note: true,
      },
    ];
  }, [formData, typeBikeName]);
  const onOpenModal = useCallback((modal: string) => {
    setOpenModal(modal);
  }, []);

  const onCloseModal = useCallback(() => {
    setOpenModal('');
  }, []);

  const renderDescriptions = useMemo(() => {
    const checkString = HTMLTagOnString;
    const checkStringInDescriptions = RegExp(checkString).test(formData?.description);
    if (checkStringInDescriptions) {
      return (
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: safelySetHtml(formData?.description),
          }}
        />
      );
    }
    return <pre className={classes.customDescription}>{formData?.description}</pre>;
  }, [formData]);

  const renderModalInfo = useCallback(
    (modal: string) => {
      switch (modal) {
        case 'Frame Size':
          return <FrameSizeModal isOpen={openModal === 'Frame Size'} onClose={onCloseModal} />;

        case 'Condition':
          return <ConditionModal isOpen={openModal === 'Condition'} onClose={onCloseModal} showLikeNewCondition />;

        default:
          return null;
      }
    },
    [openModal, onCloseModal],
  );

  return (
    <>
      <section
        className={'my-5'}
        style={{
          fontFamily: 'DM Sans',
          fontSize: pxToRem(22),
          wordBreak: 'break-word',
          fontWeight: 300,
          color: '#6e7785',
        }}>
        {renderDescriptions}
        <div>
          Sales price of bike is based on the condition described and accounts for any repairs or replacement parts
          needed to be sourced by the buyer.
        </div>
      </section>
      <section className={'my-5'}>
        {!isAccessories &&
          details.map((item: DetailRow, index: number) => (
            <div
              key={item.label}
              className={cx(classes.detail, {
                [classes.transparent]: index % 2 === 0,
                [classes.white]: index % 2 !== 0,
              })}>
              <div className={classes.label}>{item.label}</div>
              {item.note ? (
                <Button buttonType="transparent" className={classes.buttonInfo} onClick={() => onOpenModal(item.label)}>
                  {item.value}
                  <img className={classes.iconInfo} src={iconInfo} alt="icon-info" />
                  {renderModalInfo(item.label)}
                </Button>
              ) : (
                <div className={classes.value}>{item.value}</div>
              )}
            </div>
          ))}
      </section>
    </>
  );
};

export default ProductFormData;
