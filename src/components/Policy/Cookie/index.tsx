import React, { useCallback, ReactElement, useState } from 'react';
import Container from 'reactstrap/lib/Container';
import Collapse from 'reactstrap/lib/Collapse';
import Link from 'next/link';
import cx from 'classnames';
import images from 'assets/images';
import useDeviceDetect from 'hooks/useDeviceDetect';
import classes from './cookie.module.scss';

interface Policy {
  label: string;
  description: string | ReactElement;
}

const ListPolicies: Policy[] = [
  {
    label: 'Introduction',
    description: (
      <>
        <div>
          Bicycle Book, LLC (“we” or “us” or “our”) may use cookies, web beacons, tracking pixels, and other tracking
          technologies when you visit our website www.bicyclebluebook.com including any other media form, media channel,
          mobile website, or mobile application related or connected thereto (collectively, the “Site”) to help
          customize the Site and improve your experience.
        </div>
        <div className={classes.separateContent}>
          We reserve the right to make changes to this Cookie Policy at any time and for any reason. We will alert you
          about any changes by updating the “Last Updated” date of this Cookie Policy. Any changes or modifications will
          be effective immediately upon posting the updated Cookie Policy on the Site, and you waive the right to
          receive specific notice of each such change or modification.
        </div>
        <div className={classes.separateContent}>
          You are encouraged to periodically review this Cookie Policy to stay informed of updates. You will be deemed
          to have been made aware of, will be subject to, and will be deemed to have accepted the changes in any revised
          Cookie Policy by your continued use of the Site after the date such revised Cookie Policy is posted.
        </div>
      </>
    ),
  },
  {
    label: 'Use of Cookies',
    description: (
      <>
        A “cookie” is a string of information which assigns you a unique identifier that we store on your computer. Your
        browser then provides that unique identifier to use each time you submit a query to the Site. We use cookies on
        the Site to, among other things, keep track of services you have used, record registration information, record
        your user preferences, keep you logged into the Site, facilitate purchase procedures, and track the pages you
        visit. Cookies help us understand how the Site is being used and improve your user experience.
      </>
    ),
  },
  {
    label: 'Types of Cookies',
    description: (
      <>
        The following types of cookies may be used when you visit the Site:
        <div className={cx(classes.subTitle, classes.separateContent)}>Advertising Cookies</div>
        <div className={classes.separateContent}>
          Advertising cookies are placed on your computer by advertisers and ad servers in order to display
          advertisements that are most likely to be of interest to you. These cookies allow advertisers and ad servers
          to gather information about your visits to the Site and other websites, alternate the ads sent to a specific
          computer, and track how often an ad has been viewed and by whom. These cookies are linked to a computer and do
          not gather any personal information about you.
        </div>
        <div className={cx(classes.subTitle, classes.separateContent)}>Analytics Cookies</div>
        <div className={classes.separateContent}>
          Analytics cookies monitor how users reached the Site, and how they interact with and move around once on the
          Site. These cookies let us know what features on the Site are working the best and what features on the Site
          can be improved.
        </div>
        <div className={cx(classes.subTitle, classes.separateContent)}>Our Cookies</div>
        <div className={classes.separateContent}>
          Analytics cookies monitor how users reached the Site, and how they interact with and move around once on the
          Site. These cookies let us know what features on the Site are working the best and what features on the Site
          can be improved.
        </div>
        <div className={cx(classes.subTitle, classes.separateContent)}>Personalization Cookies</div>
        <div className={classes.separateContent}>
          Personalization cookies are used to recognize repeat visitors to the Site. We use these cookies to record your
          browsing history, the pages you have visited, and your settings and preferences each time you visit the Site.
        </div>
        <div className={cx(classes.subTitle, classes.separateContent)}>Security Cookies</div>
        <div className={classes.separateContent}>
          Security cookies help identify and prevent security risks. We use these cookies to authenticate users and
          protect user data from unauthorized parties.
        </div>
        <div className={cx(classes.subTitle, classes.separateContent)}>Site Management Cookies</div>
        <div className={classes.separateContent}>
          Site management cookies are used to maintain your identity or session on the Site so that you are not logged
          off unexpectedly, and any information you enter is retained from page to page. These cookies cannot be turned
          off individually, but you can disable all cookies in your browser.
        </div>
        <div className={cx(classes.subTitle, classes.separateContent)}>Third-Party Cookies</div>
        <div className={classes.separateContent}>
          Third-party cookies may be place on your computer when you visit the Site by companies that run certain
          services we offer. These cookies allow the third parties to gather and track certain information about you.
          These cookies can be manually disabled in your browser.
        </div>
      </>
    ),
  },
  {
    label: 'Control of Cookies',
    description: (
      <>
        <div className={classes.separateContent}>
          Most browsers are set to accept cookies by default. However, you can remove or reject cookies in your
          browser’s settings. Please be aware that such action could affect the availability and functionality of the
          Site.
        </div>
        <div className={classes.separateContent}>
          For more information on how to control cookies, check your browser or device’s settings for how you can
          control or reject cookies, or visit the following links:
        </div>
        <div className={classes.separateContent}>
          For more information on how to control cookies, check your browser or device’s settings for how you can
          control or reject cookies, or visit the following links:
        </div>
        <div className={classes.separateContent}>
          <p>
            <Link href="https://support.apple.com/en-vn/guide/safari/sfri11471/mac">
              <a target="_blank" className={classes.customLink}>
                Apple Safari
              </a>
            </Link>
          </p>
          <p>
            <Link href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=en">
              <a target="_blank" className={classes.customLink}>
                Google Chrome
              </a>
            </Link>
          </p>
          <p>
            <Link href="https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy">
              <a target="_blank" className={classes.customLink}>
                Microsoft Edge
              </a>
            </Link>
          </p>
          <p>
            <Link href="https://support.microsoft.com/en-gb/help/17442/windows-internet-explorer-delete-manage-cookies">
              <a target="_blank" className={classes.customLink}>
                Microsoft Internet Explorer
              </a>
            </Link>
          </p>
          <p>
            <Link href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences">
              <a target="_blank" className={classes.customLink}>
                Mozilla Firefox
              </a>
            </Link>
          </p>

          <p>
            <Link href="http://www.opera.com/help/tutorials/security/cookies/">
              <a target="_blank" className={classes.customLink}>
                Opera
              </a>
            </Link>
          </p>
          <p>
            <Link href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DAndroid&hl=en&oco=1">
              <a target="_blank" className={classes.customLink}>
                Android (Chrome)
              </a>
            </Link>
          </p>
          <p>
            <Link href="https://help.blackberry.com/en/blackberry-classic/10.3.1/help/mwa1334238823957.html">
              <a target="_blank" className={classes.customLink}>
                Blackberry
              </a>
            </Link>
          </p>
          <p>
            <Link href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DiOS&hl=en&oco=1">
              <a target="_blank" className={classes.customLink}>
                Iphone or Ipad (Chrome)
              </a>
            </Link>
          </p>
          <p>
            <Link href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DAndroid&hl=en&oco=1">
              <a target="_blank" className={classes.customLink}>
                Iphone or Ipad (Safari)
              </a>
            </Link>
          </p>
        </div>
        <div className={classes.separateContent}>
          In addition, you may opt-out of some third-party cookies through the{' '}
          <Link href="https://optout.networkadvertising.org/?c=1#!%2F">
            <a target="_blank" className={classes.customLink}>
              Network Advertising Initiative’s Opt-Out Tool.
            </a>
          </Link>
        </div>
      </>
    ),
  },
  {
    label: 'Other Tracking Technologies',
    description: (
      <>
        In addition to cookies, we may use web beacons, pixel tags, and other tracking technologies on the Site to help
        customize the Site and improve your experience. A “web beacon” or “pixel tag” is tiny object or image embedded
        in a web page or email. They are used to track the number of users who have visited particular pages and viewed
        emails, and acquire other statistical data. They collect only a limited set of data, such as a cookie number,
        time and date of page or email view, and a description of the page or email on which they reside. Web beacons
        and pixel tags cannot be declined. However, you can limit their use by controlling the cookies that interact
        with them.
      </>
    ),
  },
  {
    label: 'Privacy Policy',
    description: (
      <>
        For more information about how we use information collected by cookies and other tracking technologies, please
        refer to our Privacy Policy which is posted on the Site. This Cookie Policy is part of and is incorporated into
        our
        <Link href="/privacy-policy/">
          <a className={classes.customLink}> Privacy Policy</a>
        </Link>
        . By using the Site, you agree to be bound by this Cookie Policy and our Privacy Policy.
      </>
    ),
  },
];

