let BaseUrl = `https://localhost:7235`;
let editModal = new Modal(document.getElementById('editRentModal'));
let rentPage = 1, totalRentPage = 1, rentPageSize = 7;
let rentData;

let filterData = {
    keyword: ``,
    dayRangeValue: -1
};

function alertError(title = ``, message = ``) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: message,
        confirmButtonColor: '#d90429'
    });
}
async function fetchRentData() {
    try {
        const url = `${BaseUrl}/api/rents`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filterData)
        });
        const data = await response.json();
        rentData = data;
        console.log(data);
        renderRentContent();
    } catch (error) {
        console.error(error);
    }
}

function formatMoney(price) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
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

function paginateRentArray(array, pageSize, pageNumber) {
    // calculate the start index
    let startIndex = (pageNumber - 1) * pageSize;
    // startItemCnt = startIndex + 1;
    // return a slice of the array
    return array.slice(startIndex, startIndex + pageSize);
}

function calculateRentTotalPage(array, pageSize) {
    return Math.ceil(array.length / pageSize);
}

function renderRentPagingBar() {
    let rentPageBarContent = document.querySelector('.rentPageBarContent');
    rentPageBarContent.innerHTML = ``;
    let pageItemTemplate = document.getElementById('rentPageItemTemplate');
    for (var cnt = 1; cnt <= totalRentPage; ++cnt) {
        let clone = document.importNode(pageItemTemplate.content, true);
        let pageItem = clone.querySelector('li');
        pageItem.setAttribute('page', cnt.toString());
        if (parseInt(rentPage) === parseInt(cnt)) {
            pageItem.classList.add('active-page');
        }
        let pageAnchor = clone.querySelector('li a');
        pageAnchor.textContent = cnt.toString();
        pageItem.addEventListener('click', (e) => {
            e.preventDefault();
            let newPage = parseInt(pageItem.getAttribute('page'));
            rentPage = newPage;
            renderRentContent();
        });
        rentPageBarContent.appendChild(clone);
    }
}

function renderRentContent() {
    let data = paginateRentArray(rentData, rentPageSize, rentPage);
    renderRentTable(data);
    totalRentPage = calculateRentTotalPage(rentData, rentPageSize);
    renderRentPagingBar();
}

let prevRentBtn = document.querySelector('.prevRentBtn');
let nextRentBtn = document.querySelector('.nextRentBtn');

prevRentBtn.addEventListener('click', () => {
    --rentPage;
    if (rentPage <= 0) {
        rentPage = totalRentPage;
    }
    renderRentContent();
});


nextRentBtn.addEventListener('click', () => {
    ++rentPage;
    if (rentPage > totalRentPage) {
        rentPage = 1;
    }
    renderRentContent();
});

async function fetchRentDetailsData(rentId) {
    try {
        const url = `${BaseUrl}/api/rent/${rentId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            alertError(`Error loading rent details`, `${response.status} - ${response.statusText}`);
            return;
        }
        const data = await response.json();
        renderRentDetailsData(data);
    } catch (error) {
        console.error(error);
    }
}

function renderRentDetailsData(rent) {
    if (rent === null) {
        return;
    }
    document.querySelector('.updateRentId').textContent = rent.rentId;
    let image = document.querySelector('.rentVehicleImage');
    let nameElement = document.querySelector('.rentVehicleName');
    let descriptionElement = document.querySelector('.rentVehicleDescription');
    let brandElement = document.querySelector('.rentVehicleBrand');
    let typeElement = document.querySelector('.rentVehicleType');
    let vehiclePriceElement = document.querySelector('.rentVehiclePrice');
    let addressElement = document.querySelector('.rentVehicleAddress');
    let contactNumberElement = document.querySelector('.rentContactNumber');
    let startDateInput = document.querySelector('.rentStartDate');
    let endDateInput = document.querySelector('.rentEndDate');
    let totalPriceElement = document.querySelector('.rentTotalPrice');
    // let rentHoursElement = document.querySelector('.rentHours');

    if (rent.vehicle.image !== null && rent.vehicle.image !== `` && rent.vehicle.image !== `none`) {
        image.src = `/img/vehicle/${rent.vehicle.image}`;
    }
    
    nameElement.textContent = rent.vehicle.name;
    descriptionElement.innerHTML = rent.vehicle.description;
    brandElement.textContent = rent.vehicle.brand;
    typeElement.textContent = rent.vehicle.type;
    vehiclePriceElement.textContent = `${formatMoney(rent.vehicle.rentPrice)} / Giờ`;
    document.querySelector('.vehiclePriceValue').textContent = rent.vehicle.rentPrice;
    console.log(`Vehicle price: ${rent.vehicle.rentPrice}`);
    addressElement.textContent = rent.vehicle.address;
    contactNumberElement.textContent = rent.vehicle.contactNumber;
    startDateInput.value = rent.startDate;
    endDateInput.value = rent.endDate;
    updateRentPrice();
    totalPriceElement.textContent = formatMoney(rent.totalRentPrice);
    document.querySelector('.rentTotalPriceValue').textContent = rent.totalRentPrice.toString();
}

async function deleteRent(rentId) {
    try {
        const url = `${BaseUrl}/api/rent/delete/${rentId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 204) {
            alertError(`Lỗi hủy đơn`, `${response.status} - ${response.statusText}`);
            return;
        }
    } catch (error) {
        console.error(error);
    }
}

