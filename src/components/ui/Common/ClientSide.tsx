import { FC, useEffect, useState } from 'react';

const ClientSide: FC<any> = ({ children }) => {
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);
  return isClientSide ? children : null;
};

export default ClientSide;
