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
}
let vehicleTableBody = document.getElementById('vehicleTableBody') as HTMLTableSectionElement;
const vehicleSearch = document.getElementById('vehicleSearch') as HTMLInputElement;
const tableLoader = document.getElementById('tableLoader') as HTMLDivElement;
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
    vehicleList.forEach(vehicle => {
        let clone = document.importNode(template.content, true);

        let cells = clone.querySelectorAll('td') as NodeListOf<HTMLTableCellElement>;
        cells[0].textContent = vehicle.name;
        cells[1].textContent = vehicle.brand;
        cells[2].textContent = vehicle.years.toString();
        cells[3].textContent = vehicle.type;
        cells[4].textContent = '...';
        cells[5].textContent = getFormattedPrice(vehicle.rentPrice);

        vehicleTableBody.appendChild(clone);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    fetchVehiclesData();
});
vehicleSearch.addEventListener('input', () => {
    const newKeyword = vehicleSearch.value;
    sendData.keyword = newKeyword;
    fetchVehiclesData();
});