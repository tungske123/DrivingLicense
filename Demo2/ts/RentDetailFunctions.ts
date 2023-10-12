//Declarations
const modal = document.querySelector('.modal') as HTMLDivElement;
const modalTitle = document.querySelector('.modal-title') as HTMLSpanElement;
const startDateElement = document.querySelector('.start-date') as HTMLInputElement;
const endDateElement = document.querySelector('.end-date') as HTMLInputElement;
const pricePerHour: number = 40000;
var openedModal: boolean = false;

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
    const hasValidRentDate: boolean = checkValidRentDate();
    if (!hasValidRentDate) {
        alert('Vui lòng nhập ngày và giờ phù hợp');
        return;
    }
    openModal();
}

function checkValidRentDate(): boolean {
    const startDate = startDateElement.value;
    const endDate = endDateElement.value;
    return (startDate <= endDate);
}

function calculatePrice(pricePerHour: number) {
    const CostElement = document.querySelector('.finalcost') as HTMLParagraphElement;
    if (!checkValidRentDate()) {
        alert('Vui lòng nhập ngày và giờ phù hợp');
        CostElement.textContent = `Chưa có thông tin`;
        return;
    }
    const startDate = new Date(startDateElement.value);
    const endDate = new Date(endDateElement.value);
    const minuteDifferences = endDate.getTime() - startDate.getTime();
    const hourDifferences = minuteDifferences / (1000 * 60 * 60); 
    const totalPrice = pricePerHour * hourDifferences;
    CostElement.textContent = totalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
}

//Events
startDateElement.addEventListener('change', () => {
    calculatePrice(pricePerHour);
});
endDateElement.addEventListener('change', () => {
    calculatePrice(pricePerHour);
});