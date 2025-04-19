import React, { FC, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import Card from '@ui/Cards';
import Radio from '@ui/Radio';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import Dropdown from '@ui/Dropdown/Dropdown';
import icMore from 'assets/img/account/personal/ic_more.svg';
import classes from './shipping-item.module.scss';
import ModelConfirmDelete from './ModalConfirmDelete';
import ModalEditShipping from './ModalEditShipping';
import StoreState from '../../../../model/store';

interface ShippingForm {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phoneNumber: string;
  apartment?: string;
}

interface Props {
  checked: boolean;
  name: string;
  address: ShippingForm;
  onSelect: () => void;
  onRemove: () => void;
  onEdit: (info: ShippingForm) => void;
  show?: boolean;
  setShow?: (show: boolean) => void;
}

const ShippingItem: FC<Props> = ({ name, checked, address, onSelect, onRemove, onEdit, show, setShow }) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  const editSuccess = useSelector((state: StoreState) => state.checkout.shipping.editSuccess);
  const editing = useSelector((state: StoreState) => state.checkout.shipping.editing);

  useEffect(() => {
    if (editSuccess) {
      setShowModalEdit(false);
    }
  }, [editSuccess]);

  return (
    <Card className={classes.shippingAddressCard}>
      <ModelConfirmDelete
        open={showModal}
        onClose={() => setShowModal(false)}
        onDelete={() => {
          onRemove();
          setShowModal(false);
        }}
      />
      <ModalEditShipping
        open={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        onSave={(newShipping) => {
          onEdit(newShipping);
        }}
        show={show}
        setShow={setShow}
        disabled={editing}
        address={address}
      />
      <div className={'d-flex'}>
        <Radio checked={checked} onClick={onSelect} />
        <div>
          <p className={classes.name}>{name}</p>
          <p className={classes.address}>
            {address?.apartment}
            {address?.apartment && ','} {address.address}, {address.city}, {address.state}, {address.zip}
          </p>
          <p className={classes.address}>{address.phoneNumber}</p>
        </div>
      </div>
      <Dropdown
        className={classes.dropdownContainer}
        style={{ position: 'relative' }}
        renderToggle={({ toggle }) => (
          <ImageButton className={'d-none d-sm-inline-block'} onClick={toggle}>
            <img src={icMore} alt="profile" />
          </ImageButton>
        )}
        renderMenu={({ hide }) => (
          <MenuDropdown shadow={true} style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }} onClose={hide}>
            <MenuDropdown.Item onClick={() => setShowModalEdit(true)}>Edit Address</MenuDropdown.Item>
            <MenuDropdown.Item className={'color-danger'} onClick={() => setShowModal(true)}>
              Remove Address
            </MenuDropdown.Item>
          </MenuDropdown>
        )}
      />
    </Card>
  );
};

export default React.memo(ShippingItem, (prev, props) => {
  const { address: prevAddress, ...otherPrev } = prev;
  const { address, ...otherProps } = props;
  return shallowEqual(prevAddress, address) && shallowEqual(otherPrev, otherProps);
});
