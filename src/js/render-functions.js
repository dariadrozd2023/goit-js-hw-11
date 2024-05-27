import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import * as basicLightbox from 'basiclightbox';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  formSearch: document.getElementById('formSearch'),
  inputSearch: document.getElementById('inputSearch'),
  btnSearch: document.getElementById('btnSearch'),
  galleryList: document.querySelector('.js-ImagesCart'),
  loader: document.querySelector('.loader'),
};
refs.formSearch.addEventListener('submit', onBtnSearch);
refs.galleryList.addEventListener('click', showLargeImg);

const lightbox = new SimpleLightbox('.js-ImagesCart a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function onBtnSearch(event) {
  event.preventDefault();
  const URL_SEARCH_IMAGES = 'https://pixabay.com/api/';
  const API_KEY = '43910002-4f8293575df59775d1c0606c1';
  const inputValue = refs.inputSearch.value.trim();

  const params = new URLSearchParams({
    key: API_KEY,
    q: inputValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    lang: 'en',
  });

  refs.loader.style.display = 'block';

  return fetch(`${URL_SEARCH_IMAGES}?${params}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.show({
          message:
            'Sorry, there are no images matching your search query. Please, try again!',
          timeout: 5000,
          backgroundColor: '#EF4040',
        });
        return;
      }
      refs.galleryList.innerHTML = markUpSearchImg(data.hits);
      lightbox.refresh();
    })
    .catch(error => {
      console.log(error);
      iziToast.show({
        message: 'Something went wrong. Please, try again later.',
        timeout: 5000,
        backgroundColor: '#EF4040',
      });
    })
    .finally(() => {
      refs.loader.style.display = 'none';
    // console.log(event.target.elements);
    });
}
function markUpSearchImg(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `
          <li class="js-list">
              <a href="${largeImageURL}"><img class="js-image" src="${webformatURL}" alt="${tags}" /></a>
              <ul class="js-dates">
                  <li class="js-likes">Likes: ${likes}</li>
                  <li class="js-views">Views: ${views}</li>
                  <li class="js-comments">Comments: ${comments}</li>
                  <li class="js-downloads">Downloads: ${downloads}</li>
              </ul>
          </li>
      `
    )
    .join('');
}
function showLargeImg(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  const largeImageURL = event.target.closest('a').href;
  const instance = basicLightbox.create(
    `<img src="${largeImageURL}" width="800" height="600" alt="${event.target.alt}">`,
    {
      onShow: () => {
        document.addEventListener('keydown', handleEscapeKeyPress);
      },
      onClose: () => {
        document.removeEventListener('keydown', handleEscapeKeyPress);
      },
    }
  );
  instance.show();
}
function handleEscapeKeyPress(event) {
  if (event.code === 'Escape') {
    const instance = basicLightbox.visible();
    if (instance) {
      instance.close();
    }
  }
}
