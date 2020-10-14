import loadable from '@loadable/component';
import Loading from 'shared/components/Loading/Loading';
import React from 'react';

const page = (path, name, func, exact = true, delay = 300) => {
  return {
    path,
    exact,
    component: loadable(() => import(`../pages/${name}`), {
      fallback: <Loading timer={delay}/>
    }),
    initialAction: func ? (api, req = {}) => func(api, req) : null
  };
};

export { page };
