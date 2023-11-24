var UserId = `AFB98A94-D245-4075-8B5D-9B309BCE96F3`;
let baseUrl = `https://localhost:7235`;
async function fetchExamProfileData() {
    try {
        const url = `${baseUrl}/api/user/examprofile/${UserId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error(`Error!${response.status} - ${response.statusText}`);
            return;
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

function loadUserInfo(data) {
    if (data.userData === null) {
        console.log('No user data');
        return;   
    }
    let avatarImage = document.getElementById('avatar');
    let fullNameInput = document.getElementById('fullname');
    let nationalityInput = document.getElementById('nationality');
    let birthdateInput = document.getElementById('birthdate');
    let CCCDInput = document.getElementById('cccd');
    let phoneNumberInput = document.getElementById('phone');
    let addressInput = document.getElementById('address');

    let userAvatar = data.userData.avatar;
    let hasAvatar = (userAvatar !== null && userAvatar !== ``);
    if (hasAvatar) {
        avatarImage.src = `/img/Avatar/${userAvatar}`;
    }
    fullNameInput.value = data.userData.fullName;
    nationalityInput.value = data.userData.nationality;
    let userBirthDate = data.userData.birthDate;
    let validBirthDate = (userBirthDate !== null && userBirthDate !== ``);
    if (validBirthDate) {
        birthdateInput.value = userBirthDate.split("T")[0];
    }
    CCCDInput.value = data.userData.cccd;
    phoneNumberInput.value = data.userData.phoneNumber;
    addressInput.value = data.userData.address;
}

function loadProfileData(data) {
    if (data.examProfileData !== null) {
        console.log(`No exam profile data`);
        return;
    }
    let licenseSelect = document.getElementById('license');
    licenseSelect.value = data.licenseId;
}



