import * as React from 'react';
import classes from './browseHelp.module.scss';
import { ReactElement } from 'react';
import Link from 'next/link';

interface Props {
  iconSrc?: string;
  title: string;
  link: string;
  icon?: ReactElement<any>;
}

class BrowseHelpCard extends React.PureComponent<Props> {
  render() {
    const { iconSrc, title, icon, link } = this.props;
    return (
      <Link href={link}>
        <div className={classes.wrapper}>
          {icon ? icon : <img className={classes.icon} src={iconSrc} />}
          <p>{title}</p>
        </div>
      </Link>
    );
  }
}

export default BrowseHelpCard;
