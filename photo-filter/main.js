const filters = document.querySelector('.filters');
const filtersInput = document.querySelectorAll('.filters input');
const btnContainer = document.querySelector('.btn-container');
const buttons = document.querySelectorAll('.btn');
const reset = document.querySelector('.btn-reset');
const next = document.querySelector('.btn-next');
const load = document.querySelector('.btn-load');
const loadInput = document.querySelector('.btn-load--input');
const save = document.querySelector('.btn-save');
const imgBlock = document.querySelector('.editor img');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const base = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images';
const images = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
const fullscreenButton = document.querySelector('.fullscreen');

let i = images.length;

function updateFilter(e) {
  let target = e.target;
  let output = target.nextElementSibling;
  let suffix = target.dataset.sizing || '';
  if(target && output) {
    output.value = target.value;
    document.documentElement.style.setProperty(`--${target.name}`, target.value + suffix);
    updateCanvasFilters();
  }
  drawImage(imgBlock.src);
}

function activeButton(e) {
  buttons.forEach((btn) => {
    btn.classList.remove('btn-active');
  });
  e.target.classList.add('btn-active');
  if(e.target.classList.contains('btn-load--input')){
    load.classList.add('btn-active');
  }
}

function resetFilters() {
  document.documentElement.style.removeProperty('--blur');
  document.documentElement.style.removeProperty('--invert');
  document.documentElement.style.removeProperty('--sepia');
  document.documentElement.style.removeProperty('--saturate');
  document.documentElement.style.removeProperty('--hue');

  for(let i = 0; i < filtersInput.length; i++) {
    filtersInput[i].value = filtersInput[i].defaultValue;
    filtersInput[i].nextElementSibling.value = filtersInput[i].value;
  }
  
  drawImage(imgBlock.src);
}

function updateCanvasFilters() {
  const canvasFilters = [];
  filtersInput.forEach((filter) => {
    if(filter.name === 'hue') {
      canvasFilters.push(`hue-rotate(${filter.value}${filter.dataset.sizing})`);
    } else if(filter.name === 'blur') {
      canvasFilters.push(`${filter.name}(${(imgBlock.naturalHeight / imgBlock.height) * filter.value}${filter.dataset.sizing})`);
    } else {
      canvasFilters.push(`${filter.name}(${filter.value}${filter.dataset.sizing})`);
    }
  });
  canvasFiltersStr = canvasFilters.join(' ');
  ctx.filter = canvasFiltersStr;
}

function drawImage(src) {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  imgBlock.src = src;
  img.src = imgBlock.src;
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    updateCanvasFilters();
    ctx.drawImage(img, 0, 0);
    console.log('hey');
  }
}

drawImage('assets/img/img.jpg');

function nextImage() {
  let index = i - images.length;
  let date = new Date();
  let imgSrc;

  if ((Math.floor(date.getHours() / 6)) === 0) {
    imgSrc = base + '/night/' + images[index];
  } else if ((Math.floor(date.getHours() / 6)) === 1) {
    imgSrc = base + '/morning/' + images[index];
  } else if ((Math.floor(date.getHours() / 6)) === 2) {
    imgSrc = base + '/day/' + images[index];
  } else {
    imgSrc = base + '/evening/' + images[index];
  }

  drawImage(imgSrc);

  if(index === 19) {
    i = images.length;
  } else {
    i++;
  }
}

function loadImage() {
  const file = loadInput.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    imgBlock.src = reader.result;
    drawImage(imgBlock.src);
  }
  reader.readAsDataURL(file);
  loadInput.value = null;
}

function saveImage() {
  let link = document.createElement('a');
  link.download = 'download.png';
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
}

function getFullScreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement;
}

function toggleScreen() {
  if(!getFullScreenElement()) {
      document.documentElement.requestFullscreen();
  } else if(getFullScreenElement()) {
      document.exitFullscreen();
  }
}

filters.addEventListener('mousemove', updateFilter);
btnContainer.addEventListener('click', activeButton);
reset.addEventListener('click', resetFilters);
next.addEventListener('click', nextImage);
load.addEventListener('change', loadImage);
save.addEventListener('click', saveImage);
fullscreenButton.addEventListener('click', toggleScreen);