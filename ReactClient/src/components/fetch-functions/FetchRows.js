import axios from 'axios';

const FetchRows = async (url, setData, isSearched) => {
  await axios.get(url).then(response => 
    setData(!isSearched ? 
      response.data.rows : 
      [...response.data].length
    )
  );
}

export default FetchRows;