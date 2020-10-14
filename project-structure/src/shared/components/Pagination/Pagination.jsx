import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import style from './Pagination.scss';

export default class Pagination extends Component {

  scrollBy = (event, direction) => {
    const step = +`${direction}50`;
    this.pagination.scrollBy(step, 0);
  };

  render() {
    const { amount, root } = this.props;
    const links = [];
    const isScrollable = amount > 7;

    for(let i = 0; i < amount; i++) {
      links.push(`/${root}/${i + 1}`);
    }

    return (
      <div className={style.pagination}>
        { isScrollable ? <button className={style.direction} onClick={event => this.scrollBy(event, '-')} >◀</button> : null }
        <div className={style.paginationContainer}  ref={x => this.pagination = x}>
          {
            links.map((link, index) => <NavLink activeClassName={style.active} key={`pagination${index}`} to={link}>{index + 1}</NavLink>)
          }
        </div>
        { isScrollable ? <button className={style.direction} onClick={event => this.scrollBy(event, '+')} >▶</button> : null }
      </div>
    );
  }
}
