//Form validations
const form = document.querySelector(".info-form");
form.addEventListener('submit', element => {
    if (!form.checkValidity()) {
        element.preventDefault();
    }
    form.classList.add('was-validated');
});
