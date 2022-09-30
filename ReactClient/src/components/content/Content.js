import React from 'react';
import * as FaIcons from 'react-icons/fa';

import PropTypes from 'prop-types';
import { useDebounce } from 'use-lodash-debounce';

import { UserContext } from '../../context/UserContext';
import ContentSortNavbar from './ContentSortNavbar';
import ContentNavbar from './ContentNavbar';
import ContentList from './ContentList'
import UpdateLikedContent from './UpdateLikedContent';
import LoadingEllipsis from '../loading-ellipsis/LoadingEllipsis';
import FetchRows from '../fetch-functions/FetchRows';
import FetchData from '../fetch-functions/FetchData';
import Api from '../../Api';

import './Content.css'
import './Heart.css'

const PAGE = 1;
const ROWS = 20;
const LAYOUT = 2;
const SORT = {
  column: 'Title',
  ascending: true
};

const Content = ({ contentName, icon, contentUrl, usersContentUrl }) => {
  const pluralName = `${contentName.charAt(0).toUpperCase()}${contentName.slice(1)}s`; // 'item' => 'Items'
  const columns = contentName !== 'playlist' ? ['Title', 'Artist', 'Genre'] : ['Title', 'Owner'];
  const isPlaylist = contentName === 'playlist';

  /* Fetch trigger */
  const [fetch, setFetch] = React.useState(true);
  
  /* User Context */
  const { user } = React.useContext(UserContext);
  const isLoggedIn = user.userId !== undefined;

  /* Page */
  const [page, setPage] = React.useState(PAGE);

  const handlePage = (value) => {
    const minRows = ((value - 1) * rows) + 1;

    if (value > 0 && minRows <= contentRows) {
      setPage(value);
      setFetch(true);
    }
  }

  /* Rows */
  const [rows, setRows] = React.useState(ROWS);

  const handleRows = (value) => {
    setPage(PAGE);
    setSort(SORT);
    setRows(value);
    setFetch(true);
  }

  /* Rows String */
  const [rowsString, setRowsString] = React.useState('');

  const handleRowsString = () => {
    let minRows = ((page - 1) * rows) + 1;
    let maxRows = page * rows;

    if (maxRows > contentRows) {maxRows = contentRows;}
    if (minRows > maxRows) {minRows = maxRows;}
    
    setRowsString(`${minRows} - ${maxRows} of ${contentRows}`);
  }

  /* Search */
  const [searchedWord, setSearchedWord] = React.useState('');
  const debounceSearch = useDebounce(searchedWord, 400);

  const handleSearch = (value) => {
    setPage(PAGE);
    setRows(ROWS);
    setSort(SORT);
    setSearchedWord(value);
  }

  React.useEffect(() => {
    setFetch(true);
  }, [debounceSearch])

  /* Sort */
  const [sort, setSort] = React.useState(SORT)

  const handleSort = (column) => {
    setSort({
      column: column,
      ascending: column === sort.column ? !sort.ascending : false
    })
    setFetch(true);
  }

  /* Layout */
  const [layout, setLayout] = React.useState(LAYOUT);

  /* Content */
  const [contentList, setContentList] = React.useState([]);
  const [contentRows, setContentRows] = React.useState(0);
  const [isContentLoading, setIsContentLoading] = React.useState(true);
  const [isContentNotFound, setIsContentNotFound] = React.useState(false);

  React.useEffect(() => {
    handleRowsString();
  }, [contentRows, contentList])

  // Incase of unsuccesful output - render loading/not found messages
  React.useEffect(() => {
    setIsContentLoading(contentList.length < 1 && searchedWord.length < 1);
    setIsContentNotFound(contentList.length < 1 && searchedWord.length > 0);
  }, [contentList, searchedWord])

  React.useEffect(() => {
    if (searchedWord.length < 1) {
      const contentRowsUrl = `${Api.TablesRows}/${pluralName}`;
      FetchRows(contentRowsUrl, setContentRows, false);
    }
  }, [searchedWord])

  // Render content
  React.useEffect(() => {
    if (fetch) {
      const isSearched = searchedWord.length > 0;
      const sortName = `${sort.column}${sort.ascending ? 'Asc' : 'Desc'}`

      if (isSearched) {
        let contentRowsUrl = `${contentUrl}?page=1&rows=99999&q=${searchedWord}`;
        FetchRows(contentRowsUrl, setContentRows, isSearched);
      }
  
      const contentListUrl = `${contentUrl}?page=${page}&rows=${rows}&q=${searchedWord}&sort=${sortName}`;
      FetchData(contentListUrl, setContentList);
  
      setFetch(false);
    }
  }, [fetch])

  /* Render Hearts - Get all the liked content to set hearts to liked/not */
  const [likedContent, setLikedContent] = React.useState([]);

  const handleLikedContent = async (id) => {
    if (isLoggedIn) {
      const content = await UpdateLikedContent(usersContentUrl, user.userId, id, likedContent);
      setLikedContent(content);
    }
  }

  React.useEffect(() => {
    if (isLoggedIn) {
      let likedContentUrl = usersContentUrl;
      FetchData(likedContentUrl, setLikedContent);
    }
  }, [user.userId])
  
  
  
  return (
    <div className='content-container'>
      <div className='content-header'>
        {icon}
        <span>{pluralName}</span>
      </div>
      <div className='content-sort-navbar'>
        <ContentSortNavbar
          columns={columns}
          sort={sort}
          handleSort={handleSort}
        />
      </div>

      <div className='content-navbar top'>
        <ContentNavbar 
          contentName={contentName}
          addSearchBar={true}
          searchedWord={searchedWord}
          handleSearch={handleSearch}
          rowsString={rowsString}
          handlePage={handlePage}
          page={page}
          contentRows={contentRows}
          rows={rows}
          handleRows={handleRows}
          addLayoutBar={true}
          layout={layout}
          handleLayout={setLayout}
        />
      </div>

      {isContentLoading && 
        <h4 className='content-list-loading'>
          <LoadingEllipsis/>
        </h4>
      }

      {isContentNotFound && 
        <h4 className='content-list-not-found'>
          <FaIcons.FaSearchMinus size={72}/><br/>
            No {pluralName.toLowerCase()} were found matching specified keyword:<br/>
            "<u>{searchedWord}</u>"
        </h4>
      }

      <div className='content-list'>
        <ContentList
          name={contentName}
          icon={icon}
          layout={layout}
          content={contentList}
          likedContent={likedContent}
          handleLikedContent={handleLikedContent}
        />
      </div>

      <div className='content-navbar'>
        <ContentNavbar 
          contentName={contentName}
          rowsString={rowsString}
          handlePage={handlePage}
          page={page}
          contentRows={contentRows}
          rows={rows}
          handleRows={handleRows}
        />
      </div>

    </div>
  );
}

Content.propTypes = {
  contentName: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired, 
  contentUrl: PropTypes.string.isRequired, 
  usersContentUrl: PropTypes.string.isRequired
}

export default Content;