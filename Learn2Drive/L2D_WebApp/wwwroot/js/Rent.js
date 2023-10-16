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
var showButtons = document.querySelectorAll('.show_button');
showButtons.forEach(function (showBtn) {
    showBtn.addEventListener('click', function () {
        var carCategory = showBtn.closest('.car_category');
        if (!carCategory.classList.contains('show')) {
            carCategory.classList.add('show');
        }
        else {
            carCategory.classList.remove('show');
        }
    });
});
//Declarations
var Vehicle = /** @class */ (function () {
    function Vehicle(vehicleId, name, image, brand, type, years, contactNumber, address, rentPrice, status) {
        this.vehicleId = vehicleId;
        this.name = name;
        this.image = image;
        this.brand = brand;
        this.type = type;
        this.years = years;
        this.contactNumber = contactNumber;
        this.address = address;
        this.rentPrice = rentPrice;
        this.status = status;
    }
    return Vehicle;
}());
var startSlider = document.querySelector('.min-range');
var endSlider = document.querySelector('.max-range');
var minInput = document.querySelector('.min-input');
var maxInput = document.querySelector('.max-input');
var searchForm = document.getElementById('searchForm');
var brandCheckBoxes = document.querySelectorAll('.brand-check');
var typeCheckBoxes = document.querySelectorAll('.category-check');
var toponeVehicleName = document.querySelector('.topone-vehicle-name');
var toponeVehicleImg = document.querySelector('.topone-vehicle-img');
var suggestSection = document.querySelector('.suggest_page_section');
var topOneRentButton = document.querySelector('.topone-rent-btn');
//Methods
function checkFormattedPrice(priceString) {
    var threeDotNotationRegex = /^\d{1,3}(\.\d{3})*$/;
    return (priceString !== null && priceString !== "" && threeDotNotationRegex.test(priceString));
}
function checkValidPriceOnSliders() {
    var startPrice = Number(startSlider.value);
    var endPrice = Number(endSlider.value);
    return (startPrice < endPrice);
}
function getFormattedPrice(price) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString();
}
function updatePriceOnSliders() {
    if (!checkValidPriceOnSliders()) {
        resetSliders();
        resetPriceInput();
        notifyInvalidPrice();
        return;
    }
    var startPrice = startSlider.value;
    var endPrice = endSlider.value;
    minInput.value = getFormattedPrice(Number(startPrice));
    maxInput.value = getFormattedPrice(Number(endPrice));
}
function resetPriceInput() {
    minInput.value = "0";
    maxInput.value = "1.000.000";
}
function resetSliders() {
    startSlider.value = "0";
    endSlider.value = "1000000";
}
function notifyInvalidPrice() {
    alert('Nhập giá phù hợp');
}
function formatPriceInput(input) {
    var price = input.value;
    if (!checkFormattedPrice(price)) {
        var numValue = Number(input.value.replace(/\D/g, ''));
        updatePriceOnSliders();
        input.value = numValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return;
    }
    notifyInvalidPrice();
    resetPriceInput();
}
function createVehicleItem(vehicleId, name, category, price, image) {
    var carItem = document.createElement('div');
    carItem.setAttribute('vid', vehicleId);
    carItem.className = 'car_item';
    var nameDiv = document.createElement('div');
    nameDiv.className = 'car_item_name';
    nameDiv.textContent = name;
    var categoryDiv = document.createElement('div');
    categoryDiv.className = 'car_body_category';
    categoryDiv.textContent = category;
    var priceDiv = document.createElement('div');
    priceDiv.className = 'price';
    priceDiv.innerHTML = "<p>".concat(price, " VN\u0110</p> <span> /Gi\u1EDD</span>");
    var imageDiv = document.createElement('div');
    imageDiv.className = 'car_image';
    imageDiv.innerHTML = "<img src=\"/img/vehicle/".concat(image, "\" alt=\"\">");
    var bottomContentDiv = document.createElement('div');
    bottomContentDiv.className = 'car_bottom_content';
    var rentButtonDiv = document.createElement('div');
    rentButtonDiv.className = 'rent_button';
    rentButtonDiv.setAttribute('vid', vehicleId);
    rentButtonDiv.innerHTML = "Thu\u00EA ngay<div class=\"icon\"><i class=\"fa-solid fa-arrow-right\"></i></div>";
    bottomContentDiv.appendChild(rentButtonDiv);
    rentButtonDiv.addEventListener('click', function () {
        var vid = String(rentButtonDiv.getAttribute('vid'));
        location.href = "/Rent/RentDetail?vid=".concat(vid);
    });
    carItem.appendChild(nameDiv);
    carItem.appendChild(categoryDiv);
    carItem.appendChild(priceDiv);
    carItem.appendChild(imageDiv);
    carItem.appendChild(bottomContentDiv);
    return carItem;
}
// Usage:
//   const features = [
//       {icon: 'fa-solid fa-copyright', info: `auto`},
//       {icon: 'fa-solid fa-chair', info: `4 chỗ`},
//       {icon: 'fa-solid fa-id-card', info: `B1`}
//   ];
//   const carItemElement = createVehicleItem('Yamaha', 'Honda', '500,000Đ', 'img/Assets/Image/Car Image/Image (1).png', features, 'Thuê ngay');
var page = 1;
var keyword = '';
var types = [];
var brands = [];
var startPrice = -1;
var endPrice = -1;
var totalPageNumber;
function fetchVehicleDataAsync() {
    return __awaiter(this, void 0, void 0, function () {
        var sendData, fetchURL, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendData = {
                        keyword: keyword,
                        types: types,
                        brands: brands,
                        startPrice: startPrice,
                        endPrice: endPrice
                    };
                    fetchURL = "https://localhost:7235/api/rent/".concat(page);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch(fetchURL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(sendData)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! Status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log(data);
                    if (Array.isArray(data.items)) {
                        renderVehiclesData(data.items);
                    }
                    else {
                        console.error('Error: data.items is not an array');
                    }
                    return [4 /*yield*/, renderPageItems(data.totalPages)];
                case 4:
                    _a.sent();
                    totalPageNumber = Number(data.totalPages);
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error: ".concat(error_1));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function renderVehiclesData(vehicleList) {
    var carItemBox = document.querySelector('.car_item_box');
    if (vehicleList === null || vehicleList.length === 0) {
        carItemBox.innerHTML = "<h1 style=\"text-align: center;\">Kh\u00F4ng c\u00F3 k\u1EBFt qu\u1EA3</h1>";
        return;
    }
    vehicleList.forEach(function (vehicle) {
        // Create and append loading div
        var loadDiv = document.createElement('div');
        loadDiv.className = 'loader';
        loadDiv.innerHTML = "<i class=\"fa-solid fa-circle-notch\"></i>";
        carItemBox.appendChild(loadDiv);
        // Add a delay before creating and appending vehicle card item
        setTimeout(function () {
            var vehicleCardItem = createVehicleItem(vehicle.vehicleId, vehicle.name, vehicle.brand, getFormattedPrice(vehicle.rentPrice), vehicle.image);
            // Replace loading div with actual data
            carItemBox.replaceChild(vehicleCardItem, loadDiv);
        }, 750);
    });
}
function clearVehicleList() {
    var carItemBox = document.querySelector('.car_item_box');
    carItemBox.innerHTML = '';
}
function clearPageList() {
    var pageList = document.querySelector('.pagination');
    pageList.innerHTML = '';
}
function renderPageItems(totalPages) {
    return __awaiter(this, void 0, void 0, function () {
        var pageList, prevButton, i, newPageItem, nextButton;
        var _this = this;
        return __generator(this, function (_a) {
            if (page > totalPages && page <= 0) {
                page = 1;
            }
            pageList = document.querySelector('.pagination');
            clearPageList();
            prevButton = document.createElement('li');
            prevButton.className = 'page-item';
            prevButton.dataset.page = 'prev';
            prevButton.innerHTML = "\n    <div class=\"page-link\" aria-label=\"Previous\">\n        <span aria-hidden=\"true\">\u00AB</span>\n    </div>";
            pageList.appendChild(prevButton);
            prevButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (page === 1) {
                                page = totalPages;
                            }
                            else {
                                --page;
                            }
                            console.log('Page is now: ' + page);
                            clearVehicleList();
                            return [4 /*yield*/, fetchVehicleDataAsync()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            for (i = 1; i <= totalPages; ++i) {
                newPageItem = document.createElement('li');
                newPageItem.className = 'page-item';
                newPageItem.setAttribute('page', i.toString());
                newPageItem.innerHTML = "<div class=\"page-link\" page=\"".concat(i, "\">").concat(i, "</div>");
                pageList.appendChild(newPageItem);
                if (page == i && !newPageItem.classList.contains('active')) {
                    newPageItem.classList.add('active');
                }
                // Check if the event listener has already been added
                if (!newPageItem.dataset.listenerAdded) {
                    // Use an IIFE to create a new scope for each iteration
                    (function (newPageItem, i) {
                        var _this = this;
                        newPageItem.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                            var newPage;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        newPage = Number(newPageItem.getAttribute('page'));
                                        page = newPage;
                                        console.log('Page is now: ' + newPage);
                                        clearVehicleList();
                                        return [4 /*yield*/, fetchVehicleDataAsync()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        // Add a custom attribute to indicate that the event listener has been added
                        newPageItem.dataset.listenerAdded = 'true';
                    })(newPageItem, i);
                }
            }
            nextButton = document.createElement('li');
            nextButton.className = 'page-item';
            nextButton.dataset.page = 'next';
            nextButton.id = 'prev';
            nextButton.innerHTML = "\n    <div class=\"page-link\" aria-label=\"Next\">\n        <span aria-hidden=\"true\">\u00BB</span>\n    </div>";
            pageList.appendChild(nextButton);
            nextButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (page === totalPageNumber) {
                                page = 1;
                            }
                            else {
                                ++page;
                            }
                            console.log('Page is now: ' + page);
                            clearVehicleList();
                            return [4 /*yield*/, fetchVehicleDataAsync()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
function fetchTop1VehicleAsync() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, top1Vehicle_1, rentCount, imageUrl, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('https://localhost:7235/api/rent/topone', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! Status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    suggestSection.classList.remove('hide-section');
                    suggestSection.classList.add('show-section');
                    console.log(data);
                    top1Vehicle_1 = data.vehicle;
                    rentCount = Number(data.rentCount);
                    toponeVehicleName.textContent = String(top1Vehicle_1.name);
                    imageUrl = String(top1Vehicle_1.image);
                    toponeVehicleImg.src = "/img/vehicle/".concat(imageUrl);
                    topOneRentButton.addEventListener('click', function () {
                        var vid = top1Vehicle_1.vehicleId;
                        location.href = "/Rent/RentDetail?vid=".concat(vid);
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error; ".concat(error_2));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//Events
brandCheckBoxes.forEach(function (brandCheck) {
    brandCheck.addEventListener('input', function () { return __awaiter(_this, void 0, void 0, function () {
        var brand, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    brand = String(brandCheck.getAttribute('value'));
                    if (brands.indexOf(brand) === -1) {
                        brands.push(brand);
                    }
                    else {
                        index = brands.indexOf(brand);
                        if (index > -1) {
                            brands.splice(index, 1);
                        }
                    }
                    clearVehicleList();
                    return [4 /*yield*/, fetchVehicleDataAsync()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
typeCheckBoxes.forEach(function (typeCheck) {
    typeCheck.addEventListener('input', function () { return __awaiter(_this, void 0, void 0, function () {
        var type, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    type = String(typeCheck.value);
                    if (types.indexOf(type) === -1) {
                        types.push(type);
                    }
                    else {
                        index = types.indexOf(type);
                        types.splice(index, 1);
                    }
                    clearVehicleList();
                    return [4 /*yield*/, fetchVehicleDataAsync()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
searchForm.addEventListener('submit', function (event) { return __awaiter(_this, void 0, void 0, function () {
    var newKeyword, newStartPrice, newEndPrice;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                event.preventDefault();
                newKeyword = document.getElementById('keyword').value;
                newStartPrice = Number(startSlider.value);
                newEndPrice = Number(endSlider.value);
                keyword = newKeyword;
                startPrice = newStartPrice;
                endPrice = newEndPrice;
                clearVehicleList();
                return [4 /*yield*/, fetchVehicleDataAsync()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
startSlider.addEventListener('input', function () {
    updatePriceOnSliders();
});
endSlider.addEventListener('input', function () {
    updatePriceOnSliders();
});
minInput.addEventListener('input', function () {
    formatPriceInput(minInput);
});
maxInput.addEventListener('input', function () {
    formatPriceInput(maxInput);
});
window.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchTop1VehicleAsync()];
            case 1:
                _a.sent();
                return [4 /*yield*/, fetchVehicleDataAsync()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=Rent.js.map