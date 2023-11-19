let UserId = `AFB98A94-D245-4075-8B5D-9B309BCE96F3`;
let attemptId = `AB8AAEC1-6DE6-42DE-B2DF-25BC89A9E29F`;
const baseUrl = `https://localhost:7235`;

let attemptTableBody = document.getElementById('attemptTableBody');
let questionTableBody = document.getElementById('questionTableBody');
let questionRowTemplate = document.getElementById('question_row_template');
let correctCellTemplate = document.getElementById('correct-cell-template');
let attemptRowTemplate = document.getElementById('attempt-row-template');
let incorrectCellTemplate = document.getElementById('incorrect-cell-template');
let notDoneCellTemplate = document.getElementById('notdone-cell-template');
let pageButtonTemplate = document.getElementById('page_btn_template');
function paginateArray(array, pageSize, pageNumber) {
    // calculate the start index
    let startIndex = (pageNumber - 1) * pageSize;
    startItemCnt = startIndex + 1;
    // return a slice of the array
    return array.slice(startIndex, startIndex + pageSize);
}

function calculateTotalPage(array, pageSize) {
    return Math.ceil(array.length / pageSize);
}

let pageSize = 10;
let page = 1;
let totalPage = 1;
let startItemCnt = 1;
let attempt;

function renderPagingBar() {
    let pageBarContent = document.getElementById('pageBarContent');
    pageBarContent.innerHTML = ``;
    for (var cnt = 1; cnt <= totalPage; ++cnt) {
        let clone = document.importNode(pageButtonTemplate.content, true);
        let pageItem = clone.querySelector('li');
        if (parseInt(cnt) === parseInt(page)) {
            pageItem.classList.add('active');
        }
        let pageLink = clone.querySelector('.page-link');
        pageLink.textContent = cnt.toString();
        pageLink.setAttribute('page', cnt.toString());
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            let newPage = parseInt(pageLink.getAttribute('page'));
            page = newPage;
            goToPage(newPage);
        });
        pageBarContent.appendChild(clone);
    }
}

function goToPage(page) {
    let attemptDetailsPagingList = paginateArray(attempt.attemptDetails, pageSize, page);
    renderQuestionTable(attemptDetailsPagingList);
    totalPage = calculateTotalPage(attempt.attemptDetails, pageSize);
    renderPagingBar();
}

async function fetchUserAttemptData() {
    try {
        const url = `${baseUrl}/api/user/profile/quiz/${UserId}?aid=${attemptId}`;
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
        console.log(data);
        attempt = data;
        renderAttemptData(attempt);
        let attemptDetailsPagingList = paginateArray(attempt.attemptDetails, pageSize, page);
        renderQuestionTable(attemptDetailsPagingList);
        totalPage = calculateTotalPage(attempt.attemptDetails, pageSize);
        console.log('Total page:' + totalPage);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

function getFormattedTime(timeString) {
    let parts = timeString.split(':');

    let hours = parts[0];
    let minutes = parts[1];
    let seconds = parts[2];

    let formattedString = ``;
    if (hours !== `00`) {
        formattedString += `${hours} giờ `;
    }
    if (minutes !== `00`) {
        formattedString += `${minutes} phút `;
    }
    formattedString += `${seconds} giây`;
    return formattedString;
}

function getVietnamDateTime(dateString) {
    const utcDate = new Date(dateString);

    // Convert to Vietnam timezone (Indochina Time - ICT)
    const vietnamTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(utcDate);
    return vietnamTime;
}

function getFormattedAttemptDate(date) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let timeString = `${hours}:${minutes}:${seconds}`;
    let formattedDateTimeString = `${day}/${month}/${year} vào lúc ${getFormattedTime(timeString)}`;
    return formattedDateTimeString;
}

function renderAttemptData(attempt) {
    attemptTableBody.innerHTML = ``;
    let clone = document.importNode(attemptRowTemplate.content, true);
    let cells = clone.querySelectorAll('tr td');

    cells[0].textContent = attempt.quizName;
    cells[1].textContent = attempt.licenseId;
    cells[2].textContent = getFormattedTime(attempt.attemptTime);
    // let attemptDate = new Date(attempt.attemptDate.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
    cells[3].textContent = getVietnamDateTime(attempt.attemptDate);
    cells[4].textContent = attempt.totalQuestion;
    cells[5].textContent = attempt.correctQuestionCnt;
    cells[6].textContent = attempt.incorrectQuestionCnt;
    let remainingQuestion = parseInt(attempt.totalQuestion) - parseInt(attempt.correctQuestionCnt) - parseInt(attempt.incorrectQuestionCnt);
    cells[7].textContent = remainingQuestion.toString();
    cells[8].textContent = (attempt.result === true) ? `Đậu` : `Rớt`;
    attemptTableBody.appendChild(clone);
}


function renderQuestionTable(attemptDetailsList) {
    questionTableBody.innerHTML = ``;
    if (attemptDetailsList === null || attemptDetailsList.length === 0) {
        return;
    }
    try {

        attemptDetailsList.forEach(attemptData => {
            console.log(`Question num: ${startItemCnt}`);
            let clone = document.importNode(questionRowTemplate.content, true);
            let cells = clone.querySelectorAll('tr td');
            cells[0].textContent = startItemCnt.toString();
            cells[1].textContent = attemptData.questionText;
            let questionImage = attemptData.questionImage;
            let questionImageElement = document.createElement('img');
            if (questionImage !== null && questionImage !== `` && questionImage !== `none`) {
                questionImageElement.className = `img-fluid rounded-3`;
                questionImageElement.src = `/img/question/A1/${questionImage}`;
                cells[1].appendChild(questionImageElement);
            }
            cells[2].textContent = attemptData.selectedAnswer;
            cells[3].textContent = attemptData.correctAnswer;

            switch (attemptData.status) {
                case `correct`:
                    let correctCell = document.importNode(correctCellTemplate.content, true);
                    cells[4].appendChild(correctCell);
                    break;
                case `incorrect`:
                    let incorrectCell = document.importNode(incorrectCellTemplate.content, true);
                    cells[4].appendChild(incorrectCell);
                    break;
                case `notdone`:
                    let notdoneCell = document.importNode(notDoneCellTemplate.content, true);
                    cells[4].appendChild(notdoneCell);
                    break;
                default:
                    break;
            }

            questionTableBody.appendChild(clone);
            ++startItemCnt;
        });
    } catch (error) {
        console.error(error);
    }
}

// let redoButton = document.getElementById('redoButton');
// redoButton.addEventListener('click', () => {
//     Swal.fire({
//         title: "Xác nhận vào làm lại đề này?",
//         showCancelButton: true,
//         confirmButtonText: `Làm`,
//         confirmButtonColor: `#d90429`,
//         denyButtonText: `Hủy`
//     }).then((result) => {
//         if (result.isConfirmed) {
//             window.location.href = `/Quiz/StartQuiz?qid=${parseInt(quizId)}`;
//         }
//     });
// });
window.addEventListener('DOMContentLoaded', async () => {
    await fetchUserAttemptData();

    let prevBtn = document.getElementById('prevBtn');
    let nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        --page;
        if (page <= 0) {
            page = totalPage;
        }
        console.log(`Current page: ${page}`);
        goToPage(page);
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        ++page;
        if (page > totalPage) {
            page = 1;
        }
        console.log(`Current page: ${page}`);
        goToPage(page);
    });
});