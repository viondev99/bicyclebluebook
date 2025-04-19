import React, { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import Link from 'next/link';

import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import Input from '@ui/Inputs/Input';
import Card from '@ui/Cards';
import Select from '@ui/Select/Select';
import CheckBox from '@ui/CheckBox';
import Radio from '@ui/Radio';
import Modal from '@ui/Modal';
import Button from '@ui/Buttons/Primary/Button';
import Tooltip from '@ui/Tooltip/Tooltip';
import { universalRedirect } from '../../helpers/ssr.helper';
import config from '../../config';

const a: any = {};

export default function Home() {
  const [disabled, setDisabled] = useState(false);
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];
  const [radioChecked, setRadioChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const renderTooltipForAssembled = () => {
    return (
      <Card>
        <h5>This bike is available fully assembled for local pickup.</h5>
        <button type="button">Learn More</button>
      </Card>
    );
  };
  const testCrash = () => {
    // eslint-disable-next-line react/button-has-type
    return <button onClick={() => a.methodDoesNotExist()}>Break the world</button>;
  };
  return (
    <div style={{ paddingTop: 100, backgroundColor: '#F3F3F5' }}>
      <div className="container">
        {testCrash()}
        <div className="row">
          <Link href={'/marketplace/buy-now/12344'}>
            <a>Component</a>
          </Link>
          <div className={'col-12'}>
            <h1>Tooltip</h1>
          </div>
          <div className={'col-12'}>
            <h2>Tooltip with title</h2>
            <Tooltip title={'hello'}>
              <button type="button">Hello please hover on me</button>
            </Tooltip>
          </div>
          <div className={'col-12'}>
            <h2>Tooltip with custom tooltip</h2>
            <Tooltip renderTooltip={renderTooltipForAssembled()}>
              <button type="button">Hello please hover on me</button>
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h1>Button</h1>
          </div>
          <div className="col-12">
            <CheckBox checked={disabled} onChange={(e) => setDisabled(e.target.checked)} style={{ width: '200px' }} />
          </div>

          <Card>
            <Button buttonType={'primary'} disabled={disabled}>
              Primary
            </Button>
            <Button buttonType={'danger'} disabled={disabled}>
              Danger
            </Button>
            <Button buttonType={'warning'} disabled={disabled}>
              Warning
            </Button>
            <Button buttonType={'transparent'} disabled={disabled}>
              Trans
            </Button>
            <Button buttonType={'clear'} disabled={disabled}>
              Clear
            </Button>
          </Card>
        </div>
        <div className="row mt-2">
          <div className="col-12">
            <h1>Input</h1>
          </div>
          <Input placeholder="Some thing" className="col-md-3" />
        </div>
        <div className="row mt-2">
          <div className="col-12">
            <h1>Checkbox</h1>
          </div>
          <CheckBox label="Some thing" className="col-md-3" title="Something" />
        </div>
        <div className="row mt-2">
          <div className="col-12">
            <h1>Card</h1>
          </div>
          <div className="row col-12">
            <Card className="col-md-4">Something</Card>
            <Card className="col-md-4">Something</Card>
            <Card className="col-md-4">Something</Card>
          </div>
        </div>
        <Card className="row mt-2">
          <div className="col-12">
            <h1>Select</h1>
          </div>

          <Select inputId={'test'} options={options} instanceId="test" placeholder="Test" className="col-md-4" />
          <div className="mt-2">
            <h3>WithAutoComplete</h3>
            <Select
              inputId={'test-2'}
              options={options}
              instanceId="test"
              placeholder="Test"
              className="col-md-4"
              isSearchable={true}
            />
          </div>
        </Card>
        <div className="row mt-2">
          <div className="col-12">
            <h1>Radio</h1>
          </div>
          <div className="col-12">
            <span>Normal</span>
            <Radio
              label="Disable"
              name="radio"
              className="col-md-4"
              checked={radioChecked}
              onChange={(e) => setRadioChecked(!radioChecked)}
            />
          </div>

          <div className="col-12 mt-2">
            <span>Disabled</span>
            <Radio title="Radio title" name="radio_disable" disabled className="col-md-4" checked={true} />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12">
            <h1>Modal</h1>
          </div>
          <div className="col-12">
            <Button onClick={() => setModalVisible(true)}>Open Modal</Button>
            <Modal
              isOpen={modalVisible}
              title="Example title"
              onClose={() => {
                setModalVisible(false);
              }}
              footer={
                <div className="d-flex">
                  <Button
                    onClick={() => {
                      setModalVisible(false);
                    }}>
                    Close
                  </Button>
                </div>
              }>
              <p>Example</p>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

Home.getInitialProps = async (ctx: NextPageContext) => {
  if (config.NAME === 'PRODUCTION') {
    await universalRedirect(ctx)('/', 302);
  }
  return {};
};

Home.renderLayout = renderMainLayout;
