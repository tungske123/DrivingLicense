var Vehicle = /** @class */ (function () {
    function Vehicle() {
    }
    return Vehicle;
}());
var VehicleRequestData = /** @class */ (function () {
    function VehicleRequestData() {
        this.types = [];
        this.brands = [];
        this.startPrice = -1;
        this.endPrice = -1;
    }
    VehicleRequestData.prototype.reset = function () {
        this.keyword = '';
        this.types = [];
        this.brands = [];
        this.startPrice = -1;
        this.endPrice = -1;
    };
    return VehicleRequestData;
}());
var vehicleTableBody = document.getElementById('vehicleTableBody');
var vehicleSearch = document.getElementById('vehicleSearch');
var tableLoader = document.getElementById('tableLoader');
var createModal = document.getElementById('createProductModal');
var page = 1;
var sendData = new VehicleRequestData();
function fetchVehiclesData() {
    var fetchUrl = "https://localhost:7235/api/vehicle/".concat(page);
    fetch(fetchUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendData)
    }).then(function (response) {
        if (!response.ok) {
            throw new Error("Http Error! Status code: ".concat(response.status));
        }
        return response.json();
    }).then(function (data) {
        console.log(data);
        renderVehicleTable(data.items);
    })["catch"](function (error) {
        console.error("Http Error!".concat(error));
    });
}
function getFormattedPrice(price) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString();
}
function renderVehicleTable(vehicleList) {
    var template = document.getElementById('vehicle-row-template');
    vehicleTableBody.innerHTML = "";
    tableLoader.style.display = 'block';
    setTimeout(function () {
        vehicleList.forEach(function (vehicle) {
            var clone = document.importNode(template.content, true);
            var cells = clone.querySelectorAll('td');
            cells[0].textContent = vehicle.name;
            cells[1].textContent = vehicle.brand;
            cells[2].textContent = vehicle.years.toString();
            cells[3].textContent = vehicle.type;
            cells[4].textContent = '...';
            cells[5].textContent = getFormattedPrice(vehicle.rentPrice);
            var dropdownButton = cells[6].querySelector('.dropdown_button');
            var dropDownContent = cells[6].querySelector('.dropdown_content');
            dropdownButton.addEventListener('click', function () {
                var hasDropdown = (!dropDownContent.classList.contains('hidden') && dropDownContent.classList.contains('block'));
                if (!hasDropdown) {
                    dropDownContent.classList.remove('hidden');
                    dropDownContent.classList.add('block');
                }
                else {
                    dropDownContent.classList.add('hidden');
                    dropDownContent.classList.remove('block');
                }
            });
            var editButton = dropDownContent.querySelector('.edit_btn');
            var detailsButton = dropDownContent.querySelector('.details_btn');
            var deleteButton = dropDownContent.querySelector('.cancel_btn');
            editButton.addEventListener('click', function () {
                toggleUpdateModal();
            });
            detailsButton.addEventListener('click', function () {
                toggleDetailsModal();
            });
            deleteButton.addEventListener('click', function () {
                toggleDeleteModal();
            });
            vehicleTableBody.appendChild(clone);
        });
        tableLoader.style.display = 'none';
    }, 1000);
}
function toggleUpdateModal() {
    var updateModal = document.getElementById('updateProductModal');
    var openedUpdateModal = (!updateModal.classList.contains('hidden') && updateModal.classList.contains('flex') && updateModal.classList.contains('blur-background'));
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
    var detailsModal = document.getElementById('readProductModal');
    var openedDetaisModal = (!detailsModal.classList.contains('hidden') && detailsModal.classList.contains('flex') && detailsModal.classList.contains('blur-background'));
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
    var deleteModal = document.getElementById('deleteModal');
    var openedDeleteModal = (!deleteModal.classList.contains('hidden') && deleteModal.classList.contains('flex') && deleteModal.classList.contains('blur-background'));
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
window.addEventListener('DOMContentLoaded', function () {
    fetchVehiclesData();
});
var priceInputs = document.querySelectorAll('.price_input');
var startPriceInput = document.getElementById('start_price');
var endPriceInput = document.getElementById('end_price');
var typeCheckList = document.querySelectorAll('.type_check');
var brandCheckList = document.querySelectorAll('.brand_check');
var resetButton = document.getElementById('resetButton');
function resetFilter() {
    startPriceInput.value = '0';
    endPriceInput.value = '0';
    typeCheckList.forEach(function (typeCheck) {
        typeCheck.checked = false;
    });
    brandCheckList.forEach(function (brandCheck) {
        brandCheck.checked = false;
    });
    sendData.reset();
    fetchVehiclesData();
}
priceInputs.forEach(function (priceInput) {
    priceInput.addEventListener('input', function () {
        var priceValue = Number(priceInput.value.replace(/\D/g, ''));
        priceInput.value = priceValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        var startPrice = reverseFormatPrice(startPriceInput.value);
        var endPrice = reverseFormatPrice(endPriceInput.value);
        if (startPrice >= endPrice) {
            alert('Vui lòng nhập giá phù hợp');
            startPriceInput.value = '0';
            endPriceInput.value = '0';
        }
    });
});
startPriceInput.addEventListener('input', function () {
    var startPrice = reverseFormatPrice(startPriceInput.value);
    sendData.startPrice = startPrice;
    fetchVehiclesData();
});
endPriceInput.addEventListener('input', function () {
    var endPrice = reverseFormatPrice(endPriceInput.value);
    sendData.endPrice = endPrice;
    fetchVehiclesData();
});
typeCheckList.forEach(function (typeCheck) {
    typeCheck.addEventListener('input', function () {
        if (typeCheck.checked) {
            sendData.types.push(String(typeCheck.value));
        }
        else {
            var index = sendData.types.indexOf(String(typeCheck.value));
            if (index !== -1) {
                sendData.types.splice(index, 1);
            }
        }
        fetchVehiclesData();
    });
});
brandCheckList.forEach(function (brandCheck) {
    brandCheck.addEventListener('input', function () {
        if (brandCheck.checked) {
            sendData.brands.push(String(brandCheck.value));
        }
        else {
            var index = sendData.brands.indexOf(String(brandCheck.value));
            if (index !== -1) {
                sendData.brands.splice(index, 1);
            }
        }
        fetchVehiclesData();
    });
});
vehicleSearch.addEventListener('input', function () {
    var newKeyword = vehicleSearch.value;
    sendData.keyword = newKeyword;
    fetchVehiclesData();
});
resetButton.addEventListener('click', resetFilter);
