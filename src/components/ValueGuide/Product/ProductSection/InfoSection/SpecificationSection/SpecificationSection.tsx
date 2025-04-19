import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import FormSpecification from './FormSpecification';

const SpecificationSection: FC = () => {
  const detail = useSelector((state: StoreState) => state.valueGuide.bicycle.detail.bicycle);

  const bicycleInfo = useMemo(() => {
    return {
      brandId: detail?.brandId,
      chargerIncluded: false,
      ebikeSubtypeId: '',
      hasKey: false,
      isEbike: detail?.isEbike,
      modelId: detail?.modelId,
      yearId: detail?.yearId,
    };
  }, [detail]);

  return (
    <div className={'my-5'}>
      <FormSpecification bicycleInfo={bicycleInfo} />
    </div>
  );
};

export default SpecificationSection;
