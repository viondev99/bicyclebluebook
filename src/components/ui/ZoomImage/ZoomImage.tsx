import React, { ReactElement, FC, useState, useRef, useMemo, useCallback } from 'react';
import cx from 'classnames';

import Zoom from './Zoom/Zoom';
import ZoomModal from './Zoom/ZoomModal';
import classes from './zoom-image.module.scss';

interface Props {
  src: string;
  rightContentId?: string;
  zoomMultiple?: number;
  children: ReactElement;
}

const ZoomImage: FC<Props> = ({ src, rightContentId, zoomMultiple = 5, children }) => {
  const [show, setShow] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [controlMeasure, setControlMeasure] = useState<
    { width: number; height: number; x: number; y: number } | undefined
  >();
  const [zoomMeasure, setZoomMeasure] = useState<{ width: number; height: number; x: number; y: number } | undefined>();
  const [imageMeasure, setImageMeasure] = useState<
    { width: number; height: number; x: number; y: number } | undefined
  >();
  const imageRef = useRef<HTMLDivElement>();

  const controlStyles = useMemo(() => {
    if (controlMeasure) {
      return {
        width: controlMeasure.width,
        height: controlMeasure.height,
        left: controlMeasure.x,
        top: controlMeasure.y,
      };
    }
    return {};
  }, [controlMeasure]);

  const handleMouseMove = useCallback(
    (event) => {
      if (rightContentId) {
        const right = document.getElementById(rightContentId)?.getBoundingClientRect();

        if (right) {
          setZoomMeasure({
            width: right.width,
            height: right.height,
            x: right.x,
            y: right.y,
          });

          const left = imageRef.current.getBoundingClientRect();

          let x = event.clientX - left.x - right.width / (zoomMultiple * 2);
          const minX = 0;
          const maxX = left.width - right.width / zoomMultiple - 2;
          if (x < minX) {
            x = minX;
          }
          if (x > maxX) {
            x = maxX;
          }

          let y = event.clientY - left.y - right.height / (zoomMultiple * 2);
          const minY = 0;
          const maxY = left.height - right.height / zoomMultiple - 2;
          if (y < minY) {
            y = minY;
          }
          if (y > maxY) {
            y = maxY;
          }

          setControlMeasure({
            width: right.width / zoomMultiple,
            height: right.height / zoomMultiple,
            x,
            y,
          });

          setImageMeasure({
            width: left.width * zoomMultiple,
            height: left.height * zoomMultiple,
            x: x * zoomMultiple,
            y: y * zoomMultiple,
          });
        }
      }
      setShow(true);
    },
    [rightContentId, zoomMultiple],
  );

  const handleMouseLeave = useCallback(() => {
    setShow(false);
  }, []);

  const handleClick = useCallback(() => {
    // setShowModal(true);
  }, []);

  const renderZoom = useCallback(() => {
    return show && <Zoom src={src} zoomMeasure={zoomMeasure} imageMeasure={imageMeasure} />;
  }, [show, src, zoomMeasure, imageMeasure]);

  const renderZoomMobile = useCallback(() => {
    return <ZoomModal src={src} show={showModal} onClose={() => setShowModal(false)} />;
  }, [src, showModal]);

  return (
    <div className={classes.container}>
      <div
        className={cx(classes.image, 'd-none', 'd-lg-block')}
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}>
        {children}
        {show && <div className={classes.control} style={controlStyles} />}
      </div>
      <div className={cx(classes.image, 'd-block', 'd-lg-none')} onClick={handleClick}>
        {children}
      </div>
      <div className={cx('d-none', 'd-lg-block')}>{renderZoom()}</div>
      <div className={cx('d-block', 'd-lg-none')}>{renderZoomMobile()}</div>
    </div>
  );
};

export default ZoomImage;
