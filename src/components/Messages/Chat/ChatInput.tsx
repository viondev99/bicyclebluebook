import React, { FC, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import trim from 'lodash/trim';
import { useDispatch, useSelector } from 'react-redux';
import images from 'assets/images';
import { maxFileSizeUpload } from 'helpers/common.helper';
import { toastError } from 'helpers/utils.helper';
import t from 'helpers/language';
import StoreState from 'model/store';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import Button from '@ui/Buttons/Primary/Button';
import { useRouter } from 'next/router';
import { CheckBlockUserPayload } from 'api/message.api';
import { handleCheckListUsersBlockedRequest } from 'store/partner/account/account.saga';
import { sendMessage } from '../../../store/message/message.action';
import classes from './chat.module.scss';

const ChatInput: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { selected, loading, storesInfo } = useSelector((store: StoreState) => ({
    selected: store.message.conversation.selected,
    loading: store.message.loading,
    storesInfo: store.info.storesInfo,
  }));
  const userId = useSelector(
    (store: StoreState) => store.authenticate.user?.storefront || store.authenticate.user?._id,
  );
  const storeBBBinfo = useMemo(() => {
    return selected?.members
      ?.map((i) => storesInfo?.find((it) => it.id === i))
      .find((item) => item?.is_bbb_store_created || item?.is_bbb_store);
  }, [selected, storesInfo]);

  const onlineStoreInfo = useMemo(() => {
    return selected?.members
      ?.map((i) => storesInfo?.find((it) => it.id === i))
      .find((item) => !item?.is_bbb_store_created && !item?.is_bbb_store);
  }, [selected, storesInfo]);

  const [file, setFile] = useState(null);
  const [src, setSrc] = useState<string | ArrayBuffer | null>('');
  const inputTextRef = useRef<HTMLDivElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const isAllStorefront = selected?.first_receiver_is_store && selected?.first_sender_is_store;
  const onSendMessage = useCallback(async () => {
    const findTargetSendMessage =
      selected?.members?.length > 0 ? selected?.members?.filter((it: string) => it !== userId) : null;
    let params: CheckBlockUserPayload;
    if (findTargetSendMessage?.length === 1) {
      params = {
        ids: [String(findTargetSendMessage[0])],
      };
    }
    if (isAllStorefront && storeBBBinfo && findTargetSendMessage?.length !== 1) {
      params = {
        ids: [onlineStoreInfo?.id],
      };
    }
    if (!isAllStorefront && selected?.first_receiver_is_store && findTargetSendMessage?.length !== 1) {
      params = {
        ids: [selected?.first_sender],
      };
    }
    if (!isAllStorefront && selected?.first_sender_is_store && findTargetSendMessage?.length !== 1) {
      params = {
        ids: [selected?.first_receiver],
      };
    }
    const isBlocked = await handleCheckListUsersBlockedRequest(params);
    if (isBlocked) {
      return toastError(t('myAccount.message.checkUsersBlockedAccess'));
    }
    if (trim(inputTextRef.current.innerText) || file) {
      const payload = {
        id: selected?.id,
        message: trim(inputTextRef.current.innerText),
        attachment: file,
      };
      dispatch(sendMessage(payload));
      setFile(null);
      inputTextRef.current.innerText = '';
      inputFileRef.current.value = '';
    }
  }, [selected, isAllStorefront, storeBBBinfo, dispatch, file, userId, onlineStoreInfo]);

  const onEnterKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSendMessage();
      }
    },
    [onSendMessage],
  );

  const onPaste = useCallback(() => {
    setTimeout(() => {
      inputTextRef.current.innerHTML = inputTextRef.current.innerText;
    }, 1);
  }, [inputTextRef]);

  const onDeleteFile = useCallback(() => {
    setFile(null);
    inputFileRef.current.value = '';
  }, [inputFileRef]);

  useEffect(() => {
    setFile(null);
    inputTextRef.current.innerText = '';
    inputFileRef.current.value = '';
  }, [router.query.conversation]);

  const onChangeFile = useCallback(
    (e) => {
      const fileTemp: File = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      if (fileTemp) {
        if (!maxFileSizeUpload(fileTemp.size)) {
          toastError(t('common.validate.fileSize'), t('seoTitle.invalid'));
          onDeleteFile();
        } else {
          setFile(fileTemp);
          if (String(fileTemp.type).includes('image')) {
            const reader = new FileReader();
            reader.onload = (event) => {
              setSrc(event.target.result);
            };
            reader.readAsDataURL(fileTemp);
          } else {
            setSrc('');
          }
        }
      }
    },
    [onDeleteFile],
  );

  return (
    <div className={classes.inputContainer}>
      {file && typeof src === 'string' && src && (
        <div className={classes.previewImage}>
          <img className={classes.imagePreview} src={src} alt={'preview'} />
          <Button buttonType="clear" onClick={onDeleteFile}>
            <img className={classes.iconButtonDelete} src={images.messages.icCloseCircleGrey} alt="icon-delete" />
          </Button>
        </div>
      )}
      <div className={classes.inputChat}>
        <div
          className={classes.input}
          ref={inputTextRef}
          contentEditable={true}
          data-placeholder={'Type a message...'}
          onKeyPress={onEnterKeyPress}
          onPaste={onPaste}
        />
        <ImageButton disabled={loading} className={classes.attachmentButton}>
          <label className={classes.labelButton} htmlFor={'attachmentChat'}>
            <input
              disabled={loading}
              id={'attachmentChat'}
              type={'file'}
              ref={inputFileRef}
              style={{ display: 'none' }}
              onChange={onChangeFile}
            />
            <img className={classes.iconButton} src={images.messages.icAttachment} alt={'attachment-icon'} />
          </label>
        </ImageButton>
        <ImageButton disabled={loading} className={classes.directButton} onClick={onSendMessage}>
          <img className={classes.iconButton} src={images.messages.icDirect} alt={'direct-icon'} />
        </ImageButton>
      </div>
      <div className={classes.inputFile}>
        {file && (typeof src !== 'string' || !src) && (
          <Button buttonType="clear" className={classes.nameFile} onClick={onDeleteFile}>
            {file.name}
            <img className={classes.iconButtonDelete} src={images.messages.icCloseCircleRed} alt="icon-delete" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
