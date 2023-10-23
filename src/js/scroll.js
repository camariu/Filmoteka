const showOnPx = 100;
const backToTopButton = document.querySelector('.btn--to-top');

const scrollContainer = () => {
  return document.documentElement || document.body;
};

document.addEventListener('scroll', () => {
  if (scrollContainer().scrollTop > showOnPx) {
    backToTopButton.classList.remove('hidden');
  } else {
    backToTopButton.classList.add('hidden');
  }
});

const goToTop = () => {
  document.body.scrollIntoView({ behavior: 'smooth' });
};

backToTopButton.addEventListener('click', goToTop);

document.body.style.overflow = 'scroll'; 


let styleElement = document.createElement('style');
styleElement.type = 'text/css';


let css = `
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #353740; 
  }
  ::-webkit-scrollbar-thumb {
    background: #b92f2c; 
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #e6e6e6; 
  }
`;


if (styleElement.styleSheet) {
  styleElement.styleSheet.cssText = css; 
} else {
  styleElement.appendChild(document.createTextNode(css));
}

document.getElementsByTagName('head')[0].appendChild(styleElement);


