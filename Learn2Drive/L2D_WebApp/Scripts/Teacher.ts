//Switching tabs
const teacherTabLinkList: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('#sidebar-content .dashboard-item');
teacherTabLinkList.forEach(tabLink => {
    tabLink.addEventListener('click', (e) => {
        e.preventDefault();

        const tabList = document.querySelectorAll('.teacher-tab') as NodeListOf<HTMLElement>;
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
        const linkAnchor: HTMLAnchorElement | null = tabLink.querySelector('a');
        if (!linkAnchor) {
            return;
        }
        const target: string | null = linkAnchor.getAttribute('href');
        if (target === `/Home`) {
            window.location.href = `/Home`;
            return;
        }
        //Show the tab
        if (target) {
            const tab: HTMLElement | null = document.querySelector(target);
            if (tab) {
                tab.style.display = 'block';
            }
        }
    });
});

teacherTabLinkList[0].click();

//Teacher info form
const teacherAvatarElement = document.querySelector('.teacherAvatar') as HTMLInputElement;
const PreviewImageElement = document.getElementById('previewImage') as HTMLImageElement;
teacherAvatarElement.addEventListener('change', (event: Event) => {
    const files = (<HTMLInputElement>event.target).files;
    if (!files) {
        console.log('No file selected');
        return;
    }
    const file = files[0];
    let reader = new FileReader();
    // Set the onload function, which will be called after the file has been read
    reader.onload = (e) => {
        // The result attribute contains the data as a data: URL representing the file's data as a base64 encoded string.
        PreviewImageElement.src = <string>reader.result;
    };
    // Read the image file as a data URL
    reader.readAsDataURL(file);
});


class Teacher {
    teacherId: string;
    accountId: string;
    avatar: string;
    fullName: string;
    information: string;
    contactNumber: string;
    email: string;
    password: string;
}
var teacherId: string = (document.getElementById('TeacherId') as HTMLDivElement).textContent;
const teacherInfoForm = document.getElementById('teacherInfoForm') as HTMLFormElement;
teacherInfoForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    const passwordElement = document.getElementById('password') as HTMLInputElement;
    const repassElement = document.getElementById('repass') as HTMLInputElement;
    if (passwordElement.value !== repassElement.value) {
        alert('Vui lòng xác nhận mật khẩu chính xác');
        return;
    }
    await saveTeacherInfo();
});
async function saveTeacherInfo() {
    const url = `https://localhost:7235/api/teacher/update/${teacherId}`;
    const formData = new FormData(teacherInfoForm);
    const response = await fetch(url, {
        method: 'PUT',
        body: formData
    });
    if (response.status !== 204) {
        throw new Error(`Http Error! Status code: ${response.status}`);
    }
    alert('Lưu thông tin thành công');
}

