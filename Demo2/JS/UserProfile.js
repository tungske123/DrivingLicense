//Definitions
/*import ApexCharts from "apexcharts";*/
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
const UserId = (document.getElementById('UserId')).textContent;
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
    const formattedDate =
        ("0" + date.getDate()).slice(-2) + "/" +
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
    startDateCell.textContent = getVietnamDateTime(data.startDate);
    newRow.appendChild(startDateCell);

    const endDateCell = document.createElement('td');
    endDateCell.className = 'normal-cell';
    endDateCell.textContent = getVietnamDateTime(data.endDate);
    newRow.appendChild(endDateCell);

    const totalRentPriceCell = document.createElement('td');
    totalRentPriceCell.className = 'normal-cell';
    totalRentPriceCell.textContent = data.totalRentPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
    newRow.appendChild(totalRentPriceCell);

    const statusCell = document.createElement('td');
    statusCell.className = 'normal-cell'
    statusCell.innerHTML = data.status === `true` ? `<div style="color: green;">Còn hạn</div>` : `<div style="color: red;">Hết hạn</div>`;
    newRow.appendChild(statusCell);

    const buttonsCell = document.createElement('td');
    buttonsCell.className = 'normal-cell';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'edit-button';
    editButton.setAttribute('rid', data.rentId);
    editButton.textContent = 'Chi tiết';
    editButton.addEventListener('click', async () => {
        const newRentId = editButton.getAttribute('rid');
        rentId = newRentId;
        await openEditModal();
    });
    buttonsCell.appendChild(editButton);

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'cancel-button';
    cancelButton.setAttribute('rid', data.rentId);
    cancelButton.textContent = 'Hủy đơn thuê';
    cancelButton.addEventListener('click', async () => {
        console.log('Clicked delete button');
        const newRentId = cancelButton.getAttribute('rid');
        rentId = newRentId;
        const result = await Swal.fire({
            icon: 'warning',
            title: "Xác nhận hủy đơn thuê này?",
            showCancelButton: true,
            confirmButtonText: "Hủy đơn này",
            confirmButtonColor: `#d90429`,
            cancelButtonText: `Không hủy`
        });
        if (result.isConfirmed) {
            await deleteRent();
            Swal.fire({
                icon: `success`,
                title: `Hủy đơn thuê thành công!`,
                confirmButtonColor: `#d90429`
            });
            await fetchRentDataPagingAsync();
        }
    });
    buttonsCell.appendChild(cancelButton);
    newRow.appendChild(buttonsCell);

    rentTableBody.appendChild(newRow);
}

//For modals

async function openEditModal() {
    if (!openedEditModal) {
        await fetchRentDataForEditModal();
        editModal.style.display = 'flex';
        editModal.style.justifyContent = `center`;
        editModal.style.alignItems = `center`;
        editModal.style.backdropFilter = `blur(2px)`;
        openedEditModal = true;
    }
}

function closeEditModal() {
    if (openedEditModal) {
        console.log(`Close edit modal`);
        editModal.style.display = `none`;
        openedEditModal = false;
    }
}

