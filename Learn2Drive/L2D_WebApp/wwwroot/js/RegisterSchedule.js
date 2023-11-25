const baseUrl = `https://localhost:7235`;
async function checkLogin() {
    try {
        const response = await fetch(`${baseUrl}/api/login/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            return false;
        }
        const data = await response.json();
        return (data.role === 'user');
    } catch (error) {
        console.error(error);
    }
}

async function fetchLicenseData() {
    try {
        const url = `${baseUrl}/api/licenses`;
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
        loadLicenseDataToRegisterForm(data);
    } catch (error) {
        console.error(error);
    }
}

var registerButton = document.getElementById('registerButton');
registerButton.addEventListener('click', async (e) => {
    var loggedIn = await checkLogin();
    if (loggedIn === false) {
        e.preventDefault();
        window.location = '/Login';
        return;
    }
});
var registerForm = document.getElementById('RegisterForm');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
        icon: 'question',
        title: 'Xác nhận đăng kí học?',
        text: 'Bạn có thể xem lịch học ở mục thời khóa biểu',
        confirmButtonText: 'Đăng kí ngay',
        showCancelButton: true,
        confirmButtonColor: '#d90429',
        cancelButtonText: 'Hủy'
    });
    if (result.isConfirmed) {
        var UserId = document.getElementById('UserId').textContent;
        var formData = new FormData(registerForm);
        var url = `${baseUrl}/api/hire/register/${UserId}`;
        var response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        if (response.status !== 204) {
            throw new Error(`HTTP Error! Status code: ${response.status}`);
        }

        Swal.fire({
            icon: 'success',
            title: 'Đăng kí học thành công!',
            confirmButtonColor: '#d90429'
        });
    }
});

async function fetchTeacherData() {
    try {
        var url = `https://localhost:7235/api/teachers`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error! status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        loadTeacherDataToRegisterForm(data);
    } catch (error) {
        console.error(error);
    }
}
function loadTeacherDataToRegisterForm(teacherList) {
    let teacherSelect = document.getElementById('teacherid');
    //Clear all options
    while (teacherSelect.options.length > 0) {
        teacherSelect.remove(0);
    }

    teacherList.forEach(teacher => {
        if (teacher.fullName !== null && teacher.fullName !== ``) {
            var option = document.createElement('option');
            option.value = teacher.teacherId;
            option.text = teacher.fullName;
            teacherSelect.add(option);
        }
    });
}

function loadLicenseDataToRegisterForm(licenseList) {
    if (licenseList === null || licenseList.length === 0) {
        return;
    }
    let licenseSelect = document.querySelector('.licenseSelect');
    while (licenseSelect.options.length > 0) {
        licenseSelect.remove(0);
    }
    licenseList.forEach(license => {
        var option = document.createElement('option');
        option.value = license.licenseId;
        option.text = `Bằng ${license.licenseId}`;
        licenseSelect.add(option);
    });
}
document.addEventListener('DOMContentLoaded', async () => {
    await fetchLicenseData();
    await fetchTeacherData();
});