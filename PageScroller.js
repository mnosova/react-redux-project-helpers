//для постраничной подгрузки

let instance = null;

class PageScroller {
  constructor(pathname = '') {
    if(!instance){
      this._pathnames = [];
      this.skipFlag = false;
      if(pathname) {
        this._pathnames.push(pathname);
      }
      instance = this;
    }
    return instance;
  }

  update(pathname) {
    this._update(pathname);
    if(this._isFull() && !this._isEqual()) {
      this._scrollToStart();
    }
  }

  skipNextScroll() {
    this.skipFlag = true;
  }

  getPreviousPage() {
    if(this._isFull()) {
      return this._pathnames[0];
    }
    return '';
  }

  _update(pathname) {
    if(this._isFull()) {
      this._pathnames = this._pathnames.slice(0, 1);
    }
    this._pathnames.unshift(pathname);
  }

  _isFull() {
    return this._pathnames.length === 2;
  }

  _isEqual() {
    if(!this._isFull()) return false;
    return this._pathnames[0] === this._pathnames[1];
  }

  _scrollToStart() {
    if(this.skipFlag) {
      this.skipFlag = false;
      return;
    }
    window.scrollTo(0, 0);
  }
}

export default PageScroller;