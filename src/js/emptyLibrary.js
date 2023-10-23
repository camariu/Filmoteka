const noneCardList = document.querySelector('.gallery');
const blockEmptyLib = document.querySelector('.library-gallery');

export function emptyLibrary() {
  noneCardList.innerHTML = `
  <li class="library-gallery">
    <div class="container library-gallery__wrap">
    <img class="library-gallery__image" src="https://raw.githubusercontent.com/Cristina-Irina/Filmoteka/main/src/images/library-img/library_img.png" alt="" width="750"/>
    <p class="library-gallery__text">The library is empty.</p>
      <p class="library-gallery__text">Add some movies.</p>
    </div>
  </li>
  <li class="library-gallery">
  <div class="container library-gallery__wrap">
          <a
            href="./index.html"
            class="link header__buttn-link home current-page"
          >
          BACK HOME
          </a>
          </div>
        </li>
`;
  try {
    noneCardList.innerHTML = '';
    blockEmptyLib.classList.add('active');
  } catch (err) {}
}