import React from 'react';
import { Link } from 'react-router-dom';
import * as BsIcons from 'react-icons/bs';

import PropTypes from 'prop-types';

const ContentSortNavbar = ({ columns, sort, handleSort }) => {
    return (
        <>
          <span/>

          {[...Array(columns.length).keys()].map(i =>
            <Link to='#' key={columns[i]} onClick={() => handleSort(columns[i])}>
              {columns[i]}
              {columns[i] === sort.column && !sort.ascending ? 
                <BsIcons.BsCaretUpFill size={22}/> :
                <BsIcons.BsCaretDownFill size={22}/>
              }
            </Link>
          )}
      </>
    );
}

ContentSortNavbar.propTypes = {
  columns: PropTypes.array.isRequired,
  sort: PropTypes.exact({
    column: PropTypes.string.isRequired,
    ascending: PropTypes.bool.isRequired
  }).isRequired,
  handleSort: PropTypes.func.isRequired
}

export default ContentSortNavbar;