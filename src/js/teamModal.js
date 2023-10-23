
const backdropTeam = document.querySelector('[data-modal-team]');
const openButtonModal = document.querySelector('.js-team-modal');
const closeButtonModal = document.querySelector('[data-modal-team-close]');
const body = document.querySelector('body');
const modal = document.querySelector('.modal');

openButtonModal.addEventListener('click', onOpenButtonClick);
closeButtonModal.addEventListener('click', onCloseButtonClick);
backdropTeam.addEventListener('click', onBackdropClick);
// modal.addEventListener('click', handleClickModal);

function onOpenButtonClick(e) {
  e.preventDefault();
  const currentMovie = e.target.closest('[data-modal-open]');

  console.log('open');

  backdropTeam.classList.remove('is-hidden');
  window.addEventListener('keydown', closeModalByEscape);
  body.style.overflow = 'hidden';
}

function onCloseButtonClick() {
  backdropTeam.classList.add('is-hidden');
  window.removeEventListener('keydown', closeModalByEscape);
  document.querySelector('.modal-content-container').innerHTML = '';
  body.style.overflow = 'auto';
}

function onBackdropClick(event) {
  if (event.currentTarget === event.target) {
    onCloseButtonClick();
  }
}

function closeModalByEscape(event) {
  const closeButtonEscape = 'Escape';
  if (event.code === closeButtonEscape) {
    onCloseButtonClick();
  }
}
