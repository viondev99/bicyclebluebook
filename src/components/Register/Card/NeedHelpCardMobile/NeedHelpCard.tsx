import React, { FC, HtmlHTMLAttributes } from 'react';
import { useRouter } from 'next/router';
import cx from 'classnames';
import Link from 'next/link';
import classes from './NeedHelpCardMobile.module.scss';

const NeedHelpCardMobile: FC<HtmlHTMLAttributes<any>> = (props) => {
  const router = useRouter();
  const { className = '', ...other } = props;

  return (
    <div {...other} className={cx(classes.card, className)}>
      <h4>Need help? </h4>{' '}
      <Link
        scroll={false}
        href={{
          pathname: router.pathname,
          query: { contact: true, backOnClose: true, redirectUrl: router.asPath, ...router.query },
        }}
        as={'/contact'}>
        <a>Get in Touch</a>
      </Link>
    </div>
  );
};

export default NeedHelpCardMobile;
