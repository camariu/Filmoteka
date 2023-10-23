const loader = document.querySelector('.loading');

window.onload = function () {
  const loaderDuration = 200; 

  setTimeout(() => {
    loader.classList.add('loading--hiden');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 100); 
  }, loaderDuration);
};
