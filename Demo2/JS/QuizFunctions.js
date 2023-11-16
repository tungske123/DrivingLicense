//For the timer
let timer;
var totalTime = 1100;
var questionCnt = 0;
const savedTimeLeft = sessionStorage.getItem("quizTimer");
let timeLeft = savedTimeLeft ? parseInt(savedTimeLeft) : totalTime;

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
    // sessionStorage.clear();
    alert('Nộp bài thành công!');
}

// startTimer();
if (savedTimeLeft) {
    startTimer();
}

class Answer {
    answerId = 0;
    questionId = 0;
    isCorrect = false;
    answerText = ``;
    answerImage = ``;
}

class Question {
    questionId = 0;
    licenseId = ``;
    questionText = ``;
    questionImage = ``;
    isCritical = false;
    answers = [];
}

class Quiz {
    quizId = 0;
    licenseId = ``;
    timer = 0;
    name = ``;
    description = ``;
    questions = [];
}

class AttemptData {
    questionId = 0;
    answerId = 0;
}


let attemptDataList = [];

var quizId = 1;
var currentQuestionId = 1;
let quiz;
async function fetchQuizData() {
    try {
        const url = `https://localhost:7235/api/quiz/${quizId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return;
        }
        const data = await response.json();
        // console.log(data);
        quiz = data;
        renderInitialQuizData(data);
    } catch (error) {
        console.error(error);
    }
}

async function fetchQuestionFromId(questionId, cnt = 1) {
    try {
        const url = `https://localhost:7235/api/questions/${questionId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return;
        }
        const data = await response.json();
        // console.log(data);
        renderQuestion(data, cnt);
    } catch (error) {
        console.error(error);
    }
}

function renderQuestion(question, cnt = 1) {
    if (question === null) {
        console.log('Question is null');
        return;
    }

    var questionTextElement = document.querySelector('.question-description');
    questionTextElement.textContent = `Câu ${cnt}: ${question.questionText}`;
    var questionImageElement = document.querySelector('.question-image');
    // questionImageElement.src = `/img/question/A1/${question.questionImage}`;
    var answersSection = document.querySelector('.question-answers');
    answersSection.innerHTML = ``;
    let answerTemplate = document.getElementById('answer-template');
    let attemptData = attemptDataList.find(att => att.questionId === question.questionId);
    console.log('Attempt data: ' + attemptData);
    question.answers.forEach(answer => {
        let clone = document.importNode(answerTemplate.content, true);
        let answerInput = clone.querySelector('.form-check-input');
        let answerLabel = clone.querySelector('.form-check-label');
        answerLabel.textContent = answer.answerText;
        answerInput.setAttribute('value', answer.answerId);
        answerInput.setAttribute('id', answer.answerId);
        answerLabel.setAttribute('for', answer.answerId);
        answerInput.addEventListener('input', () => {
            let newAnswerId = Number(answerInput.getAttribute('value'));
            console.log('Selected answer id: ' + newAnswerId);
            let index = attemptDataList.findIndex(att => att.questionId === question.questionId);
            if (index !== -1) {
                attemptDataList[index].answerId = newAnswerId;
            } else {
                let newAttemptData = {
                    questionId: question.questionId,
                    answerId: newAnswerId
                };
                attemptDataList.push(newAttemptData);
            }
            console.log(attemptDataList);
            renderQuestionButtons(quiz.questions);
        });
        if (attemptData !== undefined && answer.answerId === attemptData.answerId) {
            answerInput.checked = true;
        }
        answersSection.appendChild(clone);
    });
}

function renderQuestionButtons(questions) {
    // console.log(`Question list: ` + JSON.stringify(questions, null, 2));
    if (questions == null) {
        return;
    }
    var buttonSection = document.querySelector('.quiz-select-section');
    buttonSection.innerHTML = ``;
    for (let i = 0; i < questions.length; ++i) {
        var question = questions[i];
        var templateIdName = `normalQuestionButtonTemplate`;
        let attemptData = attemptDataList.find(att => att.questionId === question.questionId);
        if (attemptData === undefined) {
            templateIdName = `normalQuestionButtonTemplate`;
        } else {
            if (question.questionId === parseInt(currentQuestionId)) {
                templateIdName = `currentQuestionButtonTemplate`;
            } else {
                templateIdName = `doneQuestionButtonTemplate`;
            }
        }
        // if (question.questionId === currentQuestionId) {
        //     templateIdName = `currentQuestionButtonTemplate`;
        // } else if (attemptData !== undefined) {
        //     templateIdName = `doneQuestionButtonTemplate`;
        // } 
        let questionBtnTemplate = document.getElementById(templateIdName);
        let clone = document.importNode(questionBtnTemplate.content, true);
        let button = clone.querySelector('button');
        button.setAttribute('qid', question.questionId);
        button.textContent = `Câu ${i + 1}`;
        button.addEventListener('click', async () => {
            var qid = button.getAttribute('qid');
            await fetchQuestionFromId(qid, i + 1);
            currentQuestionId = qid;
            console.log('Current Question id: ' + currentQuestionId);
            renderQuestionButtons(quiz.questions);
        });
        buttonSection.appendChild(clone);
    }
}

function renderInitialQuizData(quiz) {
    if (quiz === null) {
        console.log('Quiz is null');
        return;
    }
    var quizNameElement = document.querySelector('.quiz-name');

    if (quiz.timer !== null) {
        totalTime = quiz.timer;
    }
    quizNameElement.textContent = quiz.name;
    var question = quiz.questions[0];
    currentQuestionId = question.questionId;
    renderQuestion(question);
    renderQuestionButtons(quiz.questions);

}


//Clear answers
let clearAnswerLink = document.getElementById('clearLink');
clearAnswerLink.addEventListener('click', (e) => {
    e.preventDefault();
    var answerList = document.querySelectorAll('.answer');
    answerList.forEach(answer => {
        answer.checked = false;
    });
    let attemptData = attemptDataList.find(att => parseInt(att.questionId) === parseInt(currentQuestionId));
    let index = attemptDataList.indexOf(attemptData);
    console.log('Remove index: ' + index);
    if (index !== -1) {
        attemptDataList.splice(index, 1);
        renderQuestionButtons(quiz.questions);
    }
    console.log(attemptDataList);
});



let submitModalButtons = document.querySelectorAll('.submit-btn');
submitModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        let action = btn.getAttribute('action');
        if (action === `submit`) {
            submitQuiz();
        }
    });
});

window.addEventListener('DOMContentLoaded', async () => {
    await fetchQuizData();
    //startTimer();
});