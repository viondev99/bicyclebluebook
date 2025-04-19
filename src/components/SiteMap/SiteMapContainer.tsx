/* eslint-disable react/jsx-key */
import React, { FC, useCallback } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import { useRouter } from 'next/router';
import Link from 'next/link';
import classes from './site-map-container.module.scss';
import { listDataSiteMapCol1, listDataSiteMapCol2, listDataSiteMapCol3 } from './site-map.constant';

export interface list {
  id: number;
  name: string;
  subArray: { id: number; name: string; link: string }[];
}

const SiteMapContainer: FC = () => {
  const router = useRouter();
  const navigateLink = useCallback(
    (link: string) => {
      window.scrollTo(0, 0);
      router.push(link);
    },
    [router],
  );

  const renderSiteMap = useCallback((list: list[]) => {
    return list.map((item) => {
      return (
        <div className={'mb-5'}>
          <Row>
            <Col>
              <p className={classes.titleListSiteMap}>{item.name}</p>
            </Col>
          </Row>
          {item.subArray.map((el) => {
            return (
              <Row className={'mt-2'}>
                <Col>
                  <span className={classes.subArray}>
                    <Link href={el?.link}>{el?.name}</Link>
                  </span>
                </Col>
              </Row>
            );
          })}
        </div>
      );
    });
  }, []);

  return (
    <div className="position-relative">
      <Container className={classes.container}>
        <Row className={classes.containHeader}>
          <Col>
            <Row>
              <Col>
                <h2>Site Map</h2>
              </Col>
            </Row>
            <Row className={'mt-5'}>
              <Col>
                <p>Find your way around Bicycle Blue Book easily using the links below.</p>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row>
              <Col md={4} xs={12}>
                <div className={classes.content}>{renderSiteMap(listDataSiteMapCol1)}</div>
              </Col>
              <Col md={4} xs={12}>
                <div className={classes.content}>{renderSiteMap(listDataSiteMapCol2?.filter((i) => !!i))}</div>
              </Col>
              <Col md={4} xs={12}>
                <div className={classes.content}>{renderSiteMap(listDataSiteMapCol3)}</div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SiteMapContainer;
