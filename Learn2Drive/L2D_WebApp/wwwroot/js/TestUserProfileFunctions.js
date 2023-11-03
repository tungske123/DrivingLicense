////Definitions
//class VehicleData {
//    vehicleId: string;
//    name: string;
//    image: string;
//    brand: string;
//    type: string;
//    years: number;
//    contactNumber: string;
//    address: string;
//    rentPrice: number;
//    status: boolean;
//    constructor(vehicleId: string, name: string, image: string, brand: string, type: string, years: number, contactNumber: string,
//        address: string, rentPrice: number, status: boolean) {
//        this.vehicleId = vehicleId;
//        this.name = name;
//        this.image = image;
//        this.brand = brand;
//        this.type = type;
//        this.years = years;
//        this.contactNumber = contactNumber;
//        this.address = address;
//        this.rentPrice = rentPrice;
//        this.status = status;
//    }
//}
//class RentData {
//    rentId: string;
//    vehicleId: string;
//    vehicleName: string;
//    vehicleImage: string;
//    startDate: Date;
//    endDate: Date;
//    totalRentPrice: number;
//    status: string;
//    vehicle: VehicleData;
//}
//class QuizAttemptData {
//    attemptID: string;
//    quizName: string;
//    license: string;
//    attemptDate: Date;
//    totalQuestion: number;
//    correctQuestion: number;
//    incorrectQuestion: number;
//    remainingQuestion: number;
//    result: number;
//}
//const userInfoForm = document.getElementById('userInfoForm') as HTMLFormElement;
//const deleteModal = document.getElementById('delete-modal') as HTMLDivElement;
//const deleteModalButtons = document.querySelectorAll('.deleteModalButton') as NodeListOf<HTMLButtonElement>;
//const editModal = document.getElementById('editModal') as HTMLDivElement;
//const previewImageElement = document.getElementById('previewImage') as HTMLImageElement;
//const avatarInputElement = document.getElementById('dropzone-file') as HTMLInputElement;
//const tabButtonList = document.querySelectorAll('.dashboard-item') as NodeListOf<HTMLLIElement>;
//const filterDateOptions = document.querySelectorAll('.filter-date-option') as NodeListOf<HTMLInputElement>;
//const dateFilterContent = document.querySelector('.date-filter-content') as HTMLSpanElement;
//const rentInfoSection = document.getElementById('rentInfo') as HTMLElement;
//const rentTableBody = document.getElementById('rentTableBody') as HTMLTableSectionElement;
//const rentTableSearchBar = document.getElementById('rentTableSearch') as HTMLInputElement;
//const tabLinkList: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('#sidebar-content .dashboard-item');
//const avatarPreviewImage = document.getElementById('previewImage') as HTMLImageElement;
//const fullNameInput = document.getElementById('fullname') as HTMLInputElement;
//const birthDateInput = document.getElementById('birthdate') as HTMLInputElement;
//const phoneInput = document.getElementById('phone') as HTMLInputElement;
//const nationalityInput = document.getElementById('nationality') as HTMLInputElement;
//const addressInput = document.getElementById('address') as HTMLInputElement;
//const CCCDInput = document.getElementById('cccd') as HTMLInputElement;
//const emailInput = document.getElementById('email') as HTMLInputElement;
//const passwordInput = document.getElementById('password') as HTMLInputElement;
//const repassInput = document.getElementById('repass') as HTMLInputElement;
//const rentPagingContent = document.querySelector('#rentPagination .ul') as HTMLUListElement;
////
//const UserId = (document.getElementById('UserId') as HTMLDivElement).textContent;
//var keyword: string = ``;
//var dayRangeValue: number = -1;
//var page: number = 1;
//var totalPages: number = 1;
//var openedDeleteModal: boolean = false;
//var openedEditModal: boolean = false;
//var rentId: string | null = ``;
//var vehiclePrice: number = 0;
////Methods
//function GetFormattedDate(date: Date) {
//    const formattedDate =
//        ("0" + date.getDate()).slice(-2) + "/" +
//        ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
//        date.getFullYear() + " vào lúc " +
//        ("0" + date.getHours()).slice(-2) + ":" +
//        ("0" + date.getMinutes()).slice(-2);
//    return formattedDate;
//}
//function renderRentDataRow(data: RentData) {
//    const newRow = document.createElement('tr');
//    newRow.className = 'row';
//    const vehicleImageCell = document.createElement('td');
//    vehicleImageCell.className = `w-32 p-4`;
//    const vehicleImageElement = document.createElement('img');
//    vehicleImageElement.className = `rounded-lg`;
//    vehicleImageElement.src = `/img/vehicle/${data.vehicleImage}`;
//    vehicleImageCell.appendChild(vehicleImageElement);
//    newRow.appendChild(vehicleImageCell);
//    const vehicleNameCell = document.createElement('td');
//    vehicleNameCell.className = 'key-cell';
//    vehicleNameCell.textContent = data.vehicleName;
//    newRow.appendChild(vehicleNameCell);
//    const startDateCell = document.createElement('td');
//    startDateCell.className = 'normal-cell';
//    startDateCell.textContent = GetFormattedDate(new Date(data.startDate));
//    newRow.appendChild(startDateCell);
//    const endDateCell = document.createElement('td');
//    endDateCell.className = 'normal-cell';
//    endDateCell.textContent = GetFormattedDate(new Date(data.endDate));
//    newRow.appendChild(endDateCell);
//    const totalRentPriceCell = document.createElement('td');
//    totalRentPriceCell.className = 'normal-cell';
//    totalRentPriceCell.textContent = data.totalRentPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
//    newRow.appendChild(totalRentPriceCell);
//    const statusCell = document.createElement('td');
//    statusCell.className = 'normal-cell'
//    statusCell.innerHTML = data.status === `true` ? `<div style="color: green;">Còn hạn</div>` : `<div style="color: red;">Hết hạn</div>`;
//    newRow.appendChild(statusCell);
//    const buttonsCell = document.createElement('td');
//    buttonsCell.className = 'normal-cell';
//    const editButton: HTMLButtonElement = document.createElement('button');
//    editButton.type = 'button';
//    editButton.className = 'edit-button';
//    editButton.setAttribute('rid', data.rentId);
//    editButton.textContent = 'Chi tiết';
//    editButton.addEventListener('click', async () => {
//        const newRentId = editButton.getAttribute('rid');
//        rentId = newRentId;
//        await openEditModal();
//    });
//    buttonsCell.appendChild(editButton);
//    const cancelButton: HTMLButtonElement = document.createElement('button');
//    cancelButton.type = 'button';
//    cancelButton.className = 'cancel-button';
//    cancelButton.setAttribute('rid', data.rentId);
//    cancelButton.textContent = 'Hủy đơn thuê';
//    cancelButton.addEventListener('click', () => {
//        console.log('Clicked delete button');
//        const newRentId = cancelButton.getAttribute('rid');
//        rentId = newRentId;
//        openDeleteModal();
//    });
//    buttonsCell.appendChild(cancelButton);
//    newRow.appendChild(buttonsCell);
//    rentTableBody.appendChild(newRow);
//}
////For modals
//function openDeleteModal() {
//    if (!openedDeleteModal) {
//        deleteModal.style.display = 'flex';
//        openedDeleteModal = true;
//        deleteModal.style.justifyContent = `center`;
//        deleteModal.style.alignItems = `center`;
//        deleteModal.style.backdropFilter = `blur(2px)`;
//    }
//}
//async function closeDeleteModal(button: HTMLButtonElement) {
//    if (openedDeleteModal) {
//        deleteModal.style.display = 'none';
//        openedDeleteModal = false;
//        const action = String(button.getAttribute('action'));
//        if (action === `confirm`) {
//            await deleteRent();
//        }
//    }
//}
//async function openEditModal() {
//    if (!openedEditModal) {
//        await fetchRentDataForEditModal();
//        editModal.style.display = 'flex';
//        editModal.style.justifyContent = `center`;
//        editModal.style.alignItems = `center`;
//        editModal.style.backdropFilter = `blur(2px)`;
//        openedEditModal = true;
//    }
//}
//function closeEditModal() {
//    if (openedEditModal) {
//        console.log(`Close edit modal`);
//        editModal.style.display = `none`;
//        openedEditModal = false;
//    }
//}
//async function deleteRent() {
//    const fetchUrl = `https://localhost:7235/api/rent/delete/${UserId}?rid=${rentId}`;
//    try {
//        const response = await fetch(fetchUrl, {
//            method: 'DELETE',
//            headers: {
//                'Content-Type': 'application/json'
//            }
//        });
//        if (response.status !== 204) {
//            throw new Error(`Delete rent Error! Status code: ${response.status}`);
//        }
//        await fetchRentDataPagingAsync();
//    } catch (error) {
//        console.error(`Error: ${error}`);
//    }
//}
//function renderRentData(data: RentData[]) {
//    const noResultHeading = document.querySelector('.no-result') as HTMLHeadingElement;
//    if (data === null || data.length === 0) {
//        rentTableBody.innerHTML = '';
//        noResultHeading.style.display = 'block';
//        return;
//    }
//    noResultHeading.style.display = 'none';
//    rentTableBody.innerHTML = '';
//    const loader = `<div role="status" id="rentTableLoader"
//    class="p-4 space-y-4 w-full border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 dark:border-gray-700">
//    <div class="flex items-center justify-between">
//        <div>
//            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
//            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
//        </div>
//        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
//    </div>
//    <div class="flex items-center justify-between pt-4">
//        <div>
//            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
//            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
//        </div>
//        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
//    </div>
//    <div class="flex items-center justify-between pt-4">
//        <div>
//            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
//            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
//        </div>
//        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
//    </div>
//    <div class="flex items-center justify-between pt-4">
//        <div>
//            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
//            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
//        </div>
//        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
//    </div>
//    <div class="flex items-center justify-between pt-4">
//        <div>
//            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
//            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
//        </div>
//        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
//    </div>
//    <span class="sr-only">Loading...</span>
//</div>`;
//    rentTableBody.innerHTML = loader;
//    setTimeout(() => {
//        rentTableBody.innerHTML = ``;
//        //Render the content
//        data.forEach(rentData => {
//            renderRentDataRow(rentData);
//        });
//    }, 1000);
//}
//function createRentPageItemElement(text: string, className: string) {
//    const li = document.createElement('li');
//    if (className === `prev-button` || className === `next-button`) {
//        li.innerHTML = `<button class="${className}">${text}</button>`;
//        li.addEventListener('click', async () => {
//            if (li.classList.contains(`prev-button`)) {
//                --page;
//                if (page <= 0) {
//                    page = totalPages;
//                }
//            } else {
//                ++page;
//                if (page > totalPages) {
//                    page = 1;
//                }
//            }
//            console.log(`Current page: ${page}`);
//            await fetchRentDataPagingAsync();
//        });
//    } else {
//        li.innerHTML = `<button class="${className}" page="${text}">${text}</button>`;
//        li.addEventListener('click', async () => {
//            const newPage = Number(li.getAttribute("page"));
//            page = newPage;
//            await fetchRentDataPagingAsync();
//        });
//    }
//    rentPagingContent.appendChild(li);
//}
//function renderRentPagingBar() {
//    rentPagingContent.innerHTML = '';
//    createRentPageItemElement(`&lt;`, `prev-button`);
//    for (var pageCount = 1; pageCount <= totalPages; ++pageCount) {
//        if (pageCount === page) {
//            createRentPageItemElement(pageCount.toString(), `is-active-page`);
//        } else {
//            createRentPageItemElement(pageCount.toString(), `page`);
//        }
//    }
//    createRentPageItemElement(`&gt;`, `next-button`);
//}
//function fetchRentData() {
//    const fetchUrl: string = `https://localhost:7235/api/rent/filter/${UserId}`;
//    const sendData = {
//        keyword: keyword,
//        dayRangeValue: dayRangeValue
//    };
//    console.log(`Send data: ${sendData}`);
//    fetch(fetchUrl, {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify(sendData)
//    }).then(repsonse => {
//        if (!repsonse.ok) {
//            throw new Error(`Network error!Status code: ${repsonse.status}`);
//        }
//        return repsonse.json();
//    })
//        .then(data => {
//            console.log(data);
//            const rentDataList: RentData[] = data;
//            renderRentData(rentDataList);
//        })
//        .catch(error => {
//            console.error(`Error: ${error}`);
//        })
//}
//function fetchRentDataPaging() {
//    const fetchUrl = `https://localhost:7235/api/rent/filter/page/${UserId}?page=${page}`;
//    const sendData = {
//        keyword: keyword,
//        dayRangeValue: dayRangeValue
//    };
//    console.log(`Send data: ${sendData}`);
//    fetch(fetchUrl, {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify(sendData)
//    }).then(repsonse => {
//        if (!repsonse.ok) {
//            throw new Error(`Network error!Status code: ${repsonse.status}`);
//        }
//        return repsonse.json();
//    })
//        .then(data => {
//            console.log(data);
//            const rentDataList: RentData[] = data.rentData;
//            renderRentData(rentDataList);
//            totalPages = Number(data.totalPages);
//            console.log(`Total pages: ${totalPages}`);
//            renderRentPagingBar();
//        })
//        .catch(error => {
//            console.error(`Error: ${error}`);
//        })
//}
//async function fetchRentDataPagingAsync() {
//    const fetchUrl = `https://localhost:7235/api/rent/filter/page/${UserId}?page=${page}`;
//    const sendData = {
//        keyword: keyword,
//        dayRangeValue: dayRangeValue
//    };
//    try {
//        const response = await fetch(fetchUrl, {
//            method: 'POST',
//            headers: {
//                'Content-Type': 'application/json'
//            },
//            body: JSON.stringify(sendData)
//        });
//        if (!response.ok) {
//            throw new Error(`Http error! Status code: ${response.status}`);
//        }
//        const data = await response.json();
//        console.log(data);
//        const rentDataList: RentData[] = data.rentData;
//        renderRentData(rentDataList);
//        totalPages = Number(data.totalPages);
//        console.log(`Total pages: ${totalPages}`);
//        renderRentPagingBar();
//    } catch (error) {
//        console.error(`Error: ${error}`);
//    }
//}
//async function fetchRentDataForEditModal() {
//    const fetchUrl = `https://localhost:7235/api/rent/${rentId}`;
//    try {
//        const response = await fetch(fetchUrl, {
//            method: 'GET',
//            headers: {
//                'Content-Type': 'application/json'
//            }
//        });
//        if (!response.ok) {
//            throw new Error(`Http Error! Status code: ${response.status}`);
//        }
//        const data = await response.json();
//        const rent: RentData = data;
//        renderRentDataForEditModal(rent);
//    } catch (error) {
//        console.error(`Error: ${error}`);
//    }
//}
//function renderRentDataForEditModal(data: RentData) {
//    const vehicleImageElement = document.getElementById('vehicleImage') as HTMLImageElement;
//    vehicleImageElement.src = `/img/vehicle/${data.vehicle.image}`;
//    const vehicleNameElement = document.getElementById('vehicleName') as HTMLSpanElement;
//    vehicleNameElement.textContent = data.vehicle.name;
//    const vehicleBrandElement = document.getElementById('brand') as HTMLSpanElement;
//    vehicleBrandElement.textContent = data.vehicle.brand;
//    const vehicleTypeElement = document.getElementById('type') as HTMLSpanElement;
//    vehicleTypeElement.textContent = data.vehicle.type;
//    const vehiclePriceElement = document.getElementById('vehiclePrice') as HTMLSpanElement;
//    vehiclePriceElement.textContent = GetFormattedPrice(data.vehicle.rentPrice) + `/ Giờ`;
//    vehiclePrice = data.vehicle.rentPrice;
//    const addressElement = document.getElementById('address') as HTMLSpanElement;
//    addressElement.textContent = data.vehicle.address;
//    const phoneNumberElememnt = document.getElementById('contactNumber') as HTMLSpanElement;
//    phoneNumberElememnt.textContent = data.vehicle.contactNumber;
//    const startDateElement = document.getElementById('startdate') as HTMLInputElement;
//    startDateElement.value = data.startDate.toString();
//    const endDateElement = document.getElementById('enddate') as HTMLInputElement;
//    endDateElement.value = data.endDate.toString();
//    const minuteDifferences = new Date(data.endDate).getTime() - new Date(data.startDate).getTime();
//    const hourDifferences = minuteDifferences / (1000 * 60 * 60);
//    const rentHoursElement = document.getElementById('rentHours') as HTMLSpanElement;
//    rentHoursElement.textContent = `${hourDifferences} giờ`;
//    const totalPriceElement = document.getElementById('totalPrice') as HTMLSpanElement;
//    totalPriceElement.textContent = GetFormattedPrice(data.totalRentPrice) + " VNĐ";
//}
//function GetFormattedPrice(price: number) {
//    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString();
//}
//function GetFinalCalculatedPrice(): number {
//    const startDateElement = document.getElementById('startdate') as HTMLInputElement;
//    const endDateElement = document.getElementById('enddate') as HTMLInputElement;
//    const startDate = new Date(startDateElement.value);
//    const endDate = new Date(endDateElement.value);
//    const minuteDifferences = endDate.getTime() - startDate.getTime();
//    const hourDifferences = minuteDifferences / (1000 * 60 * 60);
//    const totalPrice = vehiclePrice * hourDifferences;
//    return totalPrice;
//}
//function CheckValidRentDate(): boolean {
//    const startDateElement = document.getElementById('startdate') as HTMLInputElement;
//    const endDateElement = document.getElementById('enddate') as HTMLInputElement;
//    if (!startDateElement.value || !endDateElement.value) {
//        return false;
//    }
//    const startDate = startDateElement.value;
//    const endDate = endDateElement.value;
//    return (startDate <= endDate);
//}
//function UpdateRentPrice() {
//    if (!CheckValidRentDate()) {
//        alert('Vui lòng chọn ngày và giờ phù hợp');
//        return;
//    }
//    const totalPrice = GetFinalCalculatedPrice();
//    const totalPriceElement = document.getElementById('totalPrice') as HTMLSpanElement;
//    totalPriceElement.textContent = GetFormattedPrice(totalPrice) + " VNĐ";
//}
//async function saveRentData() {
//    const startDateElement = document.getElementById('startdate') as HTMLInputElement;
//    const endDateElement = document.getElementById('enddate') as HTMLInputElement;
//    const totalPrice = GetFinalCalculatedPrice();
//    const sendData = [
//        {
//            op: `replace`,
//            path: `/startDate`,
//            value: startDateElement.value
//        },
//        {
//            op: `replace`,
//            path: `/endDate`,
//            value: endDateElement.value
//        },
//        {
//            op: `replace`,
//            path: `/totalRentPrice`,
//            value: totalPrice
//        }
//    ];
//    const fetchUrl = `https://localhost:7235/api/rent/update/${rentId}`;
//    try {
//        const response = await fetch(fetchUrl, {
//            method: 'PATCH',
//            headers: {
//                'Content-Type': 'application/json-patch+json'
//            },
//            body: JSON.stringify(sendData)
//        });
//        if (!response || response.status !== 204) {
//            throw new Error(`Http Error! Status code: ${response.status}`);
//        }
//        alert(`Lưu thành công!`);
//        await fetchRentDataForEditModal();
//    } catch (error) {
//        console.error(`Error: ${error}`);
//    }
//    await fetchRentDataPagingAsync();
//}
////Events
//deleteModalButtons.forEach(btn => {
//    btn.addEventListener('click', async () => {
//        await closeDeleteModal(btn);
//    });
//});
//tabLinkList.forEach(tabLink => {
//    tabLink.addEventListener('click', (e) => {
//        e.preventDefault();
//        const tabList = document.querySelectorAll('.user-tab') as NodeListOf<HTMLElement>;
//        tabList.forEach(tab => {
//            tab.style.display = 'none';
//        });
//        // Remove is-active from all tab links
//        tabLinkList.forEach(link => {
//            link.classList.remove('is-active');
//        });
//        // Add is-active to this current tab link
//        tabLink.classList.add('is-active');
//        //Get id target for each link
//        const linkAnchor: HTMLAnchorElement | null = tabLink.querySelector('a');
//        if (!linkAnchor) {
//            return;
//        }
//        const target: string | null = linkAnchor.getAttribute('href');
//        if (target === `/Home`) {
//            window.location.href = `/Home`;
//            return;
//        }
//        //Show the tab
//        if (target) {
//            const tab: HTMLElement | null = document.querySelector(target);
//            if (tab) {
//                tab.style.display = 'block';
//            }
//        }
//    });
//});
//rentTableSearchBar.addEventListener('input', async () => {
//    const newKeyword = String(rentTableSearchBar.value);
//    keyword = newKeyword;
//    // fetchRentData();
//    await fetchRentDataPagingAsync();
//});
//filterDateOptions.forEach(option => {
//    option.addEventListener('input', async () => {
//        const optionText: string = String(option.value);
//        dateFilterContent.textContent = optionText;
//        const NewDayRangeValue: number = Number(option.getAttribute('day'));
//        dayRangeValue = NewDayRangeValue;
//        // fetchRentData();
//        await fetchRentDataPagingAsync();
//    });
//});
//avatarInputElement.addEventListener('change', (event) => {
//    const files = (<HTMLInputElement>event.target).files;
//    if (!files) {
//        console.log('No file selected');
//        return;
//    }
//    const file = files[0];
//    let reader = new FileReader();
//    // Set the onload function, which will be called after the file has been read
//    reader.onload = (e) => {
//        // The result attribute contains the data as a data: URL representing the file's data as a base64 encoded string.
//        previewImageElement.src = <string>reader.result;
//    };
//    // Read the image file as a data URL
//    reader.readAsDataURL(file);
//});
//window.addEventListener('DOMContentLoaded', async () => {
//    await fetchRentDataPagingAsync();
//    const startDateElement = document.getElementById('startdate') as HTMLInputElement;
//    const endDateElement = document.getElementById('enddate') as HTMLInputElement;
//    const rentSubmitBtn = document.getElementById('rentSubmitBtn');
//    startDateElement.addEventListener('change', () => {
//        UpdateRentPrice();
//    });
//    endDateElement.addEventListener('change', () => {
//        UpdateRentPrice();
//    })
//    rentSubmitBtn.addEventListener('click', async () => {
//        await saveRentData();
//    });
//    await fetchUserAttemptHistory();
//});
//userInfoForm.addEventListener('submit', (e) => {
//    const password = (document.getElementById('password') as HTMLInputElement).value;
//    const repass = (document.getElementById('repass') as HTMLInputElement).value;
//    if (password !== repass) {
//        e.preventDefault();
//        alert('Xác nhận mật khẩu và mật khẩu không giống nhau');
//        return;
//    }
//});
//tabLinkList[0].click();
////For quiz section
//class QuestionData {
//    questionText: string;
//    userAnswer: string;
//    correctAnswer: string;
//    isCorrect: boolean;
//}
//const questionDataTableBody = document.getElementById('questionDataContent') as HTMLTableSectionElement;
//const quizAttemptHistoryTableBody = document.getElementById('quizAttemptHistoryTableBody') as HTMLTableSectionElement;
//const detailsModal = document.getElementById('statModal') as HTMLDivElement;
//var openedDetailsModal: boolean = false;
//var attemptId: string | null = `A18C11ED-AD47-4D8A-9522-4A6C0B9F6158`;
//const correctPercentElement = document.getElementById('correctPercent') as HTMLDivElement;
//const incorrectPercentElement = document.getElementById('incorrectPercent') as HTMLDivElement;
//const unfinishPercentElement = document.getElementById('unfinishedPercent') as HTMLDivElement; 
//var attemptDataList: QuizAttemptData[] = [];
//async function fetchUserAttemptHistory() {
//    const fetchUrl = `https://localhost:7235/api/user/profile/quiz/${UserId}`;
//    try {
//        const response = await fetch(fetchUrl, {
//            method: 'GET',
//            headers: {
//                'Content-Type': 'application/json'
//            }
//        });
//        if (!response.ok) {
//            throw new Error(`Http Error! Status code: ${response.status}`);
//        }
//        const data = await response.json();
//        console.log(data);
//        attemptDataList = data;
//        renderUserAttemptTable(data);
//    } catch (error) {
//        console.error(`Error: ${error}`);
//    }
//}
//function openDetailsModal() {
//    if (!openedDetailsModal) {
//        detailsModal.style.display = 'flex';
//        detailsModal.style.justifyContent = `center`;
//        detailsModal.style.alignItems = 'center';
//        detailsModal.style.backdropFilter = 'blur(2px)';
//        openedDetailsModal = true;
//    }
//}
//function closeDetailsModal() {
//    if (openedDetailsModal) {
//        detailsModal.style.display = 'none';
//        openedDetailsModal = false;
//    }
//}
//function createUserAttemptTableRow(data: QuizAttemptData) {
//    const row = document.createElement('tr');
//    row.className = `bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`;
//    const quizNameCell = document.createElement('td');
//    quizNameCell.className = `px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white`;
//    quizNameCell.textContent = data.quizName;
//    row.appendChild(quizNameCell);
//    const attemptDateCell = document.createElement('td');
//    attemptDateCell.className = `px-6 py-4`;
//    attemptDateCell.textContent = new Date(data.attemptDate).toLocaleString();
//    row.appendChild(attemptDateCell);
//    const buttonsCell = document.createElement('td');
//    const editButton = document.createElement('button');
//    editButton.className = `text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`;
//    editButton.textContent = `Chi tiết`;
//    editButton.setAttribute('aid', data.attemptID);
//    editButton.addEventListener('click', async () => {
//        console.log('Clicked details button');
//        const newAttemptId = editButton.getAttribute('aid');
//        attemptId = newAttemptId;
//        const quizData = attemptDataList.find(att => att.attemptID === attemptId);
//        loadQuizStatsData(quizData);
//        await fetchQuestionHistory();
//        openDetailsModal();
//    });
//    buttonsCell.appendChild(editButton);
//    const redoButton = document.createElement('button');
//    redoButton.className = `text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900`;
//    redoButton.textContent = `Làm lại`;
//    redoButton.setAttribute('lid', data.license);
//    redoButton.addEventListener('click', () => {
//        console.log('Clicked redo button');
//        const licenseid = redoButton.getAttribute('lid');
//        window.location.href = `/Quiz?licenseid=${licenseid}`;
//    });
//    buttonsCell.appendChild(redoButton);
//    row.appendChild(buttonsCell);
//    quizAttemptHistoryTableBody.appendChild(row);
//}
//function loadQuizStatsData(data: QuizAttemptData) {
//    const totalQuestionElement = document.getElementById('totalQuestion') as HTMLSpanElement;
//    totalQuestionElement.textContent = String(data.totalQuestion);
//    const correctQuestionElement = document.getElementById('correctQuestion') as HTMLSpanElement;
//    correctQuestionElement.textContent = String(data.correctQuestion);
//    (document.getElementById('correctQuestion') as HTMLSpanElement).textContent = data.correctQuestion.toString();
//    (document.getElementById('incorrectQuestion') as HTMLSpanElement).textContent = data.incorrectQuestion.toString();
//    (document.getElementById('unfinishQuestion') as HTMLSpanElement).textContent = data.remainingQuestion.toString();
//    const correctPercent = Math.round((data.correctQuestion / data.totalQuestion) * 100);
//    const incorrectPercent = Math.round((data.incorrectQuestion / data.totalQuestion) * 100);
//    const unfinishedPercent = 100 - correctPercent - incorrectPercent;
//    console.log(`Correct: ${data.correctQuestion} - Incorrect: ${data.incorrectQuestion} - Remaining: ${data.remainingQuestion}`);
//    console.log(`${correctPercent} - ${incorrectPercent} - ${unfinishedPercent}`);
//    correctPercentElement.textContent = correctPercent.toString();
//    incorrectPercentElement.textContent = incorrectPercent.toString();
//    unfinishPercentElement.textContent = unfinishedPercent.toString();
//}
//function renderUserAttemptTable(quizAttemptList: QuizAttemptData[]) {
//    quizAttemptHistoryTableBody.innerHTML = '';
//    quizAttemptList.forEach(attempt => {
//        createUserAttemptTableRow(attempt);
//    });
//}
//async function fetchQuestionHistory() {
//    const fetchUrl = `https://localhost:7235/api/user/profile/quiz/questions/${attemptId}`;
//    try {
//        const response = await fetch(fetchUrl, {
//            method: 'GET',
//            headers: {
//                'Content-Type': 'application/json'
//            }
//        });
//        if (!response.ok) {
//            throw new Error(`Http Error! Status code: ${response.status}`);
//        }
//        const data = await response.json();
//        renderQuestionDataTable(data);
//    } catch (error) {
//        console.error(`Error: ${error}`);
//    }
//}
//function createQuestionDataTableRow(data: QuestionData) {
//    const row = document.createElement('tr');
//    row.className = `bg-white text-justify border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`;
//    const questionTextCell = document.createElement('td');
//    questionTextCell.className = `pl-2 text-gray-900 dark:text-white`;
//    questionTextCell.setAttribute('scope', 'row');
//    questionTextCell.textContent = data.questionText;
//    row.appendChild(questionTextCell);
//    const userAnswerCell = document.createElement('td');
//    userAnswerCell.className = `pl-2 px-6 py-4`;
//    userAnswerCell.textContent = data.userAnswer;
//    row.appendChild(userAnswerCell);
//    const correctAnswerCell = document.createElement('td');
//    correctAnswerCell.className = `pl-2 px-6 py-4`;
//    correctAnswerCell.textContent = data.correctAnswer;
//    row.appendChild(correctAnswerCell);
//    const resultCell = document.createElement('td');
//    resultCell.className = `px-6 py-3 text-center`;
//    resultCell.setAttribute('scope', 'col');
//    var result: string = ``;
//    if (data.userAnswer !== null && data.userAnswer !== "") {
//        if (data.userAnswer == data.correctAnswer) {
//            result = `<span class="text-green-700">Đúng</span>`;
//        } else {
//            result = `<span class="text-red-700">Sai</span>`;
//        }
//    } else {
//        result = `<span class="text-grey-700">Chưa làm</span>`;
//    } 
//    resultCell.innerHTML = result;
//    row.appendChild(resultCell);
//    questionDataTableBody.appendChild(row);
//}
//function renderQuestionDataTable(questionList: QuestionData[]) {
//    questionDataTableBody.innerHTML = ``;
//    questionList.forEach(question => {
//        createQuestionDataTableRow(question);
//    });
//}
//# sourceMappingURL=TestUserProfileFunctions.js.map