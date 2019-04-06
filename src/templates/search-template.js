import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';
import Search from "../components/Search";

const SearchTemplate = (props) => {
  const {
    data: {
      site: {
        siteMetadata: { algolia }
      }
    }
  } = props;

  return (
    <Layout title={'Search'}>
      <Sidebar />
      <Page title="搜索">
        <Search algolia={algolia} />
      </Page>
    </Layout>
  );
};


export const query = graphql`
  query SearchQuery {
    site {
      siteMetadata {
        algolia {
          appId
          searchOnlyApiKey
          indexName
        }
      }
    }
  }
`;

export default SearchTemplate;
