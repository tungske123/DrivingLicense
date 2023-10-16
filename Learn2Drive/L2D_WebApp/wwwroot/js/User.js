//Classes definitions
var Rent = /** @class */ (function () {
    function Rent() {
    }
    return Rent;
}());
var User = /** @class */ (function () {
    function User(userID, accountId, avatar, cccd, email, fullName, birthDate, nationality, phoneNumber, address) {
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
    return User;
}());
var QuizAttemptData = /** @class */ (function () {
    function QuizAttemptData() {
    }
    return QuizAttemptData;
}());
//Methods
// function getFormattedDate(date: Date): string {
//     const day = ('0' + date.getUTCDate()).slice(-2); // Extract day component and pad with leading zero if necessary
//     const month = ('0' + (date.getUTCMonth() + 1)).slice(-2); // Extract month component (Note: month is zero-based) and pad with leading zero if necessary
//     const year = date.getUTCFullYear().toString(); // Extract year component
//     return `${day}-${month}-${year}`;
// }
function loadUserInfo(user) {
    var AvatarElement = document.querySelector('.img-account-profile');
    var FullNameElement = document.getElementById('FullName');
    var AddressElement = document.getElementById('Address');
    var EmailElement = document.getElementById('Email');
    var PhoneNumberElement = document.getElementById('PhoneNumber');
    var BirthDateElement = document.getElementById('BirthDate');
    var CCCDElement = document.getElementById('CCCD');
    AvatarElement.src = user.avatar;
    FullNameElement.value = user.fullName;
    AddressElement.value = user.address;
    EmailElement.value = user.email;
    PhoneNumberElement.value = user.phoneNumber;
    BirthDateElement.value = user.birthDate.toISOString().split('T')[0];
    CCCDElement.value = user.cccd;
}
function loadRentData(rentData) {
    var rentTable = document.getElementById('rentTable');
    if (rentData === null) {
        var newRow = rentTable.insertRow(-1);
        var newCell = newRow.insertCell(0);
        var h1 = document.createElement("h1");
        h1.textContent = "Không có thông tin";
        newCell.appendChild(h1);
        return;
    }
    rentData.forEach(function (rent) {
        var row = rentTable.insertRow();
        row.insertCell().textContent = rent.vehicleName;
        row.insertCell().textContent = rent.startDate.toLocaleString();
        row.insertCell().textContent = rent.endDate.toLocaleString();
        row.insertCell().textContent = rent.totalRentPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
        row.insertCell().innerHTML = (rent.status === 'true') ?
            "<button class=\"btn btn-success\" type=\"button\">C\u00F2n h\u1EA1n</button>" :
            "<button class=\"btn btn-danger\" type=\"button\">H\u1EBFt h\u1EA1n</button>";
        row.insertCell().innerHTML = "<button class=\"btn btn-outline-danger delete-btn\" type=\"button\">H\u1EE7y thu\u00EA</button>";
    });
}
function loadQuizAttemptData(resultList) {
    var quizResultTable = document.getElementById('quizResultTable');
    if (resultList === null) {
        var newRow = quizResultTable.insertRow(-1);
        var newCell = newRow.insertCell(0);
        var h1 = document.createElement("h1");
        h1.textContent = "Không có thông tin";
        newCell.appendChild(h1);
        return;
    }
    resultList.forEach(function (result) {
        var row = quizResultTable.insertRow();
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
var userObject;
function processUserData(data) {
    var user = new User(data.userID, data.accountID, data.avatar, data.cccd, data.email, data.fullName, new Date(data.birthDate), data.nationality, data.phoneNumber, data.address);
    userObject = user;
    loadUserInfo(user);
    loadRentData(data.rentData);
    loadQuizAttemptData(data.quizAttemptData);
}
var UserID = document.getElementById('UserID').textContent;
var fetchUrl = "https://localhost:7235/api/users/profile/" + UserID;
window.addEventListener('DOMContentLoaded', function () {
    fetch(fetchUrl)
        .then(function (response) {
        if (!response.ok) {
            throw new Error("Network error");
        }
        return response.json();
    })
        .then(function (data) {
        console.log(data);
        processUserData(data);
    })
        .catch(function (error) {
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
//# sourceMappingURL=User.js.map