import React, { useCallback, ReactElement, useState } from 'react';
import Container from 'reactstrap/lib/Container';
import Collapse from 'reactstrap/lib/Collapse';
import useScreenDetect from 'hooks/useScreenDetect';
import cx from 'classnames';
import images from 'assets/images';
import Button from '@ui/Buttons/Primary/Button';
import classes from './program-terms.module.scss';

interface Term {
  label: string;
  description: string | ReactElement;
}

const Terms: Term[] = [
  {
    label: 'Method of Evaluation & Valuation',
    description: (
      <>
        BicycleBlueBook.com provides the online scorecard and custom quotation tools for sole purpose of evaluation and
        valuation of used bikes exclusively part of this program. In order to comply with program terms and conditions,
        partners must correctly evaluate and determine value of trade-in using the online scorecard based specifically
        on the condition of the trade-in.
      </>
    ),
  },
  {
    label: 'Accuracy of Evaluation',
    description: (
      <>
        Please refer to our scorecard for definitions of "Conditional Values." BicycleBlueBook.com provides these
        conditional values in order to provide the information needed to accurately evaluate trade-ins.
        BicyclelueBook.com reserves the right to take action if a trade-in partner has inaccurately evaluated a
        trade-in. BicycleBlueBook.com reimburses trade-in partner for actual value of trade based on our final
        evaluation. In the event a trade-in is inaccurately valued, the trade-in partner will have the choice to either,
        (1) Accept the BicycleBlueBook.com evaluation and associated reimbursement value or (2) Pay to have the trade-in
        shipped back to the trade-in partner. All cases of value discrepancy will be documented and available for
        trade-in partner appeal.
        <div className={classes.separateContent}>
          In all cases of valuation discrepancy BicycleBlueBook.com will contact partner via email (provided at time of
          partner registration) and/or phone. If partner does not respond within 3 business days of contact,
          BicycleBlueBook.com reserves the right to reimburse based on BicycleBlueBook’s evaluation and corresponding
          finalized trade-in value.
        </div>
      </>
    ),
  },
  {
    label: 'Packing Requirements',
    description: (
      <>
        Trade-in partners are required to properly package and protect all bikes accepted through the program. If a bike
        is damaged due to improper handling by the carrier, a claim will be filed by Bicyclebluebook.com with respective
        carrier. If a trade-in is received with damage as a result of improper packaging, Bicyclebluebook.com reserves
        the right to adjust the valuation consistent with the new condition of the bike or refuse the trade-in. In all
        cases, the trade-in partner will have the right to (1) accept the revised valuation and associated reimbursement
        amount or (2) pay to have the bike returned. All cases of value discrepancy will be documented and available for
        trade-in partner appeal.
      </>
    ),
  },
  {
    label: 'Cleanliness',
    description: (
      <>
        <div>All trade-ins, independent of condition must be clean as defined by:</div>
        <ul className={cx(classes.groupLineInfo, classes.separateContent)}>
          <li>
            Frame – remove the wheels from the frame and wipe down/clean the entire frame and fork, paying special
            attention to the areas around the brakes, bottom bracket, and fork.
          </li>
          <li>
            Wheels/tires – wheels should be wiped down and cleaned of dirt, debris, and grease. Ensure tires and tubes
            are without punctures and hold the recommended tire pressure designated by the manufacturer.{' '}
          </li>
          <li>
            Drivetrain – front and rear derailleurs, chain, cassette, and crankset should be clean and free of build-up.
          </li>
        </ul>
      </>
    ),
  },
  {
    label: 'Processing Time',
    description: (
      <>
        In order for Bicyclebluebook.com trade-in partners to receive the quoted trade-in value, bicycles must be in
        transit within seven (7) business days of accepting the trade. Bicycles not in transit within seven (7) business
        days of accepting the trade are subject to a re-evaluation of the trade-in amount and / or additional penalty.
      </>
    ),
  },
  {
    label: 'Program Compliance',
    description: (
      <>
        As a retail partner, your use of the BicycleBlueBook.com website and valuation program, must comply with all
        applicable laws in the state, territory, or country in which you access and use the information, including
        without limitation, any secondhand dealer laws and import and export control laws and regulations of the United
        States and other countries.
        <br /> As a retail partner participating in the BicycleBlueBook.com Trade-In Program, you are required to comply
        with the following conditions:
        <ul className={cx(classes.groupLineInfo, 'mt-1')}>
          <li>
            You may not retain the trade-in item for any other purpose, including, but not limited to, reselling it for
            your own purposes.
          </li>
          <li>
            You may not use the BicycleBlueBook.com valuation guide for any other commercial use or purpose that is
            inconsistent with your Retail Partner agreement.
          </li>
        </ul>
        <div className="mt-1">
          Authorized Trade-in Partners are strictly prohibited from the direct or indirect transfer or resale of
          manufacturer inventory through the mobile scorecard. Including but not limited to, current model year, NOS
          (new old stock), and closeout inventory.
          <br /> Any party interested in using the trade-in scorecard, value guide or any other tools or assets of the
          program to enable a used bike program should contact support@bicyclebluebook.com for current licensing rates
          and an application. <br />
          Without limiting other remedies, BicycleBlueBook.com may limit, suspend, or terminate our service and user
          accounts, prohibit access to our website, remove hosted content, and take technical and legal steps to keep
          users off the Sites if they violate the terms of their Retail Partner Agreement or if we think that they are
          creating problems, possible legal liabilities, or acting inconsistently with the letter or spirit of our
          policies. We also reserve the right to cancel unconfirmed accounts.
        </div>
      </>
    ),
  },
  {
    label: 'Missing Images/Image Quality',
    description: (
      <>
        Images for every trade-in are required as part of Scorecard process. BicycleBlueBook.com reserves the right to
        apply penalty, of $25 per bike, in the form of automatic reimbursement reduction in cases where image capture is
        missing, incorrect, inadequate, or otherwise unacceptable.
      </>
    ),
  },
  {
    label: 'Acceptable Image Definitions',
    description: (
      <ul className={classes.groupLineInfo}>
        <li>Bicycle must be photographed on a plain, solid colored background</li>
        <li>Bicycle must be alone in the frame with no other item visible other than bicycle and background</li>
        <li>Image must be in focus</li>
        <li>
          Image subject (complete bike, seat, drivetrain etc) must be framed in image and well lighted so that all
          details are visible
        </li>
      </ul>
    ),
  },
  {
    label: 'Reimbursement',
    description: (
      <>
        Final trade-in valuation is determined based on cleanliness, valuation, evaluation accuracy, and condition at
        time of inspection at the distribution center. BicycleBlueBook.com reimburses Trade-in partners based on the
        final Trade-in valuation, less shipping charges. Reimbursement checks are sent via USPS 14 days after receipt
        and validation of Trade-in cleanliness and accuracy at our processing center.
      </>
    ),
  },
  {
    label: 'Exception Process',
    description: (
      <>
        Scorecard discrepancies are handled on a case-by-case basis, following inspection at the BicycleBlueBook.com
        distribution center. If a discrepancy is found, the owner or manager will be notified. To avoid scorecard
        discrepancies, please read and understand all the program terms and conditions.
      </>
    ),
  },
  {
    label: 'Qualifying Bikes',
    description: (
      <ul className={classes.groupLineInfo}>
        <li>Model year 2000 or newer </li>
        <li>Bicycle shop quality brand (no department store bicycles)</li>
        <li> Serial number must be intact, legible, and not tampered with </li>
        <li>Original manufacturer paint </li>
        <li>Bicycle must be in a safe and working condition, free of any structural damage</li>
        <li> Recumbents, tricycles, and tandems do not qualify</li>
      </ul>
    ),
  },
];

const ProgramTermsPage = () => {
  const [listCollapseOpen, setListCollapseOpen] = useState<number[]>([]);
  const screen = useScreenDetect();
  const handleCollapse = useCallback(
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
      <div className={classes.title}>Bicycle Blue Book Program</div>
      <h3 className={classes.subTitle}>Terms of Use</h3>
      {Terms.map((term: Term, index: number) => (
        <Button
          key={String(index)}
          buttonType="clear"
          className={classes.btnCollapse}
          onClick={() => handleCollapse(index)}>
          <div className={classes.wrapLabel}>
            <div className={classes.label}>{term.label}</div>
            <img
              src={checkCollapseIsOpen(index) ? images.common.icDropDown : images.common.icDropDownClose}
              alt="icon dropdown"
              className={classes.iconDropdown}
            />
          </div>
          <Collapse isOpen={!screen.isMediumScreen() || checkCollapseIsOpen(index)}>
            <div className={classes.description}>{term.description}</div>
          </Collapse>
        </Button>
      ))}
    </Container>
  );
};

export default ProgramTermsPage;
