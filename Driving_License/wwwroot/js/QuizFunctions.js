//Events

//Load answer if possible

document.addEventListener('DOMContentLoaded', function(){
    const formCheckList = document.getElementsByClassName('answer-input');
    for (const formCheck of formCheckList) {
        var AnsId = parseInt(formCheck.getAttribute("id"));
        if (AnsId === currentAnswerID) {
            formCheck.checked = true;
            break;
        }
    }
});

document.querySelector('.submit-button').addEventListener('click', async function () {
    clearInterval(timer);
    await SaveQuestion();
    submitQuiz();
});

//window.addEventListener('beforeunload', function (event) {
//    SaveQuestion();
//});

const questionButtons = document.getElementsByClassName('question_button');
for (const quesButton of questionButtons) {
    quesButton.addEventListener('click', async function () {
        await changeQuestion(this);
    });
}

//Methods
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
    window.location = '/Quiz/LoadQuestion?questionid=' + questionid;
}

//For the timer
let timer;

const savedTimeLeft = sessionStorage.getItem("quizTimer");
let timeLeft = savedTimeLeft ? parseInt(savedTimeLeft) : 60;

function saveTimerState() {
    sessionStorage.setItem("quizTimer", timeLeft.toString());
}
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
function startTimer() {
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

// startTimer();
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
}

