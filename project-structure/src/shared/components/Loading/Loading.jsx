import style from './Loading.scss';

import React, { Component } from 'react';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: props.timer,
      isActive: true
    };
  }

  componentDidMount () {
    let { timer } = this.state;
    if(timer) {
      this.timer = setTimeout(() => this.setState({ isActive: false }), timer);
    } else {
      this.setState({ isActive: true });
    }
  }

  componentWillUnmount () {
    if(this.timer) clearTimeout(this.timer);
  }

  render() {
    let { isActive } = this.state;
    let { mainLoader } = this.props;
    if(isActive) {
      return (
        <section className={`${mainLoader ? style.mainLoader : ''} ${style.loading}`}>
          <div className={style.imgContainer}>
            <img src="/public/images/preloader.gif" alt=""/>
          </div>
        </section>
      );
    }
    return null;
  }
}