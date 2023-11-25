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


async function fetchAdminInfo() {
    try {
        const url = `https://localhost:7235/api/admin/info/${adminId}`;
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
        loadAdminInfo(data);
    } catch (error) {
        console.error(error);
    }
}

function loadAdminInfo(admin) {
    let fullNameInput = document.getElementById('fullname');
    let emailInput = document.getElementById('email');
    let phoneInput = document.getElementById('phone');
    let passwordInput = document.getElementById('password');
    let repassInput = document.getElementById('repass');

    fullNameInput.value = admin.fullName;
    emailInput.value = admin.email;
    phoneInput.value = admin.contactNumber;
    passwordInput.value = admin.account.password;
    repassInput.value = admin.account.password;
}

const adminInfoForm = document.getElementById('adminInfoForm');

adminInfoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
        icon: 'question',
        title: 'Xác nhận lưu thông tin?',
        showCancelButton: true,
        confirmButtonText: 'Lưu',
        confirmButtonColor: '#d90429',
        cancelButtonText: 'Hủy',
    });
    if (result.isConfirmed) {
        const password = (document.getElementById('password')).value;
        const repass = (document.getElementById('repass')).value;
        if (password !== repass) {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng xác nhận mật khẩu chính xác',
                confirmButtonColor: '#d90429'
            });
            return;
        }
        try {
            const url = `https://localhost:7235/api/admin/info/update/${adminId}`;
            const formData = new FormData(adminInfoForm);
            const response = await fetch(url, {
                method: 'PUT',
                body: formData
            });
            if (response.status !== 204) {
                throw new Error(`HTTP Error! Status code: ${response.status}`);
            }
            Swal.fire({
                icon: 'success',
                title: 'Lưu thông tin thành công!',
                confirmButtonColor: '#d90429'
            });
            fetchAdminInfo();
        } catch (error) {
            console.error(error);
        }
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    await fetchAdminInfo();
})