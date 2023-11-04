const LicenseId = (document.getElementById('licenseid') as HTMLDivElement).textContent;
console.log(LicenseId);

class License {
    licenseId: string = ``;

    licenseName: string = ``;

    describe: string = ``;

    condition: string = ``;

    cost: string = ``;

    time: string = ``;

    examContent: string = ``;

    tips: string = ``;
}

function fetchData() {

    const fetchAPI = `https://localhost:7235/license/${LicenseId}`;

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
        var license: License = data;
        renderData(license);
    }).then(error => {
        console.error(error);
    });

}
function renderData(license: License) {

    const heading = document.getElementById("Heading") as HTMLHeadingElement;
    heading.innerHTML = `Bằng lái ${license.licenseId}`;

    const describe = document.getElementById('Describe') as HTMLDivElement;
    describe.innerHTML = license.describe;

    const condition = document.getElementById('Condition') as HTMLDivElement;
    condition.innerHTML = license.condition;

    const Cost = document.getElementById('Cost') as HTMLDivElement;
    Cost.innerHTML = license.cost;

    const Time = document.getElementById('Time') as HTMLUListElement;
    Time.innerHTML = license.time;

    const Exam = document.getElementById('Exam-Content') as HTMLDivElement;
    Exam.innerHTML = license.examContent;

    const Tips = document.getElementById('Tips') as HTMLDivElement;
    Tips.innerHTML = license.tips;
}
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});
