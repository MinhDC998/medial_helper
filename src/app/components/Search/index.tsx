import React from 'react';
import { useParams } from 'react-router-dom';

import routesEndpoint from '@routers/routersEndpoint';

import SearchBySick from './searchBySick';
import SearchByMedicine from './searchByMedicine';

import './styles.scss';

function Search() {
  const params = useParams();

  const renderSearchContent = () => {
    switch (params.by) {
      case routesEndpoint.searchByMedicine:
        return <SearchByMedicine />;

      case routesEndpoint.searchBySick:
        return <SearchBySick />;

      default:
        throw new Error('No content');
    }
  };

  return <div className="main_content">{renderSearchContent()}</div>;
}

export default Search;
