const adminTabLinkList: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.dashboard-item');
adminTabLinkList.forEach(tabLink => {
    tabLink.addEventListener('click', (e) => {
        e.preventDefault();

        const tabList = document.querySelectorAll('.admin-tab') as NodeListOf<HTMLElement>;
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

adminTabLinkList[0].click();

class RentChartData {
    date: Date;
    total: number;
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

function getChartDateData(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}-${month}`;
}
//.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
function renderRentChartData(dataList: RentChartData[]) {
    if (dataList.length === 0) {
        console.log('No rent chart data');
        return;
    }
    const chartDataList = document.getElementById('chartdatalist') as HTMLUListElement;
    chartDataList.innerHTML = ``;
    const chartDateList = document.getElementById('chartdatelist') as HTMLUListElement;
    chartDateList.innerHTML = ``;
    const totalMoneyElement = document.getElementById('totalMoney') as HTMLSpanElement;
    let sum: number = 0;
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
        const url: string = `https://localhost:7235/api/admin/info/${adminId}`;
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

    } catch (error) {
        console.error(error);
    }
}
const adminInfoForm = document.getElementById('adminInfoForm') as HTMLFormElement;
const adminId: string = ``;
adminInfoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const repass = (document.getElementById('repass') as HTMLInputElement).value;
    if (password !== repass) {
        alert('Vui lòng xác nhận mật khẩu chính xác');
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
        alert('Lưu thành công');
        fetchAdminInfo();
    } catch (error) {
        console.error(error);
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    await fetchAdminInfo();
})