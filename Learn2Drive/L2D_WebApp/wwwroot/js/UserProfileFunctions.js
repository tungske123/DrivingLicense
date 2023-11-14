var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//Definitions
/*import ApexCharts from "apexcharts";*/
class UserData {
}
class VehicleData {
    constructor(vehicleId, name, image, brand, type, years, contactNumber, address, rentPrice, status) {
        this.vehicleId = vehicleId;
        this.name = name;
        this.image = image;
        this.brand = brand;
        this.type = type;
        this.years = years;
        this.contactNumber = contactNumber;
        this.address = address;
        this.rentPrice = rentPrice;
        this.status = status;
    }
}
class RentData {
}
class QuizAttemptData {
}
const userInfoForm = document.getElementById('userInfoForm');
const deleteModal = document.getElementById('delete-modal');
const deleteModalButtons = document.querySelectorAll('.deleteModalButton');
const editModal = document.getElementById('editModal');
const previewImageElement = document.getElementById('previewImage');
const avatarInputElement = document.getElementById('dropzone-file');
const tabButtonList = document.querySelectorAll('.dashboard-item');
const filterDateOptions = document.querySelectorAll('.filter-date-option');
const dateFilterContent = document.querySelector('.date-filter-content');
const rentInfoSection = document.getElementById('rentInfo');
const rentTableBody = document.getElementById('rentTableBody');
const rentTableSearchBar = document.getElementById('rentTableSearch');
const tabLinkList = document.querySelectorAll('#sidebar-content .dashboard-item');
const avatarPreviewImage = document.getElementById('previewImage');
const fullNameInput = document.getElementById('fullname');
const birthDateInput = document.getElementById('birthdate');
const phoneInput = document.getElementById('phone');
const nationalityInput = document.getElementById('nationality');
const addressInput = document.getElementById('address');
const CCCDInput = document.getElementById('cccd');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const repassInput = document.getElementById('repass');
const rentPagingContent = document.querySelector('#rentPagination .ul');
//
const UserId = document.getElementById('UserId').textContent;
var keyword = ``;
var dayRangeValue = -1;
var page = 1;
var totalPages = 1;
var openedDeleteModal = false;
var openedEditModal = false;
var rentId = ``;
var vehiclePrice = 0;
//Methods
function GetFormattedDate(date) {
    const formattedDate = ("0" + date.getDate()).slice(-2) + "/" +
        ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
        date.getFullYear() + " vào lúc " +
        ("0" + date.getHours()).slice(-2) + ":" +
        ("0" + date.getMinutes()).slice(-2);
    return formattedDate;
}
function renderRentDataRow(data) {
    const newRow = document.createElement('tr');
    newRow.className = 'row';
    const vehicleImageCell = document.createElement('td');
    vehicleImageCell.className = `w-32 p-4`;
    const vehicleImageElement = document.createElement('img');
    vehicleImageElement.className = `rounded-lg`;
    vehicleImageElement.src = `/img/vehicle/${data.vehicleImage}`;
    vehicleImageCell.appendChild(vehicleImageElement);
    newRow.appendChild(vehicleImageCell);
    const vehicleNameCell = document.createElement('td');
    vehicleNameCell.className = 'key-cell';
    vehicleNameCell.textContent = data.vehicleName;
    newRow.appendChild(vehicleNameCell);
    const startDateCell = document.createElement('td');
    startDateCell.className = 'normal-cell';
    startDateCell.textContent = GetFormattedDate(new Date(data.startDate));
    newRow.appendChild(startDateCell);
    const endDateCell = document.createElement('td');
    endDateCell.className = 'normal-cell';
    endDateCell.textContent = GetFormattedDate(new Date(data.endDate));
    newRow.appendChild(endDateCell);
    const totalRentPriceCell = document.createElement('td');
    totalRentPriceCell.className = 'normal-cell';
    totalRentPriceCell.textContent = data.totalRentPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
    newRow.appendChild(totalRentPriceCell);
    const statusCell = document.createElement('td');
    statusCell.className = 'normal-cell';
    statusCell.innerHTML = data.status === `true` ? `<div style="color: green;">Còn hạn</div>` : `<div style="color: red;">Hết hạn</div>`;
    newRow.appendChild(statusCell);
    const buttonsCell = document.createElement('td');
    buttonsCell.className = 'normal-cell';
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'edit-button';
    editButton.setAttribute('rid', data.rentId);
    editButton.textContent = 'Chi tiết';
    editButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        const newRentId = editButton.getAttribute('rid');
        rentId = newRentId;
        yield openEditModal();
    }));
    buttonsCell.appendChild(editButton);
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'cancel-button';
    cancelButton.setAttribute('rid', data.rentId);
    cancelButton.textContent = 'Hủy đơn thuê';
    cancelButton.addEventListener('click', () => {
        console.log('Clicked delete button');
        const newRentId = cancelButton.getAttribute('rid');
        rentId = newRentId;
        openDeleteModal();
    });
    buttonsCell.appendChild(cancelButton);
    newRow.appendChild(buttonsCell);
    rentTableBody.appendChild(newRow);
}
//For modals
function openDeleteModal() {
    if (!openedDeleteModal) {
        deleteModal.style.display = 'flex';
        openedDeleteModal = true;
        deleteModal.style.justifyContent = `center`;
        deleteModal.style.alignItems = `center`;
        deleteModal.style.backdropFilter = `blur(2px)`;
    }
}
function closeDeleteModal(button) {
    return __awaiter(this, void 0, void 0, function* () {
        if (openedDeleteModal) {
            deleteModal.style.display = 'none';
            openedDeleteModal = false;
            const action = String(button.getAttribute('action'));
            if (action === `confirm`) {
                yield deleteRent();
            }
        }
    });
}
function openEditModal() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!openedEditModal) {
            yield fetchRentDataForEditModal();
            editModal.style.display = 'flex';
            editModal.style.justifyContent = `center`;
            editModal.style.alignItems = `center`;
            editModal.style.backdropFilter = `blur(2px)`;
            openedEditModal = true;
        }
    });
}
function closeEditModal() {
    if (openedEditModal) {
        console.log(`Close edit modal`);
        editModal.style.display = `none`;
        openedEditModal = false;
    }
}
function deleteRent() {
    return __awaiter(this, void 0, void 0, function* () {
        const fetchUrl = `https://localhost:7235/api/rent/delete/${UserId}?rid=${rentId}`;
        try {
            const response = yield fetch(fetchUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status !== 204) {
                throw new Error(`Delete rent Error! Status code: ${response.status}`);
            }
            yield fetchRentDataPagingAsync();
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
function renderRentData(data) {
    const noResultHeading = document.querySelector('.no-result');
    if (data === null || data.length === 0) {
        rentTableBody.innerHTML = '';
        noResultHeading.style.display = 'block';
        return;
    }
    noResultHeading.style.display = 'none';
    rentTableBody.innerHTML = '';
    const loader = `<div role="status" id="rentTableLoader"
    class="p-4 space-y-4 w-full border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 dark:border-gray-700">
    <div class="flex items-center justify-between">
        <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
        <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
        <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
        <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
        <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <span class="sr-only">Loading...</span>
</div>`;
    rentTableBody.innerHTML = loader;
    setTimeout(() => {
        rentTableBody.innerHTML = ``;
        //Render the content
        data.forEach(rentData => {
            renderRentDataRow(rentData);
        });
    }, 1000);
}
function createRentPageItemElement(text, className) {
    const li = document.createElement('li');
    if (className === `prev-button` || className === `next-button`) {
        li.innerHTML = `<button class="${className}">${text}</button>`;
        li.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            if (li.classList.contains(`prev-button`)) {
                --page;
                if (page <= 0) {
                    page = totalPages;
                }
            }
            else {
                ++page;
                if (page > totalPages) {
                    page = 1;
                }
            }
            console.log(`Current page: ${page}`);
            yield fetchRentDataPagingAsync();
        }));
    }
    else {
        li.innerHTML = `<button class="${className}" page="${text}">${text}</button>`;
        li.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const newPage = Number(li.getAttribute("page"));
            page = newPage;
            yield fetchRentDataPagingAsync();
        }));
    }
    rentPagingContent.appendChild(li);
}
function renderRentPagingBar() {
    rentPagingContent.innerHTML = '';
    createRentPageItemElement(`&lt;`, `prev-button`);
    for (var pageCount = 1; pageCount <= totalPages; ++pageCount) {
        if (pageCount === page) {
            createRentPageItemElement(pageCount.toString(), `is-active-page`);
        }
        else {
            createRentPageItemElement(pageCount.toString(), `page`);
        }
    }
    createRentPageItemElement(`&gt;`, `next-button`);
}
function fetchRentData() {
    const fetchUrl = `https://localhost:7235/api/rent/filter/${UserId}`;
    const sendData = {
        keyword: keyword,
        dayRangeValue: dayRangeValue
    };
    console.log(`Send data: ${sendData}`);
    fetch(fetchUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendData)
    }).then(repsonse => {
        if (!repsonse.ok) {
            throw new Error(`Network error!Status code: ${repsonse.status}`);
        }
        return repsonse.json();
    })
        .then(data => {
        console.log(data);
        const rentDataList = data;
        renderRentData(rentDataList);
    })
        .catch(error => {
        console.error(`Error: ${error}`);
    });
}
function fetchRentDataPaging() {
    const fetchUrl = `https://localhost:7235/api/rent/filter/page/${UserId}?page=${page}`;
    const sendData = {
        keyword: keyword,
        dayRangeValue: dayRangeValue
    };
    console.log(`Send data: ${sendData}`);
    fetch(fetchUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendData)
    }).then(repsonse => {
        if (!repsonse.ok) {
            throw new Error(`Network error!Status code: ${repsonse.status}`);
        }
        return repsonse.json();
    })
        .then(data => {
        console.log(data);
        const rentDataList = data.rentData;
        renderRentData(rentDataList);
        totalPages = Number(data.totalPages);
        console.log(`Total pages: ${totalPages}`);
        renderRentPagingBar();
    })
        .catch(error => {
        console.error(`Error: ${error}`);
    });
}
function fetchRentDataPagingAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        const fetchUrl = `https://localhost:7235/api/rent/filter/page/${UserId}?page=${page}`;
        const sendData = {
            keyword: keyword,
            dayRangeValue: dayRangeValue
        };
        try {
            const response = yield fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            });
            if (!response.ok) {
                throw new Error(`Http error! Status code: ${response.status}`);
            }
            const data = yield response.json();
            console.log(data);
            const rentDataList = data.rentData;
            renderRentData(rentDataList);
            totalPages = Number(data.totalPages);
            console.log(`Total pages: ${totalPages}`);
            renderRentPagingBar();
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
function fetchRentDataForEditModal() {
    return __awaiter(this, void 0, void 0, function* () {
        const fetchUrl = `https://localhost:7235/api/rent/${rentId}`;
        try {
            const response = yield fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Http Error! Status code: ${response.status}`);
            }
            const data = yield response.json();
            const rent = data;
            renderRentDataForEditModal(rent);
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
function renderRentDataForEditModal(data) {
    const vehicleImageElement = document.getElementById('vehicleImage');
    vehicleImageElement.src = `/img/vehicle/${data.vehicle.image}`;
    const vehicleNameElement = document.getElementById('vehicleName');
    vehicleNameElement.textContent = data.vehicle.name;
    const vehicleBrandElement = document.getElementById('brand');
    vehicleBrandElement.textContent = data.vehicle.brand;
    const vehicleTypeElement = document.getElementById('type');
    vehicleTypeElement.textContent = data.vehicle.type;
    const vehiclePriceElement = document.getElementById('vehiclePrice');
    vehiclePriceElement.textContent = GetFormattedPrice(data.vehicle.rentPrice) + `/ Giờ`;
    vehiclePrice = data.vehicle.rentPrice;
    const addressElement = document.getElementById('address');
    addressElement.textContent = data.vehicle.address;
    const phoneNumberElememnt = document.getElementById('contactNumber');
    phoneNumberElememnt.textContent = data.vehicle.contactNumber;
    const startDateElement = document.getElementById('startdate');
    startDateElement.value = data.startDate.toString();
    const endDateElement = document.getElementById('enddate');
    endDateElement.value = data.endDate.toString();
    const minuteDifferences = new Date(data.endDate).getTime() - new Date(data.startDate).getTime();
    const hourDifferences = minuteDifferences / (1000 * 60 * 60);
    const rentHoursElement = document.getElementById('rentHours');
    rentHoursElement.textContent = `${hourDifferences} giờ`;
    const totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.textContent = GetFormattedPrice(data.totalRentPrice) + " VNĐ";
}
function GetFormattedPrice(price) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString();
}
function GetFinalCalculatedPrice() {
    const startDateElement = document.getElementById('startdate');
    const endDateElement = document.getElementById('enddate');
    const startDate = new Date(startDateElement.value);
    const endDate = new Date(endDateElement.value);
    const minuteDifferences = endDate.getTime() - startDate.getTime();
    const hourDifferences = minuteDifferences / (1000 * 60 * 60);
    const totalPrice = vehiclePrice * hourDifferences;
    return totalPrice;
}
function CheckValidRentDate() {
    const startDateElement = document.getElementById('startdate');
    const endDateElement = document.getElementById('enddate');
    if (!startDateElement.value || !endDateElement.value) {
        return false;
    }
    const startDate = startDateElement.value;
    const endDate = endDateElement.value;
    return (startDate <= endDate);
}
function UpdateRentPrice() {
    if (!CheckValidRentDate()) {
        alert('Vui lòng chọn ngày và giờ phù hợp');
        return;
    }
    const totalPrice = GetFinalCalculatedPrice();
    const totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.textContent = GetFormattedPrice(totalPrice) + " VNĐ";
}
function saveRentData() {
    return __awaiter(this, void 0, void 0, function* () {
        const startDateElement = document.getElementById('startdate');
        const endDateElement = document.getElementById('enddate');
        const totalPrice = GetFinalCalculatedPrice();
        const sendData = [
            {
                op: `replace`,
                path: `/startDate`,
                value: startDateElement.value
            },
            {
                op: `replace`,
                path: `/endDate`,
                value: endDateElement.value
            },
            {
                op: `replace`,
                path: `/totalRentPrice`,
                value: totalPrice
            }
        ];
        const fetchUrl = `https://localhost:7235/api/rent/update/${rentId}`;
        try {
            const response = yield fetch(fetchUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json-patch+json'
                },
                body: JSON.stringify(sendData)
            });
            if (!response || response.status !== 204) {
                throw new Error(`Http Error! Status code: ${response.status}`);
            }
            alert(`Lưu thành công!`);
            yield fetchRentDataForEditModal();
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
        yield fetchRentDataPagingAsync();
    });
}
//Events
deleteModalButtons.forEach(btn => {
    btn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        yield closeDeleteModal(btn);
    }));
});
tabLinkList.forEach(tabLink => {
    tabLink.addEventListener('click', (e) => {
        e.preventDefault();
        const tabList = document.querySelectorAll('.user-tab');
        tabList.forEach(tab => {
            tab.style.display = 'none';
        });
        // Remove is-active from all tab links
        tabLinkList.forEach(link => {
            link.classList.remove('is-active');
        });
        // Add is-active to this current tab link
        tabLink.classList.add('is-active');
        //Get id target for each link
        const linkAnchor = tabLink.querySelector('a');
        if (!linkAnchor) {
            return;
        }
        const target = linkAnchor.getAttribute('href');
        if (target === `/Home`) {
            window.location.href = `/Home`;
            return;
        }
        //Show the tab
        if (target) {
            const tab = document.querySelector(target);
            if (tab) {
                tab.style.display = 'block';
            }
        }
    });
});
rentTableSearchBar.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
    const newKeyword = String(rentTableSearchBar.value);
    keyword = newKeyword;
    // fetchRentData();
    yield fetchRentDataPagingAsync();
}));
filterDateOptions.forEach(option => {
    option.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
        const optionText = String(option.value);
        dateFilterContent.textContent = optionText;
        const NewDayRangeValue = Number(option.getAttribute('day'));
        dayRangeValue = NewDayRangeValue;
        // fetchRentData();
        yield fetchRentDataPagingAsync();
    }));
});
avatarInputElement.addEventListener('change', (event) => {
    const files = event.target.files;
    if (!files) {
        console.log('No file selected');
        return;
    }
    const file = files[0];
    let reader = new FileReader();
    // Set the onload function, which will be called after the file has been read
    reader.onload = (e) => {
        // The result attribute contains the data as a data: URL representing the file's data as a base64 encoded string.
        previewImageElement.src = reader.result;
    };
    // Read the image file as a data URL
    reader.readAsDataURL(file);
});
userInfoForm.addEventListener('submit', (e) => {
    const password = document.getElementById('password').value;
    const repass = document.getElementById('repass').value;
    if (password !== repass) {
        e.preventDefault();
        alert('Xác nhận mật khẩu và mật khẩu không giống nhau');
        return;
    }
});
tabLinkList[0].click();
//For quiz section
class QuestionData {
}
const questionDataTableBody = document.getElementById('questionDataContent');
const quizAttemptHistoryTableBody = document.getElementById('quizAttemptHistoryTableBody');
const detailsModal = document.getElementById('statModal');
var openedDetailsModal = false;
var attemptId = `A18C11ED-AD47-4D8A-9522-4A6C0B9F6158`;
const correctPercentElement = document.getElementById('correctPercent');
const incorrectPercentElement = document.getElementById('incorrectPercent');
const unfinishPercentElement = document.getElementById('unfinishedPercent');
var attemptDataList = [];
function fetchUserAttemptHistory() {
    return __awaiter(this, void 0, void 0, function* () {
        const fetchUrl = `https://localhost:7235/api/user/profile/quiz/${UserId}`;
        try {
            const response = yield fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Http Error! Status code: ${response.status}`);
            }
            const data = yield response.json();
            console.log(data);
            attemptDataList = data;
            renderUserAttemptTable(data);
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
function openDetailsModal() {
    if (!openedDetailsModal) {
        detailsModal.style.display = 'flex';
        detailsModal.style.justifyContent = `center`;
        detailsModal.style.alignItems = 'center';
        detailsModal.style.backdropFilter = 'blur(2px)';
        openedDetailsModal = true;
    }
}
function closeStatDetailsModal() {
    if (openedDetailsModal) {
        detailsModal.style.display = 'none';
        openedDetailsModal = false;
    }
}
function createUserAttemptTableRow(data) {
    const row = document.createElement('tr');
    row.className = `bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`;
    const quizNameCell = document.createElement('td');
    quizNameCell.className = `px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white`;
    quizNameCell.textContent = data.quizName;
    row.appendChild(quizNameCell);
    const attemptDateCell = document.createElement('td');
    attemptDateCell.className = `px-6 py-4`;
    attemptDateCell.textContent = new Date(data.attemptDate).toLocaleDateString();
    row.appendChild(attemptDateCell);
    const buttonsCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.className = `text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`;
    editButton.textContent = `Chi tiết`;
    editButton.setAttribute('aid', data.attemptID);
    editButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        console.log('Clicked details button');
        const newAttemptId = editButton.getAttribute('aid');
        attemptId = newAttemptId;
        const quizData = attemptDataList.find(att => att.attemptID === attemptId);
        loadQuizStatsData(quizData);
        yield fetchQuestionHistory();
        openDetailsModal();
    }));
    buttonsCell.appendChild(editButton);
    const redoButton = document.createElement('button');
    redoButton.className = `text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900`;
    redoButton.textContent = `Làm lại`;
    redoButton.setAttribute('lid', data.license);
    redoButton.addEventListener('click', () => {
        console.log('Clicked redo button');
        const licenseid = redoButton.getAttribute('lid');
        window.location.href = `/Quiz?licenseid=${licenseid}`;
    });
    buttonsCell.appendChild(redoButton);
    const removeButton = document.createElement('button');
    removeButton.className = `text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900`;
    removeButton.setAttribute('aid', data.attemptID);
    removeButton.textContent = `Xóa lịch sử`;
    removeButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        if (window.confirm('Xác nhận xóa lịch sử làm đề này?')) {
            const attemptId = removeButton.getAttribute('aid');
            deleteQuizAttempt(attemptId);
        }
    }));
    buttonsCell.appendChild(removeButton);
    row.appendChild(buttonsCell);
    quizAttemptHistoryTableBody.appendChild(row);
}
function deleteQuizAttempt(attemptId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://localhost:7235/api/users/quizattempt/delete/${attemptId}`;
            const response = yield fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status !== 204) {
                throw new Error(`Delete quiz attempt error! ${response.status} - ${response.statusText}`);
            }
            alert('Xóa lịch sử thành công');
            yield fetchUserAttemptHistory();
        }
        catch (error) {
            console.error(error);
        }
    });
}
//function drawPieChart(correctPercent: number, incorrectPercent: number, unfinishedPercent: number) {
//    const getChartOptions = () => {
//        return {
//            series: [correctPercent, incorrectPercent, unfinishedPercent],
//            colors: ["#52D726", "#FF0000", "#868686"],
//            chart: {
//                height: 420,
//                width: "100%",
//                type: "pie",
//            },
//            stroke: {
//                colors: ["white"],
//                lineCap: "",
//            },
//            plotOptions: {
//                pie: {
//                    labels: {
//                        show: true,
//                    },
//                    size: "100%",
//                    dataLabels: {
//                        offset: -25
//                    }
//                },
//            },
//            labels: ["Đúng", "Sai", "Chưa làm"],
//            dataLabels: {
//                enabled: true,
//                style: {
//                    // fontFamily: "Inter, sans-serif",
//                },
//            },
//            legend: {
//                position: "bottom",
//                // fontFamily: "Inter, sans-serif",
//            },
//            yaxis: {
//                labels: {
//                    formatter: function (value) {
//                        return value + "%"
//                    },
//                },
//            },
//            xaxis: {
//                labels: {
//                    formatter: function (value) {
//                        return value + "%"
//                    },
//                },
//                axisTicks: {
//                    show: false,
//                },
//                axisBorder: {
//                    show: false,
//                },
//            },
//        }
//    }
//    if (document.getElementById("pie-chart") && typeof ApexCharts !== 'undefined') {
//        const chart = new ApexCharts(document.getElementById("pie-chart"), getChartOptions());
//        chart.render();
//    }
//}
function loadQuizStatsData(data) {
    const totalQuestionElement = document.getElementById('totalQuestion');
    totalQuestionElement.textContent = String(data.totalQuestion);
    const correctQuestionElement = document.getElementById('correctQuestion');
    correctQuestionElement.textContent = String(data.correctQuestion);
    document.getElementById('correctQuestion').textContent = data.correctQuestion.toString();
    document.getElementById('incorrectQuestion').textContent = data.incorrectQuestion.toString();
    document.getElementById('unfinishQuestion').textContent = data.remainingQuestion.toString();
    const correctPercent = (data.correctQuestion / data.totalQuestion) * 100;
    const incorrectPercent = (data.incorrectQuestion / data.totalQuestion) * 100;
    const unfinishedPercent = 100 - correctPercent - incorrectPercent;
    console.log(`Correct: ${data.correctQuestion} - Incorrect: ${data.incorrectQuestion} - Remaining: ${data.remainingQuestion}`);
    console.log(`${correctPercent} - ${incorrectPercent} - ${unfinishedPercent}`);
    correctPercentElement.textContent = correctPercent.toString();
    incorrectPercentElement.textContent = incorrectPercent.toString();
    unfinishPercentElement.textContent = unfinishedPercent.toString();
    /*drawPieChart(correctPercent, incorrectPercent, unfinishedPercent);*/
}
function renderUserAttemptTable(quizAttemptList) {
    quizAttemptHistoryTableBody.innerHTML = '';
    quizAttemptList.forEach(attempt => {
        createUserAttemptTableRow(attempt);
    });
}
function fetchQuestionHistory() {
    return __awaiter(this, void 0, void 0, function* () {
        const fetchUrl = `https://localhost:7235/api/user/profile/quiz/questions/${attemptId}`;
        try {
            const response = yield fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Http Error! Status code: ${response.status}`);
            }
            const data = yield response.json();
            renderQuestionDataTable(data);
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
function createQuestionDataTableRow(data) {
    const row = document.createElement('tr');
    row.className = `bg-white text-justify border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`;
    const questionTextCell = document.createElement('td');
    questionTextCell.className = `pl-2 text-gray-900 dark:text-white`;
    questionTextCell.setAttribute('scope', 'row');
    questionTextCell.textContent = data.questionText;
    row.appendChild(questionTextCell);
    const userAnswerCell = document.createElement('td');
    userAnswerCell.className = `pl-2 px-6 py-4`;
    userAnswerCell.textContent = data.userAnswer;
    row.appendChild(userAnswerCell);
    const correctAnswerCell = document.createElement('td');
    correctAnswerCell.className = `pl-2 px-6 py-4`;
    correctAnswerCell.textContent = data.correctAnswer;
    row.appendChild(correctAnswerCell);
    const resultCell = document.createElement('td');
    resultCell.className = `px-6 py-3 text-center`;
    resultCell.setAttribute('scope', 'col');
    var result = ``;
    if (data.userAnswer !== null && data.userAnswer !== "") {
        if (data.userAnswer == data.correctAnswer) {
            result = `<span class="text-green-700">Đúng</span>`;
        }
        else {
            result = `<span class="text-red-700">Sai</span>`;
        }
    }
    else {
        result = `<span class="text-grey-700">Chưa làm</span>`;
    }
    resultCell.innerHTML = result;
    row.appendChild(resultCell);
    questionDataTableBody.appendChild(row);
}
function renderQuestionDataTable(questionList) {
    questionDataTableBody.innerHTML = ``;
    questionList.forEach(question => {
        createQuestionDataTableRow(question);
    });
}
class Schedule {
}
function getCalendarDays(month, year) {
    const date = new Date(year, month - 1, 1);
    const days = [];
    // Find the first Sunday before the month starts
    while (date.getDay() !== 0) {
        days.push(null);
        date.setDate(date.getDate() - 1);
    }
    const currentMonth = date.getMonth();
    // Reset date to the first day of the month
    date.setDate(1);
    while (date.getMonth() === currentMonth) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    // Fill the array to complete the last week with the next month's days
    while (days.length % 7 !== 0) {
        days.push(null);
    }
    return days;
}
const year = 2023;
function displayCalendar(month, year) {
    var _a;
    let timeTableBody = document.getElementById('userTimetable');
    timeTableBody.innerHTML = '';
    let days = getCalendarDays(month, year);
    let tr = null;
    for (let i = 0; i < days.length; i++) {
        if (i % 7 === 0) { // start a new row every week
            tr = document.createElement('tr');
            tr.className = 'text-center h-20';
        }
        if (tr !== null) {
            if (days[i] !== null) {
                let normalCellTemplate = document.getElementById('normalDayCellTemplate');
                let normalCellClone = document.importNode(normalCellTemplate.content, true);
                let dayText = normalCellClone.querySelector('.dayText');
                if (dayText) {
                    dayText.textContent = ((_a = days[i]) === null || _a === void 0 ? void 0 : _a.getDate().toString()) || '';
                }
                tr.appendChild(normalCellClone);
            }
            else {
                let missingCellTemplate = document.getElementById('missingDayCellTemplate');
                let missingCellClone = document.importNode(missingCellTemplate.content, true);
                if (timeTableBody) {
                    tr.appendChild(missingCellClone);
                }
            }
            if (i % 7 === 6 || i === days.length - 1) {
                if (timeTableBody && tr !== null) {
                    timeTableBody.appendChild(tr);
                }
            }
        }
    }
}
function fetchScheduleData(month) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://localhost:7235/api/user/schedules/${UserId}?month=${month}`;
        try {
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP Error! Status code: ${response.status}`);
            }
            const data = yield response.json();
            console.log(data);
            var scheduleList = data;
            displayCalendar(month, year);
            renderUserScheduleData(scheduleList, month);
            const normalDayCells = document.querySelectorAll('td');
            normalDayCells.forEach(normalDayCell => {
                normalDayCell.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                    console.log('Click event triggered');
                    const dayTextElement = normalDayCell.querySelector('span');
                    if (dayTextElement.textContent.trim() !== ``) {
                        const day = Number(dayTextElement.textContent);
                        const month = Number(monthSelect.value);
                        console.log(`${day}-${month}`);
                        yield fetchUserScheduleDataForDay(day, month);
                    }
                    toggleScheduleDetailsModal();
                }));
            });
        }
        catch (error) {
            console.error(error);
        }
    });
}
function fetchUserScheduleDataForDay(day, month) {
    return __awaiter(this, void 0, void 0, function* () {
        const dateParam = `${year}-${month}-${day}`;
        const url = `https://localhost:7235/api/user/schedules/date/${UserId}?date=${dateParam}`;
        console.log('Date to fetch: ' + dateParam);
        console.log(url);
        try {
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP Error! Status code: ${response.status}`);
            }
            const data = yield response.json();
            console.log(data);
            var scheduleList = data;
            renderUserSchedulesForDay(scheduleList);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function toggleScheduleDetailsModal() {
    const modal = document.getElementById('detailsScheduleModal');
    const opened = (!modal.classList.contains('hidden') && modal.classList.contains('flex') && modal.classList.contains('blur-background'));
    if (!opened) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.style.justifyContent = `center`;
        modal.style.alignItems = `center`;
        modal.classList.add('blur-background');
    }
    else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modal.classList.remove('blur-background');
    }
}
function getFormattedTime(timeString) {
    let formattedTime = timeString.substring(0, 5);
    return formattedTime;
}
function renderUserSchedulesForDay(scheduleList) {
    const scheduleDetailsModalContent = document.getElementById('scheduleDetailsModalContent');
    scheduleDetailsModalContent.innerHTML = ``;
    if (scheduleList.length === 0) {
        const h3 = document.createElement("h3");
        h3.className = `text-center`;
        h3.textContent = `[Không có thông tin]`;
        scheduleDetailsModalContent.appendChild(h3);
        return;
    }
    scheduleList.forEach(schedule => {
        const scheduleDetailsTemplate = document.getElementById('scheduleDetailsTemplate');
        let scheduleDetailsElementClone = document.importNode(scheduleDetailsTemplate.content, true);
        let courseNameElement = scheduleDetailsElementClone.querySelector('.courseName');
        let courseStatusElement = scheduleDetailsElementClone.querySelector('.courseStatus');
        let courseDateElement = scheduleDetailsElementClone.querySelector('.courseDate');
        let courseTimeElement = scheduleDetailsElementClone.querySelector('.courseTime');
        courseNameElement.textContent = `Khóa ${schedule.licenseId}`;
        const doneStatusClassName = `bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 ml-3`;
        const notDoneStatusClassName = `bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 ml-3`;
        if (schedule.status === `Sắp tới`) {
            courseStatusElement.className = `courseStatus ${doneStatusClassName}`;
        }
        else {
            courseStatusElement.className = `courseStatus ${notDoneStatusClassName}`;
        }
        courseStatusElement.textContent = schedule.status;
        courseDateElement.textContent = ``;
        courseTimeElement.textContent = `${getFormattedTime(schedule.startTime)}~${getFormattedTime(schedule.endTime)}`;
        scheduleDetailsModalContent.appendChild(scheduleDetailsElementClone);
    });
}
function renderUserScheduleData(scheduleList, month) {
    if (scheduleList === null || scheduleList.length === 0) {
        console.log('No schedules data');
        return;
    }
    const normalDayElements = document.querySelectorAll('.normalDay');
    scheduleList.forEach(schedule => {
        const scheduleDate = new Date(schedule.date);
        const index = scheduleDate.getDate() - 1;
        const normalDayCell = normalDayElements[index];
        const eventsContainer = normalDayCell.querySelector('.eventsContainer');
        let eventTemplate = document.getElementById('event-template');
        let eventElementClone = document.importNode(eventTemplate.content, true);
        var eventNameElement = eventElementClone.querySelector('.event-name');
        eventNameElement.textContent = `Khóa ${schedule.licenseId}`;
        var timeElement = eventElementClone.querySelector('time');
        // timeElement.textContent = `${schedule.startTime}~${schedule.endTime}`;
        timeElement.textContent = `${getFormattedTime(schedule.startTime)}~${getFormattedTime(schedule.endTime)}`;
        eventsContainer.appendChild(eventElementClone);
    });
}
const monthSelect = document.getElementById('monthSelect');
monthSelect.addEventListener('input', () => {
    if (monthSelect.value === "") {
        alert('Vui lòng chọn tháng phù hợp');
        return;
    }
    const month = Number(monthSelect.value);
    fetchScheduleData(month);
});
function fetchUserInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://localhost:7235/api/user/info/${UserId}`;
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP Error! Status code: ${response.status}`);
            }
            const data = yield response.json();
            console.log(data);
            const user = data;
            renderUserInfo(user);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function renderUserInfo(user) {
    //https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"))   
    const userAvatarElement = document.getElementById('previewImage');
    const fullNameElement = document.getElementById('fullname');
    const birthDateElement = document.getElementById('birthdate');
    const phoneNumberElement = document.getElementById('phoneNumber');
    const nationalityElement = document.getElementById('Nationality');
    const cccdElement = document.getElementById('cccd');
    const emailElement = document.getElementById('email');
    const addressElement = document.getElementById('address');
    const passwordElement = document.getElementById('password');
    const repassElement = document.getElementById('repass');
    if (user.avatar !== null && user.avatar !== ``) {
        userAvatarElement.src = `/img/Avatar/${user.avatar}`;
    }
    fullNameElement.value = user.fullName;
    birthDateElement.value = user.birthDate.toString().substring(0, 10);
    phoneNumberElement.value = user.phoneNumber;
    nationalityElement.value = user.nationality;
    cccdElement.value = user.cccd;
    addressElement.value = user.address;
    emailElement.value = user.email;
    passwordElement.value = user.password;
    repassElement.value = user.password;
}
function saveUserInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://localhost:7235/api/user/info/update/${UserId}`;
            const formData = new FormData(userInfoForm);
            const response = yield fetch(url, {
                method: 'PUT',
                body: formData
            });
            if (response.status !== 204) {
                throw new Error(`http error! status code: ${response.status}, ${response.statusText}`);
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
userInfoForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    yield saveUserInfo();
    alert('Lưu thành công');
}));
//For closing buttons
const closeRentEditModalButton = document.querySelector('.closeRentEditModalButton');
closeRentEditModalButton.addEventListener('click', closeEditModal);
const scheduleDetailsCloseButtons = document.querySelectorAll('.scheduleDetailsCloseButton');
scheduleDetailsCloseButtons.forEach(btn => {
    btn.addEventListener('click', toggleScheduleDetailsModal);
});
const statDetailsModalCloseButtons = document.querySelectorAll('.statDetailsModalCloseButton');
statDetailsModalCloseButtons.forEach(btn => {
    btn.addEventListener('click', closeStatDetailsModal);
});
window.addEventListener('DOMContentLoaded', () => __awaiter(this, void 0, void 0, function* () {
    yield fetchUserInfo();
    yield fetchRentDataPagingAsync();
    const startDateElement = document.getElementById('startdate');
    const endDateElement = document.getElementById('enddate');
    const rentSubmitBtn = document.getElementById('rentSubmitBtn');
    startDateElement.addEventListener('change', () => {
        UpdateRentPrice();
    });
    endDateElement.addEventListener('change', () => {
        UpdateRentPrice();
    });
    rentSubmitBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        yield saveRentData();
    }));
    yield fetchUserAttemptHistory();
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    monthSelect.selectedIndex = currentMonth;
    yield fetchScheduleData(currentMonth);
}));
//# sourceMappingURL=UserProfileFunctions.js.map