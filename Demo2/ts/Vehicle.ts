class Vehicle {
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
function fetchVehiclesData() {
    const fetchUrl = `https://localhost:7235/api/vehicle/${page}`;
    fetch(fetchUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendData)
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Http Error! Status code: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        console.log(data);
        renderVehicleTable(data.items);
    }).catch(error => {
        console.error(`Http Error!${error}`);
    });
}

function getFormattedPrice(price: number) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString();
}

function renderVehicleTable(vehicleList: Vehicle[]) {
    let template = document.getElementById('vehicle-row-template') as HTMLTemplateElement;
    vehicleTableBody.innerHTML = ``;
    tableLoader.style.display = 'block';
    setTimeout(() => {
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
            dropdownButton.addEventListener('click', () => {
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
            const detailsButton = dropDownContent.querySelector('.details_btn') as HTMLButtonElement;
            const deleteButton = dropDownContent.querySelector('.cancel_btn') as HTMLButtonElement;
            editButton.addEventListener('click', () => {
                toggleUpdateModal();
            });
            detailsButton.addEventListener('click', () => {
                toggleDetailsModal();
            });
            deleteButton.addEventListener('click', () => {
                toggleDeleteModal();
            });
            vehicleTableBody.appendChild(clone);
        });
        tableLoader.style.display = 'none';
    }, 1000);
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

window.addEventListener('DOMContentLoaded', () => {
    fetchVehiclesData();
});

const priceInputs = document.querySelectorAll('.price_input') as NodeListOf<HTMLInputElement>;
const startPriceInput = document.getElementById('start_price') as HTMLInputElement;
const endPriceInput = document.getElementById('end_price') as HTMLInputElement;
const typeCheckList = document.querySelectorAll('.type_check') as NodeListOf<HTMLInputElement>;
const brandCheckList = document.querySelectorAll('.brand_check') as NodeListOf<HTMLInputElement>;
const resetButton = document.getElementById('resetButton') as HTMLButtonElement;

function resetFilter() {
    startPriceInput.value = '0';
    endPriceInput.value = '0';
    typeCheckList.forEach(typeCheck => {
        typeCheck.checked = false;
    });
    brandCheckList.forEach(brandCheck => {
        brandCheck.checked = false;
    });
    sendData.reset();
    fetchVehiclesData();
}


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

startPriceInput.addEventListener('input', () => {
    const startPrice = reverseFormatPrice(startPriceInput.value);
    sendData.startPrice = startPrice;
    fetchVehiclesData();
});

endPriceInput.addEventListener('input',() => {
    const endPrice = reverseFormatPrice(endPriceInput.value);
    sendData.endPrice = endPrice;
    fetchVehiclesData();
});

typeCheckList.forEach(typeCheck => {
    typeCheck.addEventListener('input', () => {
        if (typeCheck.checked) {
            sendData.types.push(String(typeCheck.value));
        } else {
            const index = sendData.types.indexOf(String(typeCheck.value));
            if (index !== -1) {
                sendData.types.splice(index, 1);
            }  
        }
        fetchVehiclesData();
    });
});

brandCheckList.forEach(brandCheck => {
    brandCheck.addEventListener('input', () => {
        if (brandCheck.checked) {
            sendData.brands.push(String(brandCheck.value));
        } else {
            const index = sendData.brands.indexOf(String(brandCheck.value));
            if (index !== -1) {
                sendData.brands.splice(index, 1);
            }
        }
        fetchVehiclesData();
    });
});

vehicleSearch.addEventListener('input', () => {
    const newKeyword = vehicleSearch.value;
    sendData.keyword = newKeyword;
    fetchVehiclesData();
});

resetButton.addEventListener('click', resetFilter);