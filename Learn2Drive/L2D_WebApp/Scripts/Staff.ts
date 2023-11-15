const staffTabLinkList: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.dashboard-item');
staffTabLinkList.forEach(tabLink => {
    tabLink.addEventListener('click', (e) => {
        e.preventDefault();

        const tabList = document.querySelectorAll('.staff-tab') as NodeListOf<HTMLElement>;
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
        const linkAnchor: HTMLAnchorElement | null = tabLink.querySelector('a');
        if (!linkAnchor) {
            return;
        }
        const target: string | null = linkAnchor.getAttribute('href');
        if (target === `/Home`) {
            window.location.href = `/Home`;
            return;
        }
        if (target === `/Login/logout`) {
            window.location.href = target;
            return;
        }
        //Show the tab
        if (target) {
            const tab: HTMLElement | null = document.querySelector(target);
            if (tab) {
                tab.style.display = 'block';
            }
        }
    });
});

staffTabLinkList[0].click();
const staffId: string = (document.getElementById('StaffId') as HTMLDivElement).textContent;
class Staff {
    staffId: string;
    fullName: string;
    email: string;
    contactNumber: string;
    password: string;
}
function renderStaffInfo(staff: Staff) {
    const FullNameInput = document.getElementById('fullname') as HTMLInputElement;
    const EmailElement = document.getElementById('email') as HTMLInputElement;
    const PhoneElement = document.getElementById('phone') as HTMLInputElement;
    const PasswordElement = document.getElementById('password') as HTMLInputElement;
    const RepassElement = document.getElementById('repass') as HTMLInputElement;

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
        const staff: Staff = data;
        renderStaffInfo(staff);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function updateStaffInfo() {
    const staffInfoForm = document.getElementById('staffInfoForm') as HTMLFormElement;
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
        alert('Lưu thông tin thành công');
        await fetchStaffInfoData();
    } catch (error) {
        console.error(error);
    }
}

const staffInfoForm = document.getElementById('staffInfoForm') as HTMLFormElement;
staffInfoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await updateStaffInfo();
});

document.addEventListener('DOMContentLoaded', async () => {
    await fetchStaffInfoData();
});