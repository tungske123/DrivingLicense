// import tinymce from 'tinymce';

class VehicleCRUDData {
    vehicleId: string;
    name: string;
    image: string;
    brand: string;
    type: string;
    years: number;
    contactNumber: string;
    address: string;
    rentPrice: number;
    status: boolean;
    description: string;
}
class VehicleRequestData {
    keyword: string;
    types: string[] = [];
    brands: string[] = [];
    startPrice: number = -1;
    endPrice: number = -1;

    reset() {
        this.keyword = '';
        this.types = [];
        this.brands = [];
        this.startPrice = -1;
        this.endPrice = -1;
    }
}
let vehicleTableBody = document.getElementById('vehicleTableBody') as HTMLTableSectionElement;
const vehicleSearch = document.getElementById('vehicleSearch') as HTMLInputElement;
const tableLoader = document.getElementById('tableLoader') as HTMLDivElement;
const createModal = document.getElementById('createProductModal') as HTMLDivElement;
var page = 1;
var sendData: VehicleRequestData = new VehicleRequestData();


function loadVehicleTypesData(typeList: string[]) {
    if (typeList === null || typeList.length === 0) {
        console.log('No vehicle types');
        return;
    }
    const addTypeSelect = document.querySelector('.add_type') as HTMLSelectElement;
    addTypeSelect.options.length = 0;
    const updateTypeSelect = document.querySelector('.updateType') as HTMLSelectElement;
    updateTypeSelect.options.length = 0;
    typeList.forEach(type => {
        let option = document.createElement('option');
        option.text = type;
        option.value = type;
        addTypeSelect.add(option);
        updateTypeSelect.add(option);
    });
}

