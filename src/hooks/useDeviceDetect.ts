import { useEffect, useState } from 'react';

type Devices = 'mobile' | 'tablet' | 'desktop' | 'desktop-xl' | 'mobile-lg';

export const QUERY: Record<Devices, string> = {
  mobile: '(max-width: 575.99px)',
  'mobile-lg': '(max-width: 767.99px)',
  tablet: '(min-width: 576px) and (max-width: 1023.99px)',
  desktop: '(min-width: 1024px)',
  'desktop-xl': '(min-width: 1200px)',
} as const;

const useDeviceDetect = (device: Devices) => {
  const [match, setMatch] = useState(device.includes('desktop'));

  useEffect(() => {
    const media = window.matchMedia(QUERY[device]);
    setMatch(media.matches);
    const handleChange = () => setMatch(media.matches);
    if ('addEventListener' in media) {
      media.addEventListener('change', handleChange);
      return () => {
        media.removeEventListener('change', handleChange);
      };
      // eslint-disable-next-line no-else-return
    } else {
      // deprecated
      // @ts-ignore
      media.addListener(handleChange);
      return () => {
        // deprecated
        // @ts-ignore
        media.removeListener(handleChange);
      };
    }
  }, [device]);

  return match;
};

export default useDeviceDetect;
