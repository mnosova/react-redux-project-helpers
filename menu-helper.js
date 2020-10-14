import globalStore from '/global-store';
import productHelper from './product-helper';

//кастомизируется под любой проект

const getByTextId = (textId) => {
  const menu = globalStore.get('menu', []);
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].text_id === textId) {
      return menu[i];
    }
  }
  return null;
};

const getMenuId = ({ menu, menu_id }) => {
  let { id: menuId } = menu.find(({ text_id = '' }) => text_id === menu_id) || {};
  return menuId;
};

const getById = (id) => {
  const menu = globalStore.get('menu', []);
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].id === id) {
      return menu[i];
    }
  }
  return null;
};

//вывести в меню еще какой нибудь элемент согласно id
const pushProduct = (textId, product) => {
  if (!product || !product.id) {
    return;
  }
  const menu = getByTextId(textId);
  if (!menu) {
    return;
  }
  if (!menu.products) {
    menu.products = [];
  }
  menu.products.push(product.id);
};

//получить эелементы согласно меню
const getProducts = (textId) => {
  const menu = getByTextId(textId);
  if (!menu || !menu.products) {
    return [];
  }
  const products = [];
  menu.products.forEach((id) => {
    products.push(productHelper.get(id));
  });
  return products;
};
//получить меню с определенной настройкой(видимость)
const getVisible = () => {
  const menu = [];
  globalStore.get('menu', []).forEach(item => {
    if (item.visible) {
      menu.push(item);
    }
  });
  return menu;
};

export default {
  getByTextId,
  getById,
  pushProduct,
  getProducts,
  getVisible
};
