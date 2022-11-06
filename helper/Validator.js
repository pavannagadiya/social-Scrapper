function validateEmail(emailAddress) {
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailAddress.match(regexEmail)) {
    return true;
  } else {
    return false;
  }
}

function phoneNumber(phoneNumber) {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(phoneno.test(phoneNumber)) {
      return true;
    }
    else {
      return false;
    }
  }

module.exports = {
  validateEmail,
  phoneNumber
};
