import React, { FC } from 'react';
import cx from 'classnames';

import { ComponentStatic } from 'model/common';
import { withAuthenticate } from 'hocs/withAuthenticate';
import { Roles } from 'constants/roles';
import { useRouter } from 'next/router';
import classes from '../../../components/Messages/messages.module.scss';
import { renderMainLayout } from '../../../layout/MainLayout/MainLayout';
import AccountPersonalLayout from '../../../layout/Account/Personal';
import ConversationSection from '../../../components/Messages/ConversationSection';
import ChatSection from '../../../components/Messages/ChatSection';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const Messages: FC & ComponentStatic = () => {
  const selected = useRouter().query.conversation;

  return (
    <AccountPersonalLayout titleMobile="Messages">
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
    </AccountPersonalLayout>
  );
};

Messages.getInitialProps = () => {
  return {};
};

Messages.renderLayout = renderMainLayout;

export default withInjectAllSaga(withAuthenticate({ role: Roles.PERSONAL })(Messages));
