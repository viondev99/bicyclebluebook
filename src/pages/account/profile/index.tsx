import React, { ComponentType, FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import StoreState from 'model/store';
import Card from '@ui/Cards/index';
import ModalControlPassword from 'components/Account/Personal/Profile/ModalControlPassword';
import HeaderProfile from 'components/Account/Personal/Profile/HeaderProfile';
import AccountInformation from 'components/Account/Personal/Profile/AccountInformation';
import FormAddress from 'components/Account/Personal/Profile/FormAddress';
import AccountPersonalLayout from 'layout/Account/Personal';
import * as profileAction from 'store/account/personal/profile/profile.action';
import { decodeToken } from 'helpers/common.helper';
import { ComponentStatic } from 'model/common';
import classes from 'components/Account/Personal/Profile/profile.module.scss';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const Profile: FC & ComponentStatic = () => {
  const [isOpenModal, openModal] = useState(null);
  const [userId, setUserId] = useState(null);
  const profilePersonal = useSelector((store: StoreState) => store.account.personal.profile.personalAccountInfo);
  const authenticate = useSelector((store: StoreState) => store.authenticate);
  const dispatch = useDispatch();
  useEffect(() => {
    if (authenticate) {
      const userInfo = decodeToken(authenticate.token);
      setUserId(userInfo._id);
      dispatch(profileAction.getProfileForPersonal({ id: userInfo.account }));
    }
  }, [authenticate, dispatch]);

  const handleOpenModal = (nameModel: string) => {
    openModal(nameModel);
  };
  const handleCloseModal = () => {
    openModal(null);
  };
  return (
    <AccountPersonalLayout titleMobile="Index">
      <>
        <Card className={classes.profileContainer}>
          <HeaderProfile avatar={profilePersonal?.avatar} />
          <AccountInformation handleOpenModal={handleOpenModal} personalAccount={profilePersonal} />
          <FormAddress personalAccount={profilePersonal} />
        </Card>
        <hr className={classes.lineSeparate} />
        <Card className={classes.profileContainer}>
          <ModalControlPassword
            handleOpenModal={handleOpenModal}
            isOpenModal={isOpenModal}
            handleCloseModal={handleCloseModal}
            userId={userId}
          />
        </Card>
      </>
    </AccountPersonalLayout>
  );
};

Profile.renderLayout = renderMainLayout;

export default withInjectAllSaga(
  withAuthenticate({ role: Roles.PERSONAL })(Profile as FC<ComponentType & ComponentStatic>),
);
