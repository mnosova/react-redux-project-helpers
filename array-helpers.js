//returns filled random indexs array with length equal count,
//limit is max value for each index
//getRandomIndexs(6,10) => [9, 3, 4, 7, 6, 8]

function getRandomIndexs(count, limit) {
  function getRandom() {
    return Math.floor(Math.random() * (limit));
  }

  let currentCount = 0;
  const arr          = [];

  while (+currentCount !== +count) {
    const rnd = getRandom();

    if (!arr.includes(rnd)) {
      arr.push(rnd);
      currentCount++;
    }
  }

  return arr;
}
//
function modifyArr({ Template = {} } = {}, keys = []) {
  keys.forEach(({ key, count }) => {
    console.log('key', key);
    console.log('count', count);
    if(!count) return;
    if (Array.isArray(Template[key]) && Template[key].length > count) {
      const randomStocks = [];
      const indexs = getRandomIndexs(count, Template[key].length);

      indexs.forEach(index => {
        randomStocks.push(Template[key][index]);
      });

      Template[key] = randomStocks;
    }
  });
}
//object values to array
//valuesToArray ({"key1": "1", "key2": "2", "key3": "3"}) => ["1","2","3"]
function valuesToArray(val) {
  if (Array.isArray(val)) {
    return val;
  }

  if (typeof val === 'object') {
    return Object.keys(val).map(function (i) {
      return val[i];
    });
  }

  return [val];
}

//clear array from double values
//getUnique ([10, 10, 15, 1, 15, 3, 4, '15']) => [10, 15, 1, 3, 4, '15']
function getUnique(array) {
  if(!Array.isArray(array)) return [];
  return [ ...new Set(array) ];
}

/**
 *
 * @param array
 * @param qty
 * @returns {Array}
 */
// returns Array with random values form param array, length equal param qty
//getRandomItems ([10, 10, 15, 1, 15, 3, 4, '15'], 1) => [3]
//getRandomItems ([10, 10, 15, 1, 15, 3, 4, '15'], 4) => [10, 15, 3, 10]

function getRandomItems(array = [], qty = 1) {
  if (!Array.isArray(array) || !array.length || !qty) {
    return [];
  }

  const _array = array.concat();

  const returnArray = [];

  while(qty--) {
    const rand = Math.floor(Math.random() * _array.length);
    returnArray.push(_array[rand]);
    _array.splice(rand, 1);
    if (!_array.length) {
      return returnArray;
    }
  }

  return returnArray;
}



//есть ли в массиве сумма
let a = [10, 20, 15, 1, 2, 3, 4, 5, 6, 7];
let b = 17;
//checkNumber(17, [10, 20, 15, 1, 2, 3, 4, 5, 6, 7] ) => true (10+7)

//нам небходимо каждое число сложить другим
// то есть для каждого числа должен сработать перебор
// поэтому функция имеет вдва цикла for
//первый цикл берет каждое число по очереди в отдельности
// и для каждого срабатывает второй цикл складывая себя с соседним
// с соседним потому что с предыдущим сумма была получена в цикле ранее
// таким образом для числа 10 будет найденно 9 сумм
// а для числа 6 только одна сумма (6+7) т.к. (5+6) уже была найдена для цифры 5
// для числа 7 вообще нет суммы

function checkNumber(number, arr) {
  let sum;
  let result = false;
  for (let i = 0; i < arr.length - i; i++) {
    for (let j = i; j < arr.length - 1; j++) {
      sum = arr[i] + arr[j + 1];
      result = sum === number;
      if (result) return result;
    }
  }
  return result;
}

//=============================
//есть в массиве элемент

let c = 'tatata';
let d = [10, 3, 89, {"key1": "1", "key2": "2", "key3": "3"}, true, "tatata", [7, 8, 9]];

//checkParam('tatata', [10, 3, 89, {"key1": "1", "key2": "2", "key3": "3"}, true, "tatata", [7, 8, 9]]) => true
//checkParam([1, 2, 3], [10, 3, 89, {"key1": "1", "key2": "2", "key3": "3"}, true, "tatata", [7, 8, 9]]) => false

//1. сравнивая между собой значения, которые могут быть различными по типу
//2. объекты никогда не равны
// поэтому каждый элемент массива приводится к строке json(обычную строку тоже нельзя сравнить)
function checkParam(param, arr) {
  let result = false;

  for (let i = 0; i < arr.length; i++) {
    result = JSON.stringify(arr[i]) === JSON.stringify(param);
    if (result) return result;
  }
  return result;
}
//=============================
//разбить массив на подмассивы, так чтобы в каждом массиве было по slice_mount элементов
//возвращает массив массивов

//sliceArray(slArray , 3)  =>    [[{"id":1,"name":"one"},{"id":2,"name":"two"},{"id":3,"name":"three"}],  [{"id":4,"name":"four"},{"id":5,"name":"five"}]]
//sliceArray([10, 20, 15, 1, 2, 3, 4, 5, 6, 7] , 2)  =>   [[10,20],[15,1],[2,3],[4,5],[6,7]]

