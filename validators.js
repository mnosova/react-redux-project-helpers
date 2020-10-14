const allrules = {
  phone: /^\+?([0-9()-]{8,})$/,
  smscode: /^([0-9]{4,8})$/,
  email: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/,
  name: /^.{1,15}$/,
  orderId: /^\d{3}(?:-\d{3}){3}$/,
  comment: /^([A-zА-я0-9\s]+)$/,
  password: /^.{8,}$/,
  letter_or_number: /[а-яА-ЯёЁ0-9a-zA-Z]/,
  age: /^\d{1,3}$/
};

function checkrule(rule) {
  const tmpl = rule.split(':');

  if (tmpl.length === 2) {
    return makerule(tmpl[0], tmpl[1]);
  }
}

function makerule(type, length) {
  let pattern = '^';

  switch (type) {
    case 'string':
      pattern += '.';
      break;
    case 'number':
      pattern += '[0-9]';
      break;
  }

  pattern += '{1,' + length + '}$';

  return new RegExp(pattern, 'g');
}

const Validator = {
  validate(form, formValidators, invalidFields, nonRequiredFields = [], specificChecks = {}) {
    for (const prop in form) {
      if (formValidators[prop]) {
        const rules = formValidators[prop];
        const value = form[prop];
        const rule = checkrule(rules);
        let match = '';
        let check_ok = true;

        if(typeof specificChecks[prop] !== 'undefined') {
          var checks = specificChecks[prop],
            check_will_used = [];

          if (Array.isArray(checks)) {
            check_will_used = checks;
          }
          else if(typeof checks === 'string') {
            check_will_used = [checks];
          }

          for(var check in check_will_used) {
            if(typeof allrules[check_will_used[check]] !== 'undefined') {
              if(!allrules[check_will_used[check]].test(value)) {
                check_ok = false;
                invalidFields[prop] = true;
              }
            }
          }
        }
        
        if(check_ok) {
          const isNonRequiredFields = nonRequiredFields.includes(prop);
          if (rule && !isNonRequiredFields || rule && isNonRequiredFields && value.length !== 0) {
            match = value.match(rule);
          } else if (isNonRequiredFields && value.length > 0) {
            match = value.match(allrules[rules]);

          } else if (isNonRequiredFields && value.length === 0) {
            match = true;
          } else {
            match = value.match(allrules[rules]);
          }


          if (match) {
            delete invalidFields[prop];
          } else {
            invalidFields[prop] = true;
          }
        }
      }
    }

    return invalidFields;
  }
};
Validator.allrules = allrules;
export default Validator;
//===============

function phoneValidate(input, num = 10) {
  if(input.value && input.value.replace(/\D+/g,'').length < num || !input.value) {
    return true;
  }
}

function isPhoneValid(phoneNumber) {
  if(!phoneNumber) return false;
  const regExpression = '\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}';
  const phoneRegexp = new RegExp(regExpression, 'g');
  return phoneNumber.search(phoneRegexp) >= 0;
}
