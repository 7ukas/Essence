import axios from 'axios';

const FetchLikes = async (deleteUrl, postUrl, userId, contentId) => {
    // If content does not exists - POST, if it does - DELETE */
    return await axios.post(postUrl, {
        userId: userId, 
        id: contentId
    })
    .then(response => { return { liked: response.status === 200 } })
    .catch(async () => {
        return await axios.delete(deleteUrl, { withCredentials: true })
        .then(response => { return { liked: response.status !== 200 } });
    });
}

export default FetchLikes;