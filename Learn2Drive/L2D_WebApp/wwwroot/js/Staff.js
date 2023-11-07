var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const staffTabLinkList = document.querySelectorAll('.dashboard-item');
staffTabLinkList.forEach(tabLink => {
    tabLink.addEventListener('click', (e) => {
        e.preventDefault();
        const tabList = document.querySelectorAll('.staff-tab');
        tabList.forEach(tab => {
            tab.style.display = 'none';
        });
        // Remove is-active from all tab links
        staffTabLinkList.forEach(link => {
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
staffTabLinkList[0].click();
const staffId = document.getElementById('StaffId').textContent;
class Staff {
}
function renderStaffInfo(staff) {
    const FullNameInput = document.getElementById('fullname');
    const EmailElement = document.getElementById('email');
    const PhoneElement = document.getElementById('phone');
    const PasswordElement = document.getElementById('password');
    FullNameInput.value = staff.fullName;
    EmailElement.value = staff.email;
    PhoneElement.value = staff.email;
    PasswordElement.value = staff.password;
}
function fetchStaffInfoData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://localhost:7235/api/staff/info/${staffId}`;
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
            //renderInfoHere
            const staff = data;
            renderStaffInfo(staff);
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
function updateStaffInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const staffInfoForm = document.getElementById('staffInfoForm');
        const url = `https://localhost:7235/api/staff/info/update/${staffId}`;
        const formData = new FormData(staffInfoForm);
        try {
            const response = yield fetch(url, {
                method: 'PUT',
                body: formData
            });
            if (response.status !== 204) {
                throw new Error(`HTTP Error! Status code: ${response.status}`);
            }
            alert('Lưu thông tin thành công');
            yield fetchStaffInfoData();
        }
        catch (error) {
            console.error(error);
        }
    });
}
const staffInfoForm = document.getElementById('staffInfoForm');
staffInfoForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    yield updateStaffInfo();
}));
document.addEventListener('DOMContentLoaded', () => __awaiter(this, void 0, void 0, function* () {
    yield fetchStaffInfoData();
}));
//# sourceMappingURL=Staff.js.map