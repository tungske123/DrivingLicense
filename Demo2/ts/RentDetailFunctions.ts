//Declarations
const modal = document.querySelector('.modal') as HTMLDivElement;
const modalTitle = document.querySelector('.modal-title') as HTMLSpanElement;
const startDateElement = document.querySelector('.start-date') as HTMLInputElement;
const endDateElement = document.querySelector('.end-date') as HTMLInputElement;
const pricePerHour: number = 40000;
var rentBody = document.querySelector('.rent-body') as HTMLDivElement;
var openedModal: boolean = false;

//Functions
function openModal() {
    if (!openedModal) {
        modal.classList.add('show');
        rentBody.classList.add('blur-background');
        document.body.classList.add('modal-open');
        openedModal = true;
    }
}
function closeModal() {
    if (openedModal) {
        modal.classList.remove('show');
        rentBody.classList.remove('blur-background');
        document.body.classList.remove('modal-open');
        openedModal = false;
    }
}

function openSubmitForm() {
    const hasValidRentDate: boolean = checkValidRentDate();
    if (!hasValidRentDate) {
        alert('Vui lòng nhập ngày và giờ phù hợp');
        return;
    }
    openModal();
}

function checkValidRentDate(): boolean {
    const startDate = startDateElement.value;
    const endDate = endDateElement.value;
    return (startDate <= endDate);
}

function calculatePrice(pricePerHour: number) {
    const CostElement = document.querySelector('.finalcost') as HTMLParagraphElement;
    if (!checkValidRentDate()) {
        alert('Vui lòng nhập ngày và giờ phù hợp');
        CostElement.textContent = `Chưa có thông tin`;
        return;
    }
    const startDate = new Date(startDateElement.value);
    const endDate = new Date(endDateElement.value);
    const minuteDifferences = endDate.getTime() - startDate.getTime();
    const hourDifferences = minuteDifferences / (1000 * 60 * 60);
    const totalPrice = pricePerHour * hourDifferences;
    CostElement.textContent = totalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
}

//Events
startDateElement.addEventListener('change', () => {
    calculatePrice(pricePerHour);
});
endDateElement.addEventListener('change', () => {
    calculatePrice(pricePerHour);
});

const UserId: string = `1AD7482E-2EB6-4394-B63A-D22120241532`;
const cookieValue: string = `.AspNetCore.Session=CfDJ8Df8HqZpRiZNhjIT0NyT1BKfi3xVmayL9ktyM3GQwjp0HSdwA74b%2BxQ3RJMyKMMesti5l9b5ptunRWeD5MbBpi%2BdyDC8dvmmRu5Vo%2BBAT3KLRaxYejMOpByH3o8yaNUpNu3aG3W%2F%2BbUrHJVBHJmjCHj%2Bkl3a4YiPKqUDl%2BCMegDF`;
const registerForm = document.getElementById('RegisterForm') as HTMLFormElement;
registerForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const url: string = `https://localhost:7235/api/hire/register/${UserId}`;
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    if (response.status !== 204) {
        throw new Error(`HTTP Error! Status code: ${response.status}`);
    }
    alert(`Đăng kí học thành công!`);
});
