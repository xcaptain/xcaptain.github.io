import React from 'react';
import classNames from 'classnames/bind';
import { PAGINATION } from '../../constants';
import styles from '../Pagination/Pagination.module.scss';

const cx = classNames.bind(styles);

const Pagination = ({
  currentRefinement, nbPages,
  refine,
}) => {
  const hasPrevPage = currentRefinement > 1;
  const hasNextPage = currentRefinement < nbPages;

  const prevClassName = cx({
    'pagination__prev-link': true,
    'pagination__prev-link--disable': !hasPrevPage
  });

  const nextClassName = cx({
    'pagination__next-link': true,
    'pagination__next-link--disable': !hasNextPage
  });

  const prevPage = currentRefinement > 1 ? currentRefinement - 1 : 1;
  const nextPage = currentRefinement < nbPages ? currentRefinement + 1 : nbPages;

  return (
    <div className={styles['pagination']}>
      <div className={styles['pagination__prev']}>
        <a rel="prev" onClick={(event) => {
          event.preventDefault();
          refine(prevPage);
        }} className={prevClassName}>{PAGINATION.PREV_PAGE}</a>
      </div>
      <div className={styles['pagination__next']}>
        <a rel="next" onClick={(event) => {
          event.preventDefault();
          refine(nextPage);
        }} className={nextClassName}>{PAGINATION.NEXT_PAGE}</a>
      </div>
    </div>
  );
};

export default Pagination;
