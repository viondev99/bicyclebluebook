import Card from '@ui/Cards';
import React, { FC } from 'react';
import classes from './program-term.module.scss';

const ProgramTerms: FC = () => {
  return (
    <Card className={classes.wrapContainer}>
      <div className={classes.header}>Bicycle Blue Book Partner Program</div>
      <div className={classes.headerDescription}>Terms of Use</div>

      <div className={classes.wrapBody}>
        <div className={classes.title}>Method of Evaluation & Valuation</div>
        <div className={classes.description}>
          BicycleBlueBook.com provides the online scorecard and custom quotation tools for sole purpose of evaluation
          and valuation of used bikes exclusively part of this program. In order to comply with program terms and
          conditions, partners must correctly evaluate and determine value of trade-in using the online scorecard based
          specifically on the condition of the trade-in.
        </div>
      </div>

      <div className={classes.wrapBody}>
        <div className={classes.title}>Accuracy of Evaluation</div>
        <div className={classes.description}>
          Please refer to our scorecard for definitions of "Conditional Values." BicycleBlueBook.com provides these
          conditional values in order to provide the information needed to accurately evaluate trade-ins.
          BicyclelueBook.com reserves the right to take action if a trade-in partner has inaccurately evaluated a
          trade-in. BicycleBlueBook.com reimburses trade-in partner for actual value of trade based on our final
          evaluation. In the event a trade-in is inaccurately valued, the trade-in partner will have the choice to
          either, (1) Accept the BicycleBlueBook.com evaluation and associated reimbursement value or (2) Pay to have
          the trade-in shipped back to the trade-in partner. All cases of value discrepancy will be documented and
          available for trade-in partner appeal.
        </div>
      </div>

      <div className={classes.wrapBody}>
        <div className={classes.description}>
          In all cases of valuation discrepancy BicycleBlueBook.com will contact partner via email (provided at time of
          partner registration) and/or phone. If partner does not respond within 3 business days of contact,
          BicycleBlueBook.com reserves the right to reimburse based on BicycleBlueBook’s evaluation and corresponding
          finalized trade-in value.
        </div>
      </div>
    </Card>
  );
};

export default ProgramTerms;
