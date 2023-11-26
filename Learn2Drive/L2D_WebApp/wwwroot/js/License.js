const LicenseId = document.getElementById('licenseid').textContent;
console.log(LicenseId);
class License {
    constructor() {
        this.licenseId = ``;
        this.licenseName = ``;
        this.describe = ``;
        this.condition = ``;
        this.cost = ``;
        this.time = ``;
        this.examContent = ``;
        this.tips = ``;
    }
}
function fetchData() {
    const fetchAPI = `https://localhost:7235/api/license/${LicenseId}`;
    fetch(fetchAPI, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("error");
        }
        return response.json();
    }).then(data => {
        console.log(data);
        var license = data;
        renderData(license);
    }).then(error => {
        console.error(error);
    });
}
function renderData(license) {
    const heading = document.getElementById("Heading");
    heading.innerHTML = `Bằng lái ${license.licenseId}`;
    const describe = document.getElementById('Describe');
    describe.innerHTML = license.describe;
    const condition = document.getElementById('Condition');
    condition.innerHTML = license.condition;
    const Cost = document.getElementById('Cost');
    Cost.innerHTML = license.cost;
    const Time = document.getElementById('Time');
    Time.innerHTML = license.time;
    const Exam = document.getElementById('Exam-Content');
    Exam.innerHTML = license.examContent;
    const Tips = document.getElementById('Tips');
    Tips.innerHTML = license.tips;
}
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});
//# sourceMappingURL=License.js.map