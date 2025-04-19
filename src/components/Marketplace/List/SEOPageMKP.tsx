/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { ContentSEOMKP, getSeoMKP } from 'helpers/constraintSeoMKP';
import { useRouter } from 'next/router';
import React, { FC, useMemo, useState } from 'react';
import cx from 'classnames';
import { isProduction } from 'helpers/utilities.helper';
import icDropDown from 'assets/img/common/ic_dropdown.svg';
import classes from './list-product.module.scss';

const SEOPageMKP: FC = () => {
  const { query, asPath } = useRouter();
  const [dropdown, setDropdown] = useState(false);
  const renderContentSEO: ContentSEOMKP = useMemo(() => {
    const typeBikeNameT = query.t || '';
    const typeBikeNameB = query.b || '';

    if (typeBikeNameB === '683') {
      return getSeoMKP().GIANT_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '714') {
      return getSeoMKP().NORCO_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '685') {
      return getSeoMKP().GT_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '681') {
      return getSeoMKP().FUJI_BIKES_FOR_SALE;
    }
    if (typeBikeNameT === 'Road') {
      return getSeoMKP().ROAD_BIKES_FOR_SALE;
    }
    if (typeBikeNameT === 'Mountain') {
      return getSeoMKP().USED_MOUNTAIN_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '750') {
      return getSeoMKP().TREK_BIKES_FOR_SALE;
    }
    if (!isProduction() && typeBikeNameB === '1312') {
      return getSeoMKP().TREK_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '694') {
      return getSeoMKP().KONA_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '679') {
      return getSeoMKP().DIAMONDBACK_BIKES_FOR_SALE;
    }
    if (typeBikeNameB === '723') {
      return getSeoMKP().RALEIGH_BIKES_FOR_SALE;
    }
    if (typeBikeNameT === 'Hybrid') {
      return getSeoMKP().HYBRID_BIKES_FOR_SALE;
    }
    if (asPath === '/value-guide/Gary%20Fisher/') {
      return getSeoMKP().GARY_FISHER_BIKES_FOR_SALE;
    }
    if (asPath.includes('/marketplace/buy-now')) {
      return getSeoMKP().USED_BIKES_FOR_SALE;
    }
    return null;
  }, [query, asPath]);

  if (!renderContentSEO) return null;
  return (
    <div className="my-5">
      <div className={classes.customArrowDropdown}>
        <img
          src={icDropDown}
          alt=""
          width={18}
          height={8}
          className={cx(classes.arrowDropdown, { [classes.rotage]: !dropdown })}
          onClick={() => setDropdown(!dropdown)}
        />
      </div>
      <div className={cx(classes.SEOContainer, { 'd-none': !dropdown })}>
        <h1 className={classes.h1ClassName}>{renderContentSEO?.title}</h1>
        <div>{renderContentSEO?.subTitle}</div>
        <h2 className={cx('mt-5', classes.h2ClassName)}>{renderContentSEO?.section1.title}</h2>
        <div>{renderContentSEO?.section1.content.subContent}</div>
        {renderContentSEO.section1?.content.option1 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section1?.content.option1?.title}</h3>
            <div>{renderContentSEO.section1?.content.option1?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section1?.content.option2 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section1?.content.option2?.title}</h3>
            <div>{renderContentSEO.section1?.content.option2?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section1?.content.option3 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section1?.content.option3?.title}</h3>
            <div>{renderContentSEO.section1?.content.option3?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section1?.content.option4 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section1?.content.option4?.title}</h3>
            <div>{renderContentSEO.section1?.content.option4?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section1?.content.option5 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section1?.content.option5?.title}</h3>
            <div>{renderContentSEO.section1?.content.option5?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section1?.content.option6 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section1?.content.option6?.title}</h3>
            <div>{renderContentSEO.section1?.content.option6?.subOption}</div>{' '}
          </>
        ) : null}
        {renderContentSEO.section1?.content.option7 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section1?.content.option7?.title}</h3>
            <div>{renderContentSEO.section1?.content.option7?.subOption}</div>{' '}
          </>
        ) : null}

        <h2 className={cx('mt-5', classes.h2ClassName)}>{renderContentSEO?.section2.title}</h2>
        <div>{renderContentSEO?.section2.content.subContent}</div>
        {renderContentSEO.section2?.content.option1 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section2?.content.option1?.title}</h3>
            <div>{renderContentSEO.section2?.content.option1?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section2?.content.option2 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section2?.content.option2?.title}</h3>
            <div>{renderContentSEO.section2?.content.option2?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section2?.content.option3 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section2?.content.option3?.title}</h3>
            <div>{renderContentSEO.section2?.content.option3?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section2?.content.option4 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section2?.content.option4?.title}</h3>
            <div>{renderContentSEO.section2?.content.option4?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section2?.content.option5 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section2?.content.option5?.title}</h3>
            <div>{renderContentSEO.section2?.content.option5?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section2?.content.option6 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section2?.content.option6?.title}</h3>
            <div>{renderContentSEO.section2?.content.option6?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section2?.content.option7 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section2?.content.option7?.title}</h3>
            <div>{renderContentSEO.section2?.content.option7?.subOption}</div>
          </>
        ) : null}

        <h2 className={cx('mt-5', classes.h2ClassName)}>{renderContentSEO?.section3.title}</h2>
        <div>{renderContentSEO?.section3.content.subContent}</div>
        {renderContentSEO.section3?.content.option1 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section3?.content.option1?.title}</h3>
            <div>{renderContentSEO.section3?.content.option1?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section3?.content.option2 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section3?.content.option2?.title}</h3>
            <div>{renderContentSEO.section3?.content.option2?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section3?.content.option3 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section3?.content.option3?.title}</h3>
            <div>{renderContentSEO.section3?.content.option3?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section3?.content.option4 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section3?.content.option4?.title}</h3>
            <div>{renderContentSEO.section3?.content.option4?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section3?.content.option5 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section3?.content.option5?.title}</h3>
            <div>{renderContentSEO.section3?.content.option5?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section3?.content.option6 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section3?.content.option6?.title}</h3>
            <div>{renderContentSEO.section3?.content.option6?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section3?.content.option7 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section3?.content.option7?.title}</h3>
            <div>{renderContentSEO.section3?.content.option7?.subOption}</div>
          </>
        ) : null}

        <h2 className={cx('mt-5', classes.h2ClassName)}>{renderContentSEO?.section4.title}</h2>
        <div>{renderContentSEO?.section4.content.subContent}</div>
        {renderContentSEO.section4?.content.option1 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section4?.content.option1?.title}</h3>
            <div>{renderContentSEO.section4?.content.option1?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section4?.content.option2 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section4?.content.option2?.title}</h3>
            <div>{renderContentSEO.section4?.content.option2?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section4?.content.option3 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section4?.content.option3?.title}</h3>
            <div>{renderContentSEO.section4?.content.option3?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section4?.content.option4 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section4?.content.option4?.title}</h3>
            <div>{renderContentSEO.section4?.content.option4?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section4?.content.option5 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section4?.content.option5?.title}</h3>
            <div>{renderContentSEO.section4?.content.option5?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section4?.content.option6 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section4?.content.option6?.title}</h3>
            <div>{renderContentSEO.section4?.content.option6?.subOption}</div>
          </>
        ) : null}
        {renderContentSEO.section4?.content.option7 ? (
          <>
            <h3 className={cx('mt-5', classes.h3ClassName)}>{renderContentSEO.section4?.content.option7?.title}</h3>
            <div>{renderContentSEO.section4?.content.option7?.subOption}</div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SEOPageMKP;
