//создаем удобное для 1С поле адерса

function createAddress(order) {
  const _order = Object.assign({}, order);
  let address = '';
  if (order.city) address += `г. ${order.city}`;
  if(order.fullnameStreet) {
    address += `, ул. ${order.fullnameStreet}`;
    // if(order.fullnameStreet !== order.street) {
    //   comment += `ул. ${order.street}`;
    // }
  } else if(order.street){
    // comment += `ул. ${order.street}`;
    address += `, ул. ${order.street}`;
  }

  if (order.house) address += `, дом. ${order.house}`;
  if (order.building) address += `, корп. ${order.building}`;
  if (order.entrance) address += `, подъезд ${order.entrance}`;
  if (order.floor) address += `, этаж ${order.floor}`;
  if (order.apartment) address += `, кв. ${order.apartment}`;

  // if (comment) {
  //   comment = `### address comment: ${comment} ###`;
  // }

  _order.address = address;
  _order.comment = order.comment ? order.comment: '';
  return _order;
}
function getAddress(form) {
  if((!form.street && !form.cityName) || !form.house) return '';
  return `${form.full_address || ''}${form.street || ''}, ${form.house || ''} ${form.building || ''}`.trim();
}


function getInvalidFields({ target: { name } }, { invalidFields, isInvalid }) {
  if(name === 'password_again' || name === 'password' || name === 'new_password' || name === 'new_password_again') {
    invalidFields.password_again     = false;
    invalidFields.password           = false;
    invalidFields.new_password       = false;
    invalidFields.new_password_again = false;
  }
  if(name === 'address') {
    invalidFields.is_valid_address = false;
  }
  return { ...invalidFields, [name]: isInvalid };
}

function getFormFields ({ target }, fields) {
  let form = { };
  fields.forEach(name => {
    if(target[name] && name === target[name].name) {
      form[name] = target[name].value;
    }
  });
  return form;
}

export {
  createAddress
};


