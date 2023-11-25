let vehicleBaseUrl = `https://localhost:7235`;
let vehiclePage = 1, totalVehiclePages = 1;
let detailsModal = new Modal(document.getElementById('vehicleDetailsModal'));
let vehicleForm = document.getElementById('vehicleForm');
let vehicleFilterData = {
    keyword: ``,
    types: [],
    brands: [],
    startPrice: -1,
    endPrice: -1
};

function toggleDetailsModal() {
    detailsModal.toggle();
}
function alertError(title = ``, message = ``) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: message,
        confirmButtonColor: '#d90429'
    });
}

function alertSuccess(title = ``, message = ``) {
    Swal.fire({
        icon: 'success',
        title: title,
        text: message,
        confirmButtonColor: '#d90429'
    });
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

async function fetchVehiclesData() {
    try {
        const url = `${vehicleBaseUrl}/api/vehicle/${vehiclePage}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vehicleFilterData)
        });
        if (!response.ok) {
            console.error(`Error! ${response.status} - ${response.statusText}`);
            return;
        }
        const data = await response.json();
        console.log(data);
        totalVehiclePages = data.totalPages;
        renderVehicleTable(data.items);
        renderVehiclePagingBar();
    } catch (error) {
        console.error(error);
    }
}

async function deleteVehicle(vehicleId) {
    try {
        const url = `${vehicleBaseUrl}/api/vehicles/delete/${vehicleId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 204) {
            alertError('Lỗi khi xóa xe', `${response.status} - ${response.statusText}`);
            return;
        }
        alertSuccess('Xóa xe thành công!');
    } catch (error) {
        alertError(error);
    }
}

async function fetchVehicleDetailsData(vehicleId) {
    try {
        const url = `${vehicleBaseUrl}/api/vehicles/${vehicleId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        loadVehicleDetailsToModal(data);
    } catch (error) {
        alertError(error);
    }
}

async function addVehicle(data) {
    try {
        const url = `${vehicleBaseUrl}/api/vehicles/add`;
        const response = await fetch(url, {
            method: 'POST',
            body: data
        });
        if (response.status !== 204) {
            alertError('Lỗi thêm xe', `${response.status} - ${response.statusText}`);
        }
        alertSuccess('Thêm xe thành công!');
    } catch (error) {
        alertError(error);
    }
}

async function updateVehicle(vehicleId, data) {
    try {
        const url = `${vehicleBaseUrl}/api/vehicles/update/${vehicleId}`;
        const response = await fetch(url, {
            method: 'PUT',
            body: data
        });
        if (response.status !== 204) {
            alertError('Lỗi cập nhật xe', `${response.status} - ${response.statusText}`);
        }
        alertSuccess('Cập nhật thông tin xe thành công!');
    } catch (error) {
        alertError(error);
    }
}

function renderVehiclePagingBar() {
    let pageBarContent = document.querySelector('.vehiclePagingBar');
    pageBarContent.innerHTML = ``;
    let pageItemTemplate = document.getElementById('vehiclePageItemTemplate');
    for (var cnt = 1; cnt <= totalVehiclePages; ++cnt) {
        let clone = document.importNode(pageItemTemplate.content, true);
        let pageItem = clone.querySelector('li button');
        pageItem.setAttribute('page', cnt.toString());
        if (parseInt(vehiclePage) === parseInt(cnt)) {
            pageItem.classList.add('active-page');
        }
        pageItem.textContent = cnt.toString();
        pageItem.addEventListener('click', async () => {
            let newPage = parseInt(pageItem.getAttribute('page'));
            vehiclePage = newPage;
            await fetchVehiclesData();
        });
        pageBarContent.appendChild(clone);
    }
}

function loadVehicleDetailsToModal(vehicle) {
    if (vehicle === null) {
        return;
    }
    document.querySelector('.updateVehicleId').textContent = vehicle.vehicleId;
    let vehicleImage = document.querySelector('.vehicleImage');
    let nameInput = document.querySelector('.vehicleName');
    let yearInput = document.querySelector('.vehicleYear');
    let brandInput = document.querySelector('.vehicleBrand');
    let priceInput = document.querySelector('.vehiclePrice');
    let typeInput = document.querySelector('.vehicleType');
    let contactNumberInput = document.querySelector('.vehicleContactNumber');
    let addressInput = document.querySelector('.vehicleAddress');
    let vehicleDescriptionElement = tinymce.get('vehicleDescription');
    console.log(`Description: ${vehicle.description}`);
    if (vehicle.image !== `` && vehicle.image !== null && vehicle.image !== 'none') {
        vehicleImage.src = `/img/vehicle/${vehicle.image}`;
    }

    nameInput.value = vehicle.name;
    yearInput.value = vehicle.years;
    brandInput.value = vehicle.brand;
    priceInput.value = vehicle.rentPrice.toString();
    typeInput.value = vehicle.type;
    contactNumberInput.value = vehicle.contactNumber;
    addressInput.value = vehicle.address;
    if (vehicle.description !== null) {
        vehicleDescriptionElement.setContent(vehicle.description);
    } else {
        vehicleDescriptionElement.setContent('');
    }
}

function clearModalData() {
    let vehicleImage = document.querySelector('.vehicleImage');
    let nameInput = document.querySelector('.vehicleName');
    let yearInput = document.querySelector('.vehicleYear');
    let brandInput = document.querySelector('.vehicleBrand');
    let newBrandInput = document.querySelector('.vehicleNewBrand');
    let priceInput = document.querySelector('.vehiclePrice');
    let typeInput = document.querySelector('.vehicleType');
    let newTypeInput = document.querySelector('.vehicleNewType');
    let contactNumberInput = document.querySelector('.vehicleContactNumber');
    let addressInput = document.querySelector('.vehicleAddress');
    let vehicleDescriptionElement = tinymce.get('vehicleDescription');

    vehicleImage.src = 'https://flowbite.com/docs/images/examples/image-1@2x.jpg';
    nameInput.value = ``;
    yearInput.value = ``;
    brandInput.value = ``;
    newBrandInput.value = ``;
    priceInput.value = ``;
    typeInput.value = ``;
    newTypeInput.value = ``;
    contactNumberInput.value = ``;
    addressInput.value = ``;
    vehicleDescriptionElement.setContent('');
}

async function fetchFormData() {
    try {
        const url = `${vehicleBaseUrl}/api/vehicles/filterdata`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error(`Error!${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        loadTypeSelectElementData(data.typeList);
        loadBrandSelectElementData(data.brandList);
    } catch (error) {
        console.error(error);
    }
}

function loadTypeSelectElementData(typeList) {
    let typeSelectElements = document.querySelectorAll('.vehicleTypeSelect');
    typeSelectElements.forEach(typeSelectElement => {
        if (typeList === null || typeList.length === 0) {
            return;
        }
        typeSelectElement.innerHTML = ``;
        let otherOption = document.createElement('option');
        otherOption.text = 'Loại khác';
        otherOption.value = ``;
        typeSelectElement.add(otherOption);
        typeList.forEach(type => {
            let option = document.createElement('option');
            option.text = type;
            option.value = type;
            typeSelectElement.add(option);
        });
        typeSelectElement.selectedIndex = -1;
    });
}

function loadBrandSelectElementData(brandList) {
    let brandSelectElements = document.querySelectorAll('.vehicleBrandSelect');
    brandSelectElements.forEach(brandSelectElement => {
        if (brandList === null || brandList.length === 0) {
            return;
        }
        brandSelectElement.innerHTML = ``;
        let otherOption = document.createElement('option');
        otherOption.text = 'Hãng khác';
        otherOption.value = ``;
        brandSelectElement.add(otherOption);
        brandList.forEach(brand => {
            let option = document.createElement('option');
            option.text = brand;
            option.value = brand;
            brandSelectElement.add(option);
        });
        brandSelectElement.selectedIndex = -1;
    });
}


function renderVehicleTable(vehicleList) {
    let vehicleTableBody = document.getElementById('vehicleTableBody');
    vehicleTableBody.innerHTML = ``;
    if (vehicleList === null || vehicleList.length === 0) {
        console.log(`No vehicle data`);
        return;
    }
    let vehicleRowTemplate = document.getElementById('vehicleRowTemplate');
    vehicleList.forEach(vehicle => {
        let clone = document.importNode(vehicleRowTemplate.content, true);
        let cells = clone.querySelectorAll('tr td');
        cells[0].textContent = vehicle.name;
        cells[1].textContent = vehicle.brand;
        cells[2].textContent = vehicle.years.toString();
        cells[3].textContent = vehicle.type;
        cells[4].textContent = `${formatMoney(vehicle.rentPrice)} / Giờ`;
        let editBtn = cells[5].querySelector('.editBtn');
        let deleteBtn = cells[5].querySelector('.deleteBtn');

        editBtn.setAttribute('vid', vehicle.vehicleId);
        editBtn.addEventListener('click', async () => {
            vehicleForm.setAttribute('action', 'update');
            let vehicleId = editBtn.getAttribute('vid');
            await fetchVehicleDetailsData(vehicleId);
            toggleDetailsModal();
        });

        deleteBtn.setAttribute('vid', vehicle.vehicleId);
        deleteBtn.addEventListener('click', async () => {
            const result = await Swal.fire({
                icon: 'question',
                title: 'Xác nhận xóa xe này?',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Huỷ',
                showCancelButton: true,
                confirmButtonColor: '#d90429'
            });
            if (!result.isConfirmed) {
                return;
            }

            let vehicleId = deleteBtn.getAttribute('vid');
            await deleteVehicle(vehicleId);

            vehiclePage = 1;
            await fetchFormData();
            await fetchVehiclesData();
        });
        vehicleTableBody.appendChild(clone);
    });
}

let prevVehicleBtn = document.querySelector('.prevVehicleBtn');
prevVehicleBtn.addEventListener('click', async () => {
    --vehiclePage;
    if (vehiclePage <= 0) {
        vehiclePage = totalVehiclePages;  
    }
    await fetchVehiclesData();
});

let nextVehicleBtn = document.querySelector('.nextVehicleBtn');
nextVehicleBtn.addEventListener('click', async () => {
    ++vehiclePage;
    if (vehiclePage > totalVehiclePages) {
        vehiclePage = 1;
    }
    await fetchVehiclesData();
});

let createVehicleBtn = document.getElementById('createVehicleBtn');
createVehicleBtn.addEventListener('click', () => {
    vehicleForm.setAttribute('action', 'add');
    clearModalData();
    toggleDetailsModal();
});


vehicleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const action = vehicleForm.getAttribute('action');
        const message = (action === 'add') ? 'Xác nhận thêm xe này?' : 'Xác nhận cập nhật thông tin xe này?';
        const result = await Swal.fire({
            icon: 'question',
            title: message,
            confirmButtonText: (action === 'add') ? 'Thêm' : 'Cập nhật',
            cancelButtonText: 'Huỷ',
            showCancelButton: true,
            confirmButtonColor: '#d90429'
        });

        if (!result.isConfirmed) {
            return;
        }

        let vehicleImage = document.querySelector('.vehicleImage');
        let nameInput = document.querySelector('.vehicleName');
        let yearInput = document.querySelector('.vehicleYear');
        let brandInput = document.querySelector('.vehicleBrand');
        let newBrandInput = document.querySelector('.vehicleNewBrand');
        let priceInput = document.querySelector('.vehiclePrice');
        let typeInput = document.querySelector('.vehicleType');
        let newTypeInput = document.querySelector('.vehicleNewType');
        let contactNumberInput = document.querySelector('.vehicleContactNumber');
        let addressInput = document.querySelector('.vehicleAddress');
        let vehicleDescriptionElement = tinymce.get('vehicleDescription');

        let formData = new FormData();


        formData.append('Name', nameInput.value);
        let imageFile = vehicleImageFileInput.files[0];
        if (imageFile != null && imageFile != undefined && imageFile !== ``) {
            formData.append('Image', imageFile);
        }

        let brand = brandInput.value;
        let newBrand = newBrandInput.value;

        if (brand === `` && newBrand === ``) {
            alertError('Vui lòng chọn hãng xe');
            return;
        }

        if (brand !== `` && newBrand !== ``) {
            alertError('Hãng xe chưa phù hợp!', 'Chỉ được chọn hãng trong hãng đã có hoặc hãng mới!');
            return;
        }

        let type = typeInput.value;
        let newType = newTypeInput.value;

        if (type === `` && newType === ``) {
            alertError('Vui lòng chọn loại xe');
            return;
        }

        if (type !== `` && newType !== ``) {
            alertError('Loại xe chưa phù hợp!', 'Chỉ được chọn loại trong loại đã có hoặc loại mới!');
            return;
        }


        let finalBrand = (brand !== ``) ? brand : newBrand;
        formData.append('Brand', finalBrand);

        let finalType = (type !== ``) ? type : newType;
        formData.append('Type', finalType);

        let year = yearInput.value;
        if (year === `` || parseInt(year) <= 0) {
            alertError('Năm sản xuất chưa hợp lệ!');
            return;
        }
        formData.append('Years', parseInt(year));
        formData.append('ContactNumber', contactNumberInput.value);
        formData.append('Address', addressInput.value);


        let price = priceInput.value;
        console.log(`Vehicle price: ${price}`);
        if (price === `` || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            alertError('Giá xe chưa hợp lệ!');
            return;
        }

        formData.append('RentPrice', price);
        // console.log('Vehicle description: ' + vehicleDescriptionElement.getContent());
        formData.append('Description', vehicleDescriptionElement.getContent());

        if (action === 'add') {
            await addVehicle(formData);
        } else {
            let updateVehicleId = document.querySelector('.updateVehicleId').textContent;
            await updateVehicle(updateVehicleId, formData);
        }


        vehiclePage = 1;
        toggleDetailsModal();
        clearModalData();
        await fetchFormData();
        await fetchVehiclesData();
    } catch (error) {
        alertError(error);
    }
});


let vehicleImageFileInput = document.querySelector('.vehicleImageFile');
vehicleImageFileInput.addEventListener('change', (event) => {
    if (vehicleImageFileInput.files.length > 1) {
        alertError('Vui lòng chỉ upload tối đa 1 ảnh duy nhất');
        return;
    }
    let vehicleImage = document.querySelector('.vehicleImage');
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
        vehicleImage.src = reader.result;
    };
    // Read the image file as a data URL
    reader.readAsDataURL(file);
});

let closeVehicleModalBtn = document.querySelector('.closeVehicleModalBtn');
closeVehicleModalBtn.addEventListener('click', () => {
    toggleDetailsModal();
});


let vehicleSearchBar = document.querySelector('.vehicleSearchBar');
vehicleSearchBar.addEventListener('input', async () => {
    let newKeyword = vehicleSearchBar.value;
    vehicleFilterData.keyword = newKeyword;
    vehiclePage = 1;
    await fetchFormData();
    await fetchVehiclesData();
});


document.addEventListener('DOMContentLoaded', async () => {
    await fetchFormData();
    await fetchVehiclesData();
});