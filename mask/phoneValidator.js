//create phones examples
import phones from 'data/phones';
const preparedPhones = phones.map((phone) => {
  const re = /#/g;
  let result = phone.replace(re, '\\d', 'g');
  result = result.replace('+', '\\+', 'g');
  result = result.replace('(', '\\(', 'g');
  result = result.replace(')', '\\)', 'g');
  return `(${result})`;
});

const regexpPhones = new RegExp(preparedPhones.join('|'), 'g');

function isValid(phoneNumber) {
  return phoneNumber.search(regexpPhones) >= 0;
}

const phoneValidator = {
  isValid
};

export default phoneValidator;