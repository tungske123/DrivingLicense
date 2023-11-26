const baseUrl = `https://localhost:7235`;
let licenseInfoModal = new Modal(document.getElementById('licenseInfoModal'));
let licenseList;
let currentLicense;
async function fetchLicensesData() {
    try {
        const url = `${baseUrl}/api/licenses`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        licenseList = data;
        renderLicenseTable(data);
    } catch (error) {
        console.error(error);
    }
}

async function addLicense(license) {
    try {
        const url = `${baseUrl}/api/license/insert`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi thêm bằng lái!',
                text: `${response.status} - ${response.statusText}`,
                confirmButtonColor: '#d90429'
            });
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Thêm bằng lái mới thành công!',
            confirmButtonColor: '#d90429'
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi thêm bằng lái!',
            text: `${error}`,
            confirmButtonColor: '#d90429'
        });
    }
}

async function updateLicense(license) {
    try {
        const url = `${baseUrl}/api/license/update/${license.licenseId}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi cập nhật bằng lái!',
                text: `${response.status} - ${response.statusText}`,
                confirmButtonColor: '#d90429'
            });
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Cập nhật bằng lái thành công!',
            confirmButtonColor: '#d90429'
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi cập nhật bằng lái!',
            text: `${error}`,
            confirmButtonColor: '#d90429'
        });
    }
}

function renderLicenseTable(dataList) {
    let licenseTableBody = document.getElementById('licenseTableBody');
    licenseTableBody.innerHTML = ``;
    let licenseRowTemplate = document.getElementById('licenseRowTemplate');
    if (dataList === null || dataList.length === 0) {
        console.log('No licenses data');
        return;
    }
    dataList.forEach(license => {
        let clone = document.importNode(licenseRowTemplate.content, true);
        let cells = clone.querySelectorAll('tr td');
        cells[0].textContent = license.licenseId;
        cells[1].innerHTML = license.licenseName;
        let updateBtn = cells[2].querySelector('.updateBtn');
        let deleteBtn = cells[2].querySelector('.deleteBtn');

        updateBtn.setAttribute('lid', license.licenseId);
        // updateBtn.setAttribute('data-drawer-target', 'drawer-update-product-default');
        // updateBtn.setAttribute('data-drawer-show','drawer-update-product-default');
        // updateBtn.setAttribute('aria-controls','drawer-update-product-default');
        // updateBtn.setAttribute('data-drawer-placement', 'right');
        updateBtn.addEventListener('click', () => {
            let licenseId = updateBtn.getAttribute('lid');
            // let license = licenseList.find(l => l.licenseId == licenseId);
            loadLicenseDataToInfoModal(license);
            toggleLicenseInfoModal();
        });
        deleteBtn.setAttribute('lid', license.licenseId);
        // deleteBtn.setAttribute('data-drawer-target', 'drawer-delete-product-default');
        // deleteBtn.setAttribute('data-drawer-show','drawer-delete-product-default');
        // deleteBtn.setAttribute('aria-controls','drawer-delete-product-default');
        // deleteBtn.setAttribute('data-drawer-placement', 'right');
        licenseTableBody.appendChild(clone);
    });
}

function loadLicenseDataToInfoModal(license) {
    if (license === null || license === undefined) {
        console.log('License is null');
        return;
    }

    document.querySelector('.updateLicenseId').value = license.licenseId;
    tinymce.get('updateLicenseName').setContent(license.licenseName);
}

let licenseTableSearchBar = document.getElementById('licenseTableSearchBar');
licenseTableSearchBar.addEventListener('input', () => {
    let keyword = licenseTableSearchBar.value;
    let filteredList = licenseList
        .filter(license => license.licenseName.toLowerCase().includes(keyword.toLowerCase())
            || license.licenseId.toLowerCase().includes(keyword.toLowerCase()));
    renderLicenseTable(filteredList);
});


function toggleLicenseInfoModal() {

    licenseInfoModal.toggle();
}
document.addEventListener('DOMContentLoaded', async () => {
    await fetchLicensesData();
});