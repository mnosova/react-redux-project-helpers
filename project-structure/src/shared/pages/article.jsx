import React, { Component } from 'react';
import Loading from '../components/Loading/Loading';
import { connect } from 'react-redux';
import PageNotFound from './page-not-found';
import api from '../../client/api';
import ArticleComponent from 'shared/components/Article/Article';

@connect(({ articles: { articles = [], article } }) => ({ article, articles }))
class Article extends Component {


  componentDidMount () {
    let { match: { params: { id } }, initialAction } = this.props;
    this.props.dispatch(initialAction(api, { originalUrl: `/articles/article/${id}/` }));
  }

  componentWillReceiveProps (props) {
    let { match: { params: { id: newId } } } = props;
    let { match: { params: { id } }, initialAction } = this.props;
    if(id !== newId)
      this.props.dispatch(initialAction(api, { originalUrl: `/articles/article/${newId}/` }));
  }

  render() {
    let { article, articles, location: { pathname } = {} } = this.props;
    let isNotFound = article === null;

    if(article && article[0] && pathname.includes(article[0].text_id)) {
      return <ArticleComponent { ...{ articles, article: article[0] || {}, pathname }}/>;
    } else if(isNotFound) {
      return <PageNotFound />;
    } else {
      return <Loading { ...{ timer: 500 } }/>;
    }
  }
}

export default Article;
