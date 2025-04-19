/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-target-blank */
import cx from 'classnames';
import images from 'assets/images';
import React, { FC, Suspense, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getListTrainings } from 'store/partner/training/training.action';
import Button from '@ui/Buttons/Primary/Button';
import Textarea from '@ui/Textarea';
import CONFIG from 'config';
import {
  constWidgetContentFileDownload,
  getWidgetContentScript,
} from 'components/PartnerPortal/CostCalculator/constraint';
import { generateScriptRequest, GenerateScriptResponse } from 'api/partner/widget-content.api';
import { toastError } from 'helpers/utils.helper';
import { DataFile } from '@ui/Modal/ModalViewImage';
import classes from './widget-content.module.scss';

const ModalProgressUpload = React.lazy(() => import('@ui/Modal/ModalProgressUpload'));

const WidgetContent: FC = () => {
  const dispatch = useDispatch();
  const [scriptText, setScriptText] = useState('');
  const [isCopy, setIsCopy] = useState(false);
  const [dataModalDownloadProgress, setDataModalDownloadProgress] = useState(null);

  useEffect(() => {
    handleGetListTrainings();
  }, []);

  const handleGetListTrainings = useCallback(() => {
    dispatch(getListTrainings());
  }, [dispatch]);

  const handleCopyScript = () => {
    setIsCopy(true);
    navigator.clipboard.writeText(scriptText);
    setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  };

  const handleCloseModalDownloadProgress = () => {
    setDataModalDownloadProgress(null);
  };
  const handleOpenModalDownloadProgress = (data: DataFile) => {
    setDataModalDownloadProgress(data);
  };

  const renderItemDownload = (title: string, url: string) => {
    return (
      <div className={classes.wrapItem}>
        <div className={cx(classes.title, classes.size22)}>{title}</div>
        <div className={cx(classes.wrapAction, classes.size22)}>
          <a onClick={() => handleOpenModalDownloadProgress({ url, name: title })}>
            <img className={classes.icDownloadBlue} src={images.account.partner.icDownloadBlue} alt="icDownloadBlue" />
            <span>Download</span>
          </a>
        </div>
      </div>
    );
  };

  const handleGenerateScript = useCallback(async () => {
    try {
      const response: GenerateScriptResponse = await generateScriptRequest();
      if (response?.api_key) {
        setScriptText(getWidgetContentScript(response?.api_key));
      }
    } catch (error) {
      toastError(error);
    }
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.wrapHeader}>Website Widget</div>
      <div className={cx(classes.description, classes.spaceBottom34)}>
        As a benefit of the Bicycle Blue Book Trade in Partner Program, you receive access to a valuable Trade in
        Widget. It Is a software application which can easily be embedded into your current website so your customers
        can now see that your shop accepts trades and find the trade-In value of their used bicycle without leaving your
        site. There are two easy steps to get the widget up and running.{' '}
      </div>

      <div className={cx(classes.wrapStep, classes.size22)}>
        <span>Step 1</span>Generate Widget Script
      </div>

      <div className={cx(classes.description, classes.spaceBottom34)}>
        Firstly, generate a new widget script then copy it.
      </div>

      <div className={cx('d-flex', classes.spaceBottom34)}>
        <Button onClick={handleGenerateScript} className={cx(classes.customButton, classes.size22)}>
          Generate Script
        </Button>
        <a
          href={`${CONFIG.WIDGET_STAGING_URL}/demoWidget.html`}
          className={cx(classes.size22, classes.customButtonLink)}
          target="_blank">
          Demo pre populate
        </a>
      </div>

      <Textarea
        rows={10}
        className={classes.spaceBottom34}
        value={scriptText}
        onChange={(e) => setScriptText(e.target.value)}
      />

      <Button
        onClick={handleCopyScript}
        buttonType="outline"
        className={cx(classes.customButton, classes.spaceBottom48)}>
        {isCopy ? 'Copied' : 'Copy Script'}
      </Button>

      <div className={cx(classes.wrapStep, classes.size22)}>
        <span>Step 2</span>Embed to Site
      </div>

      <div className={cx(classes.description, classes.spaceBottom34)}>
        Whether you're going to be embedding the script or if you're passing It along to your IT team, you will want to
        download and follow the applicable Implementation Guide. If you have a WordPress site, please ensure you
        download the correct guide as the instructions are slightly different.
      </div>

      {renderItemDownload('General Guide', constWidgetContentFileDownload.GENERAL_GUIDE)}
      {renderItemDownload('Wordpress Guide', constWidgetContentFileDownload.WORDPRESS_GUIDE)}
      {renderItemDownload('SmartEtailing Guide', constWidgetContentFileDownload.SMARTETAILING_GUIDE)}

      <div className={cx(classes.description, classes.spaceBottom34, classes.spaceTop52)}>
        You can also promote the Trade in Program by embedding our YouTube video on your website.
      </div>

      {renderItemDownload('Consumer YouTube Script', constWidgetContentFileDownload.CONSUMER_YOUTUBE_SCRIPT)}

      <hr className={classes.customHr} />

      {renderItemDownload('Trade in Logo', constWidgetContentFileDownload.TRADE_IN_LOGO)}

      <div className={classes.description}>
        Ensuring that potential customers can find the Trade in Widget is critical to generating trades and new
        business. Please leverage our trade in logo along with appropriate copy on your homepage to link to your trade
        in page and widget.
      </div>

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

export default WidgetContent;