function checkValidRentDate() {
    let startDateInput = document.querySelector('.rentStartDate');
    let endDateInput = document.querySelector('.rentEndDate');
    let startDate = new Date(startDateInput.value);
    let endDate = new Date(endDateInput.value);
    if (startDate === null || endDate === null) {
        return false;
    }
    let startTime = startDate.getTime();
    let endTime = endDate.getTime();
    let minuteDifferences = endTime - startTime;
    let hourDifferences = minuteDifferences / (1000 * 60 * 60);

    let result = false;
    if (startDate < endDate) {
        result = true;
    } else if (startDate === endDate) {
        if (hourDifferences >= 0 && hourDifferences < 0.5) {
            result = false;
        }
    }
    return result;
}

async function updateRent(data, rentId) {
    try {
        const url = `${BaseUrl}/api/rent/update/${rentId}`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify(data)
        });
        if (response.status !== 204) {
            alertError('Lỗi cập nhật đơn thuê', `${response.status} - ${response.statusText}`);
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Cập nhật đơn thuê thành công!',
            confirmButtonColor: '#d90429'
        });
    } catch (error) {
        console.error(error);
    }
}

let rentHours = 0;
function calculateRentPrice(pricePerHour) {
    let rentHoursElement = document.querySelector('.rentHours');
    if (!checkValidRentDate()) {
        rentHours = 0;
        rentHoursElement.textContent = 'Chưa có dữ liệu';
        return -1;
    }
    let startDateInput = document.querySelector('.rentStartDate');
    let endDateInput = document.querySelector('.rentEndDate');
    let startTime = new Date(startDateInput.value).getTime();
    let endTime = new Date(endDateInput.value).getTime();
    let minuteDifferences = endTime - startTime;
    const hourDifferences = minuteDifferences / (1000 * 60 * 60);
    let totalPrice = -1;
    if (hourDifferences >= 0.5 && hourDifferences < 24) {
        totalPrice = pricePerHour * hourDifferences;
    } else {
        totalPrice = pricePerHour * hourDifferences * 0.8;
    }
    rentHoursElement.textContent = `${hourDifferences.toFixed(1)} Giờ`;
    totalPriceElement.textContent = (hourDifferences >= 24) ? `${formatMoney(totalPrice)}(-20%)` : `${formatMoney(totalPrice)}`;
    return totalPrice;
}

function updateRentPrice() {
    if (!checkValidRentDate()) {
        alertError('Vui lòng chọn ngày và giờ thuê phù hợp!');
        return;
    }
    let pricePerHour = parseFloat(document.querySelector('.vehiclePriceValue').textContent);
    let totalPriceElement = document.querySelector('.rentTotalPrice');
    let totalPrice = calculateRentPrice(pricePerHour);
    if (totalPrice === -1) {
        alertError('Vui lòng chọn ngày và giờ phù hợp!');
        totalPriceElement.textContent = 'Chưa có dữ liệu';
        return;
    }
   
    document.querySelector('.rentTotalPriceValue').textContent = totalPrice.toString();
}


