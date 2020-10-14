import { FETCH_ARTICLES_SUCCESS, FETCH_ARTICLE_SUCCESS } from '../actions/articles';

export default (state = {}, { payload, type }) => {
  switch (type) {
    case FETCH_ARTICLES_SUCCESS:
      return { ...state, articles: payload.articles, total_pages: payload.total_pages };
    case FETCH_ARTICLE_SUCCESS:
      return { ...state, article: payload.article };
    default:
      return state;
  }
};