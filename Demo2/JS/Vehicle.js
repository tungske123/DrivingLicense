const vehicleTableBody = document.getElementById('vehicleTableBody');
var page = 1;
var keyword = ``;
var types = [];
var brands = [];
var startPrice = -1;
var endPrice = -1
async function fetchVehiclesData() {
    const fetchUrl = `https://localhost:7235/api/vehicle/${page}`;
    const sendData = {
        keyword: keyword,
        types: types,
        brands: brands,
        startPrice: startPrice,
        endPrice: endPrice
    };
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
}

async function renderVehicleTable() {

}

async function renderVehicleTableRow() {
    
}

window.addEventListener('DOMContentLoaded', async () => {
    await fetchVehiclesData();
});
