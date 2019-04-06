import React from 'react';
import styles from './SearchBox.module.scss';
import AlgoliaIcon from '!svg-react-loader!./search-by-algolia.svg?name=AlgoliaLogo';

const SearchBox = ({ currentRefinement, refine }) => (
  <React.Fragment>
    <div className={styles['icon']}>
      <AlgoliaIcon />
    </div>

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
