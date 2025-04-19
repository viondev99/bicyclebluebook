import React, { ComponentType, FC, ReactElement, useState } from 'react';
import Script from 'react-load-script';

interface Options {
  src: string;
  loading?: ReactElement;
}

export default function withScript<P extends any>(options: Options) {
  return (Wrapped: ComponentType) => {
    const Child: FC<P> = (props) => {
      const [isLoading, setIsLoading] = useState(true);
      return (
        <>
          <Script onLoad={() => setIsLoading(false)} onError={() => setIsLoading(false)} url={options.src} />
          {isLoading ? options.loading || null : <Wrapped {...props} />}
        </>
      );
    };
    return Child;
  };
}
