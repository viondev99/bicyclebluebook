import { FC, ReactElement, useEffect, useState } from 'react';

interface Props {
  done: boolean;
  children: (v: number) => ReactElement;
  maxProgress?: number;
}

const ProgressProvider: FC<Props> = ({ done, children, maxProgress = 90 }) => {
  const [value, setValue] = useState(0);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!done) {
      const interval = setInterval(() => {
        setValue((p) => Math.min(Math.pow(1 - p, 2) * 0.02 + p, maxProgress / 100));
      }, 20);
      return () => clearInterval(interval);
    }
    setValue(1);
  }, [done, maxProgress]);

  useEffect(() => {
    const a = setTimeout(() => {
      if (!done) {
        setShow(true);
      }
    }, 10);
    return () => clearTimeout(a);
  }, [done]);

  useEffect(() => {
    if (done) {
      const timeout = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [done]);

  return show ? children(Math.floor(value * 100)) : null;
};
export default ProgressProvider;