const slArray = [
  {
    'id': 1,
    'name': 'one'
  },
  {
    'id': 2,
    'name': 'two'
  },
  {
    'id': 3,
    'name': 'three'
  },
  {
    'id': 4,
    'name': 'four'
  },
  {
    'id': 5,
    'name': 'five'
  }
];

function sliceArray(array = [], slice_mount) {
  let slicedArray = [];
  //разбивает массив на столько частей, чтобы в каждом подмассиве было по slice_mount
  //array.length/slice_mount количество частей, количество итераций
  for (let i = 0; i < Math.ceil(array.length / slice_mount); i++) {
    //заполняет новый массив с 0 по slice_mount
    //c пред места по новое место и т.д.
    slicedArray[i] = array.slice((i * slice_mount), (i * slice_mount) + slice_mount);
  }
  return slicedArray;
}

//=============================
//вернуть маскимальное количество возможной покупки shav изходя из mycash в каталоге цен разных кафе testPrices

const testPrices = ['200', '600', '800', '1300' , '300'];
const shav =2;
const mycash = 1600;

 function howMuchItemsCanIBuy (prices = [], cache=0, n=0) {
  let result = 0;
  if(!prices.length && !Array.isArray(prices))return result;
  if(!cache && typeof +cache !== 'number' )return result;
  if(!n && typeof +n !== 'number' )return result;
  const resultArr = prices.map(num => +num).filter( num => num*n <= cache );
  if(!resultArr && !resultArr.length) return result;
  if(resultArr.reduce((a,b) => a+b) === cache) return resultArr.length;
  let newResultArr = [];
  let max = 0;
  for(let i = 0; i<= resultArr.length-1; i++){
    for(let n = i; n <= resultArr.length-1; n++){
      if(resultArr[n+1]) {
        if ( resultArr[i] + resultArr[n+1] > max &&resultArr[i] + resultArr[n+1]<=cache){
          max = resultArr[i] + resultArr[n+1];
          newResultArr = [ resultArr[i], resultArr[n+1]]
        }
      }
    }
  }
  if(newResultArr && newResultArr.length) return newResultArr.length;
}

//=============================
//из массива строк перечислений получить предложение где последняя строка соединяется союзом 'и'
//getStringFromArray(['JavaScript' , 'python', 'Php', 'Ruby' ]) => 'JavaScript , python, Php и Ruby'
const stringArray = ['JavaScript' , 'python', 'Php', 'Ruby' ];

function getStringFromArray (arr=[]) {
  if(!Array.isArray(arr) && !arr.length) return;
  const newArr = arr.map((word, index)=>{
    if(index === arr.length-1) return `и ${word}`;
    else if((index === arr.length-2) ) return word;
    else return  `${word},`
  });
  return newArr.join(' ');
}

//=============================
//распарсить структуру так, чтобы
//возвращает boolean

const dataIn = {
  'a.b.c.m': 'm data',
  'a.b.x': 'x data',
  'd.e': 'e data',
  'd.d': 'd data',
  'testKey': 'test key data',
};

const dataOut = {
  'a': {
    'b': {
      'c': {
        'm': 'm data',
      },
      'x': 'x data',
    }
  },
  'd': {
    'e': 'e data',
    'd': 'd data',
  },
  'testKey': 'test key data',
};

function myParser(data) {
  //target это первое значение для функции reduce, подобно 0 или 1, старт, начало
  const target = {};
  const appendKey = (keys, value) => {
    //keys ['a','b','c','m']
    //value m data'
    keys.reduce((EmptyObj, key, index) => {
      //EmptyObj[а] = если индекс равен последнему эл массива, то  возвращаем посл строчку value
      //если нет, то заносим в объект пред значение reduce и  EmptyObj[key], если оно есть
      EmptyObj[key] = index === keys.length - 1 ? value : { ...EmptyObj[key] };
      return EmptyObj[key];
      //console.log('acc[key]', acc[key]);
      //target это первое значение для функции reduce
    }, target);
  };

  //берем ключи в виде массива и перебираем
  // '[a.b.c.m'], ['a.b.x'], ['d.e'], ['d.d'], ['testKey']

  Object.keys(data).map(dataKey =>
    //примеяем к каждому функцию которая вернет объект
    //dataKey.split('.') === ['a','b','c','m']
    //data[dataKey] === 'm data'
    appendKey(dataKey.split('.'), data[dataKey])
  );
  return target;
}

//   const arr = pipe(
//             items => items.map(({ product_id }) => products.find(({ id }) => product_id === id)),
//             products => products.filter(({ is_delivery }) => !is_delivery)
//           )(items);
const pipe = (...functions) => (value) => {
  return functions
    .reduce((currentValue, currentFunction) => {
      return currentFunction(currentValue);
    }, value);
};


export {
  getRandomItems,
  valuesToArray,
  getUnique,
  modifyArr,
  getRandomIndexs,
  howMuchItemsCanIBuy,
  getStringFromArray,
  myParser
};



