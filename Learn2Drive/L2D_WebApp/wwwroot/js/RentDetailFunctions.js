var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//Declarations
const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal-title');
const startDateElement = document.querySelector('.start-date');
const endDateElement = document.querySelector('.end-date');
const VehicleNameElement = document.getElementById('vehicleName');
const VehicleIDElement = document.getElementById('VehicleID');
const PricePerHourElement = document.getElementById('jsPrice');
const CostElement = document.querySelector('.finalcost');
const pricePerHour = parseFloat(PricePerHourElement.textContent);
const confirmButton = document.querySelector('.is-confirm');
const modalNameElement = document.getElementById('modalName');
const modalStartDateElement = document.getElementById('modalStartDate');
const modalEndDateElement = document.getElementById('modalEndDate');
const modalPriceElement = document.getElementById('modalPrice');
var rentBody = document.querySelector('.rent-body');
var openedModal = false;
//Functions
function openModal() {
    if (!openedModal) {
        modal.classList.add('show');
        rentBody.classList.add('blur-background');
        document.body.classList.add('modal-open');
        openedModal = true;
    }
}
function closeModal() {
    if (openedModal) {
        modal.classList.remove('show');
        rentBody.classList.remove('blur-background');
        document.body.classList.remove('modal-open');
        openedModal = false;
    }
}
function updateModalInfo() {
    const VehicleName = VehicleNameElement.textContent;
    const startDate = new Date(startDateElement.value);
    const endDate = new Date(endDateElement.value);
    const totalRentPrice = getFinalCalculatedPrice();
    modalNameElement.textContent = VehicleName;
    modalStartDateElement.textContent = startDate.toLocaleString();
    modalEndDateElement.textContent = endDate.toLocaleString();
    modalPriceElement.textContent = totalRentPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
}
function openSubmitForm() {
    const hasValidRentDate = checkValidRentDate();
    if (!hasValidRentDate) {
        alert('Vui lòng nhập ngày và giờ phù hợp');
        return;
    }
    openModal();
    updateModalInfo();
}
function initializeStartDateData() {
    const currentDateTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
    startDateElement.value = currentDateTime;
}
function checkValidRentDate() {
    if (!startDateElement.value || !endDateElement.value) {
        return false;
    }
    const startDate = startDateElement.value;
    const endDate = endDateElement.value;
    return (startDate <= endDate);
}
function getFinalCalculatedPrice() {
    const startDate = new Date(startDateElement.value);
    const endDate = new Date(endDateElement.value);
    const minuteDifferences = endDate.getTime() - startDate.getTime();
    const hourDifferences = minuteDifferences / (1000 * 60 * 60);
    const totalPrice = pricePerHour * hourDifferences;
    return totalPrice;
}
function updateRentPrice() {
    if (!checkValidRentDate()) {
        alert('Vui lòng chọn ngày và giờ phù hợp');
        CostElement.textContent = `Chưa có thông tin`;
        return;
    }
    const totalPrice = getFinalCalculatedPrice();
    CostElement.textContent = totalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
}
function getRentData() {
    const VehicleID = VehicleIDElement.textContent;
    const startDate = new Date(startDateElement.value);
    const endDate = new Date(endDateElement.value);
    const totalRentPrice = getFinalCalculatedPrice();
    const data = {
        vehicleID: VehicleID,
        startDate: startDate,
        endDate: endDate,
        totalRentPrice: totalRentPrice
    };
    return data;
}
function submitAndSentRentData() {
    return __awaiter(this, void 0, void 0, function* () {
        const hasValidPrice = (CostElement.textContent !== `Chưa có thông tin`);
        if (!hasValidPrice) {
            alert('Vui lòng chọn ngày và giờ thuê phù hợp');
            return;
        }
        const VehicleID = VehicleIDElement.textContent;
        const fetchURL = `https://localhost:7235/api/rent/insert/${VehicleID}`;
        const data = getRentData();
        const response = yield fetch(fetchURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else {
            console.log('Sent rent data success');
            alert('Thuê xe thành công');
        }
    });
}
initializeStartDateData();
//Events
startDateElement.addEventListener('change', () => {
    updateRentPrice();
});
endDateElement.addEventListener('change', () => {
    updateRentPrice();
});
confirmButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    closeModal();
    yield submitAndSentRentData();
}));
//# sourceMappingURL=RentDetailFunctions.js.map