import React, { FC, HtmlHTMLAttributes } from 'react';
import cx from 'classnames';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Progress from 'reactstrap/lib/Progress';
import classes from './stepper.module.scss';

interface Step {
  title: string;
  smallTitle?: string;
  step: number;
}

interface Props {
  showProgress?: boolean;
  steps: Step[];
  step: number;
  isComplete?: boolean;
  showTitleSm?: boolean;
  maxStep: number;
  handleChangeStep?: (step: number) => void;
}

const Stepper: FC<Props & HtmlHTMLAttributes<any>> = (props) => {
  const onClick = (step: number) => {
    if (step !== props.step && step <= props.maxStep && props.handleChangeStep) {
      props.handleChangeStep(step);
    }
  };
  const stepPercentage = (1 / (props.steps.length - 1)) * 100;

  return (
    <Row>
      <Col>
        <div className={cx(classes.stepper, props.className)}>
          {props.showProgress && (
            <Progress
              value={(props.step - 1) * stepPercentage}
              className={cx(classes.progress)}
              barClassName={cx(classes.progressBar)}
            />
          )}

          <div
            className={cx(classes.main, {
              'justify-content-between': props.steps.length === 4,
            })}>
            {props.steps.map((item) => (
              // eslint-disable-next-line
              <div
                onClick={() => onClick(item.step)}
                role="button"
                key={item.title}
                className={cx(classes.step, {
                  [classes.active]: item.step === props.step,
                  [classes.paddingCustom]: props.steps.length !== 4,
                })}>
                <div className={cx(classes.stepNumber)}>{item.step}</div>
                <div className={cx(classes.title)}>{item.title}</div>
                {item.smallTitle && (
                  <div
                    className={cx(classes.title, {
                      [classes.showOnMobile]: props.showTitleSm,
                    })}>
                    {item.smallTitle}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Col>
    </Row>
  );
};

Stepper.defaultProps = {
  showProgress: true,
};

export default Stepper;
