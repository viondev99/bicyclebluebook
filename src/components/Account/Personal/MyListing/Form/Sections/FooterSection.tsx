import React, { FC } from 'react';
import FormikCheckbox from 'components/Formik/CheckBox/FormikCheckbox';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import Button from '@ui/Buttons/Primary/Button';
import classes from './form.module.scss';

interface Props {
  loading?: boolean;
  isStorefront?: boolean;
  showPreviewModal: () => void;
  saveAsDraft?: () => void;
  formValue: FormValue;
  isEdit?: boolean;
}

const FooterSection: FC<Props> = ({ loading, showPreviewModal, saveAsDraft, formValue, isStorefront, isEdit }) => {
  return (
    <div>
      {isStorefront && (
        <FormikCheckbox
          name={'isAcceptTerms'}
          label={
            <span>
              I understand the following fees will be assessed upon the sale of this item: Selling Fees: 5%
              BicycleBlueBook.com final value fee, and 2.9% + $0.30 Stripe per transaction fee.
            </span>
          }
        />
      )}
      <div className={`${classes.wrapFooterBtn} ${!isStorefront && classes.noMarginTopFooterBtn}`}>
        <Button buttonType="outline" onClick={showPreviewModal}>
          Preview
        </Button>
        <Button
          className={'ml-4'}
          type={'submit'}
          disabled={(!formValue?.isAcceptTerms && isStorefront) || loading}
          isLoading={loading}>
          {isEdit ? 'Save Changes' : 'Publish'}
        </Button>
      </div>
      {saveAsDraft && (
        <Button disabled={loading} buttonType="clear" className={'mt-4'} onClick={saveAsDraft}>
          Save as draft
        </Button>
      )}
    </div>
  );
};

export default FooterSection;
