import React, { useCallback, ReactElement, useState } from 'react';
import Collapse from 'reactstrap/lib/Collapse';
import images from 'assets/images';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import classes from './terms.module.scss';

interface Term {
  label: string;
  description: string | ReactElement;
}

const ListRules: Term[] = [
  {
    label: 'Definitions',
    description: (
      <div>
        <div className={classes.subLabel}>1.1. “Authorized Platform” </div>
        <div className={classes.description}>
          Means the computer or operating system, or both, on which Licensee is authorized to use the Software pursuant
          to this Agreement. Licensee is authorized to use the Software on its internal website.
        </div>
        <div className={classes.subLabel}>1.2. “Authorized Site”</div>
        <div className={classes.description}>Means a location at which Licensee is authorized to use the Software.</div>
        <div className={classes.subLabel}>1.3. “Documentation”</div>
        <div className={classes.description}>
          Means all user manuals and other written material created by Licensor to describe the functionality or assist
          in the use of the Software.
        </div>
        <div className={classes.subLabel}>1.4. “Licensee” </div>
        <div className={classes.description}>
          Means you or your, and includes any employee, consultant, or contractor of Licensee, provided that the
          employee, consultant, or contractor is using the Software in the performance of his or her duties as an
          employee, consultant, or contractor of Licensee.
        </div>
        <div className={classes.subLabel}>1.5. “License Fee” </div>
        <div className={classes.description}>
          Means the fee to be paid by Licensee to Licensor as consideration for the license granted under this Agreement
          and the right to use the Software and the Documentation. The License Fee is set forth in Section 3, below,
          LICENSE FEES.
        </div>
        <div className={classes.subLabel}>1.6. “License Fee” </div>
        <div className={classes.description}>
          Means BICYCLE BOOK, LLC, dba BICYCLEBLUEBOOK.COM, a California Limited Liability Company.
        </div>
        <div className={classes.subLabel}>1.7. “Software”</div>
        <div className={classes.description}>
          Means the computer application program and website marketed and sold as BICYCLEBLUEBOOK.COM, in object code
          form only, and the Documentation. Software includes any updates, modification, bug fixes, updates,
          enhancements, or other modifications. It does not include any version of the Software that constitutes a
          separate product because of differences in function or features.
        </div>
      </div>
    ),
  },
  {
    label: 'Grant of License',
    description: (
      <div>
        <div className={classes.subLabel}>2.1 Grant.</div>
        <div className={classes.description}>
          Subject to the terms and conditions set forth in this Agreement, Licensor hereby grants to Licensee a
          nonexclusive, royalty-bearing, nontransferable license in the Software, to use the Software exclusively for
          internal business uses on the Authorized Platforms and at the Authorized Sites, and to use the Documentation
          solely in connection with Licensee’s use of the Software.
        </div>
        <div className={classes.subLabel}>2.2. License Restrictions.</div>
        <div className={classes.description}>
          Except as specifically granted in this Agreement, Licensor owns and retains all right, title, and interest in
          the Software, any modifications to the Software, Documentation, and any and all related materials. This
          Agreement does not transfer ownership rights of any description in the Software, Documentation, or any related
          materials to Licensee or any third party. Licensee shall install and render the Software operational only on
          the Authorized Platforms at the Authorized Sites. Licensee shall not modify, reverse engineer, or decompile
          the Software, or create derivative works based on the Software, except as otherwise agreed upon in Exhibit C.
          Licensee shall not distribute the Software to any persons or entities other than Licensee’s employees,
          consultants, or contractors. Licensee may not sell the Software to any person or make any other commercial use
          of the software. Licensee shall retain all copyright and trademark notices on the Software and Documentation
          and shall take other necessary steps to protect Licensor’s intellectual property rights.
        </div>
      </div>
    ),
  },
  {
    label: 'Licensor’s Obligations',
    description: (
      <div>
        <div className={classes.subLabel}>3.1. Deliverables. </div>
        <div className={classes.description}>
          Upon execution of this Agreement, Licensor shall deliver the Software to Licensee in a format appropriate for
          the Authorized Platforms at the Authorized Sites, together with the Documentation. Licensor shall provide
          Licensee with a BicycleBlueBook.com branded widget on Licensee’s website, and will provide Licensee with
          access to modify the widget as required and necessary for Licensee’s use through back-end API access.
        </div>
        <div className={classes.subLabel}>3.2. Support and Maintenance.</div>
        <div className={classes.description}>
          Licensor shall provide Licensee with technical support in connection with Licensee’s use of the Software and
          widget and shall provide Licensee with all modifications, bug fixes, and updates for the Software as part of
          this support and maintenance obligation.
        </div>
        <div className={classes.subLabel}>3.3. Accuracy of Evaluation.</div>
        <div className={classes.description}>
          Please refer to our scorecard for definitions of "Conditional Values". BicycleBlueBook.com provides these
          conditional values in order to provide the information needed to accurately evaluate trade-ins.
          BicyclelueBook.com reserves the right to take action if we deem that a trade-in partner has inaccurately
          evaluated a trade-in. BicycleBlueBook.com will only re-imburse trade-in partner for actual value of trade
          based on our evaluation. Trade-in partner will have the choice to either 1. Accept the BicycleBlueBook.com
          evaluation and associated reimbursement value or
          <br /> 2. Pay to have the trade-in shipped back to the trade-in partner. All cases of value discrepancy will
          be documented and available for trade-in partner appeal.
        </div>
      </div>
    ),
  },
  {
    label: 'Term and Termination',
    description: (
      <div>
        <div className={classes.subLabel}>4.1. Term.</div>
        <div className={classes.description}>
          This Agreement, and the license granted under this Agreement, becomes effective on the date set forth in
          Section 10.11, below. Unless sooner terminated as set forth in Sections 4.2 and 4.3, below, the Agreement
          shall continue in effect until the expiration of Licensor’s rights in the Software.
        </div>
        <div className={classes.subLabel}>4.2. Termination for Convenience.</div>
        <div className={classes.description}>
          Licensee may terminate the Agreement at any time and from time to time on THIRTY (30) days’ prior written
          notice to Licensor.
        </div>
        <div className={classes.subLabel}>4.3. Termination for Cause.</div>
        <div className={classes.description}>
          Either party, as applicable, shall have the right, in addition, and without prejudice to any other rights or
          remedies, to terminate this Agreement as follows:
          <div className={classes.subLabel}>4.3.1.</div>
          <div className={classes.description}>
            by Licensor, upon fifteen (15) days’ written notice, if Licensee fails to pay the amounts due to Licensor
            pursuant to this Agreement;
          </div>
          <div className={classes.subLabel}>4.3.2.</div>
          <div className={classes.description}>
            by Licensor, upon fifteen (15) days’ written notice, if there is a change in control of Licensee, whether by
            sale of assets, stock, or otherwise;
          </div>
          <div className={classes.subLabel}>4.3.3.</div>
          <div className={classes.description}>
            by either party for any material breach of this Agreement, other than failure to make payments under Section
            3, that is not cured within ten (10) days of receipt by the party in default of a notice specifying the
            breach and requiring its cure; or
          </div>
          <div className={classes.subLabel}>4.3.4.</div>
          <div className={classes.description}>
            by either party, immediately upon written notice, if: (a) all or a substantial portion of the assets of the
            other party are transferred to an assignee for the benefit of creditors, to a receiver, or to a trustee in
            bankruptcy; (b) a proceeding is commenced by or against the other party for relief under bankruptcy or
            similar laws and such proceeding is not dismissed within sixty (60) days; or (c) the other party is adjudged
            bankrupt.
          </div>
          <div className={classes.subLabel}>4.4. Rights on Termination.</div> Licensor has and reserves all rights and
          remedies that it has by operation of law or otherwise to enjoin the unlawful or unauthorized use of Software
          or Documentation. On termination all rights granted to Licensee under this Agreement cease and Licensee will
          promptly cease all use and reproduction of the Software and Documentation, and Licensee will promptly return
          all copies of the Software to Licensor or destroy all of Licensee’s copies of the Software and so certify to
          Licensor in writing within fourteen (14) days of termination. Sections 2.1, 6, 7, and 8 will survive
          termination or expiration of this Agreement as will any cause of action or claim of either party, whether in
          law or in equity, arising out of any breach or default.
        </div>
      </div>
    ),
  },
  {
    label: 'Warranties, Disclaimer and Limitation',
    description: (
      <div>
        <div className={classes.subLabel}> 5.1. Warranties</div>
        <div className={classes.description}>
          Licensor hereby warrants to Licensee that: (a) Licensor is the owner of the Software and the Documentation or
          has the right to grant to Licensee the license to use the Software and Documentation in the manner and for the
          purposes set forth in this Agreement without violating any rights of a third party; and (b) the media
          containing the Software will be free from defects for a period of thirty (30) days from the date of delivery
          to Licensee, provided that this warranty does not cover defects in the media due to Licensee’s misuse of the
          Software media or an accident subsequent to delivery to Licensee.
        </div>
        <div className={classes.subLabel}>5.2. Disclaimer</div>
        <div className={classes.description}>
          THE WARRANTIES SET FORTH IN SECTION 5.1, ABOVE, ARE IN LIEU OF, AND THIS AGREEMENT EXPRESSLY EXCLUDES, ALL
          OTHER WARRANTIES, EXPRESS OR IMPLIED, ORAL OR WRITTEN, INCLUDING, WITHOUT LIMITATION: (a) ANY WARRANTY THAT
          THE SOFTWARE IS ERROR-FREE, WILL OPERATE WITHOUT INTERRUPTION, OR IS COMPATIBLE WITH ALL EQUIPMENT AND
          SOFTWARE CONFIGURATIONS; (b) ANY AND ALL IMPLIED WARRANTIES OF MERCHANTABILITY; AND (c) ANY AND ALL WARRANTIES
          OF FITNESS FOR A PARTICULAR PURPOSE.
        </div>
        <div className={classes.subLabel}>5.3. Remedies on Breach of Warranty</div>
        <div className={classes.description}>
          In the event of any breach of the warranty set forth in Section 6.1, Licensee’s exclusive remedy shall be for
          Licensor to promptly replace defective Software media; if Licensor is unable to replace the media within
          thirty (30) days of notification by Licensee of a defect, Licensee’s sole remedy is to terminate this
          Agreement, at which time Licensor will refund any and all license or other fees paid by Licensee pursuant to
          this Agreement.
        </div>
        <div className={classes.subLabel}>5.4. Limitation of Liability</div>
        <div className={classes.description}>
          LICENSOR IS NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING THE LOSS OF
          PROFITS, REVENUE, DATA, OR USE OR COST OF PROCUREMENT OF SUBSTITUTE GOODS INCURRED BY LICENSEE OR ANY THIRD
          PARTY, WHETHER IN AN ACTION IN CONTRACT OR TORT OR BASED ON A WARRANTY, EVEN IF LICENSOR OR ANY OTHER PERSON
          HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. LICENSOR’S LIABILITY FOR DAMAGES UNDER THIS AGREEMENT
          SHALL NOT EXCEED THE AMOUNTS ACTUALLY PAID BY LICENSEE TO LICENSOR UNDER THIS AGREEMENT.
        </div>
        <div className={classes.subLabel}>5.5. Limitations Period</div>
        <div className={classes.description}>
          No action arising out of or in connection with this Agreement or the transactions contemplated by the
          Agreement may be brought by either party against the other more than 3 years after the action accrues.
        </div>
      </div>
    ),
  },
  {
    label: 'Indemnity',
    description: (
      <div>
        <div className={classes.subLabel}>6.1. Infringement Indemnity.</div>
        <div className={classes.description}>
          Licensor indemnifies, defends, and holds Licensee harmless from and against any claims, actions, or demands
          alleging that the Software infringes any United States patent, United States copyright, or other United States
          intellectual property right of a third party. If use of the Software is permanently enjoined for any reason,
          Licensor, at Licensor’s option, and in its sole discretion, may: (a) modify the Software so as to avoid
          infringement; (b) procure the right for Licensee to continue to use and reproduce the Software and
          Documentation; or (c) terminate this Agreement and refund to Licensee all license fees paid. Licensor shall
          have no obligation under this Section 7.1 for or with respect to claims, actions, or demands alleging
          infringement that arise as a result of (a) the combination of noninfringing items supplied by Licensor with
          any items not supplied by Licensor; (b) modification of the Software or Documentation by Licensee or by
          Licensor in compliance with Licensee’s designs, specifications, or instructions; (c) the direct or
          contributory infringement of any process patent by Licensee through the use of the Software; and (d) continued
          allegedly infringing activity by Licensee after Licensee has been notified of the possible infringement.
        </div>
        <div className={classes.subLabel}>6.2 Other Indemnity. </div>
        <div className={classes.description}>
          Licensee is responsible and indemnifies and holds Licensor harmless for any and all losses, liability, or
          damages arising out of, or incurred in connection with, Licensee’s use or reproduction of the Software
          pursuant to this Agreement. 7.3. Condition to Indemnification. Should any claim subject to indemnity be made
          against Licensor or Licensee, the party against whom the claim is made agrees to provide the other party with
          prompt written notice of the claim. Licensor will control the defense and settlement of any claim under
          Section 7.1 and Licensee will control the defense and settlement of any claim under Section 7.2. The
          indemnified party agrees to cooperate with the indemnifying party and provide reasonable assistance in the
          defense and settlement of such claim. The indemnifying party is not responsible for any costs incurred or
          compromise made by the indemnified party unless the indemnifying party has given prior written consent to the
          cost or compromise.
        </div>
      </div>
    ),
  },
  {
    label: 'Confidentiality',
    description: (
      <div>
        <div className={classes.subLabel}>7.1. Confidentiality.</div>
        <div className={classes.description}>
          Licensee acknowledges that the Software and Documentation, and all information relating to the business and
          operations of the Licensor that Licensee learns or has learned during or prior to the term of this Agreement,
          may be the valuable, confidential, and proprietary information of the Licensor. During the period this
          Agreement is in effect, and at all times afterwards, Licensee, and its employees, contractors, consultants,
          and agents, will: (a) safeguard the confidential information, widget and software with the same degree of care
          that it uses to protect its own confidential information; (b) maintain the confidentiality of this
          information, widget and software; (c) not use the information, widget and software except as permitted under
          this Agreement; and (d) not disseminate, disclose, sell, publish in online or print advertising or otherwise
          make available the information, widget or software to any third party without the prior written consent of
          Licensor.
        </div>
        <div className={classes.subLabel}>7.2. Limitations on Confidentiality Restrictions.</div>
        <div className={classes.description}>
          Section 8.1 does not apply to any information that: (a) is already lawfully in the receiving party’s
          possession (unless received pursuant to a nondisclosure agreement); (b) is or becomes generally available to
          the public through no fault of the receiving party; (c) is disclosed to the receiving party by a third party
          who may transfer or disclose such information without restriction; (d) is required to be disclosed by the
          receiving party as a matter of law (provided that the receiving party will use all reasonable efforts to
          provide the disclosing party with prior notice of such disclosure and to obtain a protective order therefor);
          (e) is disclosed by the receiving party with the disclosing party’s approval; and (f) is independently
          developed by the receiving party without any use of confidential information. In all cases, the receiving
          party will use all reasonable efforts to give the disclosing party ten (10) days’ prior written notice of any
          disclosure of information under this agreement. The parties will maintain the confidentiality of all
          confidential and proprietary information learned pursuant to this Agreement for a period of 3 years from the
          date of termination of this Agreement.
        </div>
        <div className={classes.subLabel}>7.3. Injunctive Relief for Breach. </div>
        <div className={classes.description}>
          Licensor and Licensee acknowledge that any breach of Section 8.1 by a receiving party will irreparably harm
          the disclosing party. Accordingly, in the event of a breach, the disclosing party is entitled to promptly seek
          injunctive relief in addition to any other remedies that the disclosing party may have at law or in equity.
        </div>
      </div>
    ),
  },
  {
    label: 'Export Controls and Restricted Rights',
    description: (
      <div>
        <div className={classes.subLabel}>8.1. Export Controls. </div>
        <div className={classes.description}>
          The Software, the Documentation, and all underlying information or technology may not be exported or
          re-exported into any country to which the U.S. has embargoed goods, or to anyone on the U.S. Treasury
          Department’s list of Specially Designated Nationals or the U.S. Commerce Department’s Table of Deny Orders.
          Licensee shall not export the Software or Documentation or any underlying information or technology to any
          facility in violation of these or other applicable laws and regulations. Licensee represents and warrants that
          it is not a national or resident of, or located in or under the control of, any country subject to such export
          controls.
        </div>
        <div className={classes.subLabel}>8.2. Restricted Rights.</div>
        <div className={classes.description}>
          The Software and Documentation are provided with Restricted Rights. Use, duplication, or disclosure by the
          U.S. Government is subject to restrictions as set forth in subparagraph (c)(1) of the Commercial Computer
          Software - Restricted Rights clause at FAR 52.227-19, subparagraph (c)(1)(ii) of The Rights in Technical Data
          and Computer Software clause at DFARS 252.227-7013, or subparagraph (d) of the Commercial Computer Software—
          Licensing at NASA FAR supplement 16-52.227-86, or their equivalent, as applicable.
        </div>
      </div>
    ),
  },
  {
    label: 'General',
    description: (
      <div>
        <div className={classes.subLabel}>9.1. Assignment.</div>
        <div className={classes.description}>
          Licensee may not assign, sublicense, or transfer Licensee’s rights or delegate its obligations under this
          Agreement without Licensor’s prior written consent, which will not be unreasonably withheld. This Agreement
          shall be binding upon the successors and assigns of the parties to this Agreement.
        </div>
        <div className={classes.subLabel}>9.2. Entire Agreement. </div>
        <div className={classes.description}>
          This Agreement, along with the Exhibits attached and referenced in this Agreement, constitutes the final and
          complete understanding between the parties, and replaces and supersedes all previous oral or written
          agreements, understandings, or arrangements between the parties with respect to the subject matter contained
          in this Agreement.
        </div>
        <div className={classes.subLabel}>9.3. Waiver.</div>
        <div className={classes.description}>
          This Agreement may not be modified or amended except in a writing signed by an authorized officer of each
          party. The failure of either party to enforce any provision of this Agreement shall not be deemed a waiver of
          the provisions or of the right of such party thereafter to enforce that or any other provision.
        </div>
        <div className={classes.subLabel}>9.4. Notices.</div>
        <div className={classes.description}>
          Except as otherwise provided in this Agreement, notices required to be given pursuant to this Agreement shall
          be effective when received, and shall be sufficient if given in writing, hand-delivered, sent by facsimile
          with confirmation of receipt, sent by First Class Mail, return receipt requested (for all types of
          correspondence), postage prepaid, or sent by overnight courier service and addressed as follows:
          <br />
          To Licensor: 1590 Berryessa Road, San Jose, CA 95133
          <br />
          Attn: Jeffrey B. Farrell Fax no.: (408) 437-9011
          <br />
          To Licensee, at your last known address on file with licensor.
        </div>
        <div className={classes.subLabel}>9.5. Publicity.</div>
        <div className={classes.description}>
          Without the prior written consent of the other party, neither party shall disclose the terms and conditions of
          this Agreement, except disclosure may be made as is reasonably necessary to the disclosing party’s bankers,
          attorneys, or accountants or except as may be required by law.
        </div>
        <div className={classes.subLabel}>9.6. Independent Contractor.</div>
        <div className={classes.description}>
          This Agreement shall be governed by and construed in accordance with the laws of the State of California.
        </div>
        <div className={classes.subLabel}>9.7. Governing Law and Jurisdiction.</div>
        <div className={classes.description}>
          Without the prior written consent of the other party, neither party shall disclose the terms and conditions of
          this Agreement, except disclosure may be made as is reasonably necessary to the disclosing party’s bankers,
          attorneys, or accountants or except as may be required by law.
        </div>
        <div className={classes.subLabel}>9.8. Severability. </div>
        <div className={classes.description}>
          In case any provision of this Agreement is held to be invalid, unenforceable, or illegal, the provision will
          be severed from this Agreement, and such invalidity, unenforceability, or illegality will not affect any other
          provisions of this Agreement.
        </div>
        <div className={classes.subLabel}>9.9. Arbitration.</div>
        <div className={classes.description}>
          In the event of any dispute between the parties arising out of this Agreement, the dispute shall be resolved
          by arbitration under the rules of the American Arbitration Association by an arbitrator agreed upon in writing
          by the parties. In the event the parties cannot agree upon the choice of an arbitrator, each party shall
          appoint one individual representative and the two party representatives shall, between themselves, chose an
          arbitrator.
        </div>
        <div className={classes.subLabel}>9.10. Attorney’s Fees. </div>
        <div className={classes.description}>
          In the event of any dispute between the parties arising out of this Agreement, the prevailing party shall be
          entitled, in addition to any other rights and remedies it may have, to recover its reasonable attorney’s fees
          and costs.
        </div>
        <div className={classes.subLabel}>9.11. Effective Date.</div>
        <div className={classes.description}>
          The effective date of this Agreement shall be upon execution of the trade-in partner agreement. IN WITNESS
          WHEREOF, the parties have caused this Agreement to be executed as of the date written above.
        </div>
        <div className={classes.subLabel}>9.12. DOJ REPORTING.</div>
        <div className={classes.description}>
          BicycleBlueBook.com complies with the Secondhand Dealer Laws of the State of California by submitting details
          of all transactions to the California Department of Justice through the DOJ's online portal located at{' '}
          <a href="https://capss.doj.ca.gov/login/auth" target={'_blank'} className={classes.customLink}>
            https://capss.doj.ca.gov/login/auth.
          </a>
          To the extent that California DOJ reporting does not satisfy your local jurisdictional requirements for these
          types of transactions, You remain responsible for any state and local jurisdictional licensing, reporting and
          other requirements.
        </div>
      </div>
    ),
  },
];