async function deleteRent() {
    const fetchUrl = `https://localhost:7235/api/rent/delete/${rentId}`;
    try {
        const response = await fetch(fetchUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 204) {
            throw new Error(`Delete rent Error! Status code: ${response.status}`);
        }
        await fetchRentDataPagingAsync();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

function renderRentData(data) {
    const noResultHeading = document.querySelector('.no-result');
    if (data === null || data.length === 0) {
        rentTableBody.innerHTML = '';
        noResultHeading.style.display = 'block';
        return;
    }
    noResultHeading.style.display = 'none';
    rentTableBody.innerHTML = ``;
    //Render the content
    data.forEach(rentData => {
        renderRentDataRow(rentData);
    });
}

function createRentPageItemElement(text, className) {
    const li = document.createElement('li');
    if (className === `prev-button` || className === `next-button`) {
        li.innerHTML = `<button class="${className}">${text}</button>`;
        li.addEventListener('click', async () => {
            if (li.classList.contains(`prev-button`)) {
                --page;
                if (page <= 0) {
                    page = totalPages;
                }
            } else {
                ++page;
                if (page > totalPages) {
                    page = 1;
                }
            }
            console.log(`Current page: ${page}`);
            await fetchRentDataPagingAsync();
        });
    } else {
        li.innerHTML = `<button class="${className}" page="${text}">${text}</button>`;
        li.addEventListener('click', async () => {
            const newPage = Number(li.getAttribute("page"));
            page = newPage;
            await fetchRentDataPagingAsync();
        });
    }
    rentPagingContent.appendChild(li);
}

function renderRentPagingBar() {
    rentPagingContent.innerHTML = '';
    createRentPageItemElement(`&lt;`, `prev-button`);
    for (var pageCount = 1; pageCount <= totalPages; ++pageCount) {
        if (pageCount === page) {
            createRentPageItemElement(pageCount.toString(), `is-active-page`);
        } else {
            createRentPageItemElement(pageCount.toString(), `page`);
        }
    }
    createRentPageItemElement(`&gt;`, `next-button`);
}

async function fetchRentDataPagingAsync() {
    const fetchUrl = `https://localhost:7235/api/rent/filter/page/${UserId}?page=${page}`;
    const sendData = {
        keyword: keyword,
        dayRangeValue: dayRangeValue
    };
    try {
        const response = await fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        });
        if (!response.ok) {
            throw new Error(`Http error! Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const rentDataList = data.rentData;
        renderRentData(rentDataList);
        totalPages = Number(data.totalPages);
        console.log(`Total pages: ${totalPages}`);
        renderRentPagingBar();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function fetchRentDataForEditModal() {
    const fetchUrl = `https://localhost:7235/api/rent/${rentId}`;
    try {
        const response = await fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Http Error! Status code: ${response.status}`);
        }
        const data = await response.json();
        renderRentDataForEditModal(data);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
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
    vehiclePriceElement.textContent = GetFormattedPrice(data.vehicle.rentPrice) + ` VNĐ/ Giờ`;
    vehiclePrice = data.vehicle.rentPrice;

    const addressElement = document.getElementById('address');
    addressElement.textContent = data.vehicle.address;

    const phoneNumberElememnt = document.getElementById('contactNumber');
    phoneNumberElememnt.textContent = data.vehicle.contactNumber;

    const startDateElement = document.getElementById('startdate');
    startDateElement.value = data.startDate;

    const endDateElement = document.getElementById('enddate');
    endDateElement.value = data.endDate;

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
        Swal.fire({
            icon: 'error',
            title: 'Vui lòng chọn ngày và giờ thuê phù hợp!',
            confirmButtonColor: '#d90429'
        });
        return;
    }
    const totalPrice = GetFinalCalculatedPrice();
    const totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.textContent = GetFormattedPrice(totalPrice) + " VNĐ";
}

async function saveRentData() {
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
        const response = await fetch(fetchUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify(sendData)
        });
        if (!response || response.status !== 204) {
            throw new Error(`Http Error! Status code: ${response.status}`);
        }
        Swal.fire({
            icon: 'success',
            title: 'Lưu thông tin đơn thuê thành công!',
            text: 'Vui lòng kiểm tra trong phần lịch sử thuê xe',
            confirmButtonColor: '#d90429'
        });
        await fetchRentDataForEditModal();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
    await fetchRentDataPagingAsync();
}

//Events

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
            window.location.href = target;
            return;
        }
        if (target === `/Login/logout`) {
            window.location.href = target;
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

rentTableSearchBar.addEventListener('input', async () => {
    const newKeyword = String(rentTableSearchBar.value);
    keyword = newKeyword;
    // fetchRentData();
    await fetchRentDataPagingAsync();
});

filterDateOptions.forEach(option => {
    option.addEventListener('input', async () => {
        const optionText = String(option.value);
        dateFilterContent.textContent = optionText;
        const NewDayRangeValu = Number(option.getAttribute('day'));
        dayRangeValue = NewDayRangeValue;
        // fetchRentData();
        await fetchRentDataPagingAsync();
    });
});

avatarInputElement.addEventListener('change', (event) => {
    const files = (event.target).files;
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



tabLinkList[0].click();

//For quiz section

const questionDataTableBody = document.getElementById('questionDataContent');
const quizAttemptHistoryTableBody = document.getElementById('quizAttemptHistoryTableBody');
const detailsModal = document.getElementById('statModal');
var openedDetailsModal = false;

var attemptDataList = [];

let quizAttemptPage = 1, totalQuizAttemptPage = 1, quizAttemptPageSize = 5;

function paginateArray(array, pageSize, pageNumber) {
    // calculate the start index
    let startIndex = (pageNumber - 1) * pageSize;
    startItemCnt = startIndex + 1;
    // return a slice of the array
    return array.slice(startIndex, startIndex + pageSize);
}

function calculateTotalPage(array, pageSize) {
    return Math.ceil(array.length / pageSize);
}

async function fetchUserAttemptHistory() {
    const fetchUrl = `https://localhost:7235/api/user/profile/quizattempt/${UserId}`;
    try {
        const response = await fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Http Error! Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        attemptDataList = data;
        totalQuizAttemptPage = calculateTotalPage(attemptDataList, quizAttemptPageSize);
        renderUserAttemptTable(paginateArray(attemptDataList, quizAttemptPageSize, quizAttemptPage));
        renderQuizAttemptPagingBar();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

function renderQuizAttemptPagingBar() {
    let quizAttemptPagingContent = document.getElementById('quizAttemptPagingContent');
    quizAttemptPagingContent.innerHTML = ``;
    let quizAttemptPageItemTemplate = document.getElementById('quizAttemptPageItemTemplate');
    for (var cnt = 1;cnt <= totalQuizAttemptPage;++cnt) {
        let clone = document.importNode(quizAttemptPageItemTemplate.content, true);
        let pageItem = clone.querySelector('li a');
        pageItem.setAttribute('page', cnt.toString());
        if (parseInt(cnt) === parseInt(quizAttemptPage)) {
            pageItem.classList.add('active-page');
        }
        pageItem.textContent = cnt.toString();
        pageItem.addEventListener('click', (e) => {
            e.preventDefault();
            let newPage = parseInt(pageItem.getAttribute('page'));
            quizAttemptPage = newPage;
            goToQuizAttemptPage();
        });

        quizAttemptPagingContent.appendChild(clone);
    }
}

function goToQuizAttemptPage() {
    // totalQuizAttemptPage = calculateTotalPage(attemptDataList, quizAttemptPageSize);
    renderUserAttemptTable(paginateArray(attemptDataList, quizAttemptPageSize, quizAttemptPage));
    renderQuizAttemptPagingBar();
}

let prevQuizAttemptBtn = document.querySelector('.prevQuizAttemptBtn');
let nextQuizAttemptBtn = document.querySelector('.nextQuizAttemptBtn');

prevQuizAttemptBtn.addEventListener('click', (e) => {
    e.preventDefault();
    --quizAttemptPage;
    if (quizAttemptPage <= 0) {
        quizAttemptPage = totalQuizAttemptPage;
    }
    goToQuizAttemptPage();
})

nextQuizAttemptBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    ++quizAttemptPage;
    if (quizAttemptPage > totalQuizAttemptPage) {
        quizAttemptPage = 1;
    }
    goToQuizAttemptPage();
});


function openDetailsModal() {
    if (!openedDetailsModal) {
        detailsModal.style.display = 'flex';
        detailsModal.style.justifyContent = `center`;
        detailsModal.style.alignItems = 'center';
        detailsModal.style.backdropFilter = 'blur(2px)';
        openedDetailsModal = true;
    }
}

function getFormattedTime(timeString) {
    let parts = timeString.split(':');

    let hours = parts[0];
    let minutes = parts[1];
    let seconds = parts[2];

    let formattedString = ``;
    if (hours !== `00`) {
        formattedString += `${hours} giờ `;
    }
    if (minutes !== `00`) {
        formattedString += `${minutes} phút `;
    }
    formattedString += `${seconds} giây`;
    return formattedString;
}

function getVietnamDateTime(dateString) {
    const utcDate = new Date(dateString);

    // Convert to Vietnam timezone (Indochina Time - ICT)
    const vietnamTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(utcDate);
    return vietnamTime;
}

async function deleteQuizAttempt(attemptId) {
    try {
        const url = `https://localhost:7235/api/users/quizattempt/delete/${attemptId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 204) {
            throw new Error(`Delete quiz attempt error! ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(error);
    }

}

function renderUserAttemptTable(attemptList) {
    quizAttemptHistoryTableBody.innerHTML = ``;
    if (attemptList === null || attemptList.length === 0) {
        return;
    }
    let quizAttemptRowTemplate = document.getElementById('quizAttemptRowTemplate');
    attemptList.forEach(attempt => {
        let clone = document.importNode(quizAttemptRowTemplate.content, true);
        let cells = clone.querySelectorAll('tr td');
        cells[0].textContent = attempt.quizName;
        cells[1].textContent = attempt.licenseId;
        cells[2].textContent = getVietnamDateTime(attempt.attemptDate);
        cells[3].textContent = attempt.attemptTime;
        cells[4].innerHTML = (attempt.result === true) ? `<span class="text-green-700 font-bold">Đậu</span>` : `<span class="text-red-700 font-bold">Rớt</span>`;
        let detailsBtn = cells[5].querySelector('.attemptDetailsBtn');

        let deleteBtn = cells[5].querySelector('.attemptDeleteBtn');
        detailsBtn.setAttribute('aid', attempt.attemptId);
        detailsBtn.setAttribute('qid', attempt.quizId);
        detailsBtn.addEventListener('click', () => {
            let aid = detailsBtn.getAttribute('aid');
            let qid = detailsBtn.getAttribute('qid');
            window.location.href = `/Quiz/ViewQuizResult?uid=${UserId}&aid=${aid}&qid=${qid}`;
        });

        deleteBtn.setAttribute('aid', attempt.attemptId);
        deleteBtn.setAttribute('qid', attempt.quizId);
        deleteBtn.addEventListener('click', async () => {
            let aid = deleteBtn.getAttribute('aid');
            let result = await Swal.fire({
                title: "Bạn có chắc chắn muốn xóa lịch sử?",
                text: "Bạn sẽ không thể xem lại thông tin của lần thi thử này sau khi xóa!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d90429",
                cancelButtonColor: "#808080",
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy"
            });
            if (result.isConfirmed) {
                await deleteQuizAttempt(aid);
                await fetchUserAttemptHistory();
                Swal.fire({
                    title: "Xóa thành công",
                    text: "Dữ liệu của lần thi thử này đã được xóa khỏi hệ thống!",
                    icon: "success",
                    confirmButtonColor: "#d90429",
                });
            }
        });
        quizAttemptHistoryTableBody.appendChild(clone);
    });
}


// class Schedule {
//     scheduleId;
//     hireId;
//     licenseId;
//     startTime;
//     endTime;
//     date;
//     address;
//     status;
// }

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
                    dayText.textContent = days[i]?.getDate().toString() || '';
                }
                tr.appendChild(normalCellClone);
            } else {
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
async function fetchScheduleData(month) {
    const url = `https://localhost:7235/api/user/schedules/${UserId}?month=${month}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP Error! Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        var scheduleList = data;
        displayCalendar(month, year);
        renderUserScheduleData(scheduleList, month);
        const normalDayCells = document.querySelectorAll('td');
        normalDayCells.forEach(normalDayCell => {
            normalDayCell.addEventListener('click', async () => {
                console.log('Click event triggered');
                const dayTextElement = normalDayCell.querySelector('span');
                if (dayTextElement.textContent.trim() !== ``) {
                    const day = Number(dayTextElement.textContent);
                    const month = Number(monthSelect.value);
                    console.log(`${day}-${month}`);
                    await fetchUserScheduleDataForDay(day, month);
                }
                toggleScheduleDetailsModal();
            });
        });
    } catch (error) {
        console.error(error);
    }
}

async function fetchUserScheduleDataForDay(day, month) {
    const dateParam = `${year}-${month}-${day}`;
    const url = `https://localhost:7235/api/user/schedules/date/${UserId}?date=${dateParam}`;
    console.log('Date to fetch: ' + dateParam);
    console.log(url);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP Error! Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        renderUserSchedulesForDay(data);
    } catch (error) {
        console.error(error);
    }
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
    } else {
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
    const scheduleDetailsModalContent = document.getElementById('scheduleDetailsModalContent')
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
        let courseTeacherNameElement = scheduleDetailsElementClone.querySelector('.courseTeacherName');
        let courseAddressElement = scheduleDetailsElementClone.querySelector('.courseAddress');
        let courseTeacherPhoneElement = scheduleDetailsElementClone.querySelector('.courseTeacherphone');
        courseNameElement.textContent = `Khóa ${schedule.licenseId}`;

        const doneStatusClassName = `bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 ml-3`;
        const notDoneStatusClassName = `bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 ml-3`;
        if (schedule.status === `Sắp tới`) {
            courseStatusElement.className = `courseStatus ${doneStatusClassName}`;
        } else {
            courseStatusElement.className = `courseStatus ${notDoneStatusClassName}`;
        }
        courseStatusElement.textContent = schedule.status;

        courseDateElement.textContent = ``;

        courseTeacherNameElement.textContent = schedule.hire.teacher.fullName;
        courseAddressElement.textContent = schedule.address;
        let teacherPhone = schedule.hire.teacher.contactNumber;
        courseTeacherPhoneElement.textContent = (teacherPhone !== null && teacherPhone !== ``) ? teacherPhone : 'Chưa cập nhật';
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



const monthSelect = document.getElementById('monthSelect')
monthSelect.addEventListener('input', () => {
    if (monthSelect.value === "") {
        alert('Vui lòng chọn tháng phù hợp');
        return;
    }
    const month = Number(monthSelect.value);
    fetchScheduleData(month);
});

async function fetchUserInfo() {
    try {
        const url = `https://localhost:7235/api/user/info/${UserId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP Error! Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const user = data;
        renderUserInfo(user);
    } catch (error) {
        console.error(error);
    }
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
    if (user.birthDate !== null) {
        birthDateElement.value = user.birthDate.toString().substring(0, 10);
    }
    phoneNumberElement.value = user.phoneNumber;
    nationalityElement.value = user.nationality;
    cccdElement.value = user.cccd;
    addressElement.value = user.address;
    emailElement.value = user.email;
    passwordElement.value = user.password;
    repassElement.value = user.password;
}

userInfoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
        icon: 'question',
        title: 'Xác nhận lưu thông tin?',
        confirmButtonColor: "#d90429",
        showCancelButton: true,
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Lưu'
    });

    if (!result.isConfirmed) {
        return;
    }

    const password = document.getElementById('password').value;
    const repass = document.getElementById('repass').value;
    console.log(`Password: ${password}\nRepass: ${repass}`);
    if (password !== repass) {
        Swal.fire({
            icon: 'error',
            title: 'Thông tin không chính xác!',
            confirmButtonColor: "#d90429",
        });
        return;
    }
    await saveUserInfo();
    Swal.fire({
        icon: 'success',
        title: 'Lưu thông tin thành công!',
        confirmButtonColor: "#d90429",
    });
});

async function saveUserInfo() {
    try {
        const url = `https://localhost:7235/api/user/info/update/${UserId}`;
        const formData = new FormData(userInfoForm);
        const response = await fetch(url, {
            method: 'PUT',
            body: formData
        });
        if (response.status !== 204) {
            throw new Error(`http error! status code: ${response.status}, ${response.statusText}`);
        }
    } catch (error) {
        console.error(error);
    }
}

//For closing buttons
const closeRentEditModalButton = document.querySelector('.closeRentEditModalButton');
closeRentEditModalButton.addEventListener('click', closeEditModal);

const scheduleDetailsCloseButtons = document.querySelectorAll('.scheduleDetailsCloseButton');
scheduleDetailsCloseButtons.forEach(btn => {
    btn.addEventListener('click', toggleScheduleDetailsModal);
});


window.addEventListener('DOMContentLoaded', async () => {
    await fetchUserInfo();
    await fetchRentDataPagingAsync();
    const startDateElement = document.getElementById('startdate');
    const endDateElement = document.getElementById('enddate');
    const rentSubmitBtn = document.getElementById('rentSubmitBtn');
    startDateElement.addEventListener('change', () => {
        UpdateRentPrice();
    });
    endDateElement.addEventListener('change', () => {
        UpdateRentPrice();
    })
    rentSubmitBtn.addEventListener('click', async () => {
        await saveRentData();
    });
    await fetchUserAttemptHistory();
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    monthSelect.selectedIndex = currentMonth;
    await fetchScheduleData(currentMonth);
});