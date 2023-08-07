import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.headers.common['x-api-key'] =
  'live_OtFwWvpZeBBpl5HTrfp0f9p2srvbxg4uiKmGiFLtGMzarx3Fnq7taZvcXyww45X6';

const refs = {
  selectBreedCat: document.querySelector('.breed-select'),
  infoForCat: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  errorFetch: document.querySelector('.error'),
};

refs.selectBreedCat.addEventListener('change', onSelectChange);
createCatOptions();
function onSelectChange(e) {
  refs.loader.classList.remove('is-hidden');
  refs.infoForCat.classList.add('is-hidden');
  const idBreedCat = e.currentTarget.value;
  fetchCatByBreed(idBreedCat)
    .then(data => {
      markupRender(data);
      refs.loader.classList.add('is-hidden');
      refs.infoForCat.classList.remove('is-hidden');
    })
    .catch(error => {
      refs.loader.classList.add('is-hidden');
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
    });
}
function markupRender(data) {
  const { breeds, url } = data[0];
  const { name, temperament, description } = breeds[0];
  const markupCard = `<img class="cat-img" width = "350px" src="${url}" alt="${name}">
  <div>
  <h2>${name}</h2>
  <p>${description}</p>
  <p"><span class="cat-temperament">Temperament:</span> ${temperament}</p>  
  </div>`;

  refs.infoForCat.innerHTML = markupCard;
}
function createCatOptions() {
  refs.loader.classList.remove('is-hidden');
  refs.selectBreedCat.classList.add('is-hidden');
  refs.errorFetch.classList.add('is-hidden');
  fetchBreeds()
    .then(data => {
      const markupOptions = data
        .map(({ id, name }) => ` <option value="${id}">${name}</option>`)
        .join(' ');
      refs.selectBreedCat.innerHTML = markupOptions;

      new SlimSelect({
        select: refs.selectBreedCat,
      });

      refs.loader.classList.add('is-hidden');
      refs.selectBreedCat.classList.remove('is-hidden');
    })
    .catch(error => {
      refs.loader.classList.add('is-hidden');
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
    });
}
