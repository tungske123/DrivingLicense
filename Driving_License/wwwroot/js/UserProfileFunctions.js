//Form validations
var form = document.querySelector(".info-form");
form.addEventListener('submit', function (element) {
  if (!form.checkValidity()) {
    element.preventDefault();
  }
  form.classList.add('was-validated');
});

var phone_input = document.getElementById("phone");

phone_input.addEventListener('input', () => {
  phone_input.setCustomValidity('');
  phone_input.checkValidity();
})

phone_input.addEventListener('invalid', () => {
  if (phone_input.value === "") {
    phone_input.setCustomValidity('Enter phone number!');
  } else {
    phone_input.setCustomValidity('Enter phone number in this format: 09xxxxxxxx');
  }
});
