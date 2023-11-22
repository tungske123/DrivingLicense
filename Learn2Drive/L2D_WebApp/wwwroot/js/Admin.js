var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const adminId = document.getElementById('adminId').textContent;
const adminTabLinkList = document.querySelectorAll('.dashboard-item');
adminTabLinkList.forEach(tabLink => {
    tabLink.addEventListener('click', (e) => {
        e.preventDefault();
        const tabList = document.querySelectorAll('.admin-tab');
        tabList.forEach(tab => {
            tab.style.display = 'none';
        });
        // Remove is-active from all tab links
        adminTabLinkList.forEach(link => {
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
adminTabLinkList[0].click();
class RentChartData {
}
function fetchRentChartData() {
    const url = `https://localhost:7235/api/admin/rent/data`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error! Status code: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        console.log(data);
        renderRentChartData(data);
    }).catch(error => {
        console.error(error);
    });
}
function getChartDateData(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}-${month}`;
}
//.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
function renderRentChartData(dataList) {
    if (dataList.length === 0) {
        console.log('No rent chart data');
        return;
    }
    const chartDataList = document.getElementById('chartdatalist');
    chartDataList.innerHTML = ``;
    const chartDateList = document.getElementById('chartdatelist');
    chartDateList.innerHTML = ``;
    const totalMoneyElement = document.getElementById('totalMoney');
    let sum = 0;
    dataList.forEach(data => {
        const li = document.createElement('li');
        li.setAttribute('hidden', 'true');
        li.className = 'chartdata';
        li.textContent = data.total.toString();
        chartDataList.appendChild(li);
        const dateLi = document.createElement('li');
        dateLi.setAttribute('hiden', 'true');
        dateLi.className = `chartdate`;
        dateLi.textContent = getChartDateData(new Date(data.date));
        chartDateList.appendChild(dateLi);
        sum += data.total;
    });
    totalMoneyElement.textContent = sum.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
}
fetchRentChartData();
function fetchAdminInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://localhost:7235/api/admin/info/${adminId}`;
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
        }
        catch (error) {
            console.error(error);
        }
    });
}
const adminInfoForm = document.getElementById('adminInfoForm');
adminInfoForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const repass = document.getElementById('repass').value;
    if (password !== repass) {
        alert('Vui lòng xác nhận mật khẩu chính xác');
        return;
    }
    try {
        const url = `https://localhost:7235/api/admin/info/update/${adminId}`;
        const formData = new FormData(adminInfoForm);
        const response = yield fetch(url, {
            method: 'PUT',
            body: formData
        });
        if (response.status !== 204) {
            throw new Error(`HTTP Error! Status code: ${response.status}`);
        }
        alert('Lưu thành công');
        fetchAdminInfo();
    }
    catch (error) {
        console.error(error);
    }
}));
window.addEventListener('DOMContentLoaded', () => __awaiter(this, void 0, void 0, function* () {
    yield fetchAdminInfo();
}));
//# sourceMappingURL=Admin.js.map