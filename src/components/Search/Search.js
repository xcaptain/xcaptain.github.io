import React from 'react';
import {
  InstantSearch, connectSearchBox, Hits, Stats, connectPagination, Configure,
} from 'react-instantsearch-dom';
import Pagination from './Pagination';
import SearchBox from './SearchBox';

import Hit from './Hit';

const CustomPagination = connectPagination(Pagination);
const CustomSearchBox = connectSearchBox(SearchBox);

const Search = (props) => {
  const { algolia } = props;

  return (
    <React.Fragment>
      <div className='search'>
        {algolia
          && algolia.appId
          && (
            <InstantSearch
              appId={algolia.appId}
              apiKey={algolia.searchOnlyApiKey}
              indexName={algolia.indexName}
            >
              <CustomSearchBox />
              <Stats />
              <Hits hitComponent={Hit} />
              <Configure
                hitsPerPage={10} />
              <CustomPagination />
            </InstantSearch>
          )}
      </div>
    </React.Fragment>
  );
};

export default Search;
