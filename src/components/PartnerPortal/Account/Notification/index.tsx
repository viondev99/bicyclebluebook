import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { getNotificationSetting, getPartnerLocationDetail } from 'store/partner/account/account.action';
import Card from '@ui/Cards';
import { constTradeInAccount } from 'helpers/constraint.helper';
import Switch from '@ui/Switch/Switch';
import {
  emailValidate,
  isProduction,
  isRolePartnerInstantPayout,
  isStaging,
  TREK_PARTNER_PARENT_ID,
} from 'helpers/utilities.helper';
import get from 'lodash/get';
import uniq from 'lodash/uniq';
import {
  MailGroup,
  ItemPartnerMailsConfig,
  UpdateNotificationSettingParams,
} from 'model/store/partner/trade-in-scorecard-reports';
import Button from '@ui/Buttons/Primary/Button';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import cx from 'classnames';
import { updateNotificationSettingRequest } from 'api/partner/account.api';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import UserSkeleton from './UserSkeleton';
import classes from './notification.module.scss';

const Notification: FC = () => {
  const dispatch = useDispatch();
  const dataNotificationSetting = useSelector((store: StoreState) => store.partner.account.dataNotificationSetting);

  const loading = useSelector((store: StoreState) => store.partner.account.loading);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const detailPartnerLocation = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);

  const [formSetting, setFormSetting] = useState([]);
  const [edit, setEdit] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const isInstantPayout =
    get(detailPartnerLocation, 'is_instant_payout', false) && isRolePartnerInstantPayout(userInfo?.role);

  useEffect(() => {
    handleGetNotificationSetting();
    handleGetPartnerLocationDetail();
  }, []);

  useEffect(() => {
    if (dataNotificationSetting?.mail_groups?.length) {
      const newFormSetting = get(dataNotificationSetting, 'mail_groups', [])
        .filter((item: MailGroup) => item.group !== 'po')
        .map((item: MailGroup) => ({
          ...item,
          partner_mails_config: get(item, 'partner_mails_config', [])
            .filter(
              (i: ItemPartnerMailsConfig) =>
                i.template_key !== 'inventory-non-compliant' && i.template_key !== 'inventory-at-warehouse',
            )
            .map((i: ItemPartnerMailsConfig) => ({
              ...i,
              error: '',
            })),
        }));
      setFormSetting(newFormSetting);
    }
  }, [dataNotificationSetting]);

  const handleGetNotificationSetting = useCallback(() => {
    dispatch(getNotificationSetting());
  }, [dispatch]);

  const handleGetPartnerLocationDetail = useCallback(() => {
    if (userInfo?.partner) {
      dispatch(getPartnerLocationDetail(userInfo?.partner));
    }
  }, [dispatch, userInfo]);

  const renderGroupTitle = (group: string) => {
    switch (group) {
      case constTradeInAccount.NOTIFICATION.scorecard.value:
        return constTradeInAccount.NOTIFICATION.scorecard.label;

      case constTradeInAccount.NOTIFICATION.widget.value:
        return constTradeInAccount.NOTIFICATION.widget.label;

      case constTradeInAccount.NOTIFICATION.po.value:
        return constTradeInAccount.NOTIFICATION.po.label;

      default:
        return '';
    }
  };

  const handleChangeCheckbox = (indexGroup: number, indexSetting: number) => {
    if (!edit) {
      return;
    }
    const form = [...formSetting];
    form[indexGroup].partner_mails_config[indexSetting] = {
      ...form[indexGroup].partner_mails_config[indexSetting],
      status: form[indexGroup].partner_mails_config[indexSetting].status === 'active' ? 'inactive' : 'active',
      error: '',
    };
    setFormSetting(form);
  };

  const handleInputKeyEnter = (e: React.KeyboardEvent, indexGroup: number, indexSetting: number) => {
    if (e.key === 'Enter') {
      const form = [...formSetting];
      const inputValue = form[indexGroup].partner_mails_config[indexSetting]?.inputValue?.trim() || '';

      if (inputValue !== '') {
        if (!emailValidate(inputValue)) {
          form[indexGroup].partner_mails_config[indexSetting] = {
            ...form[indexGroup].partner_mails_config[indexSetting],
            error: 'Email invalid.',
          };
          setFormSetting(form);
          return;
        }

        //else
        form[indexGroup].partner_mails_config[indexSetting] = {
          ...form[indexGroup].partner_mails_config[indexSetting],
          mails_to: [...form[indexGroup].partner_mails_config[indexSetting].mails_to, ...[inputValue]],
          error: '',
          inputValue: '',
        };
        setFormSetting(form);
      }
    }
  };

  const handleDeleteEmail = (email: string, indexGroup: number, indexSetting: number) => {
    const form = [...formSetting];

    if (!edit) {
      return;
    }

    form[indexGroup].partner_mails_config[indexSetting] = {
      ...form[indexGroup].partner_mails_config[indexSetting],
      mails_to: form[indexGroup].partner_mails_config[indexSetting].mails_to.filter((it: string) => it !== email),
    };
    setFormSetting(form);
  };

  const handleChangeInput = (value: string, indexGroup: number, indexSetting: number) => {
    const form = [...formSetting];
    form[indexGroup].partner_mails_config[indexSetting] = {
      ...form[indexGroup].partner_mails_config[indexSetting],
      inputValue: value,
      error: '',
    };
    setFormSetting(form);
  };

  const handleValidateFormSetting = () => {
    let checkError = false;
    let formData = [...formSetting];
    formData.forEach((item, index) => {
      item.partner_mails_config.forEach((it: any, idx: any) => {
        //if exist input value
        if (it.inputValue && it?.inputValue?.trim() !== '') {
          if (!emailValidate(it?.inputValue?.trim())) {
            formData[index].partner_mails_config[idx] = {
              ...formData[index].partner_mails_config[idx],
              error: 'Email invalid.',
            };
            checkError = true;
          } else {
            formData[index].partner_mails_config[idx] = {
              ...formData[index].partner_mails_config[idx],
              mails_to: [...formData[index].partner_mails_config[idx].mails_to, ...[it?.inputValue?.trim()]],
              inputValue: '',
              error: '',
            };
          }
        } else {
          if (it.status === 'active' && it.mails_to.length === 0) {
            formData[index].partner_mails_config[idx] = {
              ...formData[index].partner_mails_config[idx],
              error: 'This field is required.',
            };
            checkError = true;
          }
        }
      });
    });
    setFormSetting(formData);
    return checkError;
  };

  const handleSubmit = async () => {
    try {
      let payload: UpdateNotificationSettingParams[] = [];
      const error = await handleValidateFormSetting();
      if (error) {
        return;
      }

      formSetting.forEach((item) => {
        get(item, 'partner_mails_config', []).forEach((i: any) => {
          const mails =
            get(i, 'mails_to', []).length > 0
              ? i.mail
                ? [...i.mails_to, i.mail]
                : i.mails_to
              : i.mail
              ? [i.mail]
              : [];
          payload = [
            ...payload,
            {
              template_key: i.template_key,
              status: get(i, 'status', 'inactive'),
              mails_to: uniq(mails),
            },
          ];
        });
      });
      if (payload.length > 0) {
        setLoadingAction(true);
        await updateNotificationSettingRequest(payload);
        toastSuccess('Save notification setting successfully.');
        setEdit(false);
        setLoadingAction(false);
      }
    } catch (error) {
      toastError(error);
      setLoadingAction(false);
    }
  };

  const renderRowContent = useCallback(
    (item: ItemPartnerMailsConfig, index: number) => {
      return item?.partner_mails_config?.length
        ? item.partner_mails_config.map((it: ItemPartnerMailsConfig, n: number) => {
            if (it.template_key === 'payout-partner') {
              if (!isInstantPayout) {
                return null;
              }
            }
            if (it.template_key === 'trek-dots-scorecard') {
              if (
                detailPartnerLocation?.partner_parent?._id !== TREK_PARTNER_PARENT_ID &&
                userInfo?._id !== TREK_PARTNER_PARENT_ID &&
                detailPartnerLocation?._id !== TREK_PARTNER_PARENT_ID
              ) {
                return null;
              }
              if (userInfo?.role !== 'user_administrator') {
                return null;
              }
            }
            return (
              <div className={classes.wrapRow} key={it.template_key}>
                <div className={cx(classes.wrapSwitch, !edit && classes.pointerNotAllowed)}>
                  <Row>
                    <Col>
                      <label>{it?.title || ''}</label>
                    </Col>
                    <Col className={'d-flex justify-content-end'}>
                      {' '}
                      <Switch checked={it.status === 'active'} onChange={() => handleChangeCheckbox(index, n)} />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <div className={classes.wrapInputContainer}>
                        <div
                          className={classes.wrapInput}
                          style={{
                            background: edit && '#eee',
                            padding: edit && '10px 12px',
                            marginTop: edit && '16px',
                          }}>
                          {Array.isArray(it?.mails_to) && it?.mails_to?.length
                            ? it.mails_to.map((mail: string) => (
                                <div className={classes.wrapItem}>
                                  {mail}
                                  {edit && (
                                    <div
                                      onClick={() => handleDeleteEmail(mail, index, n)}
                                      className={classes.textClose}>
                                      ×
                                    </div>
                                  )}
                                </div>
                              ))
                            : null}

                          {edit && (
                            <input
                              className={classes.customInput}
                              disabled={!edit}
                              name="custom-quote-reviewed"
                              type="email"
                              placeholder={it?.mails_to?.length === 0 ? 'Email received notification' : ''}
                              value={it?.inputValue || ''}
                              onChange={(e) => handleChangeInput(e.target.value, index, n)}
                              onKeyPress={(e) => handleInputKeyEnter(e, index, n)}
                            />
                          )}
                        </div>
                        {it.error && edit && <p className={classes.textError}>{it.error}</p>}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            );
          })
        : null;
    },
    [formSetting, edit],
  );

  const renderRow = useMemo(() => {
    return formSetting?.length
      ? formSetting.map((item: ItemPartnerMailsConfig, index: number) => {
          return (
            <React.Fragment key={item.group}>
              <div className={classes.titleResponsize}>{renderGroupTitle(item.group)}</div>
              <div className={classes.wrapContent}>{renderRowContent(item, index)}</div>
            </React.Fragment>
          );
        })
      : null;
  }, [formSetting, edit]);

  const renderLoading = useMemo(() => {
    return <UserSkeleton />;
  }, [loading]);

  return (
    <Card className={classes.wrapNotification}>
      {loading ? renderLoading : renderRow}
      {!loading && (
        <div className={classes.wrapBottom}>
          {edit ? (
            <>
              <Button
                disabled={loadingAction}
                onClick={handleSubmit}
                isLoading={loadingAction}
                className={cx('mr-4', classes.btnSize)}>
                SAVE
              </Button>
              <Button
                disabled={loadingAction}
                onClick={() => setEdit(!edit)}
                buttonType="outline"
                className={classes.btnSize}>
                CANCEL
              </Button>
            </>
          ) : (
            <Button disabled={loadingAction} onClick={() => setEdit(!edit)} className={classes.btnSize}>
              EDIT
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default Notification;
