//create phones examples
import phones from 'data/phones';

export default (function () {
  let __masked = null;
  let currentMask = [];
  let notFilled = false;
  const validators = {
    '#': '[0-9]'
  };
  
  function prepareMasked() {
    __masked = {};
    function getMask(char, masks) {
      for (let i = 0; i < masks.length; i++) {
        if (char === masks[i].char) {
          return masks[i];
        }
      }
      masks.push({
        'char': char,
        'masks': []
      });
      return masks[masks.length - 1];
    }
    function check(mask, masks) {
      const char = mask.shift();
      if(typeof masks.masks === 'undefined') {
        masks.masks = [];
      }
      const _mask = getMask(char, masks.masks);
      if(mask.length) {
        check(mask, _mask);
      }
      
      if (validators[char]) {
        _mask.validator = validators[char];
      } else if (/[^0-9]/.test(char)) {
        _mask.fixed = 1;
      }
    }
    for (let i = 0; i<phones.length; i++) {
      const arr = phones[i].split('');
      check(arr, __masked);
    }
  }
  
  function getMasked() {
    if(__masked === null) {
      prepareMasked();
    }
    return __masked;
  }
  
  function getValidMask(char, mask) {
    if (!mask || !mask.masks || !Array.isArray(mask.masks) || !mask.masks.length) {
      return false;
    }
    const _masks = mask.masks;
    const validators = [];
    const fixed = [];
    for (let i = 0; i<_masks.length; i++) {
      if (char === _masks[i].char && !isValidator(_masks[i])) {
        currentMask.push(char);
        return _masks[i];
      }
      if (isValidator(_masks[i])) {
        validators.push(_masks[i]);
      } else if(isPredefined(_masks[i])) {
        fixed.push(_masks[i]);
      }
    }
    if (validators.length) {
      for (let i = 0; i<validators.length; i++) {
        if (validate(char, validators[i])) {
          currentMask.push(char);
          return validators[i];
        }
      }
    }
    
    if (fixed.length) {
      currentMask.push(fixed[0].char);
      return getValidMask(char, fixed[0]);
    }
    
    return null;
  }
  
  function filledMask(mask) {
    if (!mask || !mask.masks || !Array.isArray(mask.masks) || !mask.masks.length) {
      return false;
    }
    const _masks = mask.masks;
    const fixed = [];
    for (let i = 0; i<_masks.length; i++) {
      if(isPredefined(_masks[i])) {
        fixed.push(_masks[i]);
      }
    }
    return fixed.length === 1 && currentMask.push(fixed[0].char) && filledMask(fixed[0]);
  }
  
  function validate(char, mask) {
    return (new RegExp(mask.validator)).test(char);
  }
  
  function isPredefined(mask) {
    return !('undefined' === typeof mask.fixed);
  }
  
  function isValidator(mask) {
    return !('undefined' === typeof mask.validator);
  }
  
  function check(value, masks) {
    if(!value || !value.length) {
      return;
    }
    const char = value.shift();
    const mask = getValidMask(char, masks);
    
    if (mask === false) {
      return;
    }
    if (value.length) {
      return check(value, mask || null, notFilled);
    }
    if(!notFilled) {
      filledMask(mask);
    }
    notFilled = false;
  }
  
  function handlers(event) {
    const { target } = event;
    switch (event && event.type) {
      case 'keydown':
        if (event.keyCode === 8) {
          filled(false);
        }
        break;
      case 'paste':
        if (event.clipboardData) {
          event.preventDefault();
          const value = event.clipboardData.getData('text/plain');
          target.value = mask(normalize(value));
        }
        break;
      case 'input':
        target.value = mask(normalize(target.value));
        break;
      default:
            //do something
    }
  }
  
  function mask(value) {
    const _values = value.split('');
    currentMask = [];
    check(_values, getMasked());
    return currentMask.join('');
  }
  
  function filled(b) {
    notFilled = !b;
  }
  
  function normalize(phone) {
    return phone ? phone.replace(/[^0-9]/g, '') : '';
  }
  
  return handlers;
})();