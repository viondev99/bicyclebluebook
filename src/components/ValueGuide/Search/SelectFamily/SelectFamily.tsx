import React, { useCallback } from 'react';
import Card from '@ui/Cards';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import useScreenDetect from 'hooks/useScreenDetect';
import { useRouter } from 'next/router';
import { TrackingEvent } from 'model/store/value-guide.model';
import { trackingEventController } from 'store/value-guide/value-guide.action';
import SelectFamilyMobile from './SelectFamilyMobile';
import classes from './select-family.module.scss';

const SelectFamily = () => {
  const families = useSelector((store: StoreState) => store.valueGuide.family.families);
  const brandId = useSelector((store: StoreState) => store.valueGuide.model.list.brandIdSearchValueGuide);
  const router = useRouter();
  const { query } = useRouter();
  const currentDevice = useScreenDetect();
  const dispatch = useDispatch();

  const handleSelectModel = useCallback(
    (name: string) => {
      const params = {
        brandId: Number(brandId),
        event: TrackingEvent.SearchProductFamily,
        productFamily: name,
      };
      dispatch(trackingEventController(params));
      router.push(`/value-guide/${encodeURIComponent(`${query?.brandName}`)}/${encodeURIComponent(name)}`);
    },
    [brandId, dispatch, query, router],
  );

  return (
    <>
      {currentDevice.isMediumScreen() ? (
        <SelectFamilyMobile families={families} handleSelectModel={handleSelectModel} />
      ) : (
        <Card className={classes.wrapper}>
          <Row>
            {families.map((item: string) => (
              <Col md={3} key={item} className={classes.family} onClick={() => handleSelectModel(item)}>
                <h4 className={classes.name}>{item}</h4>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </>
  );
};

export default SelectFamily;
