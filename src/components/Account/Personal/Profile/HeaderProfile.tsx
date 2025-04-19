import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import UploadAvatar from '@ui/UploadAvatar/UploadAvatar';
import classes from './profile.module.scss';
import * as profileAction from '../../../../store/account/personal/profile/profile.action';

interface Props {
  avatar: string;
}

function HeaderProfile(props: Props) {
  const [fileImgAvatar, setFileImgAvatar] = useState(null);
  const dispatch = useDispatch();
  const handleChangeData = (): void => {
    // if (file) {
    //   props.handleUpdatePersonalProfile({ avatar: file });
    // }
    // setFileImgAvatar(file);
  };
  const handleUploadAvatar = (file: File) => {
    if (file) {
      dispatch(profileAction.updatePersonalProfile({ avatar: file }));
    }
  };
  const onChange = (file: File): void => {
    setFileImgAvatar(file);
  };

  return (
    <div>
      <h3 className={classes.headerTitle}>My Profile</h3>
      <UploadAvatar
        avatarUrl={props.avatar}
        src={fileImgAvatar}
        onChange={onChange}
        onChangeData={handleChangeData}
        handleUploadAvatar={handleUploadAvatar}
      />
    </div>
  );
}

export default HeaderProfile;
