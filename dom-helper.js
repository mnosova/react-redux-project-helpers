//для подключения каких либо скриптов в DOM
const onDomLoaded = function() {
  return new Promise((resolve) => {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      resolve();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        resolve();
      }, {
        capture: true,
        once: true,
        passive: true
      });
    }
  });
};


function getAll(element, selector) {
  return element.querySelectorAll(selector);
}

//getImagesMaxWidth(html element, css selector)
function getImagesMaxWidth(element, selector) {
  return new Promise((resolve, reject) => {
    const findedElements = getAll(element, selector);
    let promises = [];
    for(let i = 0; i < findedElements.length; i++) {
      promises.push(getImageWidth(findedElements[i]));
    }
    Promise.all(promises).then((widthValues) => {
      let max = 0;
      widthValues.forEach((width) => {
        if(width > max) {
          max = width;
        }
      });
      resolve(max);
    }).catch((e) => {
      reject(e);
    });
  });
}
//getImageWidth(html img)
function getImageWidth(imageElement) {
  return new Promise((resolve) => {
    if(imageElement.complete) {
      return resolve(imageElement.width);
    }
    const callback = () => {
      resolve(imageElement.width);
      imageElement.removeEventListener('load', callback);
    };
    imageElement.addEventListener('load', callback);
  });
}

function setWidth(element, width, units = 'px') {
  element.style.width = `${width}${units}`;
}

function getWidth(element) {
  return element.offsetWidth;
}

function getWidthWithoutPaddings(element) {
  let width = getWidth(element);
  let computedStyle = getComputedStyle(element);
  width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
  return width;
}

function setMaxWidth(elements, width, units = 'px') {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.maxWidth = `${width}${units}`;
  }
}

function setHeightAuto(elements) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.height = 'auto';
  }
}

function getScrollbarWidth() {
  let outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  // force scrollbars
  outer.style.overflow = 'scroll';

  // add innerdiv
  let inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  let widthWithScroll = inner.offsetWidth;
  // remove divs
  outer.parentNode.removeChild(outer);
  return widthNoScroll - widthWithScroll;
}

function getScrollSize() {
  let dHeight = document.body.scrollHeight;
  let wHeight = window.innerHeight;
  if(!document.querySelector('footer')) return 0;
  let fHeight = document.querySelector('footer').offsetHeight;
  if(dHeight === wHeight) return 0;
  return (dHeight - wHeight) - fHeight;
}

const domHelper = {
  getAll,
  getWidthWithoutPaddings,
  getImagesMaxWidth,
  getScrollbarWidth,
  setWidth,
  setMaxWidth,
  setHeightAuto,
  onDomLoaded};

export default domHelper;

//usage onDomLoaded
const scripts = [
  {
    src: '/static/widgetCallback.js',
    callback: () => {
      //do smth
    }
  },
  {src: '/worker.js'}
];
const container = document.querySelector('#asyncScripts') || document.body;

domHelper.onDomLoaded().then(() => {
  scripts.forEach((script) => {
    if (!script.src) {
      return;
    }
    const element = document.createElement('script');
    element.src = script.src;
    if (!document.querySelector(`[src="${script.src}"]`)) {
      container.appendChild(element);
    }
    element.onload = () => {
      if (typeof script.callback === 'function') {
        script.callback();
      }
    };
  });
});

