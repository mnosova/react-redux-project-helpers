function imaskInit(Imask) {
  let inputs = document.querySelectorAll('[data-imask]');
  inputs.forEach(element => {
    let options = {};
    let type = element.getAttribute('data-imask');

    switch (type) {
      case 'number':
        options.mask = Number;
        options.min = element.getAttribute('data-min') || 0;
        options.max = element.getAttribute('data-max') || 100;
        break;
      case 'string':
        options.mask = /^[a-zA-Zа-яА-ЯёЁ -]*$/;
        break;
      case 'phone':
        options.mask = '+{7} (000) 000-00-00';
        options.validate = (value) => {
          return !(element.value === '8' && value === '+7 (8');
        };
        options.prepare = (str) => {
          if (element.value.charAt(0) === '8' && element.value.length === 11) {
            element.value = element.value.substr(1);
            return '';
          }
          return str;
        };
        break;
      case 'house':
        options.mask = /^(([\d]{0,3}([-/]{1}[\d]{0,3})?))$/;
        break;
      case 'hash':
        options.mask = '000-000-000-000-000';
        break;
      default:
        return;
    }

    new Imask(element, options);
  });
}