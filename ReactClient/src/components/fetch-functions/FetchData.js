import axios from 'axios';

const FetchData = async (url, setData) => {
  await axios.get(url, { withCredentials: true })
  .then(response => setData(response.data));
}

export default FetchData;