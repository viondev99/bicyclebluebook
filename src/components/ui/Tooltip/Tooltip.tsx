import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  trigger?: 'click' | 'hover';
  title?: string;
  renderTooltip?: ReactElement;
  children: ReactElement;
  delay?: number;
}

function getFromMaxMin(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const Tooltip: FC<Props> = ({ children, trigger = 'hover', title = '', renderTooltip, delay = 200 }) => {
  const [show, setShow] = useState<boolean>(false);
  const [{ top, left, maxLeft, minLeft, offsetCaret, positioned }, setTopLeft] = useState({
    top: 0,
    left: 0,
    maxLeft: 0,
    minLeft: 0,
    offsetCaret: 0,
    positioned: false,
  });
  const ref = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<NodeJS.Timeout>();
  const onOver = () => {
    handleShow();
  };
  const onOut = () => {
    closeTimeout.current = setTimeout(() => {
      setShow(false);
    }, delay);
  };
  const onClick = () => {
    if (show) {
      handleShow();
    } else {
      setShow(false);
    }
  };
  const handleShow = useCallback(() => {
    clearTimeout(closeTimeout.current);
    setShow(true);
  }, []);
  const handleFocusTooltip = () => {
    clearTimeout(closeTimeout.current);
  };
  const handleBlurTooltip = () => {
    onOut();
  };

  useEffect(() => {
    return () => {
      clearTimeout(closeTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (show) {
      const triggerRef = ref.current.getBoundingClientRect();
      const tooltipRefRect = tooltipRef.current.getBoundingClientRect();
      const nextTop = triggerRef.top + triggerRef.height + window.scrollY;
      const nextLeft = triggerRef.left + triggerRef.width / 2 - tooltipRefRect.width / 2 + window.scrollX;
      const nextMaxLeft = window.innerWidth - tooltipRefRect.width - 20;
      const nextMinLeft = 20;
      setTopLeft({
        top: nextTop,
        left: nextLeft,
        maxLeft: nextMaxLeft,
        minLeft: nextMinLeft,
        offsetCaret: tooltipRefRect.width / 2,
        positioned: true,
      });
    } else {
      setTopLeft((prev) => ({ ...prev, positioned: false }));
    }
  }, [show]);

  const tooltipProps = {
    onMouseOver: onOver,
    onMouseOut: onOut,
    onClick,
  };
  return (
    <>
      {React.cloneElement(children, {
        ref,
        title,
        ...tooltipProps,
      })}
      {show
        ? createPortal(
            <div className="app-tooltip-container" style={{ opacity: positioned ? 1 : 0 }}>
              <div className={'app-caret'} style={{ top, left: left + offsetCaret }} />
              <div className="app-tooltip" style={{ top, left: getFromMaxMin(left, minLeft, maxLeft) }}>
                <div>
                  <div
                    className={'app-tooltip-wrapper'}
                    ref={tooltipRef}
                    onMouseOver={handleFocusTooltip}
                    onMouseLeave={handleBlurTooltip}>
                    {renderTooltip || <div className={'app-tooltip-content'}>{title}</div>}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

export default Tooltip;
