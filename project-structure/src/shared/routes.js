//импорт акшн криейторов
import { getProducts } from './store/action-creators/main';

import { page } from '/page';
//прописание роутов
const routes = [
  page('/cart', 'cart'),
  page('/menu/:menu_id', 'menu', getProducts),
  page('*', 'page-not-found')
];

export default routes;
