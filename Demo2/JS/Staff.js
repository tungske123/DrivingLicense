const staffTabLinkList = document.querySelectorAll('.dashboard-item');
staffTabLinkList.forEach(tabLink => {
    tabLink.addEventListener('click', (e) => {
        e.preventDefault();

        const tabList = document.querySelectorAll('.staff-tab');
        tabList.forEach(tab => {
            tab.style.display = 'none';
        });


        // Remove is-active from all tab links
        staffTabLinkList.forEach(link => {
            link.classList.remove('is-active');
        });

        // Add is-active to this current tab link
        tabLink.classList.add('is-active');

        //Get id target for each link
        const linkAnchor = tabLink.querySelector('a');
        if (!linkAnchor) {
            return;
        }
        const target = linkAnchor.getAttribute('href');
        if (target === `/Home`) {
            window.location.href = `/Home`;
            return;
        }
        //Show the tab
        if (target) {
            const tab = document.querySelector(target);
            if (tab) {
                tab.style.display = 'block';
            }
        }
    });
});

staffTabLinkList[0].click();
const staffId = `2AF899DA-324B-4FF0-BE6F-23A119C045E7`;
class Staff {
    staffId;
    fullName;
    email;
    contactNumber;
    password;
}
function renderStaffInfo(staff) {
    const FullNameInput = document.getElementById('fullname');
    const EmailElement = document.getElementById('email');
    const PhoneElement = document.getElementById('phone');
    const PasswordElement = document.getElementById('password');
    const RepassElement = document.getElementById('repass');

    FullNameInput.value = staff.fullName;
    EmailElement.value = staff.email;
    PhoneElement.value = staff.email;
    PasswordElement.value = staff.password;
    RepassElement.value = staff.password;
}
async function fetchStaffInfoData() {
    try {
        const url = `https://localhost:7235/api/staff/info/${staffId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP Error! Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        //renderInfoHere
        const staff = data;
        renderStaffInfo(staff);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function updateStaffInfo() {
    const staffInfoForm = document.getElementById('staffInfoForm');
    const url = `https://localhost:7235/api/staff/info/update/${staffId}`;
    const formData = new FormData(staffInfoForm);
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: formData
        });
        if (response.status !== 204) {
            throw new Error(`HTTP Error! Status code: ${response.status}`);
        }

        await fetchStaffInfoData();
    } catch (error) {
        console.error(error);
    }
}

const staffInfoForm = document.getElementById('staffInfoForm');
staffInfoForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const result = await Swal.fire({
        icon: 'question',
        title: 'Xác nhận lưu thông tin?',
        confirmButtonColor: '#d90429',
        showCancelButton: true,
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Hủy'
    });
    if (!result.isConfirmed) {
        return;
    }
    const Password = document.getElementById('password').value;
    const Repass = document.getElementById('repass').value;
    if (Password !== Repass) {
        Swal.fire({
            icon: 'error',
            title: 'Vui lòng xác nhận mật khẩu chính xác!',
            confirmButtonColor: '#d90429',
        });
    }
    await updateStaffInfo();
    Swal.fire({
        icon: 'success',
        title: 'Lưu thông tin thành công!',
        confirmButtonColor: '#d90429',
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    await fetchStaffInfoData();
});