function loadVehicleBrandsData(brandList: string[]) {
    if (brandList === null || brandList.length === 0) {
        console.log('No vehicle brands');
        return;
    }
    const addBrandSelect = document.querySelector('.add_brand') as HTMLSelectElement;
    addBrandSelect.options.length = 0;
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Chọn hãng xe';
    defaultOption.value = ``;
    defaultOption.selected = true;
    addBrandSelect.add(defaultOption);
    const filterBrandList = document.getElementById('filterBrandList') as HTMLUListElement;
    filterBrandList.innerHTML = ``;
    const filterBrandTemplate = document.getElementById('filterBrandTemplate') as HTMLTemplateElement;
    brandList.forEach(brand => {
        let option = document.createElement('option');
        option.text = brand;
        option.value = brand;
        addBrandSelect.add(option);
        let clone = document.importNode(filterBrandTemplate.content, true);
        let brandCheck = clone.querySelector('.brand_check') as HTMLInputElement;
        brandCheck.setAttribute('id', brand);
        brandCheck.setAttribute('value', brand);
        let brandLabel = clone.querySelector('label') as HTMLLabelElement;
        brandLabel.textContent = brand;
        filterBrandList.appendChild(clone);
    });
}
async function fetchVehiclesFilterData() {
    try {
        const url = `https://localhost:7235/api/vehicles/filterdata`;
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
        const brandList: string[] = data.brandList;
        loadVehicleBrandsData(brandList);
        // const typeList: string[] = data.typeList;
        // loadVehicleTypesData(typeList);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}
async function fetchVehiclesData() {
    const fetchUrl = `https://localhost:7235/api/vehicle/${page}`;
    try {
        const response = await fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        });
        if (!response.ok) {
            throw new Error(`Http Error! Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        totalPages = Number(data.totalPages);
        renderVehicleTable(data.items);
        renderPagingBar();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

function getFormattedPrice(price: number) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString();
}

var currentVehicleID: string = ``;

function renderVehicleTable(vehicleList: Vehicle[]) {
    let template = document.getElementById('vehicle-row-template') as HTMLTemplateElement;
    vehicleTableBody.innerHTML = ``;
    if (vehicleList !== null && vehicleList.length > 0) {
        vehicleList.forEach(vehicle => {
            let clone = document.importNode(template.content, true);

            let cells = clone.querySelectorAll('td') as NodeListOf<HTMLTableCellElement>;
            cells[0].textContent = vehicle.name;
            cells[1].textContent = vehicle.brand;
            cells[2].textContent = vehicle.years.toString();
            cells[3].textContent = vehicle.type;
            cells[4].textContent = '...';
            cells[5].textContent = getFormattedPrice(vehicle.rentPrice);
            const dropdownButton = cells[6].querySelector('.dropdown_button') as HTMLButtonElement;
            var dropDownContent = cells[6].querySelector('.dropdown_content') as HTMLDivElement;
            dropdownButton.addEventListener('click', function toggleDropDown() {
                const hasDropdown: boolean = (!dropDownContent.classList.contains('hidden') && dropDownContent.classList.contains('block'));
                if (!hasDropdown) {
                    dropDownContent.classList.remove('hidden');
                    dropDownContent.classList.add('block');
                } else {
                    dropDownContent.classList.add('hidden');
                    dropDownContent.classList.remove('block');
                }
            });
            const editButton = dropDownContent.querySelector('.edit_btn') as HTMLButtonElement;
            editButton.setAttribute('vid', vehicle.vehicleId);
            const detailsButton = dropDownContent.querySelector('.details_btn') as HTMLButtonElement;
            detailsButton.setAttribute('vid', vehicle.vehicleId);
            const deleteButton = dropDownContent.querySelector('.cancel_btn') as HTMLButtonElement;
            deleteButton.setAttribute('vid', vehicle.vehicleId);
            editButton.addEventListener('click', async () => {
                const vid = editButton.getAttribute('vid');
                currentVehicleID = vid;
                await loadVehicleToEditModal(vid);
                toggleUpdateModal();
            });
            detailsButton.addEventListener('click', async () => {
                const vid = detailsButton.getAttribute('vid');
                currentVehicleID = vid;
                await loadVehicleToDetailsModal(vid);
                toggleDetailsModal();
            });
            deleteButton.addEventListener('click', async () => {
                const vid = deleteButton.getAttribute('vid');
                currentVehicleID = vid;
                await DeleteVehicle(vid);
                toggleDeleteModal();
            });
            vehicleTableBody.appendChild(clone);
        });
    }
}


function toggleUpdateModal() {
    const updateModal = document.getElementById('updateProductModal') as HTMLDivElement;
    const openedUpdateModal = (!updateModal.classList.contains('hidden') && updateModal.classList.contains('flex') && updateModal.classList.contains('blur-background'));
    if (!openedUpdateModal) {
        updateModal.classList.remove('hidden');
        updateModal.classList.add('flex');
        updateModal.classList.add('blur-background');
    } else {
        updateModal.classList.add('hidden');
        updateModal.classList.remove('flex');
        updateModal.classList.remove('blur-background');
    }
}

function toggleDetailsModal() {
    const detailsModal = document.getElementById('readProductModal') as HTMLDivElement;
    const openedDetaisModal = (!detailsModal.classList.contains('hidden') && detailsModal.classList.contains('flex') && detailsModal.classList.contains('blur-background'));
    if (!openedDetaisModal) {
        detailsModal.classList.remove('hidden');
        detailsModal.classList.add('flex');
        detailsModal.classList.add('blur-background');
    } else {
        detailsModal.classList.add('hidden');
        detailsModal.classList.remove('flex');
        detailsModal.classList.remove('blur-background');
    }
}

function toggleDeleteModal() {
    const deleteModal = document.getElementById('deleteModal') as HTMLDivElement;
    const openedDeleteModal = (!deleteModal.classList.contains('hidden') && deleteModal.classList.contains('flex') && deleteModal.classList.contains('blur-background'));
    if (!openedDeleteModal) {
        deleteModal.classList.remove('hidden');
        deleteModal.classList.add('flex');
        deleteModal.classList.add('blur-background');
    } else {
        deleteModal.classList.add('hidden');
        deleteModal.classList.remove('flex');
        deleteModal.classList.remove('blur-background');
    }
}
function formatPrice(price: number) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function reverseFormatPrice(price: string): number {
    // Remove all dots from the string and convert it to a number
    return parseInt(price.replace(/\./g, ""));
}

window.addEventListener('DOMContentLoaded', async () => {
    await fetchVehiclesFilterData();
    await fetchVehiclesData();
});

const priceInputs = document.querySelectorAll('.price_input') as NodeListOf<HTMLInputElement>;
const startPriceInput = document.getElementById('start_price') as HTMLInputElement;
const endPriceInput = document.getElementById('end_price') as HTMLInputElement;
const typeCheckList = document.querySelectorAll('.type_check') as NodeListOf<HTMLInputElement>;
const brandCheckList = document.querySelectorAll('.brand_check') as NodeListOf<HTMLInputElement>;
const resetButton = document.getElementById('resetButton') as HTMLButtonElement;

async function resetFilter() {
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
    await fetchVehiclesData();
}



async function fetchSingleVehicleData(vehicleId: string): Promise<VehicleCRUDData> {
    const url = `https://localhost:7235/api/vehicles/${vehicleId}`;
    try {

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Http Error! Status code: ${response.status}`);
        }
        const data = await response.json();
        const vehicle: VehicleCRUDData = data;
        return vehicle;
    } catch (error) {
        console.error(`Error! ${error}`);
    }
}

async function addVehicle(data: FormData) {
    const url = `https://localhost:7235/api/vehicles/add`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data
        });
        if (response.status !== 204) {
            throw new Error(`Http Error! Status code: ${response.status}`);
        }
        console.log('Add vehicle success');
        await fetchVehiclesData();
        await fetchVehiclesFilterData();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function loadVehicleToDetailsModal(vehicleId: string) {
    const vehicle: VehicleCRUDData = await fetchSingleVehicleData(vehicleId);
    const readVehicleImageElement = document.getElementById('readVehicleImage') as HTMLImageElement;
    const readVehicleNameElement = document.getElementById('readVehicleName') as HTMLElement;
    const readDescriptionElement = document.getElementById('readDescription') as HTMLElement;
    const readBrandElement = document.getElementById('readBrand') as HTMLElement;
    const readYearsElement = document.getElementById('readYears') as HTMLElement;
    const readPriceElement = document.getElementById('readPrice') as HTMLElement;

    readVehicleImageElement.src = `/img/vehicle/${vehicle.image}`;
    readVehicleNameElement.textContent = vehicle.name;
    readDescriptionElement.innerHTML = vehicle.description;
    readBrandElement.textContent = vehicle.brand;
    readYearsElement.textContent = vehicle.years.toString();
    readPriceElement.textContent = getFormattedPrice(vehicle.rentPrice) + " VNĐ/ Giờ";
}

async function loadVehicleToEditModal(vehicleId: string) {
    const vehicle: VehicleCRUDData = await fetchSingleVehicleData(vehicleId);
    const updateVehicleIDElement = document.getElementById('updateVehicleID') as HTMLDivElement;
    const updateImageElement = document.getElementById('updateVehicleImage') as HTMLImageElement;
    const updateNameElement = document.querySelector('.updateName') as HTMLInputElement;
    const updateYearsElement = document.querySelector('.updateYears') as HTMLInputElement;
    const updateBrandElement = document.querySelector('.updateBrand') as HTMLInputElement;
    const updatePriceElement = document.querySelector('.updatePrice') as HTMLInputElement;
    const updateTypeElement = document.querySelector('.updateType') as HTMLInputElement;
    const updateContactNumberElement = document.querySelector('.updateContactNumber') as HTMLInputElement;
    const updateAddressElement = document.querySelector('.updateAddress') as HTMLInputElement;
    const updateDescriptionElement = document.querySelector('.updateDescription') as HTMLTextAreaElement;

    updateVehicleIDElement.textContent = vehicleId;
    updateImageElement.src = `/img/vehicle/${vehicle.image}`;
    updateNameElement.value = vehicle.name;
    updateYearsElement.value = vehicle.years.toString();
    updateBrandElement.value = vehicle.brand;
    updatePriceElement.value = vehicle.rentPrice.toString();
    updateTypeElement.value = vehicle.type;
    updateContactNumberElement.value = vehicle.contactNumber;
    updateAddressElement.value = vehicle.address;
    updateDescriptionElement.value = vehicle.description;

}

async function UpdateVehicle(vehicleId: string) {
    if (vehicleId === null || vehicleId === ``) {
        console.log('Update vehicle failed');
        return;
    }
    const url = `https://localhost:7235/api/vehicles/update/${vehicleId}`;
    const updateForm = document.getElementById('updateForm') as HTMLFormElement;
    const formData = new FormData();
    const fileImageInput = document.querySelector('.updateImageFile') as HTMLInputElement;
    const updateNameElement = document.querySelector('.updateName') as HTMLInputElement;
    const updateYearsElement = document.querySelector('.updateYears') as HTMLInputElement;
    const updateBrandElement = document.querySelector('.updateBrand') as HTMLInputElement;
    const updatePriceElement = document.querySelector('.updatePrice') as HTMLInputElement;
    const updateTypeElement = document.querySelector('.updateType') as HTMLInputElement;
    const updateContactNumberElement = document.querySelector('.updateContactNumber') as HTMLInputElement;
    const updateAddressElement = document.querySelector('.updateAddress') as HTMLInputElement;
    const updateDescriptionElement = document.querySelector('.updateDescription') as HTMLTextAreaElement;

    formData.append('Name', updateNameElement.name);
    if (fileImageInput !== null) {
        let imageFile = fileImageInput.files![0];
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
        const response = await fetch(url, {
            method: 'PATCH',
            body: formData
        });
        if (response.status !== 204) {
            throw new Error(`Http error! Status code: ${response.status}`);
        }
        console.log('Update vehicle success!');
        await fetchVehiclesData();
        await fetchVehiclesFilterData();
    } catch (error) {
        console.error(`Http error!${error}`);
    }
}

async function DeleteVehicle(vehicleId: string) {
    if (vehicleId === null || vehicleId === ``) {
        console.log('Delete vehicle failed');
        return;
    }
    const url = `https://localhost:7235/api/vehicles/delete/${vehicleId}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 204) {
            throw new Error(`Http error! Status code: ${response.status}`);
        }
        console.log('Delete vehicle success!');
        await fetchVehiclesData();
        await fetchVehiclesFilterData();
    } catch (error) {
        console.error(`Http error!${error}`);
    }
}

const updateForm = document.getElementById('updateForm');
updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await UpdateVehicle(currentVehicleID);
    alert('Cập nhật thành công!');
});

const DeleteModalButtons = document.querySelectorAll('.deleteModalBtn') as NodeListOf<HTMLButtonElement>;
DeleteModalButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const action = btn.getAttribute('btnaction');
        if (action === 'confirm') {
            await DeleteVehicle(currentVehicleID);
            alert('Xóa thành công');
        }
    });
});

priceInputs.forEach(priceInput => {
    priceInput.addEventListener('input', () => {
        let priceValue: Number = Number(priceInput.value.replace(/\D/g, ''));
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

startPriceInput.addEventListener('input', async () => {
    const startPrice = reverseFormatPrice(startPriceInput.value);
    sendData.startPrice = startPrice;
    await fetchVehiclesData();
});

endPriceInput.addEventListener('input', async () => {
    const endPrice = reverseFormatPrice(endPriceInput.value);
    sendData.endPrice = endPrice;
    await fetchVehiclesData();
});

typeCheckList.forEach(typeCheck => {
    typeCheck.addEventListener('input', async () => {
        if (typeCheck.checked) {
            sendData.types.push(String(typeCheck.value));
        } else {
            const index = sendData.types.indexOf(String(typeCheck.value));
            if (index !== -1) {
                sendData.types.splice(index, 1);
            }
        }
        page = 1;
        await fetchVehiclesData();
    });
});

brandCheckList.forEach(brandCheck => {
    brandCheck.addEventListener('input', async () => {
        if (brandCheck.checked) {
            sendData.brands.push(String(brandCheck.value));
        } else {
            const index = sendData.brands.indexOf(String(brandCheck.value));
            if (index !== -1) {
                sendData.brands.splice(index, 1);
            }
        }
        page = 1;
        await fetchVehiclesData();
    });
});

vehicleSearch.addEventListener('input', async () => {
    const newKeyword = String(vehicleSearch.value);
    sendData.keyword = newKeyword;
    page = 1;
    await fetchVehiclesData();
});

resetButton.addEventListener('click', async () => {
    await resetFilter();
});

const addPreviewImage = document.getElementById('addPreviewImage') as HTMLImageElement;
const addImageInput = document.querySelector('.add_image') as HTMLInputElement;
const addForm = document.getElementById('addForm') as HTMLFormElement;
addImageInput.addEventListener('change', (event) => {
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
        addPreviewImage.src = <string>reader.result;
    };
    // Read the image file as a data URL
    reader.readAsDataURL(file);
});

addForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const addNameInput = document.querySelector('.add_name') as HTMLInputElement;
    const addYearsInput = document.querySelector('.add_years') as HTMLInputElement;
    const addBrandInput = document.querySelector('.add_brand') as HTMLSelectElement;
    const addNewBrandInput = document.querySelector('.add_newbrand') as HTMLInputElement;
    const addPriceInput = document.querySelector('.add_price') as HTMLInputElement;
    const addTypeInput = document.querySelector('.add_type') as HTMLSelectElement;
    const addAddressInput = document.querySelector('.add_address') as HTMLInputElement;
    const addContactNumber = document.querySelector('.add_phone') as HTMLInputElement;
    const addDescriptionInput = document.querySelector('.add_description') as HTMLTextAreaElement;
    let formData = new FormData();
    let imageFile = addImageInput.files![0];
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
    } else {
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
    await addVehicle(formData);
    alert('Thêm xe thành công');
});

const pagingContent = document.getElementById('pagingContent') as HTMLSpanElement;
const prevButton = document.getElementById('prevBtn') as HTMLButtonElement;
const nextButton = document.getElementById('nextBtn') as HTMLButtonElement;
var totalPages: number = 1;

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
        } else {
            pageButton.className = pageClassName;
        }
        pageButton.addEventListener('click', async () => {
            const newPage = Number(pageButton.getAttribute('cnt'));
            page = newPage;
            await fetchVehiclesData();
        });
        li.appendChild(pageButton);
        pagingContent.appendChild(li);
    }
}

prevButton.addEventListener('click', async () => {
    --page;
    if (page <= 0) {
        page = totalPages;
    }
    await fetchVehiclesData();
});

nextButton.addEventListener('click', async () => {
    ++page;
    if (page > totalPages) {
        page = 1;
    }
    await fetchVehiclesData();
});