import React, { FC, useMemo } from 'react';
import { createPortal } from 'react-dom';

import classes from './zoom.module.scss';

interface Props {
  src: string;
  zoomMeasure?: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  imageMeasure?: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
}

const Zoom: FC<Props> = ({ src, zoomMeasure, imageMeasure }) => {
  const zoomStyles = useMemo(() => {
    if (zoomMeasure) {
      return { width: zoomMeasure.width, height: zoomMeasure.height, left: zoomMeasure.x, top: zoomMeasure.y };
    }
    return {};
  }, [zoomMeasure]);

  const imageStyles = useMemo(() => {
    if (imageMeasure) {
      return {
        width: imageMeasure.width,
        height: imageMeasure.height,
        transform: `translate(${-imageMeasure.x}px, ${-imageMeasure.y}px)`,
      };
    }
    return {};
  }, [imageMeasure]);

  return createPortal(
    <div className={classes.zoom} style={zoomStyles}>
      <img style={imageStyles} src={src} alt={'error'} />
    </div>,
    document.body,
  );
};

export default Zoom;
