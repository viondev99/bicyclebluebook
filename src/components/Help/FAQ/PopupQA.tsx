import * as React from 'react';
import Collapse from 'reactstrap/lib/Collapse';
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';
import CardTitle from 'reactstrap/lib/CardTitle';
import CardHeader from 'reactstrap/lib/CardHeader';
import classes from '../browseHelp.module.scss';
import images from '@images';

interface Props {
  qaItem: any;
  activeKey: any;
  handleShowPopup: Function;
  isMobile: boolean;
}

class PopupQA extends React.Component<Props, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { qaItem, handleShowPopup, isMobile, activeKey } = this.props;
    return (
      <div className={classes.wrapperPopUp}>
        <Card className={classes.wrapperCard}>
          <CardHeader>
            <CardTitle toggle={true}>
              <div onClick={() => handleShowPopup(qaItem)} className={classes.wrapperHeader}>
                <div>
                  <p className={classes.title}>{qaItem.question}</p>
                </div>
                <div>
                  <div className={classes.iconDrop}>
                    <img src={images.help.ic_drop} />
                  </div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <Collapse isOpen={activeKey}>
            <CardBody collapsible={true}>
              <div className={classes.wrapperContent}>
                <p>{qaItem.answer}</p>
              </div>
            </CardBody>
          </Collapse>
        </Card>
      </div>
    );
  }
}

export default PopupQA;
