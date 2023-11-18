let UserId = `AFB98A94-D245-4075-8B5D-9B309BCE96F3`;
const baseUrl = `https://localhost:7235`;
let attemptId = `96B7D170-7D89-44BC-969B-624ADC78F4A4`;

let attemptTableBody = document.getElementById('attemptTableBody');
let questionTableBody = document.getElementById('questionTableBody');
let questionRowTemplate = document.getElementById('question_row_template');
let correctCellTemplate = document.getElementById('correct-cell-template');
let attemptRowTemplate = document.getElementById('attempt-row-template');
let incorrectCellTemplate = document.getElementById('incorrect-cell-template');

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
        const attempt = await response.json();
        console.log(attempt);
        renderAttemptData(attempt);
        renderQuestionTable(attempt.attemptDetails);
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
        var rowCnt = 1;
        attemptDetailsList.forEach(attemptData => {

            let clone = document.importNode(questionRowTemplate.content, true);
            let cells = clone.querySelectorAll('tr td');
            cells[0].textContent = rowCnt.toString();
            cells[1].textContent = attemptData.questionText;
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
                    cells[4].textContent = `Chưa làm`;
                    break;
                default:
                    break;
            }

            questionTableBody.appendChild(clone);
            ++rowCnt;
        });
    } catch (error) {
        console.error(error);
    }

}

window.addEventListener('DOMContentLoaded', async () => {
    await fetchUserAttemptData();
});