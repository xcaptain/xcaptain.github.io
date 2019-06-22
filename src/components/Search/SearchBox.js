import React from 'react';
import styles from './SearchBox.module.scss';

const SearchBox = ({ currentRefinement, refine }) => (
  <React.Fragment>
    <form noValidate action="" role="search" className={styles['ais-SearchBox-form']}>
      <input
        className={styles['ais-SearchBox-input']}
        type="search"
        value={currentRefinement}
        onChange={(event) => refine(event.currentTarget.value)}
      />
    </form>
  </React.Fragment>
);

export default SearchBox;
