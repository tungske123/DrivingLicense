//Events
const formCheckList = document.getElementsByClassName('answer-input');
for (const formCheck of formCheckList) {
    formCheck.addEventListener('change', function () {
        addToSessionList(currentQuestionID);
    });
}

//Load answer if possible

let changesNeedToBeSaved = false;
document.addEventListener('DOMContentLoaded', function () {
    const formCheckList = document.getElementsByClassName('answer-input');
    for (const formCheck of formCheckList) {
        var AnsId = parseInt(formCheck.getAttribute("id"));
        if (AnsId === currentAnswerID) {
            formCheck.checked = true;
            break;
        }
    }
    startTimer();
    if (!isSessionInitialized()) {
        InitializeSessionList();
    }
    changeQuestionButtonsColor();
});


// For submission
const modalButtons = document.getElementsByClassName('modal-button');
for (var i = 0; i < modalButtons.length; ++i) {
    var button = modalButtons[i];
    button.addEventListener('click', async function () {
        var action = this.getAttribute("btnaction");
        if (action === 'submit') {
            console.log('Submit');
            clearInterval(timer);
            await SaveQuestion();
            sessionStorage.clear();
            submitQuiz();
        }
        else {
            console.log('Cancel');
        }
    });
}
// document.querySelector('.submit-button').addEventListener('click', async function () {

// });


window.addEventListener('beforeunload', function (e) {
    if (changesNeedToBeSaved) {
        e.preventDefault(); // Cancel the default behavior (showing the confirmation dialog)   
        e.returnValue = '';
    }
});

const questionButtons = document.getElementsByClassName('question_button');
for (const quesButton of questionButtons) {
    const questionid = parseInt(quesButton.getAttribute('quesid'));
    quesButton.addEventListener('click', async function () {
        changesNeedToBeSaved = true;
        await changeQuestion(this);
    });
}

//Methods
function InitializeSessionList() {
    sessionStorage.setItem('sessionlist', JSON.stringify([]));
}
function isSessionInitialized() {
    const sessionData = sessionStorage.getItem('sessionlist');
    return (sessionData !== null && sessionData !== undefined);
}
function getSessionList() {
    return JSON.parse(sessionStorage.getItem('sessionlist')) || [];
}
function addToSessionList(value) {
    let sessionList = JSON.parse(sessionStorage.getItem('sessionlist')) || [];
    sessionList.push(value);
    sessionStorage.setItem('sessionlist', JSON.stringify(sessionList));
}
function changeQuestionButtonsColor() {
    const sessionList = getSessionList();
    const questionButtonList = document.getElementsByClassName('question_button');
    for (const questionButton of questionButtonList) {
        const questionid = parseInt(questionButton.getAttribute('quesid'));
        if (sessionList.indexOf(questionid) !== -1) {
            questionButton.classList.remove('btn-outline-primary');
            questionButton.classList.add('btn-success');
        }
    }
}
function checkUserAnswered() {
    let check = false;
    const formCheckList = document.getElementsByClassName('answer-input');
    for (const formCheck of formCheckList) {
        if (formCheck.checked) {
            check = true;
            break;
        }
    }
    return check;
}
function getAnswerID() {
    const formCheckList = document.getElementsByClassName('answer-input');
    let result = null;
    for (const formCheck of formCheckList) {
        if (formCheck.checked) {
            result = parseInt(formCheck.getAttribute("id"));
            break;
        }
    }
    return result;
}

async function changeQuestion(questionButton) {
    var answerid = getAnswerID();
    var questionid = parseInt(questionButton.getAttribute("quesid"));
    if (answerid === null || answerid.toString() === null || answerid.toString() === "") {
        window.location = '/Quiz/LoadQuestion?questionid=' + questionid;
        return;
    }
    console.log('Question id: ' + questionid);
    console.log('Answer id: ' + answerid);
    const data = {
        QuestionID: questionid,
        CurrentQuestionID: currentQuestionID,
        AnswerId: answerid
    };
    console.log('Sending JSON data: ', JSON.stringify(data));
    $.ajax({
        url: "/Quiz/SaveQuestionToSession",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function () {
            console.log('Saved question');
        },
        error: function (status, error) {
            console.log('Status: ' + status);
            console.log('error: ' + error);
        }
    });
    changesNeedToBeSaved = false;
    window.location = '/Quiz/LoadQuestion?questionid=' + questionid;
}

//For the timer
let timer;

const savedTimeLeft = sessionStorage.getItem("quizTimer");
let timeLeft = savedTimeLeft ? parseInt(savedTimeLeft) : 1200;

function saveTimerState() {
    sessionStorage.setItem("quizTimer", timeLeft.toString());
}
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
function startTimer() {
    // Clear the interval if it's already running
    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(() => {
        const timeElement = document.getElementById("time");
        timeElement.textContent = formatTime(timeLeft);
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            submitQuiz();
        }
        saveTimerState();
    }, 1000);
}
function submitQuiz() {
    window.location = '/Quiz/FinishQuiz';
}


if (savedTimeLeft) {
    startTimer();
}


//For saving quiz
async function SaveQuestion() {
    var data = CreateQuizData();
    $.ajax({
        url: "/Quiz/SaveQuestionToSession",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function () {
            console.log('Saved question');
        },
        error: function (status, error) {
            console.log('Status: ' + status);
            console.log('error: ' + error);
        }
    });
    changesNeedToBeSaved = false;
}

