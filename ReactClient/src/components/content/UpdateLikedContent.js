import FetchLikes from '../fetch-functions/FetchLikes';

const UpdateLikedContent = async (usersContentUrl, userId, id, content) => {
  const deleteUrl = `${usersContentUrl}/${id}`;
  const postUrl = usersContentUrl;  

  // Get id of liked/disliked heart and add/remove it from db and array
  const { liked } = 
    await FetchLikes(deleteUrl, postUrl, userId, id)
    .then(response => {return response});
  
  if (liked) {
    return [...content, { userId, id }];
  } else {
    const index = content.findIndex(item => 
      item.userId === userId && item.id === id
    );

    if (index >= 0) {
      return [...content.slice(0, index), ...content.slice(index + 1)];
    }
  }
}

export default UpdateLikedContent;