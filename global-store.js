//работа с global store

import debug from '../debug';
import _serialize from 'serialize-javascript';


let _store = {};
const flags = new Set();

const set = (key, value, replace = true) => {
  if (replace) {
    return _store[key] = value;
  }

  if (_store[key]) {
    debug(`${key} already exist in storage`, false);
  }
  _store[key] = value;
};


const put = (key, value, replace=true) => {
  set(key, value, replace);
};

const get = (key, defaultValue=null) => {
  if (!key) {
    return defaultValue;
  }
  if (_store[key]) {
    return _store[key];
  }

  return defaultValue;
};


const take = (key, defaultValue=null) => {
  return get(key, defaultValue);
};

const unlink = (key) => {
  if (_store[key]) {
    delete _store[key];
  }
};

const flush = () => {
  _store = {};
};

const initStore = (data = {}) => {
  _store = data || {};
};

const getStore = () => {
  return _store;
};

const serialize = () => {
  return _serialize(getStore());
};


const globalStore = {
  set, put, get, take, flush, initStore, getStore, serialize, unlink
};

export default globalStore;