function renderRentTable(rentList) {
    let rentTableBody = document.getElementById('rentTableBody');
    rentTableBody.innerHTML = ``;
    let rentRowTemplate = document.getElementById('rentRowTemplate');
    if (rentList === null || rentList.length === 0) {
        return;
    }
    rentList.forEach(rent => {
        let clone = document.importNode(rentRowTemplate.content, true);
        let cells = clone.querySelectorAll('tr td');
        cells[0].textContent = rent.userFullName;
        cells[1].textContent = rent.userPhoneNumber;
        cells[2].textContent = rent.vehicleName;
        cells[3].textContent = getVietnamDateTime(rent.startDate);
        cells[4].textContent = getVietnamDateTime(rent.endDate);
        cells[5].textContent = formatMoney(rent.price);
        let statusSelect = cells[6].querySelector('.statusSelect');
        statusSelect.setAttribute('rid', rent.rentId);
        statusSelect.value = rent.status;

        statusSelect.addEventListener('input', async () => {
            let newStatus = statusSelect.value;
            let rentId = statusSelect.getAttribute('rid');
            const result = await Swal.fire({
                icon: 'question',
                title: `Xác nhận cập nhật trạng thái đơn thuê này thành ${newStatus}?`,
                confirmButtonColor: '#d90429',
                showCancelButton: true,
                cancelButtonText: 'Hủy',
                confirmButtonText: 'Cập nhật'
            });

            if (!result.isConfirmed) {
                return;
            }
            const data = [
                {
                    op: `replace`,
                    path: `/status`,
                    value: newStatus
                }
            ];
            await updateRent(data, rentId);
        });


        let editBtn = cells[7].querySelector('.editBtn');
        let deleteBtn = cells[7].querySelector('.deleteBtn');

        editBtn.setAttribute('rid', rent.rentId);
        editBtn.addEventListener('click', async () => {
            let rentId = editBtn.getAttribute('rid');
            await fetchRentDetailsData(rentId);
            toggleEditModal();
        });

        deleteBtn.setAttribute('rid', rent.rentId);
        deleteBtn.addEventListener('click', async () => {
            const result = await Swal.fire({
                icon: 'question',
                title: 'Xác nhận xóa đơn thuê này?',
                confirmButtonColor: '#d90429',
                showCancelButton: true,
                cancelButtonText: 'Hủy',
                confirmButtonText: 'Xóa'
            });
            if (result.isConfirmed) {
                let rentId = deleteBtn.getAttribute('rid');
                await deleteRent(rentId);
                Swal.fire({
                    icon: 'success',
                    title: 'Xóa đơn thuê thành công!',
                    confirmButtonColor: '#d90429'
                });
                await fetchRentData();
            }
        });

        rentTableBody.appendChild(clone);
    });
}

let searchBar = document.querySelector('.rentSearchBar');
searchBar.addEventListener('input', async () => {
    rentPage = 1;
    let newKeyword = searchBar.value;
    filterData.keyword = newKeyword;
    await fetchRentData();
});

let rentFilterDate = document.querySelector('.rentFilterDate');
rentFilterDate.addEventListener('input', async() => {
    rentPage = 1;
    let dayValue = parseInt(rentFilterDate.value);
    filterData.dayRangeValue = dayValue;
    await fetchRentData();
});

function toggleEditModal() {
    editModal.toggle();
}

let startDateInput = document.querySelector('.rentStartDate');
let endDateInput = document.querySelector('.rentEndDate');

startDateInput.addEventListener('input', () => {
    updateRentPrice();
});

endDateInput.addEventListener('input', () => {
    updateRentPrice();
});

let updateRentForm = document.getElementById('updateRentForm');
updateRentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
        icon: 'question',
        title: 'Xác nhận cập nhật đơn thuê này?',
        confirmButtonColor: '#d90429',
        showCancelButton: true,
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Cập nhật'
    });
    if (!result.isConfirmed) {
        return;
    }
    let startDate = document.querySelector('.rentStartDate').value;
    let endDate = document.querySelector('.rentEndDate').value;
    let totalPrice = parseFloat(document.querySelector('.rentTotalPriceValue').textContent);
    let rentId = document.querySelector('.updateRentId').textContent;
    console.log(`RentId: ${rentId}\nStart date: ${startDate}\nEnd date: ${endDate}\nTotal price: ${totalPrice}`);
    const sendData = [
        {
            op: `replace`,
            path: `/startDate`,
            value: startDate
        },
        {
            op: `replace`,
            path: `/endDate`,
            value: endDate
        },
        {
            op: `replace`,
            path: `/totalRentPrice`,
            value: totalPrice
        }
    ];
    await updateRent(sendData, rentId);
    await fetchRentData();
});

let closeRentEditModalButton = document.querySelector('.closeRentEditModalButton');
closeRentEditModalButton.addEventListener('click', toggleEditModal);
document.addEventListener('DOMContentLoaded', async () => {
    await fetchRentData();
});