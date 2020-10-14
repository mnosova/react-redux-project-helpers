export default class {
  _store = {};
  constructor () {
    this.store = {};
  }
  
  set(key, value) {
    this._store[key] = value;
  }
  
  get(key, defaultValue=null) {
    if (!key) {
      return defaultValue;
    }
    if (this._store[key]) {
      return this._store[key];
    }
  
    return defaultValue;
  }
  
  getStore() {
    return this._store;
  }
}