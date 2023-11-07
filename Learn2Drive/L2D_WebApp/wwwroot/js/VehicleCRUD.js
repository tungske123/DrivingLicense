// import tinymce from 'tinymce';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class VehicleCRUD {
}
class VehicleRequestData {
    constructor() {
        this.types = [];
        this.brands = [];
        this.startPrice = -1;
        this.endPrice = -1;
    }
    reset() {
        this.keyword = '';
        this.types = [];
        this.brands = [];
        this.startPrice = -1;
        this.endPrice = -1;
    }
}
let vehicleTableBody = document.getElementById('vehicleTableBody');
const vehicleSearch = document.getElementById('vehicleSearch');
const tableLoader = document.getElementById('tableLoader');
const createModal = document.getElementById('createProductModal');
var page = 1;
var sendData = new VehicleRequestData();
function loadVehicleTypesData(typeList) {
    if (typeList === null || typeList.length === 0) {
        console.log('No Vehicle types');
        return;
    }
    const addTypeSelect = document.querySelector('.add_type');
    addTypeSelect.options.length = 0;
    const updateTypeSelect = document.querySelector('.updateType');
    updateTypeSelect.options.length = 0;
    typeList.forEach(type => {
        let option = document.createElement('option');
        option.text = type;
        option.value = type;
        addTypeSelect.add(option);
        updateTypeSelect.add(option);
    });
}
function loadVehicleBrandsData(brandList) {
    if (brandList === null || brandList.length === 0) {
        console.log('No Vehicle brands');
        return;
    }
    const addBrandSelect = document.querySelector('.add_brand');
    addBrandSelect.options.length = 0;
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Chọn hãng xe';
    defaultOption.value = ``;
    defaultOption.selected = true;
    addBrandSelect.add(defaultOption);
    const filterBrandList = document.getElementById('filterBrandList');
    filterBrandList.innerHTML = ``;
    const filterBrandTemplate = document.getElementById('filterBrandTemplate');
    brandList.forEach(brand => {
        let option = document.createElement('option');
        option.text = brand;
        option.value = brand;
        addBrandSelect.add(option);
        let clone = document.importNode(filterBrandTemplate.content, true);
        let brandCheck = clone.querySelector('.brand_check');
        brandCheck.setAttribute('id', brand);
        brandCheck.setAttribute('value', brand);
        let brandLabel = clone.querySelector('label');
        brandLabel.textContent = brand;
        filterBrandList.appendChild(clone);
    });
}
function fetchVehiclesFilterData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://localhost:7235/api/vehicles/filterdata`;
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
            const brandList = data.brandList;
            loadVehicleBrandsData(brandList);
            // const typeList: string[] = data.typeList;
            // loadVehicleTypesData(typeList);
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
function fetchVehiclesData() {
    return __awaiter(this, void 0, void 0, function* () {
        const fetchUrl = `https://localhost:7235/api/VehicleCRUD/${page}`;
        try {
            const response = yield fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            });
            if (!response.ok) {
                throw new Error(`Http Error! Status code: ${response.status}`);
            }
            const data = yield response.json();
            console.log(data);
            totalPages = Number(data.totalPages);
            renderVehicleTable(data.items);
            renderPagingBar();
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
function getVehicleFormattedPrice(price) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString();
}
var currentVehicleID = ``;
function renderVehicleTable(vehicleList) {
    let template = document.getElementById('VehicleCRUD-row-template');
    vehicleTableBody.innerHTML = ``;
    if (vehicleList !== null && vehicleList.length > 0) {
        vehicleList.forEach(VehicleCRUD => {
            let clone = document.importNode(template.content, true);
            let cells = clone.querySelectorAll('td');
            cells[0].textContent = VehicleCRUD.name;
            cells[1].textContent = VehicleCRUD.brand;
            cells[2].textContent = VehicleCRUD.years.toString();
            cells[3].textContent = VehicleCRUD.type;
            cells[4].textContent = '...';
            cells[5].textContent = getVehicleFormattedPrice(VehicleCRUD.rentPrice);
            const dropdownButton = cells[6].querySelector('.dropdown_button');
            var dropDownContent = cells[6].querySelector('.dropdown_content');
            dropdownButton.addEventListener('click', function toggleDropDown() {
                const hasDropdown = (!dropDownContent.classList.contains('hidden') && dropDownContent.classList.contains('block'));
                if (!hasDropdown) {
                    dropDownContent.classList.remove('hidden');
                    dropDownContent.classList.add('block');
                }
                else {
                    dropDownContent.classList.add('hidden');
                    dropDownContent.classList.remove('block');
                }
            });
            const editButton = dropDownContent.querySelector('.edit_btn');
            editButton.setAttribute('vid', VehicleCRUD.vehicleId);
            const detailsButton = dropDownContent.querySelector('.details_btn');
            detailsButton.setAttribute('vid', VehicleCRUD.vehicleId);
            const deleteButton = dropDownContent.querySelector('.cancel_btn');
            deleteButton.setAttribute('vid', VehicleCRUD.vehicleId);
            editButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                const vid = editButton.getAttribute('vid');
                currentVehicleID = vid;
                yield loadVehicleToEditModal(vid);
                toggleUpdateModal();
            }));
            detailsButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                const vid = detailsButton.getAttribute('vid');
                currentVehicleID = vid;
                yield loadVehicleToDetailsModal(vid);
                toggleDetailsModal();
            }));
            deleteButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                const vid = deleteButton.getAttribute('vid');
                currentVehicleID = vid;
                yield DeleteVehicle(vid);
                toggleDeleteModal();
            }));
            vehicleTableBody.appendChild(clone);
        });
    }
}
function toggleUpdateModal() {
    const updateModal = document.getElementById('updateProductModal');
    const openedUpdateModal = (!updateModal.classList.contains('hidden') && updateModal.classList.contains('flex') && updateModal.classList.contains('blur-background'));
    if (!openedUpdateModal) {
        updateModal.classList.remove('hidden');
        updateModal.classList.add('flex');
        updateModal.classList.add('blur-background');
    }
    else {
        updateModal.classList.add('hidden');
        updateModal.classList.remove('flex');
        updateModal.classList.remove('blur-background');
    }
}
function toggleDetailsModal() {
    const detailsModal = document.getElementById('readProductModal');
    const openedDetaisModal = (!detailsModal.classList.contains('hidden') && detailsModal.classList.contains('flex') && detailsModal.classList.contains('blur-background'));
    if (!openedDetaisModal) {
        detailsModal.classList.remove('hidden');
        detailsModal.classList.add('flex');
        detailsModal.classList.add('blur-background');
    }
    else {
        detailsModal.classList.add('hidden');
        detailsModal.classList.remove('flex');
        detailsModal.classList.remove('blur-background');
    }
}
function toggleDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    const openedDeleteModal = (!deleteModal.classList.contains('hidden') && deleteModal.classList.contains('flex') && deleteModal.classList.contains('blur-background'));
    if (!openedDeleteModal) {
        deleteModal.classList.remove('hidden');
        deleteModal.classList.add('flex');
        deleteModal.classList.add('blur-background');
    }
    else {
        deleteModal.classList.add('hidden');
        deleteModal.classList.remove('flex');
        deleteModal.classList.remove('blur-background');
    }
}
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function reverseFormatPrice(price) {
    // Remove all dots from the string and convert it to a number
    return parseInt(price.replace(/\./g, ""));
}
window.addEventListener('DOMContentLoaded', () => __awaiter(this, void 0, void 0, function* () {
    yield fetchVehiclesFilterData();
    yield fetchVehiclesData();
}));
const priceInputs = document.querySelectorAll('.price_input');
const startPriceInput = document.getElementById('start_price');
const endPriceInput = document.getElementById('end_price');
const typeCheckList = document.querySelectorAll('.type_check');
const brandCheckList = document.querySelectorAll('.brand_check');
const resetButton = document.getElementById('resetButton');
function resetFilter() {
    return __awaiter(this, void 0, void 0, function* () {
        startPriceInput.value = '0';
        endPriceInput.value = '0';
        typeCheckList.forEach(typeCheck => {
            typeCheck.checked = false;
        });
        brandCheckList.forEach(brandCheck => {
            brandCheck.checked = false;
        });
        page = 1;
        sendData.reset();
        yield fetchVehiclesData();
    });
}
function fetchSingleVehicleData(vehicleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://localhost:7235/api/vehicles/${vehicleId}`;
        try {
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Http Error! Status code: ${response.status}`);
            }
            const data = yield response.json();
            const VehicleCRUD = data;
            return VehicleCRUD;
        }
        catch (error) {
            console.error(`Error! ${error}`);
        }
    });
}
function addVehicle(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://localhost:7235/api/vehicles/add`;
        try {
            const response = yield fetch(url, {
                method: 'POST',
                body: data
            });
            if (response.status !== 204) {
                throw new Error(`Http Error! Status code: ${response.status}`);
            }
            console.log('Add VehicleCRUD success');
            yield fetchVehiclesData();
            yield fetchVehiclesFilterData();
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
function loadVehicleToDetailsModal(vehicleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const VehicleCRUD = yield fetchSingleVehicleData(vehicleId);
        const readVehicleImageElement = document.getElementById('readVehicleImage');
        const readVehicleNameElement = document.getElementById('readVehicleName');
        const readDescriptionElement = document.getElementById('readDescription');
        const readBrandElement = document.getElementById('readBrand');
        const readYearsElement = document.getElementById('readYears');
        const readPriceElement = document.getElementById('readPrice');
        readVehicleImageElement.src = `/img/VehicleCRUD/${VehicleCRUD.image}`;
        readVehicleNameElement.textContent = VehicleCRUD.name;
        readDescriptionElement.innerHTML = VehicleCRUD.description;
        readBrandElement.textContent = VehicleCRUD.brand;
        readYearsElement.textContent = VehicleCRUD.years.toString();
        readPriceElement.textContent = getVehicleFormattedPrice(VehicleCRUD.rentPrice) + " VNĐ/ Giờ";
    });
}
function loadVehicleToEditModal(vehicleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const VehicleCRUD = yield fetchSingleVehicleData(vehicleId);
        const updateVehicleIDElement = document.getElementById('updateVehicleID');
        const updateImageElement = document.getElementById('updateVehicleImage');
        const updateNameElement = document.querySelector('.updateName');
        const updateYearsElement = document.querySelector('.updateYears');
        const updateBrandElement = document.querySelector('.updateBrand');
        const updatePriceElement = document.querySelector('.updatePrice');
        const updateTypeElement = document.querySelector('.updateType');
        const updateContactNumberElement = document.querySelector('.updateContactNumber');
        const updateAddressElement = document.querySelector('.updateAddress');
        const updateDescriptionElement = document.querySelector('.updateDescription');
        updateVehicleIDElement.textContent = vehicleId;
        updateImageElement.src = `/img/VehicleCRUD/${VehicleCRUD.image}`;
        updateNameElement.value = VehicleCRUD.name;
        updateYearsElement.value = VehicleCRUD.years.toString();
        updateBrandElement.value = VehicleCRUD.brand;
        updatePriceElement.value = VehicleCRUD.rentPrice.toString();
        updateTypeElement.value = VehicleCRUD.type;
        updateContactNumberElement.value = VehicleCRUD.contactNumber;
        updateAddressElement.value = VehicleCRUD.address;
        updateDescriptionElement.value = VehicleCRUD.description;
    });
}
function UpdateVehicle(vehicleId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (vehicleId === null || vehicleId === ``) {
            console.log('Update VehicleCRUD failed');
            return;
        }
        const url = `https://localhost:7235/api/vehicles/update/${vehicleId}`;
        const updateForm = document.getElementById('updateForm');
        const formData = new FormData();
        const fileImageInput = document.querySelector('.updateImageFile');
        const updateNameElement = document.querySelector('.updateName');
        const updateYearsElement = document.querySelector('.updateYears');
        const updateBrandElement = document.querySelector('.updateBrand');
        const updatePriceElement = document.querySelector('.updatePrice');
        const updateTypeElement = document.querySelector('.updateType');
        const updateContactNumberElement = document.querySelector('.updateContactNumber');
        const updateAddressElement = document.querySelector('.updateAddress');
        const updateDescriptionElement = document.querySelector('.updateDescription');
        formData.append('Name', updateNameElement.name);
        if (fileImageInput !== null) {
            let imageFile = fileImageInput.files[0];
            if (imageFile !== null) {
                formData.append('Image', imageFile);
            }
        }
        formData.append('Brand', updateBrandElement.value);
        formData.append('Type', updateTypeElement.value);
        formData.append('Years', updateYearsElement.value);
        formData.append('ContactNumber', updateContactNumberElement.value);
        formData.append('Address', updateAddressElement.value);
        formData.append('RentPrice', updatePriceElement.value);
        try {
            const response = yield fetch(url, {
                method: 'PATCH',
                body: formData
            });
            if (response.status !== 204) {
                throw new Error(`Http error! Status code: ${response.status}`);
            }
            console.log('Update VehicleCRUD success!');
            alert('Sửa thành công');
            yield fetchVehiclesData();
            yield fetchVehiclesFilterData();
        }
        catch (error) {
            console.error(`Http error!${error}`);
        }
    });
}
function DeleteVehicle(vehicleId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (vehicleId === null || vehicleId === ``) {
            console.log('Delete Vehicle failed');
            return;
        }
        const url = `https://localhost:7235/api/vehicles/delete/${vehicleId}`;
        try {
            const response = yield fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status !== 204) {
                throw new Error(`Http error! Status code: ${response.status}`);
            }
            console.log('Delete Vehicle success!');
            alert('Xóa thành công');
            yield fetchVehiclesData();
            yield fetchVehiclesFilterData();
        }
        catch (error) {
            console.error(`Http error!${error}`);
        }
    });
}
const updateForm = document.getElementById('updateForm');
updateForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    yield UpdateVehicle(currentVehicleID);
    alert('Cập nhật thành công!');
}));
const DeleteModalButtons = document.querySelectorAll('.deleteModalBtn');
DeleteModalButtons.forEach(btn => {
    btn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        const action = btn.getAttribute('btnaction');
        if (action === 'confirm') {
            yield DeleteVehicle(currentVehicleID);
            alert('Xóa thành công');
        }
    }));
});
priceInputs.forEach(priceInput => {
    priceInput.addEventListener('input', () => {
        let priceValue = Number(priceInput.value.replace(/\D/g, ''));
        priceInput.value = priceValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const startPrice = reverseFormatPrice(startPriceInput.value);
        const endPrice = reverseFormatPrice(endPriceInput.value);
        if (startPrice >= endPrice) {
            alert('Vui lòng nhập giá phù hợp');
            startPriceInput.value = '0';
            endPriceInput.value = '0';
        }
    });
});
startPriceInput.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
    const startPrice = reverseFormatPrice(startPriceInput.value);
    sendData.startPrice = startPrice;
    yield fetchVehiclesData();
}));
endPriceInput.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
    const endPrice = reverseFormatPrice(endPriceInput.value);
    sendData.endPrice = endPrice;
    yield fetchVehiclesData();
}));
typeCheckList.forEach(typeCheck => {
    typeCheck.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
        if (typeCheck.checked) {
            sendData.types.push(String(typeCheck.value));
        }
        else {
            const index = sendData.types.indexOf(String(typeCheck.value));
            if (index !== -1) {
                sendData.types.splice(index, 1);
            }
        }
        page = 1;
        yield fetchVehiclesData();
    }));
});
brandCheckList.forEach(brandCheck => {
    brandCheck.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
        if (brandCheck.checked) {
            sendData.brands.push(String(brandCheck.value));
        }
        else {
            const index = sendData.brands.indexOf(String(brandCheck.value));
            if (index !== -1) {
                sendData.brands.splice(index, 1);
            }
        }
        page = 1;
        yield fetchVehiclesData();
    }));
});
vehicleSearch.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
    const newKeyword = String(vehicleSearch.value);
    sendData.keyword = newKeyword;
    page = 1;
    yield fetchVehiclesData();
}));
resetButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    yield resetFilter();
}));
const addPreviewImage = document.getElementById('addPreviewImage');
const addImageInput = document.querySelector('.add_image');
const addForm = document.getElementById('addForm');
addImageInput.addEventListener('change', (event) => {
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
        addPreviewImage.src = reader.result;
    };
    // Read the image file as a data URL
    reader.readAsDataURL(file);
});
addForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    const addNameInput = document.querySelector('.add_name');
    const addYearsInput = document.querySelector('.add_years');
    const addBrandInput = document.querySelector('.add_brand');
    const addNewBrandInput = document.querySelector('.add_newbrand');
    const addPriceInput = document.querySelector('.add_price');
    const addTypeInput = document.querySelector('.add_type');
    const addAddressInput = document.querySelector('.add_address');
    const addContactNumber = document.querySelector('.add_phone');
    const addDescriptionInput = document.querySelector('.add_description');
    let formData = new FormData();
    let imageFile = addImageInput.files[0];
    formData.append('Name', addNameInput.value);
    if (addImageInput !== null) {
        formData.append('Image', imageFile);
    }
    formData.append('Years', addYearsInput.value);
    if (addNewBrandInput.value !== null && addNewBrandInput.value !== "") {
        if (addBrandInput.value !== null && addBrandInput.value !== "") {
            alert('Vui lòng chỉ chọn hãng đã có hoặc hãng mới');
            return;
        }
        formData.append('Brand', addNewBrandInput.value);
    }
    else {
        formData.append('Brand', addBrandInput.value);
    }
    formData.append('RentPrice', addPriceInput.value);
    formData.append('Type', addTypeInput.value);
    formData.append('Address', addAddressInput.value);
    formData.append('ContactNumber', addContactNumber.value);
    // let descriptionContent = tinymce.get('add_description')?.getContent();
    // if (descriptionContent) {
    //     formData.append('Description', descriptionContent);
    // }
    formData.append('Description', addDescriptionInput.value);
    yield addVehicle(formData);
    alert('Thêm xe thành công');
}));
const pagingContent = document.getElementById('pagingContent');
const prevButton = document.getElementById('prevBtn');
const nextButton = document.getElementById('nextBtn');
var totalPages = 1;
function renderPagingBar() {
    pagingContent.innerHTML = '';
    const pageClassName = `flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`;
    const activeClassName = `flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-red-700 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white`;
    for (var pageCnt = 1; pageCnt <= totalPages; ++pageCnt) {
        const li = document.createElement('li');
        const pageButton = document.createElement('button');
        pageButton.setAttribute('cnt', pageCnt.toString());
        pageButton.textContent = pageCnt.toString();
        if (pageCnt === page) {
            pageButton.className = activeClassName;
        }
        else {
            pageButton.className = pageClassName;
        }
        pageButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const newPage = Number(pageButton.getAttribute('cnt'));
            page = newPage;
            yield fetchVehiclesData();
        }));
        li.appendChild(pageButton);
        pagingContent.appendChild(li);
    }
}
prevButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    --page;
    if (page <= 0) {
        page = totalPages;
    }
    yield fetchVehiclesData();
}));
nextButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    ++page;
    if (page > totalPages) {
        page = 1;
    }
    yield fetchVehiclesData();
}));
//# sourceMappingURL=VehicleCRUD.js.map