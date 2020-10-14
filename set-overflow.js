
// setOverflow(false, true);
export default (isHidden, notScroll = false) => {
  let html = document.getElementsByTagName('html')[0];
  let content = document.getElementById('content');

  if(isHidden) {
    if(!html.className.includes('hidden')) {
      let { scrollY } = window;
      try{
        sessionStorage.setItem('scroll', `${scrollY}`);
      } catch (e) {
        console.error(e);
      }
      let timer = setTimeout(() => {
        html.classList.add('hidden');
        if(scrollY !== 0) {
          content.style.transform = `translateY(-${scrollY}px)`;
        }
        clearTimeout(timer);
      }, 10);
    }
  } else {
    if(html.className.includes('hidden')) {
      html.classList.remove('hidden');
      let scrollY = sessionStorage.getItem('scroll');
      let timer = setTimeout(() => {
        content.removeAttribute('style');
        if(!notScroll)
          window.scrollTo(0, +scrollY);
        clearTimeout(timer);
      }, 50);
    }
  }
};