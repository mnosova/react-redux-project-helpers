import { FETCH_ARTICLE_SUCCESS } from '../actions/articles';

const receivedArticle = article => ({ type: FETCH_ARTICLE_SUCCESS, payload: { article } });

const getArticle = (api, req) => {
  let { originalUrl } = req;
  let text_id = originalUrl.split('/')[3];
  return (() => (dispatch) => {
    let urls = [
      {
        url: 'article',
        body: { text_id }
      },
      {
        url: 'articles'
      }
    ];
    let promises = urls.map(({ url, body }) => api.fetch(url, body));

    return Promise.all(promises).then(results => {
      let [article, { articles }] = results;
      if(!article || !article.length) article = null;
      if(!articles || !articles.length) articles = null;
      dispatch(receivedArticle(article));
    });
  })();
};


export { getArticle, receivedArticle };