const SoftwareLicensePage = () => {
  const [listCollapseOpen, setListCollapseOpen] = useState<number[]>([]);
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
    <div>
      <div className={classes.title}>Software License Agreement</div>
      <div className={classes.subTitle}>Recitals</div>
      <div className={cx(classes.description, classes.intro)}>
        A. Licensor develops and markets computer software applications for the valuation of new and used bicycles,
        bicycle components, and for utilization in an online marketplace to facilitate the purchase, sale and delivery
        of used bicycles, as found on and known as BICYCLEBLUEBOOK.COM (the “Software”), and other written materials
        created by Licensor to describe the functionality and use of the Software (the “Documentation”); and
      </div>
      <div className={cx(classes.description, classes.intro)}>
        B. Licensee desires to acquire a license to use a Licensor-branded trade-in widget on their website which would
        also enable back-end access to Licensor’s database for determination of final trade-in values for Licensee’s
        internal business purposes only, and Licensor desires to grant Licensee the license.
      </div>
      <div className={cx(classes.description, classes.intro)}>
        THEREFORE, for valuable consideration, receipt of which is hereby acknowledged, the parties agree as follows:
      </div>
      {ListRules.map((term: Term, index: number) => (
        <div key={String(index)} className={classes.btnCollapse} onClick={() => handleCollapseTerm(index)}>
          <div className={classes.wrapLabel}>
            <div className={classes.label}>{term.label}</div>
            <img
              src={images.common.icDropDown}
              alt="icon dropdown"
              className={cx(classes.iconDropdown, {
                [classes.isOpen]: !checkCollapseIsOpen(index),
              })}
            />
          </div>
          <Collapse isOpen={checkCollapseIsOpen(index)}>
            <div className={classes.description}>{term.description}</div>
          </Collapse>
        </div>
      ))}
    </div>
  );
};

export default SoftwareLicensePage;
