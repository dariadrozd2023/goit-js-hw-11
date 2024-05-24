import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


const refs = {
    formSearch: document.getElementById('formSearch'),
    inputSearch: document.getElementById('inputSearch'),
    btnSearch: document.getElementById('btnSearch'),
    galleryList: document.querySelector('.js-ImagesCart'),
    loader: document.querySelector('.loader'),

  };
  
  export function submitSearch(e) {
      e.preventDefault();
      checkInput();

  }
  

 export function checkInput() {
      const inputValue = refs.inputSearch.value.trim();
      if (inputValue ==='' ) {
          iziToast.show({
              message:
                'please,enter the name of the picture you are looking fo for',
              timeout: 5000,
              backgroundColor: '#a0cdde',
            });
            
        refs.btnSearch.disabled = true; // робимо кнопку неактивною
      } else {
        refs.btnSearch.disabled = false; // робимо кнопку активною у разі успіху
      }
    }



