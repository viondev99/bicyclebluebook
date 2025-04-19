declare module 'react-load-script' {
  import React from 'react';

  interface Props {
    onCreate?: () => void;
    onError: () => void;
    onLoad: () => void;
    url: string;
  }

  export default class ReactLoadScript extends React.Component<Props> {}
}
