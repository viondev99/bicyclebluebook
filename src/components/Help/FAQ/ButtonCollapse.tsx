import * as React from 'react';
// import { StyledButtonCollapse } from './FAQStyle';

const ButtonCollapse = (props: { active: boolean }) => {
  return <div>{props.active ? '-' : '+'}</div>;
};

export default ButtonCollapse;
