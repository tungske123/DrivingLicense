//Classes definitions
class Rent {
    rentId: string;
    vehicleId: string;
    userId: string;
    startDate: Date;
    endDate: Date;
    totalRentPrice: number;
    status: boolean;
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

//Methods
function getFormattedDate(date: Date) {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${day}/${month}/${year} ${hours}:${minutes}` as string;
}

function loadUserInfo(user: User) {
    const FullNameElement = document.getElementById('FullName') as HTMLInputElement;
    const AddressElement = document.getElementById('Address') as HTMLInputElement;
    const EmailElement = document.getElementById('Email') as HTMLInputElement;
    const PhoneNumberElement = document.getElementById('PhoneNumber') as HTMLInputElement;
    const BirthDateElement = document.getElementById('BirthDate') as HTMLInputElement;

    FullNameElement.value = user.fullName;
    AddressElement.value = user.address;
    EmailElement.value = user.email;
    PhoneNumberElement.value = user.phoneNumber;
    BirthDateElement.value = user.birthDate.toISOString().split('T')[0];

}

function loadRentData(rentData: Rent[]) {
    const rentTable = document.getElementById('rentTable') as HTMLTableElement;
    rentData.forEach(rent => {
        const row = rentTable.insertRow();
        row.insertCell().textContent = rent.vehicleId;
        row.insertCell().textContent = getFormattedDate(rent.startDate);
        row.insertCell().textContent = getFormattedDate(rent.endDate);
        row.insertCell().textContent = rent.totalRentPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
        row.insertCell().innerHTML = (rent.startDate < rent.endDate) ?
            `<button class="btn btn-success" type="button">Còn hạn</button>` :
            `<button class="btn btn-danger" type="button">Hết hạn</button>`;
    });
}

window.addEventListener('DOMContentLoaded', () => {
    fetch('https://localhost:7208/api/users/profile/AD833572-8222-41FB-A71E-89F214B0BE8B')
        .then(response => {
            if (!response.ok) {
                throw new Error("Network error");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
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
                data.address,
            );
            loadUserInfo(user);
            loadRentData(data.rentData);
        })
        .catch(error => {
            console.error('Error: ' + error);
        });
});
