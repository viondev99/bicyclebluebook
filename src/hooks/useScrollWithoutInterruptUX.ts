import { useCallback, useEffect, useRef } from 'react';

export function useScrollWithoutInterruptUX(maxDelay: number = 500) {
  const lastScrollTime = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      lastScrollTime.current = +new Date();
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return {
    scrollToTop: useCallback(() => {
      if (lastScrollTime.current < +new Date() - maxDelay) {
        window.scroll({ top: 0 });
      }
    }, [maxDelay]),
    scroll: useCallback(
      (scroll: ScrollOptions) => {
        if (lastScrollTime.current < +new Date() - maxDelay) {
          window.scroll(scroll);
        }
      },
      [maxDelay],
    ),
  };
}
