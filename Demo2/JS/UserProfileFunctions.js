//Form validations
var form = document.querySelector(".info-form");
form.addEventListener('submit', function (element) {
    if (!form.checkValidity()) {
        element.preventDefault();
    }
    form.classList.add('was-validated');
});

var phone_input = document.getElementById("PhoneNumber");

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

function changeAvatar(fileInput) {
    const selectedFile = fileInput.files[0];

    if (selectedFile) {
        const reader = new FileReader();
        var imagePreview = document.querySelector('.img-account-profile');
        reader.onload = function (event) {
            // Set the src attribute of the img element to the data URL
            imagePreview.src = event.target.result;
        };
        // Read the selected file as a data URL
        reader.readAsDataURL(selectedFile);
    } else {
        // Clear the img src if no file is selected 
        imagePreview.src = '';
    }
}