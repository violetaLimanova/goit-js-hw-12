import axios from 'axios';

const basaUrl = 'https://pixabay.com/api/';
const apiKey = '58324539-50fa88a5fc3a10b330f7f018f';

export async function getImagesByQuery(query, page) {
  const response = await axios.get(basaUrl, {
    params: {
      key: apiKey,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 15,
    },
  });

  return response.data;
}
