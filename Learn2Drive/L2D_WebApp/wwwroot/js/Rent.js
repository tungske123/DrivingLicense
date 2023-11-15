var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const showButtons = document.querySelectorAll('.show_button');
showButtons.forEach(showBtn => {
    showBtn.addEventListener('click', () => {
        const carCategory = showBtn.closest('.car_category');
        if (!carCategory.classList.contains('show')) {
            carCategory.classList.add('show');
        }
        else {
            carCategory.classList.remove('show');
        }
    });
});
//Declarations
class Vehicle {
    constructor(vehicleId, name, image, brand, type, years, contactNumber, address, rentPrice, status) {
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
}
const startSlider = document.querySelector('.min-range');
const endSlider = document.querySelector('.max-range');
const minInput = document.querySelector('.min-input');
const maxInput = document.querySelector('.max-input');
const searchForm = document.getElementById('searchForm');
const brandCheckBoxes = document.querySelectorAll('.brand-check');
const typeCheckBoxes = document.querySelectorAll('.category-check');
const toponeVehicleName = document.querySelector('.topone-vehicle-name');
const toponeVehicleImg = document.querySelector('.topone-vehicle-img');
const suggestSection = document.querySelector('.suggest_page_section');
const topOneRentButton = document.querySelector('.topone-rent-btn');
//Methods
function checkFormattedPrice(priceString) {
    const threeDotNotationRegex = /^\d{1,3}(\.\d{3})*$/;
    return (priceString !== null && priceString !== "" && threeDotNotationRegex.test(priceString));
}
function checkValidPriceOnSliders() {
    const startPrice = Number(startSlider.value);
    const endPrice = Number(endSlider.value);
    return (startPrice < endPrice);
}
function getFormattedRentPrice(price) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString();
}
function updatePriceOnSliders() {
    if (!checkValidPriceOnSliders()) {
        resetSliders();
        resetPriceInput();
        notifyInvalidPrice();
        return;
    }
    const startPrice = startSlider.value;
    const endPrice = endSlider.value;
    minInput.value = getFormattedRentPrice(Number(startPrice));
    maxInput.value = getFormattedRentPrice(Number(endPrice));
}
function resetPriceInput() {
    minInput.value = `0`;
    maxInput.value = `1.000.000`;
}
function resetSliders() {
    startSlider.value = `0`;
    endSlider.value = `1000000`;
}
function notifyInvalidPrice() {
    alert('Nhập giá phù hợp');
}
function formatPriceInput(input) {
    const price = input.value;
    if (!checkFormattedPrice(price)) {
        let numValue = Number(input.value.replace(/\D/g, ''));
        updatePriceOnSliders();
        input.value = numValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return;
    }
    notifyInvalidPrice();
    resetPriceInput();
}
function createVehicleItem(vehicleId, name, category, price, image) {
    const carItem = document.createElement('div');
    carItem.setAttribute('vid', vehicleId);
    carItem.className = 'car_item';
    const nameDiv = document.createElement('div');
    nameDiv.className = 'car_item_name';
    nameDiv.textContent = name;
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'car_body_category';
    categoryDiv.textContent = category;
    const priceDiv = document.createElement('div');
    priceDiv.className = 'price';
    priceDiv.innerHTML = `<p>${price} VNĐ</p> <span> /Giờ</span>`;
    const imageDiv = document.createElement('div');
    imageDiv.className = 'car_image';
    imageDiv.innerHTML = `<img class="rounded-2" src="/img/vehicle/${image}" alt="">`;
    const bottomContentDiv = document.createElement('div');
    bottomContentDiv.className = 'car_bottom_content';
    const rentButtonDiv = document.createElement('div');
    rentButtonDiv.className = 'rent_button';
    rentButtonDiv.setAttribute('vid', vehicleId);
    rentButtonDiv.innerHTML = `Thuê ngay<div class="icon"><i class="fa-solid fa-arrow-right"></i></div>`;
    bottomContentDiv.appendChild(rentButtonDiv);
    rentButtonDiv.addEventListener('click', () => {
        const vid = String(rentButtonDiv.getAttribute('vid'));
        location.href = `/Rent/RentDetail?vid=${vid}`;
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
    return __awaiter(this, void 0, void 0, function* () {
        const sendData = {
            keyword: keyword,
            types: types,
            brands: brands,
            startPrice: startPrice,
            endPrice: endPrice
        };
        const fetchURL = `https://localhost:7235/api/vehicle/${page}`;
        try {
            const response = yield fetch(fetchURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            console.log(data);
            if (Array.isArray(data.items)) {
                renderVehiclesData(data.items);
            }
            else {
                console.error('Error: data.items is not an array');
            }
            yield renderPageItems(data.totalPages);
            totalPageNumber = Number(data.totalPages);
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
function renderVehiclesData(vehicleList) {
    var carItemBox = document.querySelector('.car_item_box');
    if (vehicleList === null || vehicleList.length === 0) {
        carItemBox.innerHTML = `<h1 style="text-align: center;">Không có kết quả</h1>`;
        return;
    }
    vehicleList.forEach(vehicle => {
        // Create and append loading div
        const loadDiv = document.createElement('div');
        loadDiv.className = 'loader';
        loadDiv.innerHTML = `<i class="fa-solid fa-circle-notch"></i>`;
        carItemBox.appendChild(loadDiv);
        // Add a delay before creating and appending vehicle card item
        setTimeout(() => {
            const vehicleCardItem = createVehicleItem(vehicle.vehicleId, vehicle.name, vehicle.brand, getFormattedRentPrice(vehicle.rentPrice), vehicle.image);
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
    return __awaiter(this, void 0, void 0, function* () {
        if (page > totalPages && page <= 0) {
            page = 1;
        }
        var pageList = document.querySelector('.pagination');
        clearPageList();
        var prevButton = document.createElement('li');
        prevButton.className = 'page-item';
        prevButton.dataset.page = 'prev';
        prevButton.innerHTML = `
    <div class="page-link" aria-label="Previous">
        <span aria-hidden="true">«</span>
    </div>`;
        pageList.appendChild(prevButton);
        prevButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            if (page === 1) {
                page = totalPages;
            }
            else {
                --page;
            }
            console.log('Page is now: ' + page);
            clearVehicleList();
            yield fetchVehicleDataAsync();
        }));
        for (var i = 1; i <= totalPages; ++i) {
            var newPageItem = document.createElement('li');
            newPageItem.className = 'page-item';
            newPageItem.setAttribute('page', i.toString());
            newPageItem.innerHTML = `<div class="page-link" page="${i}">${i}</div>`;
            pageList.appendChild(newPageItem);
            if (page == i && !newPageItem.classList.contains('active')) {
                newPageItem.classList.add('active');
            }
            // Check if the event listener has already been added
            if (!newPageItem.dataset.listenerAdded) {
                // Use an IIFE to create a new scope for each iteration
                (function (newPageItem, i) {
                    newPageItem.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                        const newPage = Number(newPageItem.getAttribute('page'));
                        page = newPage;
                        console.log('Page is now: ' + newPage);
                        clearVehicleList();
                        yield fetchVehicleDataAsync();
                    }));
                    // Add a custom attribute to indicate that the event listener has been added
                    newPageItem.dataset.listenerAdded = 'true';
                })(newPageItem, i);
            }
        }
        var nextButton = document.createElement('li');
        nextButton.className = 'page-item';
        nextButton.dataset.page = 'next';
        nextButton.id = 'prev';
        nextButton.innerHTML = `
    <div class="page-link" aria-label="Next">
        <span aria-hidden="true">»</span>
    </div>`;
        pageList.appendChild(nextButton);
        nextButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            if (page === totalPageNumber) {
                page = 1;
            }
            else {
                ++page;
            }
            console.log('Page is now: ' + page);
            clearVehicleList();
            yield fetchVehicleDataAsync();
        }));
    });
}
function fetchTop1VehicleAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://localhost:7235/api/vehicle/topone', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status !== 200 && response.status !== 204) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            if (data !== null) {
                suggestSection.classList.remove('hide-section');
                suggestSection.classList.add('show-section');
                console.log(data);
                const top1Vehicle = data.vehicle;
                const rentCount = Number(data.rentCount);
                toponeVehicleName.textContent = String(top1Vehicle.name);
                const imageUrl = String(top1Vehicle.image);
                toponeVehicleImg.src = `/img/vehicle/${imageUrl}`;
                topOneRentButton.addEventListener('click', () => {
                    const vid = top1Vehicle.vehicleId;
                    location.href = `/Rent/RentDetail?vid=${vid}`;
                });
            }
        }
        catch (error) {
            console.error(`Error; ${error}`);
        }
    });
}
//Events
brandCheckBoxes.forEach(brandCheck => {
    brandCheck.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
        const brand = String(brandCheck.getAttribute('value'));
        if (brands.indexOf(brand) === -1) {
            brands.push(brand);
        }
        else {
            // Remove brand
            const index = brands.indexOf(brand);
            if (index > -1) {
                brands.splice(index, 1);
            }
        }
        clearVehicleList();
        yield fetchVehicleDataAsync();
    }));
});
typeCheckBoxes.forEach(typeCheck => {
    typeCheck.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
        const type = String(typeCheck.value);
        if (types.indexOf(type) === -1) {
            types.push(type);
        }
        else {
            const index = types.indexOf(type);
            types.splice(index, 1);
        }
        clearVehicleList();
        yield fetchVehicleDataAsync();
    }));
});
searchForm.addEventListener('submit', (event) => __awaiter(this, void 0, void 0, function* () {
    event.preventDefault();
    const newKeyword = document.getElementById('keyword').value;
    const newStartPrice = Number(startSlider.value);
    const newEndPrice = Number(endSlider.value);
    keyword = newKeyword;
    startPrice = newStartPrice;
    endPrice = newEndPrice;
    clearVehicleList();
    yield fetchVehicleDataAsync();
}));
startSlider.addEventListener('input', () => {
    updatePriceOnSliders();
});
endSlider.addEventListener('input', () => {
    updatePriceOnSliders();
});
minInput.addEventListener('input', () => {
    formatPriceInput(minInput);
});
maxInput.addEventListener('input', () => {
    formatPriceInput(maxInput);
});
window.addEventListener('DOMContentLoaded', () => __awaiter(this, void 0, void 0, function* () {
    const rentBtn = document.getElementById('rentButton');
    rentBtn.click();
    yield fetchTop1VehicleAsync();
    yield fetchVehicleDataAsync();
}));
//# sourceMappingURL=Rent.js.map