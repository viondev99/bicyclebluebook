import React, { FC } from 'react';

import Card from '@ui/Cards';
import classes from './messages.module.scss';
import ChatInfo from './Chat/ChatInfo';
import ChatBox from './Chat/ChatBox';
import ChatInput from './Chat/ChatInput';

const ChatSection: FC = () => {
  return (
    <section>
      <Card className={classes.chatContainer}>
        <ChatInfo />
        <ChatBox />
        <ChatInput />
      </Card>
    </section>
  );
};

export default ChatSection;
