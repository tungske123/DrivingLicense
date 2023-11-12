var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//Switching tabs
const teacherTabLinkList = document.querySelectorAll('#sidebar-content .dashboard-item');
teacherTabLinkList.forEach(tabLink => {
    tabLink.addEventListener('click', (e) => {
        e.preventDefault();
        const tabList = document.querySelectorAll('.teacher-tab');
        tabList.forEach(tab => {
            tab.style.display = 'none';
        });
        // Remove is-active from all tab links
        teacherTabLinkList.forEach(link => {
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
teacherTabLinkList[0].click();
//Teacher info form
const teacherAvatarElement = document.querySelector('.teacherAvatar');
const PreviewImageElement = document.getElementById('previewImage');
teacherAvatarElement.addEventListener('change', (event) => {
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
        PreviewImageElement.src = reader.result;
    };
    // Read the image file as a data URL
    reader.readAsDataURL(file);
});
class Teacher {
}
var teacherId = document.getElementById('TeacherId').textContent;
const teacherInfoForm = document.getElementById('teacherInfoForm');
teacherInfoForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    const passwordElement = document.getElementById('password');
    const repassElement = document.getElementById('repass');
    if (passwordElement.value !== repassElement.value) {
        alert('Vui lòng xác nhận mật khẩu chính xác');
        return;
    }
    yield saveTeacherInfo();
}));
function saveTeacherInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://localhost:7235/api/teacher/update/${teacherId}`;
        const formData = new FormData(teacherInfoForm);
        const response = yield fetch(url, {
            method: 'PUT',
            body: formData
        });
        if (response.status !== 204) {
            throw new Error(`Http Error! Status code: ${response.status}`);
        }
        alert('Lưu thông tin thành công');
    });
}
function fetchTeacherInfoData() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://localhost:7235/api/teacher/${teacherId}`;
        try {
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error! Status code: ${response.status}`);
            }
            const data = yield response.json();
            console.log(data);
            const teacher = data;
            loadTeacherData(teacher);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function loadTeacherData(teacher) {
    const fullNameElement = document.getElementById('fullname');
    const PreviewImageElement = document.getElementById('previewImage');
    const phoneNumberElement = document.getElementById('phone');
    const emailElement = document.getElementById('email');
    const descriptionElement = document.getElementById('description');
    const passwordElement = document.getElementById('password');
    const repassElement = document.getElementById('repass');
    fullNameElement.value = teacher.fullName;
    PreviewImageElement.src = `/img/Avatar/${teacher.avatar}`;
    phoneNumberElement.value = teacher.contactNumber;
    emailElement.value = teacher.email;
    descriptionElement.textContent = teacher.information;
    passwordElement.value = teacher.password;
    repassElement.value = teacher.password;
}
function GetCalendarDays(month, TeacherYear) {
    const date = new Date(TeacherYear, month - 1, 1);
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
function displayTeacherCalendar(month, TeacherYear) {
    var _a;
    let timeTableBody = document.getElementById('teacherTimetable');
    timeTableBody.innerHTML = '';
    let days = GetCalendarDays(month, TeacherYear);
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
class TeacherSchedule {
}
const TeacherYear = 2023;
function fetchTeacherScheduleData(month) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://localhost:7235/api/teacher/schedules/${teacherId}?month=${month}`;
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
            displayTeacherCalendar(month, TeacherYear);
            renderScheduleData(scheduleList, month);
            const normalDayCells = document.querySelectorAll('td');
            normalDayCells.forEach(normalDayCell => {
                normalDayCell.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                    console.log('Click event triggered');
                    const dayTextElement = normalDayCell.querySelector('span');
                    if (dayTextElement.textContent.trim() !== ``) {
                        const day = Number(dayTextElement.textContent);
                        const month = Number(monthSelect.value);
                        console.log(`${day}-${month}`);
                        yield fetchScheduleDataForDay(day, month);
                    }
                    toggleTeacherScheduleDetailsModal();
                }));
            });
        }
        catch (error) {
            console.error(error);
        }
    });
}
function fetchScheduleDataForDay(day, month) {
    return __awaiter(this, void 0, void 0, function* () {
        const dateParam = `${TeacherYear}-${month}-${day}`;
        const url = `https://localhost:7235/api/teacher/schedules/date/${teacherId}?date=${dateParam}`;
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
            renderSchedulesForDay(scheduleList);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function toggleTeacherScheduleDetailsModal() {
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
function GetFormattedTime(timeString) {
    let formattedTime = timeString.substring(0, 5);
    return formattedTime;
}
function renderSchedulesForDay(scheduleList) {
    const scheduleDetailsModalContent = document.getElementById('scheduleDetailsModalContent');
    scheduleDetailsModalContent.innerHTML = ``;
    scheduleList.forEach(TeacherSchedule => {
        const scheduleDetailsTemplate = document.getElementById('scheduleDetailsTemplate');
        let scheduleDetailsElementClone = document.importNode(scheduleDetailsTemplate.content, true);
        let courseNameElement = scheduleDetailsElementClone.querySelector('.courseName');
        let courseStatusElement = scheduleDetailsElementClone.querySelector('.courseStatus');
        let courseDateElement = scheduleDetailsElementClone.querySelector('.courseDate');
        let courseTimeElement = scheduleDetailsElementClone.querySelector('.courseTime');
        courseNameElement.textContent = `Khóa ${TeacherSchedule.licenseId}`;
        const doneStatusClassName = `bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 ml-3`;
        const notDoneStatusClassName = `bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 ml-3`;
        if (TeacherSchedule.status === `Sắp tới`) {
            courseStatusElement.className = `courseStatus ${doneStatusClassName}`;
        }
        else {
            courseStatusElement.className = `courseStatus ${notDoneStatusClassName}`;
        }
        courseStatusElement.textContent = TeacherSchedule.status;
        courseDateElement.textContent = ``;
        courseTimeElement.textContent = `${GetFormattedTime(TeacherSchedule.startTime)}~${GetFormattedTime(TeacherSchedule.endTime)}`;
        scheduleDetailsModalContent.appendChild(scheduleDetailsElementClone);
    });
}
function renderScheduleData(scheduleList, month) {
    if (scheduleList === null || scheduleList.length === 0) {
        console.log('No schedules data');
        return;
    }
    const normalDayElements = document.querySelectorAll('.normalDay');
    scheduleList.forEach(TeacherSchedule => {
        const scheduleDate = new Date(TeacherSchedule.date);
        const index = scheduleDate.getDate() - 1;
        const normalDayCell = normalDayElements[index];
        const eventsContainer = normalDayCell.querySelector('.eventsContainer');
        let eventTemplate = document.getElementById('event-template');
        let eventElementClone = document.importNode(eventTemplate.content, true);
        var eventNameElement = eventElementClone.querySelector('.event-name');
        eventNameElement.textContent = `Khóa ${TeacherSchedule.licenseId}`;
        var timeElement = eventElementClone.querySelector('time');
        // timeElement.textContent = `${TeacherSchedule.startTime}~${TeacherSchedule.endTime}`;
        timeElement.textContent = `${GetFormattedTime(TeacherSchedule.startTime)}~${GetFormattedTime(TeacherSchedule.endTime)}`;
        eventsContainer.appendChild(eventElementClone);
    });
}
const teacherMonthSelect = document.getElementById('monthSelect');
teacherMonthSelect.addEventListener('input', () => {
    if (teacherMonthSelect.value === "") {
        alert('Vui lòng chọn tháng phù hợp');
        return;
    }
    const month = Number(teacherMonthSelect.value);
    fetchTeacherScheduleData(month);
});
class HireInfo {
}
function fetchHireData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://localhost:7235/api/teacher/hirerequest/${teacherId}`;
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP ERROR! Status code: ${response.status}`);
            }
            const data = yield response.json();
            console.log(data);
            var hireInfoList = data;
            renderHireTable(hireInfoList);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function updateHireRequestStatus(hireId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://localhost:7235/api/teacher/hirerequest/update/${hireId}?status=${status}`;
            const response = yield fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status !== 204) {
                throw new Error(`HTTP ERROR! Status code: ${response.status}`);
            }
            var currentDate = new Date();
            var currentMonth = currentDate.getMonth() + 1;
            monthSelect.selectedIndex = currentMonth;
            yield fetchTeacherScheduleData(currentMonth);
            yield fetchHireData();
        }
        catch (error) {
            console.error(error);
        }
    });
}
function renderHireTable(hireInfoList) {
    const hireTableBody = document.getElementById('hireTableBody');
    hireTableBody.innerHTML = ``;
    if (hireInfoList === null || hireInfoList.length === 0) {
        console.log('No hire data');
        return;
    }
    hireInfoList.forEach(hireInfo => {
        let template = document.getElementById('hire-row-template');
        let clone = document.importNode(template.content, true);
        let NameElement = clone.querySelector('.HireUsername');
        NameElement.textContent = hireInfo.userName;
        let HireDateElement = clone.querySelector('.HireDate');
        HireDateElement.textContent = new Date(hireInfo.hireDate).toLocaleString();
        let LicenseElement = clone.querySelector('.HireLicense');
        LicenseElement.textContent = hireInfo.licenseId;
        let StatusElement = clone.querySelector('.HireStatus');
        StatusElement.setAttribute('hid', hireInfo.hireId);
        StatusElement.value = hireInfo.status;
        StatusElement.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
            var status = String(StatusElement.value);
            if (window.confirm(`Cập nhật trạng thái thành ${status}?`)) {
                var hireId = StatusElement.getAttribute('hid');
                yield updateHireRequestStatus(hireId, status);
                alert(`Cập nhật thành công trạng thái thành ${status}`);
            }
        }));
        hireTableBody.appendChild(clone);
    });
}
document.addEventListener('DOMContentLoaded', () => __awaiter(this, void 0, void 0, function* () {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    monthSelect.selectedIndex = currentMonth;
    yield fetchTeacherInfoData();
    yield fetchTeacherScheduleData(currentMonth);
    yield fetchHireData();
}));
//# sourceMappingURL=Teacher.js.map