/* eslint-disable no-shadow */
/* eslint-disable import/no-cycle */
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import Row from 'reactstrap/lib/Row';
import Container from 'reactstrap/lib/Container';
import Col from 'reactstrap/lib/Col';
import { useRouter } from 'next/router';
import Pagination from '@ui/Pagination/Pagination';
import useScreenDetect from 'hooks/useScreenDetect';
import Link from 'next/link';
import icArrowBlue from 'assets/img/common/ic_arrow_blue.svg';
import classes from './articles.module.scss';
import ListPostArticles from './ListPostArticlesComponent/listPostArticles';
import { firstBigItemArticle, listPostArticleDefaults } from './listArticleConstant';

const CONFIG_SIZE = 6;

export interface ItemPostArticles {
  index?: number;
  image: string;
  date: string;
  title: string;
  content: string;
  url: string;
}

export type ListPostArticlesType = ItemPostArticles[];

const CoverSection: FC = () => {
  const router = useRouter();
  const { query, replace, pathname } = useRouter();
  const { currentWidthScreen } = useScreenDetect();

  const page = useMemo(() => {
    return query?.page ? Number(query.page) : 1;
  }, [query]);

  const totalPage = useMemo(() => {
    return Math.ceil(listPostArticleDefaults(currentWidthScreen)?.length / CONFIG_SIZE);
  }, [currentWidthScreen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const listArticles = useMemo(() => {
    return listPostArticleDefaults(currentWidthScreen).slice((page - 1) * CONFIG_SIZE, page * CONFIG_SIZE);
  }, [currentWidthScreen, page]);

  const handleChangePage = useCallback(
    (page: number) => {
      replace({
        pathname,
        query: {
          ...query,
          page,
        },
      });
    },
    [pathname, query, replace],
  );

  return (
    <Container className={classes.container}>
      <Row className={classes.headerSection}>
        <div className={classes.wrapTitleArticles}>
          <h1 className={classes.titleArticles}>Articles</h1>
        </div>
      </Row>
      {currentWidthScreen < 768 ? (
        <Col sm={16} className={classes.wrapPostItem}>
          <div className={classes.wrapImage} onClick={() => router.push('/articles/bike-parts-and-maintenance')}>
            <img src={firstBigItemArticle} alt="arrow right icon" className={classes.imageBgr} />
          </div>
          <div className={classes.wrapDescriptions}>
            <span className={classes.customDate}>December 2022</span>
            <div className={classes.customTitle} onClick={() => router.push('/articles/bike-parts-and-maintenance')}>
              A quick and easy guide to bike parts and maintenance
            </div>
            {/* <p className={classes.customContent}>{it.content}</p> */}
            <span className={classes.wrapUrl}>
              <Link href="/articles/bike-parts-and-maintenance">
                <a className={classes.customUrlPost}>
                  Read article <img src={icArrowBlue} alt="arrow right icon" className={classes.customImage} />
                </a>
              </Link>
            </span>
          </div>
        </Col>
      ) : (
        <Row className={classes.sectionBody1} onClick={() => router.push('/articles/bike-parts-and-maintenance')}>
          <div className={classes.coverSection1}>
            <img src={firstBigItemArticle} alt="arrow right icon" className={classes.imageBgr} />
            <span className={classes.wrapTitle}>
              <p className={classes.title1}>A quick and easy guide to bike parts and maintenance</p>
            </span>
          </div>
        </Row>
      )}

      <Row className={classes.sectionBody2}>
        <ListPostArticles listPosts={listArticles} />
      </Row>
      <Row className={classes.wrapPagination}>
        <div className={classes.customPagination}>
          <Pagination onChangePage={handleChangePage} totalPage={totalPage} page={page} />
        </div>
      </Row>
    </Container>
  );
};

export default CoverSection;
