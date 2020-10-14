import methods from './methods';
import { customFetch, checkStatus } from '/custom-fetch';

//its api req.api.fetch

export default (() => {
  let _methods = (() => {
    const _request = (url, params, options = {}) => customFetch(url, params, options).then(checkStatus);
    let obj = {};
    methods.forEach(({ name, url, options }) => {
      obj[name] = params => _request(url, params, options);
    });
    return obj;
  })();
  return {
    fetch(method, params, options) {
      if (_methods[method] && typeof _methods[method] === 'function') {
        return _methods[method](params, options);
      }
    }
  };
})();