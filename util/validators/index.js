const isValidPhoneNumber = (string) => {
  const regEx = /^(?:254|\+254|0)?((?:(?:7(?:(?:[01249][0-9])|(?:5[789])|(?:6[89])))|(?:1(?:[1][0-5])))[0-9]{6})$/;
  if (string.match(regEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};

exports.validateDepositData = (data) => {
  let errors = {};
  if (isEmpty(data.mssidn)) {
    errors.message = 'mssidn must not be empty';
  } else if (!isValidPhoneNumber(data.mssidn)) {
    errors.message = 'must be a valid mssidn';
  };
  if (isEmpty(data.amount)) {
    errors.message = 'Amount must not be empty';
  } else if (isNaN(data.amount)) {
    errors.message = 'Amount must be a number';
  } else if (parseInt(data.amount) <= '0' || parseInt(data.amount) > '70000') {
    errors.message = 'Amount must be Minimum: Ksh 1 | Maximum: Ksh 70,000';
  } 
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
}

exports.validateWithdrawalData = (data) => {
  let errors = {};
  if (isEmpty(data.mssidn)) {
    errors.message = 'mssidn must not be empty';
  } else if (!isValidPhoneNumber(data.mssidn)) {
    errors.message = 'must be a valid mssidn';
  }
  if (isEmpty(data.amount)) {
    errors.message = 'Amount must not be empty';
  } else if (isNaN(data.amount)) {
    errors.message = 'Amount must be a number';
  } else if (parseInt(data.amount) < '100' || parseInt(data.amount) > '150000') {
    errors.message = 'Amount must be Minimum: Ksh 100 | Maximum: 150,000';
  } else if (data.amount > data.accountBalance) {
    errors.message = 'insufficient account balance to perform this action';
  };
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.parseMssidn = (n) => {
  let strArray = n.split("");
  strArray[0] == "0" ? strArray.splice(0, 1, "254") : (strArray[0] == "+" ? strArray.splice(0,1) : strArray);
  return strArray.join("");
};