const PrivacyPolicyPage = () => {
  const [listCollapseOpen, setListCollapseOpen] = useState<number[]>([]);
  const isMobileLg = useDeviceDetect('mobile-lg');
  const handleCollapseTerm = useCallback(
    (key: number) => {
      const existKey = listCollapseOpen.find((item: number) => item === key) >= 0;
      if (existKey) {
        const newListCollapse: number[] = listCollapseOpen.filter((item) => item !== key);
        setListCollapseOpen(newListCollapse);
        return;
      }
      setListCollapseOpen([...listCollapseOpen, key]);
    },
    [listCollapseOpen],
  );
  const checkCollapseIsOpen = useCallback(
    (key: number) => {
      const existKey = listCollapseOpen.find((item: number) => item === key);
      if (existKey >= 0) {
        return true;
      }
      return false;
    },
    [listCollapseOpen],
  );
  return (
    <Container className={classes.container}>
      <div className={classes.intro}>Last updated July 1, 2020</div>
      <div className={classes.title}>Cookie Policy</div>
      {ListPolicies.map((term: Policy, index: number) => (
        <div key={String(index)} className={classes.btnCollapse}>
          <div className={classes.wrapLabel} onClick={() => handleCollapseTerm(index)}>
            <div className={classes.label}>{term.label}</div>
            <img
              src={images.common.icDropDown}
              alt="icon dropdown"
              className={cx(classes.iconDropdown, {
                [classes.isOpen]: !checkCollapseIsOpen(index),
              })}
            />
          </div>
          <Collapse isOpen={!isMobileLg || checkCollapseIsOpen(index)}>
            <div className={classes.description}>{term.description}</div>
          </Collapse>
        </div>
      ))}
    </Container>
  );
};

export default PrivacyPolicyPage;