async function fetchTeacherInfoData() {
    const url = `https://localhost:7235/api/teacher/${teacherId}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error! Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const teacher: Teacher = data;
        loadTeacherData(teacher);
    } catch (error) {
        console.error(error);
    }
}

function loadTeacherData(teacher: Teacher) {
    const fullNameElement = document.getElementById('fullname') as HTMLInputElement;
    const PreviewImageElement = document.getElementById('previewImage') as HTMLImageElement;
    const phoneNumberElement = document.getElementById('phone') as HTMLInputElement;
    const emailElement = document.getElementById('email') as HTMLInputElement;
    const descriptionElement = document.getElementById('description') as HTMLTextAreaElement;
    const passwordElement = document.getElementById('password') as HTMLInputElement;
    const repassElement = document.getElementById('repass') as HTMLInputElement;
    fullNameElement.value = teacher.fullName;
    PreviewImageElement.src = `/img/Avatar/${teacher.avatar}`;
    phoneNumberElement.value = teacher.contactNumber;
    emailElement.value = teacher.email;
    descriptionElement.textContent = teacher.information;
    passwordElement.value = teacher.password;
    repassElement.value = teacher.password;
}

function GetCalendarDays(month: number, TeacherYear: number): (Date | null)[] {
    const date = new Date(TeacherYear, month - 1, 1);
    const days: (Date | null)[] = [];

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


function displayTeacherCalendar(month: number, TeacherYear: number): void {
    let timeTableBody = document.getElementById('teacherTimetable') as HTMLTableSectionElement;
    timeTableBody.innerHTML = '';
    let days = GetCalendarDays(month, TeacherYear);
    let tr: HTMLTableRowElement | null = null;

    for (let i = 0; i < days.length; i++) {
        if (i % 7 === 0) { // start a new row every week
            tr = document.createElement('tr');
            tr.className = 'text-center h-20';
        }

        if (tr !== null) {
            if (days[i] !== null) {
                let normalCellTemplate = document.getElementById('normalDayCellTemplate') as HTMLTemplateElement;
                let normalCellClone = document.importNode(normalCellTemplate.content, true);
                let dayText = normalCellClone.querySelector('.dayText') as HTMLSpanElement;
                if (dayText) {
                    dayText.textContent = days[i]?.getDate().toString() || '';
                }
                tr.appendChild(normalCellClone);
            } else {
                let missingCellTemplate = document.getElementById('missingDayCellTemplate') as HTMLTemplateElement;
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
    scheduleId: string;
    hireId: string;
    licenseId: string;
    startTime: string;
    endTime: string;
    date: Date;
    address: string;
    status: string;
}
const TeacherYear: number = 2023;
async function fetchTeacherScheduleData(month: number) {
    const url: string = `https://localhost:7235/api/teacher/schedules/${teacherId}?month=${month}`;
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
        var scheduleList: TeacherSchedule[] = data;
        displayTeacherCalendar(month, TeacherYear);
        renderScheduleData(scheduleList, month);
        const normalDayCells = document.querySelectorAll('td') as NodeListOf<HTMLTableCellElement>;
        normalDayCells.forEach(normalDayCell => {
            normalDayCell.addEventListener('click', async () => {
                console.log('Click event triggered');
                const dayTextElement = normalDayCell.querySelector('span') as HTMLSpanElement;
                if (dayTextElement.textContent.trim() !== ``) {
                    const day = Number(dayTextElement.textContent);
                    const month: number = Number(monthSelect.value);
                    console.log(`${day}-${month}`);
                    await fetchScheduleDataForDay(day, month);
                }
                toggleTeacherScheduleDetailsModal();
            });
        });
    } catch (error) {
        console.error(error);
    }
}

async function fetchScheduleDataForDay(day: number, month: number) {
    const dateParam = `${TeacherYear}-${month}-${day}`;
    const url: string = `https://localhost:7235/api/teacher/schedules/date/${teacherId}?date=${dateParam}`;
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
        var scheduleList: TeacherSchedule[] = data;
        renderSchedulesForDay(scheduleList);
    } catch (error) {
        console.error(error);
    }
}

