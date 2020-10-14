// can mutable object1 Object.assign ib better
const deepMerge = (obj1, obj2) => {
  if(typeof obj1 === 'object') {
    for (const i of Object.keys(obj1)) {
      if(typeof obj2[i] !== 'undefined') {
        obj1[i] = deepMerge(obj1[i], obj2[i]);
      }
    }

    for (const i of Object.keys(obj2)) {
      if(typeof obj1[i] === 'undefined') {
        obj1[i] = obj2[i];
      }
    }

    return obj1;
  } else {
    return obj2;
  }
};

export default deepMerge;

//полная копия без последующей мутации
//const newObj = {...cloneDeep(object1), ...cloneDeep(object2) }
function cloneDeep(object) {
  try {
    return JSON.parse(JSON.stringify(object));
  }
  catch (e) {
    console.error(e);
    return undefined;
  }
}

const objectHelper = {
  cloneDeep
};

export default objectHelper;


//возвращает объект только с выбранными ключами (fields) в форме массива строк
//let obj = new ObjectHelper({ 'key': 'value','isSome': true });
//console.log('filter', obj.filter(['isSome'])); => { 'isSome': true }
class ObjectHelper {
  constructor (obj) {
    this.obj = obj;
  }

  filter(fields) {
    if(!fields || typeof fields !== 'object') {
      return obj;
    }
    if(Object.prototype.toString.call(fields) === '[object Array]') {
      return this._filterByArray(fields);
    }
    return this._filterByObj(fields);
  }

  _filterByArray(fields) {
    const ret = {};
    for (let i=0; i<fields.length; i++) {
      if (this.obj[fields[i]]) {
        ret[fields[i]] = this.obj[fields[i]];
      }
    }
    return ret;
  }

  _filterByObj(fields) {
    const ret = {};
    for (const i in fields) {
      if (this.obj[fields[i]]) {
        ret[fields[i]] = this.obj[fields[i]];
      }
    }
    return ret;
  }
}

export default ObjectHelper;

//parser
//we have
const dataIn = {
    'a.b.c.m': 'm data',
    'a.b.x': 'x data',
    'd.e': 'e data',
    'd.d': 'd data',
    'testKey': 'test key data',
};
//we return
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

//function parser
const f = (data={}) => {

    let result = {};
    Object.entries(data).map(arr=>{
        let newArr = [];
        newArr.push(arr[0].split('.'));
        newArr.push(arr[1]);
        return makeObjFromArray(newArr);
    });

    function makeObjFromArray(arr=[]) {
        let keys = arr[0].slice(0, arr[0].length);
        keys.reduce((emptyObj, key, index) =>{
            if(index === keys.length-1) return  emptyObj[key] = arr[1];
            else return  emptyObj[key] = { ...emptyObj[key]};
        }, result);
    }
    return result;
};

//must be equal(true)
//console.log(JSON.stringify(f(dataIn)) === JSON.stringify(dataOut));

//make array from range, need to refactor
//range(5) => [0, 1, 2, 3, 4]
//range(1, 5) => [1, 2, 3, 4]
//range(1, 5, 2) => [1, 3]
//range(5, 1, -1) => [5, 4, 3, 2]

function range(start, end, step) {
    let result = [];

    if(start && !end && !step){
        for(let i= 0; i<start; i++){
            result.push(i);
        }
    }
    if(start && end && !step){
        for(let i= start; i<end; i++){
            result.push(i);
        }
    }
    if(start && end && step){
        for(let i= start; i<end; i+=step){
            result.push(i);
        }
    }
    return result;
}
