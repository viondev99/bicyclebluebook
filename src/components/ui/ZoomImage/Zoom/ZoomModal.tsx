import React, { FC, useState, useRef, useEffect, useCallback } from 'react';

import Modal from '@ui/Modal/Modal';
import classes from './zoom.module.scss';

interface Props {
  src: string;
  show: boolean;
  onClose: () => void;
}

const BodyContent: FC<{ src: string }> = ({ src }) => {
  const [styles, setStyles] = useState<{
    transform?: string;
    transition?: string;
  }>({});
  const imageRef = useRef<HTMLImageElement>();

  const getCoords = useCallback(() => {
    const measure = imageRef.current.getBoundingClientRect();

    const { body, documentElement } = document;

    const scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || documentElement.scrollLeft || body.scrollLeft;

    const clientTop = documentElement.clientTop || body.clientTop || 0;
    const clientLeft = documentElement.clientLeft || body.clientLeft || 0;

    const top = measure.top + scrollTop - clientTop;
    const left = measure.left + scrollLeft - clientLeft;

    return { x: Math.round(left), y: Math.round(top) };
  }, []);

  const getRelativePosition = useCallback(
    (position: { x: number; y: number }, scale: number) => {
      const coords = getCoords();
      const x = position.x - coords.x;
      const y = position.y - coords.y;

      const relativeX = x / ((imageRef.current.clientWidth * scale) / 2) - 1;
      const relativeY = y / ((imageRef.current.clientHeight * scale) / 2) - 1;

      return { x: relativeX, y: relativeY };
    },
    [getCoords],
  );

  const getCoordinateShiftDueToScale = useCallback((scale: number) => {
    const newWidth = scale * imageRef.current.clientWidth;
    const newHeight = scale * imageRef.current.clientHeight;
    const x = (newWidth - imageRef.current.clientWidth) / 2;
    const y = (newHeight - imageRef.current.clientHeight) / 2;
    return { x, y };
  }, []);

  const scaleFrom = useCallback(
    (zoom: { x: number; y: number }, currentScale: number, newScale: number) => {
      const currentShift = getCoordinateShiftDueToScale(currentScale);
      const newShift = getCoordinateShiftDueToScale(newScale);

      const scale = newScale - currentScale;

      const shift = {
        x: currentShift.x - newShift.x,
        y: currentShift.y - newShift.y,
      };

      const output = {
        x: zoom.x * shift.x,
        y: zoom.y * shift.y,
        scale,
      };

      return output;
    },
    [getCoordinateShiftDueToScale],
  );

  useEffect(() => {
    import('hammerjs')
      .then((hammer) => {
        const Hammer = hammer.default;
        const imageHammer = new Hammer(imageRef.current);
        imageHammer.get('pinch').set({
          enable: true,
        });

        const maxScale = 3;

        const current = {
          x: 0,
          y: 0,
          scale: 1,
          zooming: false,
        };

        const last = {
          x: current.x,
          y: current.y,
          scale: current.scale,
        };

        imageHammer.on('doubletap', (event) => {
          let scaleTemp = 1;
          if (!current.zooming) {
            current.zooming = false;
          } else {
            current.zooming = false;
            scaleTemp = -scaleTemp;
          }
          const zoom = getRelativePosition({ x: event.center.x, y: event.center.y }, current.scale);
          const measure = scaleFrom(zoom, current.scale, current.scale + scaleTemp);
          current.x += measure.x;
          current.y += measure.y;
          current.scale += measure.scale;

          last.x = current.x;
          last.y = current.y;
          last.scale = current.scale;

          if (current.scale > maxScale) {
            current.x = 0;
            current.y = 0;
            current.scale = 1;

            last.x = current.x;
            last.y = current.y;
            last.scale = current.scale;
          }

          setStyles({
            transform: `translate3d(${current.x}px, ${current.y}px, 0px) scale3d(${current.scale}, ${current.scale}, 1)`,
            transition: 'transform 0.2s ease-in-out',
          });
        });

        let pinchZoom = { x: 0, y: 0 };

        imageHammer.on('pinch', (event) => {
          const measure = scaleFrom(pinchZoom, last.scale, last.scale * event.scale);
          current.x = measure.x + last.x + event.deltaX;
          current.y = measure.y + last.y + event.deltaY;
          current.scale = measure.scale + last.scale;

          setStyles({
            transform: `translate3d(${current.x}px, ${current.y}px, 0px) scale3d(${current.scale}, ${current.scale}, 1)`,
          });
        });

        const pinchStart = { x: 0, y: 0 };

        imageHammer.on('pinchstart', (event) => {
          pinchStart.x = event.center.x;
          pinchStart.y = event.center.y;
          pinchZoom = getRelativePosition({ x: pinchStart.x, y: pinchStart.y }, current.scale);
        });

        imageHammer.on('pinchend', () => {
          last.x = current.x;
          last.y = current.y;
          last.scale = current.scale;
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, [getRelativePosition, scaleFrom]);

  return <img ref={imageRef} className={classes.img} src={src} style={styles} alt={'error'} />;
};

const ZoomModal: FC<Props> = ({ src, show, onClose }) => {
  return (
    <Modal
      className={classes.zoomModal}
      contentClassName={classes.contentZoomModal}
      bodyProps={{
        className: classes.bodyZoomModal,
      }}
      isOpen={show}
      onClose={onClose}>
      <BodyContent src={src} />
    </Modal>
  );
};

export default ZoomModal;
