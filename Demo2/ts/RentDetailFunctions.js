//Declarations
var modal = document.querySelector('.modal');
var modalTitle = document.querySelector('.modal-title');
var startDateElement = document.querySelector('.start-date');
var endDateElement = document.querySelector('.end-date');
var pricePerHour = 40000; //Change the price based on the server
var openedModal = false;
//Functions
function openModal() {
    if (!openedModal) {
        modal.classList.add('show');
        openedModal = true;
    }
}
function closeModal() {
    if (openedModal) {
        modal.classList.remove('show');
        openedModal = false;
    }
}
function openSubmitForm() {
    var hasValidRentDate = checkValidRentDate();
    if (!hasValidRentDate) {
        alert('Vui lòng nhập ngày và giờ phù hợp');
        return;
    }
    openModal();
}
function checkValidRentDate() {
    var startDate = startDateElement.value;
    var endDate = endDateElement.value;
    return (startDate <= endDate);
}
function calculatePrice(pricePerHour) {
    var CostElement = document.querySelector('.finalcost');
    if (!checkValidRentDate()) {
        alert('Vui lòng nhập ngày và giờ phù hợp');
        CostElement.textContent = "Ch\u01B0a c\u00F3 th\u00F4ng tin";
        return;
    }
    var startDate = new Date(startDateElement.value);
    var endDate = new Date(endDateElement.value);
    var minuteDifferences = endDate.getTime() - startDate.getTime();
    var hourDifferences = minuteDifferences / (1000 * 60 * 60);
    var totalPrice = pricePerHour * hourDifferences;
    CostElement.textContent = totalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
}
//Events
startDateElement.addEventListener('change', function () {
    calculatePrice(pricePerHour);
});
endDateElement.addEventListener('change', function () {
    calculatePrice(pricePerHour);
});
