//Form validations
var form = document.querySelector(".info-form");
form.addEventListener('submit', function (element) {
    if (!form.checkValidity()) {
        element.preventDefault();
    }
    form.classList.add('was-validated');
});