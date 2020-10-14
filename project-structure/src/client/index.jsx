import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';

import configureStore from '/configure-store';
import App from '../shared/App';



const store = configureStore(window.__initialData__);


//здесь можно написать промис на получение жизненоважных для работы приложения данных
//задиспатчить данные и отправить событие app_init


loadableReady(() => {
  hydrate(
    <Provider store={store}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
});

export default store;

