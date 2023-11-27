let search = document.querySelector('.search-box');

document.querySelector('#search-icon').onclick = () => {
    search.classList.toggle('active');
    menu.classList.remove('active');
}

let menu = document.querySelector('.navbar');

document.querySelector('#menu-icon').onclick = () => {
    menu.classList.toggle('active');
    search.classList.remove('active');
}

// Hide Menu And Search Box On Scroll
window.onscroll = () => {
    menu.classList.remove('active');
    search.classList.remove('active');

}
//header
let header = document.querySelector('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('shadow', window.scrollY > 0);

});

async function fetchLicensesData() {
    const fetchAPI = `https://localhost:7235/api/licenses`;

    try {
        const response = await fetch(fetchAPI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Error fetching data");
        }

        const data = await response.json();
        console.log(data);
        var licenses = data;
        await renderNavbarData(licenses);
    } catch (error) {
        console.error(error);
    }
}

async function renderNavbarData(licenses) {
    const dataListElement = document.getElementById('navLicenseSelect');
    dataListElement.innerHTML = '';

    for (const item of licenses) {
        const liElement = document.createElement('span');
        liElement.innerHTML = `<li class="dropdown - item" onclick="location.href = '/Home/License?licenseid=${item.licenseId}';">Bằng ${item.licenseId}</li>`;
        dataListElement.appendChild(liElement);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchLicensesData();
});