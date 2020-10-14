export default (function(){
  let isCompleteHandled = false;
  const reg = new RegExp('^[a-z0-9][a-z0-9_-]{0,63}(?:.[a-z0-9_-]{1,64}){0,5}@[a-z0-9][a-z0-9-]{1,63}(?:.[a-z0-9-]{1,63}){0,5}.[a-z]{2,5}$', 'i');
  
  function mask(input, cb) {
    if (reg.test(input.value)) {
      if (!isCompleteHandled && typeof cb === 'function') {
        cb(input);
      }
      isCompleteHandled = true;
    } else {
      isCompleteHandled = false;
    }
  }
    
  function handlers(event, complete) {
    const { target } = event;
    switch (event && event.type) {
      case 'paste':
        if (event.clipboardData) {
          event.preventDefault();
          target.value = event.clipboardData.getData('text/plain').toLowerCase();
          mask(target, complete);
        }
        break;
      case 'input':
        mask(target, complete);
        break;
      default:
            //do something
    }
  }
  return handlers;
})();