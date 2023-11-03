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
const staffId: string = `EF262EF6-9D98-4634-9348-63BB5965A8E2`;
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

document.addEventListener('DOMContentLoaded', async () => {
    await fetchStaffInfoData();
});