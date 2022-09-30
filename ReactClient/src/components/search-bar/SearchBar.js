import React from 'react';
import * as AiIcons from 'react-icons/ai';

import PropTypes from 'prop-types';

import './SearchBar.css';

const SearchBar = ({ className, searchedWord, placeholder, handleSearch, handleFocus }) => {
    const searchBarRef = React.useRef(null);

    return (
        <div className={className}>
            <div className='search-inputs'>
                <input
                    type='text'
                    placeholder={placeholder} 
                    ref={searchBarRef}
                    onFocus={() => handleFocus(true)}
                    onBlur={() => handleFocus(false)}
                    onChange={(e) => handleSearch(e.target.value)}
                    value={searchedWord}
                />
            
                <div className='search-icon'>
                {searchedWord.length === 0 ? 
                    <AiIcons.AiOutlineSearch size={26}/> :
                    <AiIcons.AiOutlineClose 
                        size={26} 
                        id='search-clear-btn' 
                        onClick={() => handleSearch('')} 
                    />
                }
                </div>
            </div>
        </div>
    );
}

SearchBar.propTypes = {
    className: PropTypes.string,
    searchedWord: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    handleSearch: PropTypes.func.isRequired,
    handleFocus: PropTypes.func
}

SearchBar.defaultProps = {
    className: 'search me-3',
    placeholder: 'Search'
}

export default SearchBar;