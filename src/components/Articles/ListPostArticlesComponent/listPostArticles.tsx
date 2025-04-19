/* eslint-disable no-redeclare */
/* eslint-disable import/no-cycle */
import React, { FC, useCallback, useMemo } from 'react';
import { Col } from 'reactstrap';
import icArrowBlue from 'assets/img/common/ic_arrow_blue.svg';
import { useRouter } from 'next/router';
import classes from './listPostArticles.module.scss';
import { ListPostArticlesType } from '..';

interface Props {
  listPosts: ListPostArticlesType;
}

const ListPostArticles: FC<Props> = ({ listPosts }) => {
  const router = useRouter();

  const handleReadArticle = useCallback(
    (link: string) => {
      router.push(`${link}`);
    },
    [router],
  );

  const renderListPost = useMemo(() => {
    return (
      <>
        {listPosts?.map((it) => (
          <Col lg={6} md={6} sm={16} className={classes.wrapPostItem} key={it.index}>
            <div className={classes.wrapImage} onClick={() => handleReadArticle(it?.url)}>
              <img src={it?.image} alt="" className={classes.imageBgr} />
            </div>
            <div className={classes.wrapDescriptions}>
              <span className={classes.customDate}>{it.date}</span>
              <div className={classes.customTitle} onClick={() => handleReadArticle(it?.url)}>
                {it.title}
              </div>
              {/* <p className={classes.customContent}>{it.content}</p> */}
              <span className={classes.wrapUrl}>
                <a href={it.url} className={classes.customUrlPost}>
                  Read article <img src={icArrowBlue} alt="arrow right icon" className={classes.customImage} />
                </a>
              </span>
            </div>
          </Col>
        ))}
      </>
    );
  }, [listPosts, handleReadArticle]);

  return renderListPost;
};

export default ListPostArticles;
