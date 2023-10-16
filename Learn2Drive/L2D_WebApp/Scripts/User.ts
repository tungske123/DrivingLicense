//Classes definitions
class Rent {
    rentId: string;
    vehicleName: string;
    userId: string;
    startDate: Date;
    endDate: Date;
    totalRentPrice: number;
    status: string;
}
class User {
    userID: string;
    accountID: string;
    avatar: string;
    cccd: string;
    email: string;
    fullName: string;
    birthDate: Date;
    nationality: string;
    phoneNumber: string;
    address: string;
    rentData: Rent[];
    constructor(userID: string, accountId: string, avatar: string, cccd: string, email: string, fullName: string, birthDate: Date,
        nationality: string, phoneNumber: string, address: string) {
        this.userID = userID;
        this.accountID = accountId;
        this.avatar = avatar;
        this.cccd = cccd;
        this.email = email;
        this.fullName = fullName;
        this.birthDate = birthDate;
        this.nationality = nationality;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }
}
class QuizAttemptData {
    quizName: string;
    license: string;
    attemptDate: Date;
    totalQuestion: number;
    correctQuestion: number;
    incorrectQuestion: number;
    remainingQuestion: number;
    result: number;
}
//Methods
// function getFormattedDate(date: Date): string {
//     const day = ('0' + date.getUTCDate()).slice(-2); // Extract day component and pad with leading zero if necessary
//     const month = ('0' + (date.getUTCMonth() + 1)).slice(-2); // Extract month component (Note: month is zero-based) and pad with leading zero if necessary
//     const year = date.getUTCFullYear().toString(); // Extract year component
//     return `${day}-${month}-${year}`;
// }

function loadUserInfo(user: User) {
    const AvatarElement = document.querySelector('.img-account-profile') as HTMLImageElement;
    const FullNameElement = document.getElementById('FullName') as HTMLInputElement;
    const AddressElement = document.getElementById('Address') as HTMLInputElement;
    const EmailElement = document.getElementById('Email') as HTMLInputElement;
    const PhoneNumberElement = document.getElementById('PhoneNumber') as HTMLInputElement;
    const BirthDateElement = document.getElementById('BirthDate') as HTMLInputElement;
    const CCCDElement = document.getElementById('CCCD') as HTMLInputElement;
    AvatarElement.src = user.avatar;
    FullNameElement.value = user.fullName;
    AddressElement.value = user.address;
    EmailElement.value = user.email;
    PhoneNumberElement.value = user.phoneNumber;
    BirthDateElement.value = user.birthDate.toISOString().split('T')[0];
    CCCDElement.value = user.cccd;
}

function loadRentData(rentData: Rent[]) {
    var rentTable = document.getElementById('rentTable') as HTMLTableElement;
    if (rentData === null) {
        const newRow = rentTable.insertRow(-1);
        const newCell = newRow.insertCell(0);
        let h1 = document.createElement("h1");
        h1.textContent = "Không có thông tin";
        newCell.appendChild(h1);
        return;
    }
    rentData.forEach(rent => {
        const row = rentTable.insertRow();
        row.insertCell().textContent = rent.vehicleName;
        row.insertCell().textContent = rent.startDate.toLocaleString();
        row.insertCell().textContent = rent.endDate.toLocaleString();
        row.insertCell().textContent = rent.totalRentPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
        row.insertCell().innerHTML = (rent.status === 'true') ?
            `<button class="btn btn-success" type="button">Còn hạn</button>` :
            `<button class="btn btn-danger" type="button">Hết hạn</button>`;
        row.insertCell().innerHTML = `<button class="btn btn-outline-danger delete-btn" type="button">Hủy thuê</button>`;
    });
}
function loadQuizAttemptData(resultList: QuizAttemptData[]) {
    var quizResultTable = document.getElementById('quizResultTable') as HTMLTableElement;
    if (resultList === null) {
        const newRow = quizResultTable.insertRow(-1);
        const newCell = newRow.insertCell(0);
        let h1 = document.createElement("h1");
        h1.textContent = "Không có thông tin";
        newCell.appendChild(h1);
        return;
    }
    resultList.forEach(result => {
        const row = quizResultTable.insertRow();
        row.insertCell().textContent = result.quizName;
        row.insertCell().textContent = result.license;
        row.insertCell().textContent = result.attemptDate.toLocaleString();
        row.insertCell().textContent = result.totalQuestion.toString();
        row.insertCell().textContent = result.correctQuestion.toString();
        row.insertCell().textContent = result.incorrectQuestion.toString();
        row.insertCell().textContent = result.remainingQuestion.toString();
        row.insertCell().textContent = result.result.toFixed(0).toString() + " %";
    });
}

let userObject: User;
function processUserData(data) {
    let user = new User(
        data.userID,
        data.accountID,
        data.avatar,
        data.cccd,
        data.email,
        data.fullName,
        new Date(data.birthDate),
        data.nationality,
        data.phoneNumber,
        data.address
    );
    userObject = user;
    loadUserInfo(user);
    loadRentData(data.rentData);
    loadQuizAttemptData(data.quizAttemptData);
}
const UserID = document.getElementById('UserID').textContent;
const fetchUrl: string = `https://localhost:7235/api/users/profile/` + UserID;
window.addEventListener('DOMContentLoaded', () => {
    fetch(fetchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network error");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            processUserData(data);
        })
        .catch(error => {
            console.error('Error: ' + error);
        });
});
// const userForm = document.getElementById('userForm') as HTMLFormElement;
// userForm.addEventListener('submit', (e) => {
//     const AvatarElement = document.querySelector('.img-account-profile') as HTMLImageElement;
//     const FullNameElement = document.getElementById('FullName') as HTMLInputElement;
//     const AddressElement = document.getElementById('Address') as HTMLInputElement;
//     const EmailElement = document.getElementById('Email') as HTMLInputElement;
//     const PhoneNumberElement = document.getElementById('PhoneNumber') as HTMLInputElement;
//     const BirthDateElement = document.getElementById('BirthDate') as HTMLInputElement;
//     const CCCDElement = document.getElementById('CCCD') as HTMLInputElement;
//     e.preventDefault();
//     const userData = {
//         userID: userObject.userID,
//         accountID: userObject.accountID,
//         cccd: CCCDElement.textContent,
//         email: EmailElement.textContent,
//         fullName: FullNameElement.textContent,
//         birthDate: BirthDateElement.value,
//         nationality: userObject.nationality,
//         phoneNumber: PhoneNumberElement.textContent,
//         address: AddressElement.textContent
//     };
//     console.log(userData);

//     const id: string = userObject.userID;
//     fetch(`https://localhost:7208/api/users/profile/update/` + id, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData)
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//     })
//     .catch (error => {
//         console.error('Error: ' + error);
//     });
// });