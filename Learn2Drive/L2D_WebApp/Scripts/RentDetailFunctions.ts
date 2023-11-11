//Declarations
const modal = document.querySelector('.modal') as HTMLDivElement;
const modalTitle = document.querySelector('.modal-title') as HTMLSpanElement;
const startDateElement = document.querySelector('.start-date') as HTMLInputElement;
const endDateElement = document.querySelector('.end-date') as HTMLInputElement;
const VehicleNameElement = document.getElementById('vehicleName') as HTMLHeadingElement;
const VehicleIDElement = document.getElementById('VehicleID') as HTMLDivElement;
const PricePerHourElement = document.getElementById('jsPrice') as HTMLDivElement;
const CostElement = document.querySelector('.finalcost') as HTMLParagraphElement;
const pricePerHour: number = parseFloat(PricePerHourElement.textContent);
const confirmButton = document.querySelector('.is-confirm') as HTMLButtonElement;
const modalNameElement = document.getElementById('modalName') as HTMLTableCellElement; 
const modalStartDateElement = document.getElementById('modalStartDate') as HTMLTableCellElement;
const modalEndDateElement = document.getElementById('modalEndDate') as HTMLTableCellElement;
const modalPriceElement = document.getElementById('modalPrice') as HTMLTableCellElement;

var rentBody = document.querySelector('.rent-body') as HTMLDivElement;
var openedModal: boolean = false;

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
    const hasValidRentDate: boolean = checkValidRentDate();
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

function checkValidRentDate(): boolean {
    if (!startDateElement.value || !endDateElement.value) {
        return false;
    }
    const startDate = startDateElement.value;
    const endDate = endDateElement.value;
    return (startDate <= endDate);
}

function getFinalCalculatedPrice(): number {
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
        const role: string = data.role;
        if (role !== 'user') {
            alert('Thuê xe không thành công! Chỉ có tài khoản học viên mới được thuê xe!');
            return;
        }
    } catch (error) {
        console.error(error);
    }
}

async function submitAndSentRentData() {
    await CheckRentPermission();
    const hasValidPrice: boolean = (CostElement.textContent !== `Chưa có thông tin`);
    if (!hasValidPrice) {
        alert('Vui lòng chọn ngày và giờ thuê phù hợp');
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
        alert('Thuê xe thành công');
    }
}

initializeStartDateData();

//Events
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