import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const btn = document.querySelector('.btn-load-more');
let searchQuery = '';
let page = 1;
const perPage = 15;

hideLoadMoreButton();

async function fetchAndRender() {
  try {
    showLoader();
    hideLoadMoreButton();
    const data = await getImagesByQuery(searchQuery, page);
    if (data.hits.length === 0) {
      hideLoadMoreButton();
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    const loadedImages = page * perPage;
    if (loadedImages >= data.totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: " We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    // console.log('Error:', error);
    if (page > 1) {
      page -= 1;
      showLoadMoreButton();
    }

    iziToast.error({
      message: 'Something went wrong. Please try again!',
    });
  } finally {
    hideLoader();
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  searchQuery = e.currentTarget.elements['search-text'].value.trim();

  if (searchQuery === '') {
    return;
  }
  clearGallery();
  hideLoadMoreButton();

  page = 1;
  await fetchAndRender();
});

btn.addEventListener('click', async () => {
  page += 1;
  await fetchAndRender();
});
