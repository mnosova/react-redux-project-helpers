import express from 'express';
import React from 'react';
import path from 'path';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter, matchPath } from 'react-router-dom';
import routes from '../shared/routes';
import configureStore from '../shared/configure-store';
import App from '../shared/App';
import 'source-map-support/register';

import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
const statsFile = path.resolve(__dirname, '../dist/loadable-stats.json');

import url from 'url';

// action creators
//import {...} from '../shared/store/action-creators/global';


// routes
//import products from './routes/products';

// middleware
//import apiInitMiddleware from './middleware/api-init';

// cookie
//app.use(cookieParser());


// views
//app.set('views', 'public');



// middleware
//sessionMiddleware(app);

// routes
//products(app);

const app = express();


app.get('*', (req, res, next) => {
  const store = configureStore();
  let { globalStore } = req;
  let { isMobile, isFirefox, source, isSafari, isTablet } = req.useragent;
  const isPhone = isMobile && !isTablet;
  let hostname = `${req.protocol}://${req.hostname}`;
  store.dispatch(storeMenu(globalStore.get('menu', [])));

  const extractor = new ChunkExtractor({ statsFile, entrypoints: ['bundle'] });
  const promises = routes.reduce((acc, route) => {
    let { pathname } = url.parse(req.url) || {};
    if (matchPath(pathname, route) && route.initialAction) {
      acc.push(Promise.resolve(store.dispatch(route.initialAction(req.api, req))));
    }
    return acc;
  }, []);

  let version = !isDevelopment ? `?version=${timestamp}` : '';

  Promise.all(promises)
    .then(() => {
      const context = {};
      const initialData = store.getState();

      let html = renderToString(
        <ChunkExtractorManager extractor={extractor}>
          <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
              <App />
            </StaticRouter>
          </Provider>
        </ChunkExtractorManager>
      );


      res.render('index', {
        html,
        isFirefox
      });
    })
    .catch(next);
});
app.listen(port, error => {
  if (error) {
    console.error(error);
  } else {
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  }
});

