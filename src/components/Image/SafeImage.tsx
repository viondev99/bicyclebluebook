import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { CircularProgressbar } from 'react-circular-progressbar';
import withLazyProps from '../../hocs/withLazyProps';
import { NO_BIKE_PICTURE } from '../../constants/common';
import ProgressProvider from './ProgressProvider';
import 'react-circular-progressbar/dist/styles.css';
import classes from './safe-image.module.scss';

export enum SIZE {
  large = 'l',
  small = 's',
  original = 'o',
}

const replacePattern = /zoom|original|small|large/;

function normalizeSourceImage(src: string | undefined) {
  if (!src) {
    return '';
  }
  // if (!src.includes('https://')) {
  if (!/^https?:\/\//.test(src)) {
    return `https://${src}`;
  }
  return src;
}

const ErrorImageSession: string[] = [];

function tryLoadImage(src: string) {
  return new Promise((resolve, reject) => {
    if (ErrorImageSession.indexOf(src) > -1) {
      reject();
      return;
    }
    const image = new Image();
    image.src = src;
    if (image.complete) {
      return resolve(src);
    }
    image.onload = () => {
      resolve(src);
    };
    image.onerror = () => {
      ErrorImageSession.push(src);
      reject();
    };
  });
}

const cloudFrontSizeMap: {
  [key: string]: string;
} = {
  s: '320',
  l: '500',
};
const mapSizePropToSize: {
  [key: string]: string;
} = {
  s: 'small',
  l: 'large',
  o: 'original',
};

type Size = SIZE | 'l' | 's' | 'o';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  imgSize: Size;
  fallback?: string;
  renderLoading: ReactElement;
  prerenderWhileLoading: boolean;
  showProgress: boolean;
}

const SafeImage: FC<Props> = ({
  renderLoading,
  imgSize = 'o',
  fallback = NO_BIKE_PICTURE,
  src = fallback,
  style,
  className,
  alt,
  prerenderWhileLoading,
  showProgress,
  ...other
}) => {
  const getSrcWith = useCallback(
    (size: Size) => {
      const result = normalizeSourceImage(src);
      if (
        result.includes('d3toes8bkuiayb.cloudfront.net') ||
        result.includes('d1eye5spyas0l1.cloudfront.net/inventories')
      ) {
        if (size === 'l' || size === 's') {
          return result.replace(replacePattern, cloudFrontSizeMap[size]);
        }
      } else {
        return result.replace(replacePattern, mapSizePropToSize[size]);
      }
      return result;
    },
    [src],
  );

  const [currentSrc, setCurrentSrc] = useState(getSrcWith(imgSize));
  const [imageLoaded, setImageLoaded] = useState(false);
  const unmounted = useRef(null);

  useEffect(() => {
    unmounted.current = false;
    return () => {
      unmounted.current = true;
    };
  }, []);

  const tryLoadWith = useCallback((imageSrc: string | undefined) => {
    return tryLoadImage(imageSrc);
  }, []);

  useEffect(() => {
    tryLoadWith(getSrcWith(imgSize))
      .then(() => {
        if (!unmounted.current) {
          setCurrentSrc(getSrcWith(imgSize));
          setImageLoaded(true);
        }
      })
      .catch(() => {
        if (!unmounted.current) {
          tryLoadWith(src)
            .then(() => {
              if (!unmounted.current) {
                setCurrentSrc(src);
                setImageLoaded(true);
              }
            })
            .catch(() => {
              if (!unmounted.current) {
                setCurrentSrc(fallback);
                setImageLoaded(true);
              }
            });
        }
      });
  }, [fallback, getSrcWith, imgSize, src, tryLoadWith]);
  const renderProgress = () => {
    return (
      <div className={classes.progressWrapper} key={'p'}>
        <ProgressProvider done={imageLoaded}>
          {(value) => (
            <CircularProgressbar
              strokeWidth={5}
              // styles={buildStyles({
              //   strokeLinecap: 'butt',
              //   backgroundColor: '#4cb3e4',
              // })}
              value={value}
            />
          )}
        </ProgressProvider>
      </div>
    );
  };

  if (!imageLoaded) {
    return (
      <>
        {prerenderWhileLoading && <img alt={alt} className={'d-none'} src={currentSrc} {...other} />}
        {renderLoading ? (
          React.cloneElement(renderLoading, { style, className, ...other })
        ) : (
          <div style={style} className={className}>
            <Skeleton height={'100%'} width={'100%'} />
          </div>
        )}
        {showProgress && renderProgress()}
      </>
    );
  }

  return (
    <>
      <img alt={alt} style={style} className={className} src={currentSrc} {...other} />
      {showProgress && renderProgress()}
    </>
  );
};

export default withLazyProps(SafeImage);
