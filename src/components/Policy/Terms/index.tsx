import React, { useCallback, ReactElement, useState } from 'react';
import Container from 'reactstrap/lib/Container';
import Collapse from 'reactstrap/lib/Collapse';
import Link from 'next/link';
import cx from 'classnames';
import images from 'assets/images';
import Button from '@ui/Buttons/Primary/Button';
import classes from './terms.module.scss';
import SoftwareLicensePage from './SoftwareLicense';

interface Term {
  label: string;
  description: string | ReactElement;
}

const ListTerms: Term[] = [
  {
    label: 'Use of the Services',
    description:
      'You may only view, download, print one copy of the materials from, and use the Services subject to the following conditions: (a) the materials may be used solely for Your personal, non-commercial, and informational purposes; and (b) You may not modify or remove any copyright and other proprietary notices contained in the materials on any copies of the materials. Any use of the Services not expressly granted herein is prohibited. You may not (a) reproduce, republish, publicly display, perform, distribute, exploit, or otherwise use the materials or the Services for any public or commercial purpose or prepare any modification or prepare derivative works based on the contents from the Services; (b) propagate any virus, worms, trojan horses, or other programming routine intended to damage any system or data; (c) access the Services for the purpose of building a competitive product or service or copying its features or user interface; or (d) use the Services, or permit it to be used, for purposes of product evaluation, benchmarking or other comparative analysis intended for publication without BicycleBlueBook.com’s prior written consent. In addition to this Agreement, You may also be subject to any additional terms applicable to a particular Service, which will be presented to You through the use of such Service. You also agree that You will not use the Services for any unlawful purposes. You may not use BicycleBlueBook.com for any commercial purpose, including, but not limited to, insurance, financing, or related purposes. The unauthorized use of the information on BicycleBlueBook.com may subject you and/or your representatives to fines, penalties, and legal action. We would ask that you contact BicycleBlueBook.com if you are interested in obtaining a license to use the information contained our on site for any commercial purpose.',
  },
  {
    label: 'Fees',
    description:
      'You may be charged a fee for certain Services and the fee will be presented to You when You are accessing the applicable Service ("Fees"). Fees are non-refundable. Any direct or indirect local, state, federal or foreign taxes, levies, duties or similar governmental assessments of any nature, including sales, use, or withholding taxes ("Taxes") related to the Services shall be borne by You.',
  },
  {
    label: 'Ownership/Copyright',
    description:
      'The underlying software, algorithms (and the output of the algorithms and the Services), materials on the Site, and other materials accessed through the use of the Services are the exclusive property of BicycleBlueBook.com, copyrighted by BicycleBlueBook.com, and are protected by US Copyright Laws and international treaties. BicycleBlueBook.com reserves all rights in the Services and its content, not expressly granted herein.',
  },
  {
    label: 'Trademarks',
    description:
      'BicycleBlueBook.com is a service mark and trademark of BicycleBlueBook.com. Other marks, graphics, and logos used in the provision of the Services are BicycleBlueBook.com’s service marks, trademarks, and trade dress ("Marks") and are the sole and exclusive property of BicycleBlueBook.com. BicycleBlueBook.com’s Mark’s may not be used in any manner by You.',
  },
  {
    label: 'Postings and Feedback',
    description:
      'If You submit any postings, feedback, ideas, or the like ("Information") through the use of the Services, You acknowledge and agree that: (a) You have the right to provide the Information free of any restriction, (b) the Information is true and accurate, (c) if you are selling a bicycle or any other property, You are the owner or authorized agent of the bicycle or other property You are selling, and (d) upon submission, the Information then becomes the property of BicycleBlueBook.com without any obligation of BicycleBlueBook.com to You of any kind, and BicycleBlueBook.com may use the Information in any manner without any compensation or reimbursement of any kind from BicycleBlueBook.com.',
  },
  {
    label: 'Privacy',
    description: (
      <div>
        BicycleBlueBook.com takes privacy matters very seriously. As a result, BicycleBlueBook.com has developed a
        privacy policy to inform the public of its privacy practices and to bind You and other users to it. A copy of
        the privacy policy can be found at{' '}
        <Link href="/privacy-policy">
          <a className={classes.customLink}>http://www.bicyclebluebook.com/privacystatement.aspx.</a>
        </Link>
      </div>
    ),
  },
  {
    label: 'Links',
    description:
      'BicycleBlueBook.com is a service mark and trademark of BicycleBlueBook.com. Other marks, graphics, and logos used in the provision of the Services are BicycleBlueBook.com’s service marks, trademarks, and trade dress ("Marks") and are the sole and exclusive property of BicycleBlueBook.com. BicycleBlueBook.com’s Mark’s may not be used in any manner by You.',
  },
  {
    label: 'Payment Services',
    description: (
      <>
        BicycleBlueBook.com uses PayPal as its third party service providers for payment services (e.g. card acceptance,
        merchant settlement, and related services). By making use of some or all of these payment services on [Client]
        you agree to be bound by PayPal’s terms and conditions (available at{' '}
        <a
          className={classes.customLink}
          href="https://www.paypal.com/us/webapps/mpp/ua/legalhub-full"
          target="_blank"
          rel="noopener noreferrer">
          https://www.paypal.com/us/webapps/mpp/ua/legalhub-full
        </a>{' '}
        ) and hereby consent and authorize us to delegate the authorizations and share the information you provide to us
        with our Third Party Service Provider(s) to the extent required to provide the Payment Services to you. PayPal
        may also be contacted directly for payments support by phone at 1-888-221-1161
      </>
    ),
  },
  {
    label: 'Disclaimer and Limitations',
    description: (
      <div>
        THE MATERIALS ON THE SITE AND THE SERVICES ARE PROVIDED "AS IS" WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS,
        IMPLIED, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO, ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR ANY
        PARTICULAR PURPOSE, OR NON-INFRINGEMENT OF ANY THIRD-PARTY RIGHTS. WITHOUT LIMITING THE GENERALITY OF THE
        FOREGOING, BICYCLEBLUEBOOK.COM DISCLAIMS ANY AND ALL LIABILITY FROM ANY INACCURACIES RELATED TO THE SERVICES,
        THAT THE SERVICES WILL MEET YOUR REQUIREMENTS, THAT ANY GOODS ARE AS DESCRIBED BY A SELLER AND/OR ARE OWNED BY
        THE SELLER, FOR ANY THIRD-PARTY FACILITATOR’S RESPONSIBILITIES, AND/OR THAT THE RESULTS OBTAINED FROM THE USE OF
        THE SERVICES WILL BE COMPLETE, ACCURATE, AND/OR RELIABLE. BICYCLEBLUEBOOK.COM DOES NOT REVIEW ANY INFORMATION
        POSTED ON THE SITE AND/OR THROUGH THE USE OF THE SERVICES AND IS NOT RESPONSIBLE FOR ANY SUCH INFORMATION.
        CERTAIN STATES DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES AND/OR LIMITATIONS ON CERTAIN DAMAGES. IF ANY OF
        THESE LAWS APPLY TO YOU, SOME OF THE PROVISIONS IN THIS SECTION MAY NOT APPLY NOT YOU. <br />
        IN NO EVENT SHALL BICYCLEBLUEBOOK.COM OR ITS EMPLOYEES, DIRECTORS, OFFICERS, CONTRACTORS, OR AGENTS BE LIABLE
        FOR ANY DAMAGES WHATSOEVER, INCLUDING INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR OTHER DAMAGES (INCLUDING
        DAMAGES FOR LOSS OF PROFITS, BUSINESS INTERRUPTION, OR LOSS OF INFORMATION) ARISING OUT OF THE USE OF OR THE
        INABILITY TO USE THE MATERIALS PROVIDED ON, OR OTHERWISE RELATED TO, THE SERVICES, WHETHER BASED ON CONTRACT,
        TORT, OR OTHERWISE, EVEN IF BICYCLEBLUEBOOK.COM HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        BICYCLEBLUEBOOK.COM’S LIABILITY FOR DIRECT DAMAGES SHALL BE LIMITED TO FIFTY US DOLLARS ($50).
      </div>
    ),
  },
  {
    label: 'Indemnity',
    description:
      "You shall defend, indemnify and hold BicycleBlueBook.com and its employees, contractors, shareholders, subsidiaries, affiliates, and officers harmless against any loss, damage or costs (including reasonable attorneys' fees) incurred in connection with any claims made or brought against BicycleBlueBook.com by a third party resulting from Your use of the Services, including alleging that any Information infringes the rights of such third party or that You are not the owner of any bicycle or other goods posted for sale and/or sold by You.",
  },
  {
    label: 'Term',
    description:
      'This Agreement is effective upon Your first use of the Services. BicycleBlueBook.com may suspend or discontinue all or part of the Services (in general or specifically for You) for any reason with or without notice to You.',
  },
  {
    label: 'Modifications',
    description:
      'BicycleBlueBook.com may make changes to the Services at any time and by posting notice of a new version of the Agreement on the Site. You must check the Agreement before selling a bicycle or other property or otherwise using the Service.',
  },
  {
    label: 'Miscellaneous',
    description: (
      <>
        Any disputes arising out of the use of the Services shall be governed by the laws of California, without regard
        to any conflict of laws principles, and any proceedings shall solely be brought in Santa Clara County,
        California. You represent and warrant that you are not located in a country that is subject to a U.S. Government
        embargo, designated by the U.S. Government as a "terrorist supporting" country, or subject to a similar
        designation; or listed on any U.S. Government list of prohibited or restricted entities. You also acknowledge
        that the Application may be subject to other U.S. and foreign laws and regulations governing the use of the
        Services and agree to comply with all such laws. <br />
        The parties are independent contractors, and no partnership, franchise, joint venture, agency, fiduciary or
        employment relationship between the parties is created hereby. BicycleBlueBook.com may provide you notice under
        this Agreement to the latest address it has on file for You. This Agreement may only be modified by an agreement
        signed by an officer of BicycleBlueBook.com. No failure or delay in exercising any right by BicycleBlueBook.com
        shall constitute a waiver of such right. If any provision of this Agreement is held by a court of competent
        jurisdiction to be contrary to law, such provision shall be modified by the court and interpreted so as best to
        accomplish the objectives of the original provision to the fullest extent permitted by law, and the remaining
        provisions shall remain in effect. This Agreement constitutes the entire agreement between BicycleBlueBook.com
        and You, and supersedes any and all prior or contemporaneous agreements, understandings, and representations
        with respect to the information on and the use of the Services.
      </>
    ),
  },
];

const TermsPage = () => {
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
      return existKey >= 0;
    },
    [listCollapseOpen],
  );
  return (
    <div className="position-relative">
      <Container className={classes.container}>
        <div className={classes.title}>Terms of Use</div>
        <div className={cx(classes.description, classes.intro)}>
          Bicycle Book, LLC ("BicycleBlueBook.com") owns and is responsible for the BicycleBlueBook.com website ("Site")
          and provides various services through the Site and through BicycleBlueBook.com’s applications (collectively,
          the "Services"). Use of the Services is expressly subject to this BicycleBlueBook.com Terms of Use Agreement
          ("Agreement"). By using the Services, you ("You" and "Your") acknowledge that You have read this Agreement and
          that You agree to be bound by its terms. If You do not agree to its terms, you are not permitted to use the
          Services.
        </div>
        {ListTerms.map((term: Term, index: number) => (
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
        <SoftwareLicensePage />
      </Container>
    </div>
  );
};

export default TermsPage;
