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
    return VehicleRequestData;
}());
var vehicleTableBody = document.getElementById('vehicleTableBody');
var vehicleSearch = document.getElementById('vehicleSearch');
var tableLoader = document.getElementById('tableLoader');
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
    vehicleList.forEach(function (vehicle) {
        var clone = document.importNode(template.content, true);
        var cells = clone.querySelectorAll('td');
        cells[0].textContent = vehicle.name;
        cells[1].textContent = vehicle.brand;
        cells[2].textContent = vehicle.years.toString();
        cells[3].textContent = vehicle.type;
        cells[4].textContent = '...';
        cells[5].textContent = getFormattedPrice(vehicle.rentPrice);
        vehicleTableBody.appendChild(clone);
    });
    // tableLoader.style.display = 'none';
    // tableLoader.style.display = 'block';
    // setTimeout(() => {
    // }, 1000);
}
function renderVehicleTableRow() {
}
window.addEventListener('DOMContentLoaded', function () {
    fetchVehiclesData();
});
vehicleSearch.addEventListener('input', function () {
    var newKeyword = vehicleSearch.value;
    sendData.keyword = newKeyword;
    fetchVehiclesData();
});
