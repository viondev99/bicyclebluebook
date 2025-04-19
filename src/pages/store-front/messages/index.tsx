import React, { FC } from 'react';
import cx from 'classnames';

import { ComponentStatic } from 'model/common';
import { Roles } from 'constants/roles';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { useRouter } from 'next/router';
import classes from '../../../components/Messages/messages.module.scss';
import { renderMainLayout } from '../../../layout/MainLayout/MainLayout';
import StorefrontLayout from '../../../layout/Account/StoreFront';
import ConversationSection from '../../../components/Messages/ConversationSection';
import ChatSection from '../../../components/Messages/ChatSection';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const Messages: FC & ComponentStatic = () => {
  const selected = useRouter().query.conversation;

  return (
    <StorefrontLayout titleMobile="Messages">
      <>
        <div
          className={cx(classes.messageContainer, {
            'd-block': !selected,
            'd-none': selected,
          })}>
          <ConversationSection />
        </div>
        <div
          className={cx(classes.messageContainer, {
            'd-block': selected,
            'd-none': !selected,
          })}>
          <ChatSection />
        </div>
      </>
    </StorefrontLayout>
  );
};

Messages.getInitialProps = () => {
  return {};
};

Messages.renderLayout = renderMainLayout;

export default withInjectAllSaga(withAuthenticate({ role: Roles.ONLINE_STORE })(Messages));
