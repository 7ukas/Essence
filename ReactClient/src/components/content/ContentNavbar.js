import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import * as GrIcons from 'react-icons/gr';

import PropTypes from 'prop-types';

import SearchBar from '../search-bar/SearchBar';
import ContentLayout from './ContentLayout';

import './Content.css';

const ContentNavbar = ({ 
  contentName, 
  addSearchBar, searchedWord, handleSearch,
  page, handlePage, 
  rows, handleRows, rowsString, contentRows, 
  addLayoutBar, layout, handleLayout
}) => {
    return (
        <>
          <div className='group-container'>
            {addSearchBar && 
              <SearchBar
                searchedWord={searchedWord}
                placeholder={`Enter ${contentName}, artist or genre`}
                handleSearch={handleSearch}
              />
            }
  
            <span className='content-navbar-rows me-2'>
              {rowsString}
            </span>
  
            <Link to='#'
              onClick={() => handlePage(page - 1)}
              style={{pointerEvents: page > 1 ? '' : 'none'}}
            >
              <GrIcons.GrFormPrevious className='mb-1' size={24}/>
              <span>Previous</span>
            </Link>
  
            <Link to='#'
              onClick={() => handlePage(page + 1)}
              style={{pointerEvents: page < (contentRows / rows) ? '' : 'none'}}
            >
              <span className='ms-2'>Next</span>
              <GrIcons.GrFormNext className='mb-1' size={24}/>
            </Link>
          </div>
          
          <div className='group-container right'>
            <span className=''>Amount:</span>
            <DropdownButton className='content-navbar-count-dropdown ms-2' 
              id='rows' title={rows} drop='.' 
              onSelect={(e) => handleRows(e)}
            >
              <Dropdown.Item eventKey={20}>20</Dropdown.Item>
              <Dropdown.Item eventKey={50}>50</Dropdown.Item>
              <Dropdown.Item eventKey={100}>100</Dropdown.Item>
            </DropdownButton>
          </div>
            
          {addLayoutBar && 
            <div className='group-container right'>
              <ContentLayout layout={layout} handleLayout={handleLayout} />
            </div>
          }
        </>
    );
}

ContentNavbar.propTypes = {
  contentName: PropTypes.string.isRequired,

  addSearchBar: PropTypes.bool, 
  searchedWord: PropTypes.string, 
  handleSearch: PropTypes.func,

  page: PropTypes.number.isRequired, 
  handlePage: PropTypes.func.isRequired, 

  rows: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  handleRows: PropTypes.func.isRequired, 
  rowsString: PropTypes.string.isRequired, 
  contentRows: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),

  addLayoutBar: PropTypes.bool, 
  layout: PropTypes.number, 
  handleLayout: PropTypes.func
}

ContentNavbar.defaultProps = {
  addSearchBar: false, 
  searchedWord: '', 
  handleSearch: null,

  addLayoutBar: false,
  layout: 0, 
  handleLayout: null
}

export default ContentNavbar;