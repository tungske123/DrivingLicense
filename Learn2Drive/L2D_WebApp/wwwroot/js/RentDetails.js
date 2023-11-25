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
const modalEndDateElement = document.getElementById('modalEndDate')
const modalPriceElement = document.getElementById('modalPrice')
const vehicleId = (document.getElementById('vehicleId')).textContent;
const vehicleDescriptionElement = document.querySelector('.info-text');
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
    modalPriceElement.textContent = formatMoney(totalRentPrice);
}


function openSubmitForm() {
    const hasValidRentInfo = (checkValidRentDate() && rentHours !== 0 && getFinalCalculatedPrice() > 0);
    if (!hasValidRentInfo) {
        Swal.fire({
            icon: "error",
            title: "Vui lòng chọn ngày và giờ thuê phù hợp",
            confirmButtonColor: "#d90429"
        });
        return;
    }
    let rentOption = document.getElementById('rentOptionSelect').value;
    if (rentHours >= 0 && rentHours < 0.5) {
        Swal.fire({
            icon: 'error',
            title: 'Thời gian thuê quá ít!',
            confirmButtonColor: '#d90429'
        });
        return;
    }
    if (rentHours < 24 && rentOption !== 'hour') {
        Swal.fire({
            icon: 'error',
            title: 'Vui lòng chọn phương thức thuê theo giờ!',
            confirmButtonColor: '#d90429'
        });
        return;
    }
    if (rentHours >= 24 && rentOption !== 'date') {
        Swal.fire({
            icon: 'error',
            title: 'Vui lòng chọn phương thức thuê theo ngày!',
            confirmButtonColor: '#d90429'
        });
        return;
    }
    openModal();
    updateModalInfo();
}

function initializeStartDateData() {
    // Get the current date and time in Vietnam timezone
    let date = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });

    // Convert to a Date object
    date = new Date(date);

    // Format the date and time in the 'YYYY-MM-DDTHH:mm' format required by datetime-local
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    startDateElement.value = formattedDateTime;
}

function checkValidRentDate() {
    if (!startDateElement.value || !endDateElement.value) {
        return false;
    }
    const startDate = new Date(startDateElement.value);
    const endDate = new Date(endDateElement.value);
    let validDate = (startDate < endDate);
    if (startDate === endDate) {
        let startTime = startDate.getTime();
        let endTime = endDate.getTime();
        let minuteDifferences = endTime - startTime;
        let hourDifferences = minuteDifferences / (1000 * 60 * 60);
        let validHour = (hourDifferences >= 0.5);
        validDate = (startTime < endTime && validHour);
    }
    return validDate;
}

function resetForm() {
    let rentHoursElement = document.getElementById('rentHours');
    rentHoursElement.innerHTML = `<span class ='text-danger'>Chưa có dữ liệu</span>`;
    CostElement.innerHTML = `<span class='text-danger font-bold'>Chưa có thông tin</span>`;
    rentHours = 0;
}

let rentHours = 0;
function getFinalCalculatedPrice() {
    const startDate = new Date(startDateElement.value);
    const endDate = new Date(endDateElement.value);
    const minuteDifferences = endDate.getTime() - startDate.getTime();
    const hourDifferences = minuteDifferences / (1000 * 60 * 60);
    let totalPrice = -1;
    if (hourDifferences >= 0.5 && hourDifferences < 24) {
        totalPrice = pricePerHour * hourDifferences;
    } else {
        totalPrice = pricePerHour * hourDifferences * 0.8;
    }
    rentHours = hourDifferences;
    return totalPrice;
}

function formatMoney(price) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
}

function updateRentHours() {
    let rentHoursElement = document.getElementById('rentHours');
    if (rentHours === 0) {
        resetForm();
        return;
    }
    rentHoursElement.textContent = `${rentHours.toFixed(1)} Giờ`;
}

function updateRentPrice() {
    if (!checkValidRentDate()) {
        Swal.fire({
            icon: "error",
            title: "Vui lòng chọn ngày và giờ thuê phù hợp",
            confirmButtonColor: "#d90429"
        });
        resetForm();
        return;
    }
    const totalPrice = getFinalCalculatedPrice();
    if (totalPrice <= 0) {
        resetForm();
        return;
    }
    if (rentHours < 24) {
        CostElement.textContent = formatMoney(totalPrice);
    } else {
        CostElement.innerHTML = `${formatMoney(totalPrice)} <span class='text-danger font-bold'>(-20%)</span>`;
    }
    updateRentHours();
}

function getRentData() {
    const VehicleID = VehicleIDElement.textContent;
    const startDate = startDateElement.value;
    const endDate = endDateElement.value;
    const totalRentPrice = getFinalCalculatedPrice();
    const data = {
        vehicleID: VehicleID,
        startDate: startDate,
        endDate: endDate,
        totalRentPrice: totalRentPrice
    };
    return data;
}

async function fetchVehicleData() {
    try {
        const url = `https://localhost:7235/api/vehicles/${vehicleId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error(`Error! ${response.status} - ${response.statusText}`);
            return;
        }
        const data = await response.json();
        console.log(data);
        vehicleDescriptionElement.innerHTML = data.description;

    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function CheckRentPermission() {
    try {
        const url = `https://localhost:7235/api/login/check`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 200) {
            window.location.href = '/Login';
            return;
        }
        const data = await response.json();
        const role = data.role;
        if (role !== 'user') {
            Swal.fire({
                icon: 'error',
                title: 'Thuê xe không thành công!',
                text: 'Chỉ có tài khoản học viên mới được thuê xe!',
                confirmButtonColor: '#d90429'
            });
            return;
        }
    } catch (error) {
        console.error(error);
    }
}

async function submitAndSentRentData() {
    await CheckRentPermission();
    const hasValidRentInfo = (rentHours !== 0 && checkValidRentDate());
    if (!hasValidRentInfo) {
        Swal.fire({
            icon: "error",
            title: "Vui lòng chọn ngày và giờ thuê phù hợp!",
            confirmButtonColor: "#d90429"
        });
        return;
    }
    const VehicleID = VehicleIDElement.textContent;
    const fetchURL = `https://localhost:7235/api/rent/insert/${VehicleID}`;
    const data = getRentData();
    const response = await fetch(fetchURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        console.log('Sent rent data success');
        Swal.fire({
            title: "Thuê xe thành công!",
            text: "Vui lòng kiểm tra lịch sử đơn thuê",
            icon: "success",
            confirmButtonColor: "#d90429"
        });
    }
}

//Events
document.addEventListener('DOMContentLoaded', async () => {
    await fetchVehicleData();
    initializeStartDateData();
});
startDateElement.addEventListener('change', () => {
    updateRentPrice();
});
endDateElement.addEventListener('change', () => {
    updateRentPrice();
});
confirmButton.addEventListener('click', async () => {
    closeModal();
    await submitAndSentRentData();
});