function toggleTeacherScheduleDetailsModal() {
    const modal = document.getElementById('detailsScheduleModal') as HTMLDivElement;
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

function GetFormattedTime(timeString: string) {
    let formattedTime = timeString.substring(0, 5);
    return formattedTime;
}

function renderSchedulesForDay(scheduleList: TeacherSchedule[]) {
    const scheduleDetailsModalContent = document.getElementById('scheduleDetailsModalContent') as HTMLOListElement;
    scheduleDetailsModalContent.innerHTML = ``;
    scheduleList.forEach(TeacherSchedule => {
        const scheduleDetailsTemplate = document.getElementById('scheduleDetailsTemplate') as HTMLTemplateElement;
        let scheduleDetailsElementClone = document.importNode(scheduleDetailsTemplate.content, true);
        let courseNameElement = scheduleDetailsElementClone.querySelector('.courseName') as HTMLSpanElement;
        let courseStatusElement = scheduleDetailsElementClone.querySelector('.courseStatus') as HTMLSpanElement;
        let courseDateElement = scheduleDetailsElementClone.querySelector('.courseDate') as HTMLSpanElement;
        let courseTimeElement = scheduleDetailsElementClone.querySelector('.courseTime') as HTMLSpanElement;

        courseNameElement.textContent = `Khóa ${TeacherSchedule.licenseId}`;

        const doneStatusClassName = `bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 ml-3`;
        const notDoneStatusClassName = `bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 ml-3`;
        if (TeacherSchedule.status === `Sắp tới`) {
            courseStatusElement.className = `courseStatus ${doneStatusClassName}`;
        } else {
            courseStatusElement.className = `courseStatus ${notDoneStatusClassName}`;
        }
        courseStatusElement.textContent = TeacherSchedule.status;

        courseDateElement.textContent = ``;

        courseTimeElement.textContent = `${GetFormattedTime(TeacherSchedule.startTime)}~${GetFormattedTime(TeacherSchedule.endTime)}`;
        scheduleDetailsModalContent.appendChild(scheduleDetailsElementClone);

    });
}

function renderScheduleData(scheduleList: TeacherSchedule[], month: number) {
    if (scheduleList === null || scheduleList.length === 0) {
        console.log('No schedules data');
        return;
    }
    const normalDayElements = document.querySelectorAll('.normalDay') as NodeListOf<HTMLTableCellElement>;
    scheduleList.forEach(TeacherSchedule => {
        const scheduleDate: Date = new Date(TeacherSchedule.date);
        const index = scheduleDate.getDate() - 1;
        const normalDayCell = normalDayElements[index];
        const eventsContainer = normalDayCell.querySelector('.eventsContainer') as HTMLDivElement;
        let eventTemplate = document.getElementById('event-template') as HTMLTemplateElement;
        let eventElementClone = document.importNode(eventTemplate.content, true);

        var eventNameElement = eventElementClone.querySelector('.event-name') as HTMLSpanElement;
        eventNameElement.textContent = `Khóa ${TeacherSchedule.licenseId}`;

        var timeElement = eventElementClone.querySelector('time') as HTMLTimeElement;
        // timeElement.textContent = `${TeacherSchedule.startTime}~${TeacherSchedule.endTime}`;
        timeElement.textContent = `${GetFormattedTime(TeacherSchedule.startTime)}~${GetFormattedTime(TeacherSchedule.endTime)}`;

        eventsContainer.appendChild(eventElementClone);
    });
}



const teacherMonthSelect = document.getElementById('monthSelect') as HTMLSelectElement;
teacherMonthSelect.addEventListener('input', () => {
    if (teacherMonthSelect.value === "") {
        alert('Vui lòng chọn tháng phù hợp');
        return;
    }
    const month: number = Number(teacherMonthSelect.value);
    fetchTeacherScheduleData(month);
});

class HireInfo {
    hireId: string;
    teacherId: string;
    licenseId: string;
    userId: string;
    userName: string;
    hireDate: Date;
    status: string;
}

async function fetchHireData() {
    try {
        const url = `https://localhost:7235/api/teacher/hirerequest/${teacherId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP ERROR! Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        var hireInfoList: HireInfo[] = data;
        renderHireTable(hireInfoList);
    } catch (error) {
        console.error(error);
    }
}

async function updateHireRequestStatus(hireId: string, status: string) {
    try {
        const url = `https://localhost:7235/api/teacher/hirerequest/update/${hireId}?status=${status}`;
        const response = await fetch(url, {
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
        await fetchTeacherScheduleData(currentMonth);
        await fetchHireData();
    } catch (error) {
        console.error(error);
    }
}

function renderHireTable(hireInfoList: HireInfo[]) {
    const hireTableBody = document.getElementById('hireTableBody') as HTMLTableSectionElement;
    hireTableBody.innerHTML = ``;
    if (hireInfoList === null || hireInfoList.length === 0) {
        console.log('No hire data');
        return;
    }
    hireInfoList.forEach(hireInfo => {
        let template = document.getElementById('hire-row-template') as HTMLTemplateElement;
        let clone = document.importNode(template.content, true);
        let NameElement = clone.querySelector('.HireUsername') as HTMLTableCellElement;
        NameElement.textContent = hireInfo.userName;

        let HireDateElement = clone.querySelector('.HireDate') as HTMLTableCellElement;
        HireDateElement.textContent = new Date(hireInfo.hireDate).toLocaleString();

        let LicenseElement = clone.querySelector('.HireLicense') as HTMLTableCellElement;
        LicenseElement.textContent = hireInfo.licenseId;

        let StatusElement = clone.querySelector('.HireStatus') as HTMLSelectElement;
        StatusElement.setAttribute('hid', hireInfo.hireId);
        StatusElement.value = hireInfo.status;

        StatusElement.addEventListener('input', async () => {
            var status = String(StatusElement.value);
            if (window.confirm(`Cập nhật trạng thái thành ${status}?`)) {
                var hireId = StatusElement.getAttribute('hid');
                await updateHireRequestStatus(hireId, status);
                alert(`Cập nhật thành công trạng thái thành ${status}`);
            }
        });

        hireTableBody.appendChild(clone);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    monthSelect.selectedIndex = currentMonth;
    await fetchTeacherInfoData();
    await fetchTeacherScheduleData(currentMonth);
    await fetchHireData();
});