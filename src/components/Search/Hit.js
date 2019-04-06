import React from 'react';
import { Link } from 'gatsby';

const Hit = (props) => {
  const { hit } = props;

  return (
    <React.Fragment>
      <Link to={`${hit.slug}`}>{hit.title}</Link>
    </React.Fragment>
  );
};

export default Hit;
