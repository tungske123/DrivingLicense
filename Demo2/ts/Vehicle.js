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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
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
    return __awaiter(this, void 0, void 0, function () {
        var fetchUrl, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchUrl = "https://localhost:7235/api/vehicle/".concat(page);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(fetchUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(sendData)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Http Error! Status code: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log(data);
                    totalPages = Number(data.totalPages);
                    renderVehicleTable(data.items);
                    renderPagingBar();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error: ".concat(error_1));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getFormattedPrice(price) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString();
}
var currentVehicleID = "";
function renderVehicleTable(vehicleList) {
    var _this = this;
    var template = document.getElementById('vehicle-row-template');
    vehicleTableBody.innerHTML = "";
    if (vehicleList !== null && vehicleList.length > 0) {
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
            dropdownButton.addEventListener('click', function toggleDropDown() {
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
            editButton.setAttribute('vid', vehicle.vehicleId);
            var detailsButton = dropDownContent.querySelector('.details_btn');
            detailsButton.setAttribute('vid', vehicle.vehicleId);
            var deleteButton = dropDownContent.querySelector('.cancel_btn');
            deleteButton.setAttribute('vid', vehicle.vehicleId);
            editButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                var vid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vid = editButton.getAttribute('vid');
                            currentVehicleID = vid;
                            return [4 /*yield*/, loadVehicleToEditModal(vid)];
                        case 1:
                            _a.sent();
                            toggleUpdateModal();
                            return [2 /*return*/];
                    }
                });
            }); });
            detailsButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                var vid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vid = detailsButton.getAttribute('vid');
                            currentVehicleID = vid;
                            return [4 /*yield*/, loadVehicleToDetailsModal(vid)];
                        case 1:
                            _a.sent();
                            toggleDetailsModal();
                            return [2 /*return*/];
                    }
                });
            }); });
            deleteButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                var vid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vid = deleteButton.getAttribute('vid');
                            currentVehicleID = vid;
                            return [4 /*yield*/, DeleteVehicle(vid)];
                        case 1:
                            _a.sent();
                            toggleDeleteModal();
                            return [2 /*return*/];
                    }
                });
            }); });
            vehicleTableBody.appendChild(clone);
        });
    }
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
window.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchVehiclesData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var priceInputs = document.querySelectorAll('.price_input');
var startPriceInput = document.getElementById('start_price');
var endPriceInput = document.getElementById('end_price');
var typeCheckList = document.querySelectorAll('.type_check');
var brandCheckList = document.querySelectorAll('.brand_check');
var resetButton = document.getElementById('resetButton');
function resetFilter() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startPriceInput.value = '0';
                    endPriceInput.value = '0';
                    typeCheckList.forEach(function (typeCheck) {
                        typeCheck.checked = false;
                    });
                    brandCheckList.forEach(function (brandCheck) {
                        brandCheck.checked = false;
                    });
                    page = 1;
                    sendData.reset();
                    return [4 /*yield*/, fetchVehiclesData()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fetchSingleVehicleData(vehicleId) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, vehicle, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://localhost:7235/api/vehicles/".concat(vehicleId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Http Error! Status code: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    vehicle = data;
                    return [2 /*return*/, vehicle];
                case 4:
                    error_2 = _a.sent();
                    console.error("Error! ".concat(error_2));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function addVehicle(data) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://localhost:7235/api/vehicles/add";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            body: data
                        })];
                case 2:
                    response = _a.sent();
                    if (response.status !== 204) {
                        throw new Error("Http Error! Status code: ".concat(response.status));
                    }
                    console.log('Add vehicle success');
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error("Error: ".concat(error_3));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function loadVehicleToDetailsModal(vehicleId) {
    return __awaiter(this, void 0, void 0, function () {
        var vehicle, readVehicleImageElement, readVehicleNameElement, readDescriptionElement, readBrandElement, readYearsElement, readPriceElement;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchSingleVehicleData(vehicleId)];
                case 1:
                    vehicle = _a.sent();
                    readVehicleImageElement = document.getElementById('readVehicleImage');
                    readVehicleNameElement = document.getElementById('readVehicleName');
                    readDescriptionElement = document.getElementById('readDescription');
                    readBrandElement = document.getElementById('readBrand');
                    readYearsElement = document.getElementById('readYears');
                    readPriceElement = document.getElementById('readPrice');
                    readVehicleImageElement.src = "/img/vehicle/".concat(vehicle.image);
                    readVehicleNameElement.textContent = vehicle.name;
                    readDescriptionElement.innerHTML = vehicle.description;
                    readBrandElement.textContent = vehicle.brand;
                    readYearsElement.textContent = vehicle.years.toString();
                    readPriceElement.textContent = getFormattedPrice(vehicle.rentPrice) + " VNĐ/ Giờ";
                    return [2 /*return*/];
            }
        });
    });
}
function loadVehicleToEditModal(vehicleId) {
    return __awaiter(this, void 0, void 0, function () {
        var vehicle, updateVehicleIDElement, updateImageElement, updateNameElement, updateYearsElement, updateBrandElement, updatePriceElement, updateTypeElement, updateContactNumberElement, updateAddressElement, updateDescriptionElement;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchSingleVehicleData(vehicleId)];
                case 1:
                    vehicle = _a.sent();
                    updateVehicleIDElement = document.getElementById('updateVehicleID');
                    updateImageElement = document.getElementById('updateVehicleImage');
                    updateNameElement = document.querySelector('.updateName');
                    updateYearsElement = document.querySelector('.updateYears');
                    updateBrandElement = document.querySelector('.updateBrand');
                    updatePriceElement = document.querySelector('.updatePrice');
                    updateTypeElement = document.querySelector('.updateType');
                    updateContactNumberElement = document.querySelector('.updateContactNumber');
                    updateAddressElement = document.querySelector('.updateAddress');
                    updateDescriptionElement = document.querySelector('.updateDescription');
                    updateVehicleIDElement.textContent = vehicleId;
                    updateImageElement.src = "/img/vehicle/".concat(vehicle.image);
                    updateNameElement.value = vehicle.name;
                    updateYearsElement.value = vehicle.years.toString();
                    updateBrandElement.value = vehicle.brand;
                    updatePriceElement.value = vehicle.rentPrice.toString();
                    updateTypeElement.value = vehicle.type;
                    updateContactNumberElement.value = vehicle.contactNumber;
                    updateAddressElement.value = vehicle.address;
                    updateDescriptionElement.value = vehicle.description;
                    return [2 /*return*/];
            }
        });
    });
}
function UpdateVehicle(vehicleId) {
    return __awaiter(this, void 0, void 0, function () {
        var url, updateForm, formData, fileImageInput, updateNameElement, updateYearsElement, updateBrandElement, updatePriceElement, updateTypeElement, updateContactNumberElement, updateAddressElement, updateDescriptionElement, imageFile, response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (vehicleId === null || vehicleId === "") {
                        console.log('Update vehicle failed');
                        return [2 /*return*/];
                    }
                    url = "https://localhost:7235/api/vehicles/update/".concat(vehicleId);
                    updateForm = document.getElementById('updateForm');
                    formData = new FormData();
                    fileImageInput = document.querySelector('.updateImageFile');
                    updateNameElement = document.querySelector('.updateName');
                    updateYearsElement = document.querySelector('.updateYears');
                    updateBrandElement = document.querySelector('.updateBrand');
                    updatePriceElement = document.querySelector('.updatePrice');
                    updateTypeElement = document.querySelector('.updateType');
                    updateContactNumberElement = document.querySelector('.updateContactNumber');
                    updateAddressElement = document.querySelector('.updateAddress');
                    updateDescriptionElement = document.querySelector('.updateDescription');
                    formData.append('Name', updateNameElement.name);
                    if (fileImageInput !== null) {
                        imageFile = fileImageInput.files[0];
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
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'PATCH',
                            body: formData
                        })];
                case 2:
                    response = _a.sent();
                    if (response.status !== 204) {
                        throw new Error("Http error! Status code: ".concat(response.status));
                    }
                    console.log('Update vehicle success!');
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error("Http error!".concat(error_4));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function DeleteVehicle(vehicleId) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (vehicleId === null || vehicleId === "") {
                        console.log('Delete vehicle failed');
                        return [2 /*return*/];
                    }
                    url = "https://localhost:7235/api/vehicles/delete/".concat(vehicleId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.status !== 204) {
                        throw new Error("Http error! Status code: ".concat(response.status));
                    }
                    console.log('Delete vehicle success!');
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error("Http error!".concat(error_5));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var updateForm = document.getElementById('updateForm');
updateForm.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                return [4 /*yield*/, UpdateVehicle(currentVehicleID)];
            case 1:
                _a.sent();
                alert('Cập nhật thành công!');
                return [2 /*return*/];
        }
    });
}); });
var deleteModalButtons = document.querySelectorAll('.deleteModalBtn');
deleteModalButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var action;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    action = btn.getAttribute('btnaction');
                    if (!(action === 'confirm')) return [3 /*break*/, 2];
                    return [4 /*yield*/, DeleteVehicle(currentVehicleID)];
                case 1:
                    _a.sent();
                    alert('Xóa thành công');
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
});
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
startPriceInput.addEventListener('input', function () { return __awaiter(_this, void 0, void 0, function () {
    var startPrice;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                startPrice = reverseFormatPrice(startPriceInput.value);
                sendData.startPrice = startPrice;
                return [4 /*yield*/, fetchVehiclesData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
endPriceInput.addEventListener('input', function () { return __awaiter(_this, void 0, void 0, function () {
    var endPrice;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                endPrice = reverseFormatPrice(endPriceInput.value);
                sendData.endPrice = endPrice;
                return [4 /*yield*/, fetchVehiclesData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
typeCheckList.forEach(function (typeCheck) {
    typeCheck.addEventListener('input', function () { return __awaiter(_this, void 0, void 0, function () {
        var index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeCheck.checked) {
                        sendData.types.push(String(typeCheck.value));
                    }
                    else {
                        index = sendData.types.indexOf(String(typeCheck.value));
                        if (index !== -1) {
                            sendData.types.splice(index, 1);
                        }
                    }
                    page = 1;
                    return [4 /*yield*/, fetchVehiclesData()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
brandCheckList.forEach(function (brandCheck) {
    brandCheck.addEventListener('input', function () { return __awaiter(_this, void 0, void 0, function () {
        var index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (brandCheck.checked) {
                        sendData.brands.push(String(brandCheck.value));
                    }
                    else {
                        index = sendData.brands.indexOf(String(brandCheck.value));
                        if (index !== -1) {
                            sendData.brands.splice(index, 1);
                        }
                    }
                    page = 1;
                    return [4 /*yield*/, fetchVehiclesData()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
vehicleSearch.addEventListener('input', function () { return __awaiter(_this, void 0, void 0, function () {
    var newKeyword;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newKeyword = String(vehicleSearch.value);
                sendData.keyword = newKeyword;
                page = 1;
                return [4 /*yield*/, fetchVehiclesData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
resetButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, resetFilter()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var addPreviewImage = document.getElementById('addPreviewImage');
var addImageInput = document.querySelector('.add_image');
var addForm = document.getElementById('addForm');
addImageInput.addEventListener('change', function (event) {
    var files = event.target.files;
    if (!files) {
        console.log('No file selected');
        return;
    }
    var file = files[0];
    var reader = new FileReader();
    // Set the onload function, which will be called after the file has been read
    reader.onload = function (e) {
        // The result attribute contains the data as a data: URL representing the file's data as a base64 encoded string.
        addPreviewImage.src = reader.result;
    };
    // Read the image file as a data URL
    reader.readAsDataURL(file);
});
addForm.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
    var addNameInput, addYearsInput, addBrandInput, addNewBrandInput, addPriceInput, addTypeInput, addAddressInput, addContactNumber, addDescriptionInput, formData, imageFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                addNameInput = document.querySelector('.add_name');
                addYearsInput = document.querySelector('.add_years');
                addBrandInput = document.querySelector('.add_brand');
                addNewBrandInput = document.querySelector('.add_newbrand');
                addPriceInput = document.querySelector('.add_price');
                addTypeInput = document.querySelector('.add_type');
                addAddressInput = document.querySelector('.add_address');
                addContactNumber = document.querySelector('.add_phone');
                addDescriptionInput = document.querySelector('.add_description');
                formData = new FormData();
                imageFile = addImageInput.files[0];
                formData.append('Name', addNameInput.value);
                if (addImageInput !== null) {
                    formData.append('Image', imageFile);
                }
                formData.append('Years', addYearsInput.value);
                if (addNewBrandInput.value !== null && addNewBrandInput.value !== "") {
                    if (addBrandInput.value !== null && addBrandInput.value !== "") {
                        alert('Vui lòng chỉ chọn hãng đã có hoặc hãng mới');
                        return [2 /*return*/];
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
                return [4 /*yield*/, addVehicle(formData)];
            case 1:
                // let descriptionContent = tinymce.get('add_description')?.getContent();
                // if (descriptionContent) {
                //     formData.append('Description', descriptionContent);
                // }
                _a.sent();
                alert('Thêm xe thành công');
                return [2 /*return*/];
        }
    });
}); });
var pagingContent = document.getElementById('pagingContent');
var prevButton = document.getElementById('prevBtn');
var nextButton = document.getElementById('nextBtn');
var totalPages = 1;
function renderPagingBar() {
    var _this = this;
    pagingContent.innerHTML = '';
    var pageClassName = "flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
    var activeClassName = "flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-red-700 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white";
    var _loop_1 = function () {
        var li = document.createElement('li');
        var pageButton = document.createElement('button');
        pageButton.setAttribute('cnt', pageCnt.toString());
        pageButton.textContent = pageCnt.toString();
        if (pageCnt === page) {
            pageButton.className = activeClassName;
        }
        else {
            pageButton.className = pageClassName;
        }
        pageButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
            var newPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newPage = Number(pageButton.getAttribute('cnt'));
                        page = newPage;
                        return [4 /*yield*/, fetchVehiclesData()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        li.appendChild(pageButton);
        pagingContent.appendChild(li);
    };
    for (var pageCnt = 1; pageCnt <= totalPages; ++pageCnt) {
        _loop_1();
    }
}
prevButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                --page;
                if (page <= 0) {
                    page = totalPages;
                }
                return [4 /*yield*/, fetchVehiclesData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
nextButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ++page;
                if (page > totalPages) {
                    page = 1;
                }
                return [4 /*yield*/, fetchVehiclesData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
