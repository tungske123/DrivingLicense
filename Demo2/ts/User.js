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
//Methods
function getFormattedDate(date) {
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    return "".concat(day, "/").concat(month, "/").concat(year, " ").concat(hours, ":").concat(minutes);
}
function loadUserInfo(user) {
    var FullNameElement = document.getElementById('FullName');
    var AddressElement = document.getElementById('Address');
    var EmailElement = document.getElementById('Email');
    var PhoneNumberElement = document.getElementById('PhoneNumber');
    var BirthDateElement = document.getElementById('BirthDate');
    FullNameElement.value = user.fullName;
    AddressElement.value = user.address;
    EmailElement.value = user.email;
    PhoneNumberElement.value = user.phoneNumber;
    BirthDateElement.value = user.birthDate.toISOString().split('T')[0];
}
function loadRentData(rentData) {
    var rentTable = document.getElementById('rentTable');
    rentData.forEach(function (rent) {
        var row = rentTable.insertRow();
        row.insertCell().textContent = rent.vehicleId;
        row.insertCell().textContent = getFormattedDate(rent.startDate);
        row.insertCell().textContent = getFormattedDate(rent.endDate);
        row.insertCell().textContent = rent.totalRentPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
        row.insertCell().innerHTML = (rent.startDate < rent.endDate) ?
            "<button class=\"btn btn-success\" type=\"button\">C\u00F2n h\u1EA1n</button>" :
            "<button class=\"btn btn-danger\" type=\"button\">H\u1EBFt h\u1EA1n</button>";
    });
}
window.addEventListener('DOMContentLoaded', function () {
    fetch('https://localhost:7208/api/users/profile/AD833572-8222-41FB-A71E-89F214B0BE8B')
        .then(function (response) {
        if (!response.ok) {
            throw new Error("Network error");
        }
        return response.json();
    })
        .then(function (data) {
        console.log(data);
        var user = new User(data.userID, data.accountID, data.avatar, data.cccd, data.email, data.fullName, new Date(data.birthDate), data.nationality, data.phoneNumber, data.address);
        loadUserInfo(user);
        loadRentData(data.rentData);
    })["catch"](function (error) {
        console.error('Error: ' + error);
    });
});
