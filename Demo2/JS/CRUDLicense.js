let baseUrl = `https://localhost:7235`;
async function fetchAllLicensesData() {
    try {
        const url = `${baseUrl}/api/licenses`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error(`Error! ${response.status} - ${response.statusText}`);
            return;
        }
        const data = await response.json();
        console.log(`Licenses data: ${data}`);
        return data;
    } catch (error) {
        console.error(error);
    }
    return null;
}

async function saveLicenseInfo(licenseid) {
    try {
        const url = `${baseUrl}/api/license/update/${licenseid}`;
        let licenseNameElement = tinymce.get('licenseName');
        let descriptionElement = tinymce.get('description');
        let conditionElement = tinymce.get('condition');
        let costElement = tinymce.get('cost');
        let timeElement = tinymce.get('time');
        let examContentElement = tinymce.get('examContent');
        let tipsElement = tinymce.get('tips');

        let license = {
            licenseId: licenseid,
            licenseName: licenseNameElement.getContent(),
            describe: descriptionElement.getContent(),
            condition: conditionElement.getContent(),
            cost: costElement.getContent(),
            time: timeElement.getContent(),
            examContent: examContentElement.getContent(),
            tips: tipsElement.getContent()
        };

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(license)
        });

        if (!response.ok) {
            console.error(`Error! ${response.status} - ${response.statusText}`);
            return;
        }
        
        Swal.fire({
            title: "Lưu thành công",
            text: `Dữ liệu của bài viết ở hạng bằng ${licenseid} đã được cập nhật!`,
            icon: "success",
            confirmButtonColor: "#d90429"
        });
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

let licenseList;

function loadLicenseSelectData(licenseIdList) {
    let licenseSelect = document.getElementById('licenseid');
    while (licenseSelect.firstChild) {
        licenseSelect.removeChild(licenseSelect.firstChild);
    }
    let defaultOption = document.createElement('option');
    defaultOption.text = `Chọn hạng bằng lái`;
    defaultOption.value = ``;
    licenseSelect.add(defaultOption);
    licenseIdList.forEach(licenseId => {
        let option = document.createElement('option');
        option.text = licenseId;
        option.value = licenseId;
        licenseSelect.add(option);
    });
}

function loadLicenseData(licenseId) {
    var license = licenseList.find(l => l.licenseId == licenseId);
    console.log(`License with id ${licenseId}: ${license}`);
    if (license == undefined) {
        console.log(`Can't find any license with id ${licenseId}`);
        return;
    }

    let licenseNameElement = tinymce.get('licenseName');
    let descriptionElement = tinymce.get('description');
    let conditionElement = tinymce.get('condition');
    let costElement = tinymce.get('cost');
    let timeElement = tinymce.get('time');
    let examContentElement = tinymce.get('examContent');
    let tipsElement = tinymce.get('tips');


    licenseNameElement.setContent(license.licenseName);
    descriptionElement.setContent(license.describe);
    conditionElement.setContent(license.condition);
    costElement.setContent(license.cost);
    timeElement.setContent(license.time);
    examContentElement.setContent(license.examContent);
    tipsElement.setContent(license.tips);
}


window.addEventListener('DOMContentLoaded', async () => {
    licenseList = await fetchAllLicensesData();
    let licenseIdList = licenseList.map(license => license.licenseId);
    loadLicenseSelectData(licenseIdList);
    let licenseSelect = document.getElementById('licenseid');
    licenseSelect.addEventListener('input', () => {
        console.log('Changed license select data');
        let licenseId = licenseSelect.value;
        console.log(`Selected license: ${licenseId}`);
        loadLicenseData(licenseId);
    });
    
    let licenseForm = document.getElementById('licenseInfoForm');
    licenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let licenseId = licenseSelect.value;
        if (licenseId === null || licenseId === ``) {
            Swal.fire({
                icon: "error",
                title: "Không thể lưu thông tin bằng lái",
                text: "Vui lòng chọn loại bằng lái",
              });
            return;
        } 
        await saveLicenseInfo(licenseId);
    });
});