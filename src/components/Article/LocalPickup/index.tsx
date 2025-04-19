import React from 'react';
import Container from 'reactstrap/lib/Container';
import Router from 'next/router';
import images from '@images';
import cx from 'classnames';
import classes from './localpickup.module.scss';

function LocalPickup() {
  return (
    <div className={classes.localPickup}>
      <Container className={classes.sectionContainer}>
        <h2>Local Pickup from Private Sellers</h2>
        <ul className={classes.mb30}>
          <li>
            When you find a local item you like, tap the: "Send a message" button to chat with the seller about the
            item.
          </li>
          <li>Once you agree on a price, find a public place near the both of you to meet.</li>
          <li>When meeting in-person, make sure you’re satisfied with the item and go ahead and make your payment.</li>
        </ul>
        <p className={classes.mb30}>
          <span className={classes.textBlack}>Deal locally, face-to-face</span> — follow this one rule and avoid 99% of
          scam attempts.
        </p>

        <ul className={cx(classes.hasDot, classes.mb45)}>
          <li>Do not provide payment to anyone you have not met in person.</li>
          <li>Beware offers involving shipping - deal with locals you can meet in person.</li>
          <li>Never wire funds (e.g. Western Union) - anyone who asks you to is a scammer.</li>
          <li>Don't accept cashier/certified checks or money orders - banks cash fakes, then hold you responsible.</li>
          <li>Transactions are between users only, no third party provides a "guarantee".</li>
          <li>Never give out financial info (bank account, social security, paypal account, etc).</li>
        </ul>

        <h2 className={classes.mb45}>Recognizing Scams</h2>
        <p className={classes.mb30}>Most scams attempts involve one or more of the following:</p>
        <ul className={cx(classes.hasDot, classes.mb45)}>
          <li>Email or text from someone that is not local to your area.</li>
          <li>Vague initial inquiry, e.g. asking about "the item." Poor grammar/spelling.</li>
          <li>
            Western Union, Money Gram, cashier check, money order, Paypal, Zelle, shipping, escrow service, or a
            "guarantee."
          </li>
          <li>Inability or refusal to meet face-to-face to complete the transaction.</li>
        </ul>

        <h3 className={classes.mb30}>Examples of Scams</h3>
        <ul>
          <li className={cx(classes.textBlack, classes.mb30)}>
            <div className={classes.mb30}>
              Someone claims your transaction is guaranteed, that a buyer/seller is officially certified, OR that a
              third party of any kind will handle or provide protection for a payment:
            </div>
            <ul className={classes.hasDot}>
              <li>These claims are fraudulent, as transactions are between users only.</li>
              <li>
                The scammer will often send an official looking (but fake) email that appears to come from craigslist or
                another third party, offering a guarantee, certifying a seller, or pretending to handle payments.
              </li>
            </ul>
          </li>

          <li className={cx(classes.textBlack, classes.mb30)}>
            <div className={classes.mb30}>Distant person offers a genuine-looking (but fake) cashier's check:</div>
            <ul className={classes.hasDot}>
              <li>
                You receive an email or text (examples below) offering to buy your item, pay for your services in
                advance, or rent your apartment, sight unseen and without meeting you in person.
              </li>
              <li>
                A cashier's check is offered for your sale item as a deposit for an apartment or for your services.
              </li>
              <li>
                Value of cashier's check often far exceeds your item—scammer offers to "trust" you, and asks you to wire
                the balance via money transfer service.
              </li>
              <li>
                Banks will cash fake checks AND THEN HOLD YOU RESPONSIBLE WHEN THE CHECK FAILS TO CLEAR, sometimes
                including criminal prosecution.
              </li>
              <li>Scams often pretend to involve a 3rd party (shipping agent, business associate, etc.).</li>
            </ul>
          </li>

          <li className={cx(classes.textBlack, classes.mb30)}>
            <div className={classes.mb30}>Someone requests wire service payment via Western Union or MoneyGram:</div>
            <ul className={classes.hasDot}>
              <li>Deal often seems too good to be true, price is too low, or rent is below market, etc.</li>
              <li>Scam "bait" items include apartments, laptops, TVs, cell phones, tickets, other high value items.</li>
              <li>
                Scammer may (falsely) claim a confirmation code from you is needed before he can withdraw your money.
              </li>
              <li>Common countries currently include: Nigeria, Romania, UK, Netherlands—but could be anywhere.</li>
              <li>
                Rental may be local, but owner is "travelling" or "relocating" and needs you to wire money abroad.
              </li>
              <li>Scammer may pretend to be unable to speak by phone (scammers prefer to operate by text/email).</li>
            </ul>
          </li>

          <li className={cx(classes.textBlack, classes.mb30)}>
            <div className={classes.mb30}>
              Distant person offers to send you a cashier's check or money order and then have you wire money:
            </div>
            <ul className={classes.hasDot}>
              <li>This is ALWAYS a scam in our experience—the cashier's check is FAKE.</li>
              <li>Sometimes accompanies an offer of merchandise, sometimes not.</li>
              <li>Scammer often asks for your name, address, etc. for printing on the fake check.</li>
              <li>Deal often seems too good to be true.</li>
            </ul>
          </li>

          <li className={cx(classes.textBlack, classes.mb30)}>
            <div className={classes.mb30}>Distant seller suggests use of an online escrow service:</div>
            <ul className={classes.hasDot}>
              <li>Most online escrow sites are FRAUDULENT and operated by scammers.</li>
              <li>
                For more info, do a google search on "
                <a href="https://www.google.com/search?hl=en&q=fake+escrow">fake escrow</a>" or "
                <a href="https://www.google.com/search?hl=en&q=escrow+fraud">escrow fraud</a>".
              </li>
            </ul>
          </li>

          <li className={cx(classes.textBlack, classes.mb30)}>
            <div className={classes.mb30}>
              Distant seller asks for a partial payment upfront, after which they will ship goods:
            </div>
            <ul className={classes.hasDot}>
              <li>He says he trusts you with the partial payment.</li>
              <li>He may say he has already shipped the goods.</li>
              <li>Deal often sounds too good to be true.</li>
            </ul>
          </li>

          <li className={cx(classes.textBlack, classes.mb30)}>
            <div className={classes.mb30}>
              Foreign company offers you a job receiving payments from customers, then wiring funds:
            </div>
            <ul className={classes.hasDot}>
              <li>Foreign company may claim it is unable to receive payments from its customers directly.</li>
              <li>You are typically offered a percentage of payments received.</li>
              <li>This kind of "position" may be posted as a job, or offered to you via email.</li>
            </ul>
          </li>
        </ul>

        <div className={classes.divider} />
        <div className={classes.footerAction}>
          <div className={classes.buttonLeft} onClick={() => Router.push('/help')}>
            <img src={images.value_guide.ic_left_row} alt={'error'} />
            Back to Help Centre
          </div>
          <div className={classes.buttonRight} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={images.value_guide.ic_up_row} alt={'error'} />
            <div> Back to Top</div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default LocalPickup;
