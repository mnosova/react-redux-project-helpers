//проверка на запрос в адресной строке
function isSame(location1, location2) {
  if(!location1 || !location2) {
    return false;
  }

  const url1 = `${location1.pathname}${location1.search}${location1.hash}`;
  const url2 = `${location2.pathname}${location2.search}${location2.hash}`;
  return url1 === url2;
}

const historyHelper = {
  isSame
};

export default historyHelper;