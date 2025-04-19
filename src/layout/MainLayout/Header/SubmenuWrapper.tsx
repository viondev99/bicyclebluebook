import React, { CSSProperties, FC, memo, PropsWithChildren } from 'react';
import { Transition } from 'react-transition-group';

const transitionStyles: {
  [key: string]: CSSProperties;
} = {
  entering: { opacity: 1, transform: 'translate(0%)', transition: 'all 0.3s ease-in-out' },
  entered: { opacity: 1, transform: 'translate(0%)', transition: 'all 0.3s ease-in-out' },
  exiting: { opacity: 0, transform: 'translate(100%)', transition: 'all 0.3s ease-in-out' },
  exited: { opacity: 0, transform: 'translate(100%)', transition: 'all 0.3s ease-in-out' },
};

const SubmenuWrapper: FC<PropsWithChildren<{ open: boolean }>> = ({ children, open }) => {
  return (
    <Transition in={open} timeout={300}>
      {(state) => (
        <div
          className={'d-xl-none d-block'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            background: '#fff',
            ...transitionStyles[state],
          }}>
          {children}
        </div>
      )}
    </Transition>
  );
};

export default memo(SubmenuWrapper);
