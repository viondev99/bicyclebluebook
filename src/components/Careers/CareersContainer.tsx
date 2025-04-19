import React, { useCallback, ReactElement, useState } from 'react';
import Container from 'reactstrap/lib/Container';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import { Collapse } from 'reactstrap';
import classes from './careers.module.scss';
import images from '@images';

interface Job {
  label: string;
  subLabel: string;
  description: string | ReactElement;
}

const ListCareers: Job[] = [
  {
    label: 'Mechanic/Sales',
    subLabel: 'Full/Part Time',
    description: (
      <div className={classes.wrapDescriptionn}>
        <div className={classes.subTitlee}>Full/Part Time</div>
        <div className={classes.subDescription}>
          BicycleBlueBook.com is the industry’s leading authority for bicycle value reporting and the nation’s largest
          bike trade-in program for retailers. We are seeking full and part time mechanics. This is an hourly wage
          position with competitive pay and the opportunity for promotion within a rapidly growing company located in
          San Jose, CA.
        </div>
        <div className={cx(classes.label, classes.wrapRequirements)}>Requirements</div>
        <div className={classes.customUL}>
          <div className={classes.liItem}>Exceptional mechanic skills</div>
          <div className={classes.liItem}>Strong work ethic</div>
          <div className={classes.liItem}>Self-starter </div>
          <div className={classes.liItem}>Basic computer skills</div>
          <div className={classes.liItem}>Retail sales experience</div>
          <div className={classes.liItem}>
            In depth product knowledge of bicycles, both current and historical, is a plus
          </div>
        </div>
        <div className={classes.wrapInfoBottom}>
          To apply, please send your cover letter and email to{' '}
          <a href="mailto:careers@bicyclebluebook.com" target="_top" className={classes.customLink}>
            careers@bicyclebluebook.com.
          </a>
        </div>
      </div>
    ),
  },
  {
    label: 'Sales Manager',
    subLabel: 'Full Time',
    description: (
      <div>
        <div className="d-block d-sm-none mt-3 mb-3">Full Time</div>update later
      </div>
    ),
  },
  {
    label: 'Marketing Assistant',
    subLabel: 'Part Time',
    description: (
      <div>
        <div className="d-block d-sm-none mt-3 mb-3">Part Time</div>update later
      </div>
    ),
  },
];

const CareersPage = () => {
  const [listCollapseOpen, setListCollapseOpen] = useState<number[]>([]);
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
      {/* <div className={classes.title}>Sorry, we don’t have any vacancies at the moment.</div>
      <div className={cx(classes.description, classes.intro)}>
        Please check back soon as we’re always looking for talented people to work with us.
      </div> */}
      <div className={classes.title}>Join Our Team</div>
      <div className={classes.intro}>
        We're always looking for smart, hardworking, talented people. We invite you to apply for any open jobs below.
        Don’t see anything you’re interested in? Feel free to send your resume for future opportunities to{` `}
        <a className={classes.customLink} href="mailto:careers@bicyclebluebook.com">
          careers@bicyclebluebook.com
        </a>
        .
      </div>
      {ListCareers.filter((it, index) => index === 0).map((item: Job, index: number) => (
        <Button
          key={String(index)}
          buttonType="clear"
          className={classes.btnCollapse}
          onClick={() => handleCollapse(index)}>
          <div className={classes.wrapLabel}>
            <div className={classes.label}>
              {item.label}
              <div className={classes.subLabel}> {item.subLabel}</div>
            </div>
            <img
              src={checkCollapseIsOpen(index) ? images.common.icDropDown : images.common.icDropDownClose}
              alt="icon dropdown"
              className={classes.iconDropdown}
            />
          </div>
          <Collapse isOpen={checkCollapseIsOpen(index)}>
            <div className={classes.description}>{item.description}</div>
          </Collapse>
        </Button>
      ))}
      <div className={cx(classes.textFooter, classes.intro, classes.maxWidthFooter)}>
        That’s all we have for now.
        <br /> Check back soon as we’re always looking for new talent.
      </div>
    </Container>
  );
};

export default CareersPage;
