var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
//Switching tabs
var teacherTabLinkList = document.querySelectorAll('#sidebar-content .dashboard-item');
teacherTabLinkList.forEach(function (tabLink) {
    tabLink.addEventListener('click', function (e) {
        e.preventDefault();
        var tabList = document.querySelectorAll('.teacher-tab');
        tabList.forEach(function (tab) {
            tab.style.display = 'none';
        });
        // Remove is-active from all tab links
        teacherTabLinkList.forEach(function (link) {
            link.classList.remove('is-active');
        });
        // Add is-active to this current tab link
        tabLink.classList.add('is-active');
        //Get id target for each link
        var linkAnchor = tabLink.querySelector('a');
        if (!linkAnchor) {
            return;
        }
        var target = linkAnchor.getAttribute('href');
        if (target === "/Home") {
            window.location.href = "/Home";
            return;
        }
        //Show the tab
        if (target) {
            var tab = document.querySelector(target);
            if (tab) {
                tab.style.display = 'block';
            }
        }
    });
});
teacherTabLinkList[0].click();
//Teacher info form
var teacherAvatarElement = document.querySelector('.teacherAvatar');
var previewImageElement = document.getElementById('previewImage');
teacherAvatarElement.addEventListener('change', function (event) {
    var files = event.target.files;
    if (!files) {
        console.log('No file selected');
        return;
    }
    var file = files[0];
    var reader = new FileReader();
    // Set the onload function, which will be called after the file has been read
    reader.onload = function (e) {
        // The result attribute contains the data as a data: URL representing the file's data as a base64 encoded string.
        previewImageElement.src = reader.result;
    };
    // Read the image file as a data URL
    reader.readAsDataURL(file);
});
var Account = /** @class */ (function () {
    function Account() {
    }
    return Account;
}());
var Teacher = /** @class */ (function () {
    function Teacher() {
    }
    return Teacher;
}());
var teacherId = "DAA3024B-DEC1-422F-A070-144253088AD8";
var teacherInfoForm = document.getElementById('teacherInfoForm');
teacherInfoForm.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
    var passwordElement, repassElement;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                passwordElement = document.getElementById('password');
                repassElement = document.getElementById('repass');
                if (passwordElement.value !== repassElement.value) {
                    alert('Vui lòng xác nhận mật khẩu chính xác');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, saveTeacherInfo()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function saveTeacherInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var url, formData, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://localhost:7235/api/teacher/update/".concat(teacherId);
                    formData = new FormData(teacherInfoForm);
                    return [4 /*yield*/, fetch(url, {
                            method: 'PUT',
                            body: formData
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status !== 204) {
                        throw new Error("Http Error! Status code: ".concat(response.status));
                    }
                    alert('Lưu thông tin thành công');
                    return [2 /*return*/];
            }
        });
    });
}
function fetchTeacherInfoData() {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, teacher, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://localhost:7235/api/teacher/".concat(teacherId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Error! Status code: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log(data);
                    teacher = data;
                    loadTeacherData(teacher);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function loadTeacherData(teacher) {
    var fullNameElement = document.getElementById('fullname');
    var previewImageElement = document.getElementById('previewImage');
    var phoneNumberElement = document.getElementById('phone');
    var emailElement = document.getElementById('email');
    var descriptionElement = document.getElementById('description');
    var passwordElement = document.getElementById('password');
    fullNameElement.value = teacher.fullName;
    previewImageElement.src = "/img/avatar/".concat(teacher.avatar);
    phoneNumberElement.value = teacher.contactNumber;
    emailElement.value = teacher.email;
    descriptionElement.textContent = teacher.information;
    passwordElement.value = teacher.account.password;
}
function getCalendarDays(month, year) {
    var date = new Date(year, month - 1, 1);
    var days = [];
    // Find the first Sunday before the month starts
    while (date.getDay() !== 0) {
        days.push(null);
        date.setDate(date.getDate() - 1);
    }
    var currentMonth = date.getMonth();
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
function displayCalendar(month, year) {
    var _a;
    var timeTableBody = document.getElementById('teacherTimetable');
    timeTableBody.innerHTML = '';
    var days = getCalendarDays(month, year);
    var tr = null;
    for (var i = 0; i < days.length; i++) {
        if (i % 7 === 0) { // start a new row every week
            tr = document.createElement('tr');
            tr.className = 'text-center h-20';
        }
        if (tr !== null) {
            if (days[i] !== null) {
                var normalCellTemplate = document.getElementById('normalDayCellTemplate');
                var normalCellClone = document.importNode(normalCellTemplate.content, true);
                var dayText = normalCellClone.querySelector('.dayText');
                if (dayText) {
                    dayText.textContent = ((_a = days[i]) === null || _a === void 0 ? void 0 : _a.getDate().toString()) || '';
                }
                tr.appendChild(normalCellClone);
            }
            else {
                var missingCellTemplate = document.getElementById('missingDayCellTemplate');
                var missingCellClone = document.importNode(missingCellTemplate.content, true);
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
var Schedule = /** @class */ (function () {
    function Schedule() {
    }
    return Schedule;
}());
var year = 2023;
function fetchScheduleData(month) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, scheduleList, normalDayCells, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://localhost:7235/api/teacher/schedules/".concat(teacherId, "?month=").concat(month);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP Error! Status code: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log(data);
                    scheduleList = data;
                    displayCalendar(month, year);
                    renderScheduleData(scheduleList, month);
                    normalDayCells = document.querySelectorAll('td');
                    normalDayCells.forEach(function (normalDayCell) {
                        normalDayCell.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                            var dayTextElement, day, month_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log('Click event triggered');
                                        dayTextElement = normalDayCell.querySelector('span');
                                        if (!(dayTextElement.textContent.trim() !== "")) return [3 /*break*/, 2];
                                        day = Number(dayTextElement.textContent);
                                        month_1 = Number(monthSelect.value);
                                        console.log("".concat(day, "-").concat(month_1));
                                        return [4 /*yield*/, fetchScheduleDataForDay(day, month_1)];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        toggleScheduleDetailsModal();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function fetchScheduleDataForDay(day, month) {
    return __awaiter(this, void 0, void 0, function () {
        var dateParam, url, response, data, scheduleList, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dateParam = "".concat(year, "-").concat(month, "-").concat(day);
                    url = "https://localhost:7235/api/teacher/schedules/date/".concat(teacherId, "?date=").concat(dateParam);
                    console.log('Date to fetch: ' + dateParam);
                    console.log(url);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP Error! Status code: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log(data);
                    scheduleList = data;
                    renderSchedulesForDay(scheduleList);
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error(error_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function toggleScheduleDetailsModal() {
    var modal = document.getElementById('detailsScheduleModal');
    var opened = (!modal.classList.contains('hidden') && modal.classList.contains('flex') && modal.classList.contains('blur-background'));
    if (!opened) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.classList.add('blur-background');
    }
    else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modal.classList.remove('blur-background');
    }
}
function getFormattedTime(timeString) {
    var formattedTime = timeString.substring(0, 5);
    return formattedTime;
}
function renderSchedulesForDay(scheduleList) {
    var scheduleDetailsModalContent = document.getElementById('scheduleDetailsModalContent');
    scheduleDetailsModalContent.innerHTML = "";
    scheduleList.forEach(function (schedule) {
        var scheduleDetailsTemplate = document.getElementById('scheduleDetailsTemplate');
        var scheduleDetailsElementClone = document.importNode(scheduleDetailsTemplate.content, true);
        var courseNameElement = scheduleDetailsElementClone.querySelector('.courseName');
        var courseStatusElement = scheduleDetailsElementClone.querySelector('.courseStatus');
        var courseDateElement = scheduleDetailsElementClone.querySelector('.courseDate');
        var courseTimeElement = scheduleDetailsElementClone.querySelector('.courseTime');
        courseNameElement.textContent = "Kh\u00F3a ".concat(schedule.licenseId);
        var doneStatusClassName = "bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 ml-3";
        var notDoneStatusClassName = "bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 ml-3";
        if (schedule.status === "S\u1EAFp t\u1EDBi") {
            courseStatusElement.className = "courseStatus ".concat(doneStatusClassName);
        }
        else {
            courseStatusElement.className = "courseStatus ".concat(notDoneStatusClassName);
        }
        courseStatusElement.textContent = schedule.status;
        courseDateElement.textContent = "";
        courseTimeElement.textContent = "".concat(getFormattedTime(schedule.startTime), "~").concat(getFormattedTime(schedule.endTime));
        scheduleDetailsModalContent.appendChild(scheduleDetailsElementClone);
    });
}
function renderScheduleData(scheduleList, month) {
    if (scheduleList === null || scheduleList.length === 0) {
        console.log('No schedules data');
        return;
    }
    var normalDayElements = document.querySelectorAll('.normalDay');
    scheduleList.forEach(function (schedule) {
        var scheduleDate = new Date(schedule.date);
        var index = scheduleDate.getDate() - 1;
        var normalDayCell = normalDayElements[index];
        var eventsContainer = normalDayCell.querySelector('.eventsContainer');
        var eventTemplate = document.getElementById('event-template');
        var eventElementClone = document.importNode(eventTemplate.content, true);
        var eventNameElement = eventElementClone.querySelector('.event-name');
        eventNameElement.textContent = "Kh\u00F3a ".concat(schedule.licenseId);
        var timeElement = eventElementClone.querySelector('time');
        // timeElement.textContent = `${schedule.startTime}~${schedule.endTime}`;
        timeElement.textContent = "".concat(getFormattedTime(schedule.startTime), "~").concat(getFormattedTime(schedule.endTime));
        eventsContainer.appendChild(eventElementClone);
    });
}
var monthSelect = document.getElementById('monthSelect');
monthSelect.addEventListener('input', function () {
    if (monthSelect.value === "") {
        alert('Vui lòng chọn tháng phù hợp');
        return;
    }
    var month = Number(monthSelect.value);
    fetchScheduleData(month);
});
var HireInfo = /** @class */ (function () {
    function HireInfo() {
    }
    return HireInfo;
}());
function fetchHireData() {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, hireInfoList, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    url = "https://localhost:7235/api/teacher/hirerequest/".concat(teacherId);
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP ERROR! Status code: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    console.log(data);
                    hireInfoList = data;
                    renderHireTable(hireInfoList);
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error(error_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updateHireRequestStatus(hireId, status) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, currentDate, currentMonth, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    url = "https://localhost:7235/api/teacher/hirerequest/update/".concat(hireId, "?status=").concat(status);
                    return [4 /*yield*/, fetch(url, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status !== 204) {
                        throw new Error("HTTP ERROR! Status code: ".concat(response.status));
                    }
                    currentDate = new Date();
                    currentMonth = currentDate.getMonth() + 1;
                    monthSelect.selectedIndex = currentMonth;
                    return [4 /*yield*/, fetchScheduleData(currentMonth)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchHireData()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    console.error(error_5);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function renderHireTable(hireInfoList) {
    var _this = this;
    var hireTableBody = document.getElementById('hireTableBody');
    hireTableBody.innerHTML = "";
    if (hireInfoList === null || hireInfoList.length === 0) {
        console.log('No hire data');
        return;
    }
    hireInfoList.forEach(function (hireInfo) {
        var template = document.getElementById('hire-row-template');
        var clone = document.importNode(template.content, true);
        var NameElement = clone.querySelector('.HireUsername');
        NameElement.textContent = hireInfo.userName;
        var HireDateElement = clone.querySelector('.HireDate');
        HireDateElement.textContent = new Date(hireInfo.hireDate).toLocaleString();
        var LicenseElement = clone.querySelector('.HireLicense');
        LicenseElement.textContent = hireInfo.licenseId;
        var StatusElement = clone.querySelector('.HireStatus');
        StatusElement.setAttribute('hid', hireInfo.hireId);
        StatusElement.value = hireInfo.status;
        StatusElement.addEventListener('input', function () { return __awaiter(_this, void 0, void 0, function () {
            var status, hireId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = String(StatusElement.value);
                        if (!window.confirm("C\u1EADp nh\u1EADt tr\u1EA1ng th\u00E1i th\u00E0nh ".concat(status, "?"))) return [3 /*break*/, 2];
                        hireId = StatusElement.getAttribute('hid');
                        return [4 /*yield*/, updateHireRequestStatus(hireId, status)];
                    case 1:
                        _a.sent();
                        alert("C\u1EADp nh\u1EADt th\u00E0nh c\u00F4ng tr\u1EA1ng th\u00E1i th\u00E0nh ".concat(status));
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        hireTableBody.appendChild(clone);
    });
}
document.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    var currentDate, currentMonth;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentDate = new Date();
                currentMonth = currentDate.getMonth() + 1;
                monthSelect.selectedIndex = currentMonth;
                return [4 /*yield*/, fetchScheduleData(currentMonth)];
            case 1:
                _a.sent();
                return [4 /*yield*/, fetchHireData()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
