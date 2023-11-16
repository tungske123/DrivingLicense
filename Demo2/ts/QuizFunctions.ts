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

class AnswerData {
    answerId: number;
    questionId: number;
    isCorrect: boolean;
    answerText: string;
    answerImage: string;
}

class QuestionData {
    questionId: number;
    licenseId: string;
    questionText: string;
    questionImage: string;
    isCritical: boolean;
    answers: AnswerData[];
}

class QuizData {
    quizId: number;
    licenseId: string;
    timer: number;
    name: string;
    description: string;
    questions: QuestionData[];
}

class AttemptData {
    questionId: number;
    answerId: number;
}

let curentQuestionId: number = 0;

function InitializeSessionList() {
    sessionStorage.setItem('attemptlist', JSON.stringify({}));
}

function isSessionInitialized() {
    const sessionData = sessionStorage.getItem('attemptlist');
    return (sessionData !== null && sessionData !== undefined);
}

function getSessionList() {
    const sessionData = sessionStorage.getItem('attemptlist');
    return JSON.parse(sessionData) || {};
}

function addToSessionList(value) {
    const sessionList = getSessionList();
    const questionId = value.questionId.toString(); // Convert to string for key
    sessionList[questionId] = value.answerId; // Store answerId directly
    sessionStorage.setItem('attemptlist', JSON.stringify(sessionList));
}

function updateSessionList(questionId, newAnswerId) {
    const sessionList = getSessionList();
    if (sessionList.hasOwnProperty(questionId.toString())) {
        sessionList[questionId.toString()] = newAnswerId;
        sessionStorage.setItem('attemptlist', JSON.stringify(sessionList));
        return true; // Return true if successfully updated
    }
    return false; // Return false if questionId doesn't exist
}
function removeFromSessionList(questionId: number) {
    const sessionList = getSessionList();
    delete sessionList[questionId.toString()];
    sessionStorage.setItem('attemptlist', JSON.stringify(sessionList));
}

function checkAnsweredQuestionSessionList(questionId: number): boolean {
    const sessionList = getSessionList();
    return sessionList.hasOwnProperty(questionId.toString());
}



var quizId = 1;
var currentQuestionId = 1;
let quiz: QuizData = null;
async function fetchInitialQuizData() {
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
        renderInitialQuizData(quiz);
    } catch (error) {
        console.error(error);
    }
}

async function fetchQuestionFromId(questionId: number, cnt: number = 1) {
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

function renderQuestion(question: QuestionData, cnt: number = 1) {
    if (question === null) {
        console.log('Question is null');
        return;
    }
    var questionTextElement = document.querySelector('.question-description') as HTMLHeadingElement;
    questionTextElement.textContent = `Câu ${cnt}: ${question.questionText}`;
    var questionImageElement = document.querySelector('.question-image') as HTMLImageElement;
    // questionImageElement.src = `/img/question/A1/${question.questionImage}`;
    var answersSection = document.querySelector('.question-answers') as HTMLDivElement;
    answersSection.innerHTML = ``;
    let answerTemplate = document.getElementById('answer-template') as HTMLTemplateElement;
    question.answers.forEach(answer => {
        let clone = document.importNode(answerTemplate.content, true);
        let answerInput = clone.querySelector('.form-check-input') as HTMLInputElement;
        let answerLabel = clone.querySelector('.form-check-label') as HTMLLabelElement;
        if (checkAnsweredQuestionSessionList(curentQuestionId)) {
            answerInput.checked = true;
        }
        answerLabel.textContent = answer.answerText;
        answerInput.setAttribute('qid', answer.answerId.toString());
        answerInput.setAttribute('value', answer.answerId.toString());
        answersSection.appendChild(clone);
    });
}

function renderQuestionButtons(questions: Question[]) {
    // console.log(`Question list: ` + JSON.stringify(questions, null, 2));
    if (questions == null) {
        return;
    }
    var buttonSection = document.querySelector('.quiz-select-section') as HTMLDivElement;
    buttonSection.innerHTML = ``;
    for (let i = 0; i < questions.length; ++i) {
        var question = questions[i];
        var templateIdName = `normalQuestionButtonTemplate`;
        if (checkAnsweredQuestionSessionList(curentQuestionId)) {
            templateIdName = `doneQuestionButtonTemplate`;
        }

        if (question.questionId == currentQuestionId) {
            templateIdName = `currentQuestionButtonTemplate`;
        }
        let questionBtnTemplate = document.getElementById(templateIdName) as HTMLTemplateElement;
        let clone = document.importNode(questionBtnTemplate.content, true);
        let button = clone.querySelector('button');
        button.setAttribute('qid', question.questionId.toString());
        button.textContent = `Câu ${i + 1}`;
        button.addEventListener('click', async () => {
            var qid = Number(button.getAttribute('qid'));
            await fetchQuestionFromId(qid, i + 1);
            curentQuestionId = qid;
            console.log('Current Question id: ' + curentQuestionId);
            renderQuestionButtons(quiz.questions);
            renderQuestion(question);
        });
        buttonSection.appendChild(clone);
    }
}

function renderInitialQuizData(quiz: QuizData) {
    if (quiz === null) {
        console.log('Quiz is null');
        return;
    }
    var quizNameElement = document.querySelector('.quiz-name') as HTMLSpanElement;

    if (quiz.timer !== null) {
        totalTime = quiz.timer;
    }
    quizNameElement.textContent = quiz.name;
    var question = quiz.questions[0];
    curentQuestionId = question.questionId;
    console.log(`Current question id: ${curentQuestionId}`);

    renderQuestion(question);
    renderQuestionButtons(quiz.questions);
}


//Clear answers
let clearAnswerLink = document.getElementById('clearLink') as HTMLAnchorElement;
clearAnswerLink.addEventListener('click', (e) => {
    e.preventDefault();
    var answerList = document.querySelectorAll('.answer') as NodeListOf<HTMLInputElement>;
    answerList.forEach(answer => {
        answer.checked = false;
        let sessionList = getSessionList();
        if (checkAnsweredQuestionSessionList(curentQuestionId)) {
            removeFromSessionList(curentQuestionId);
            renderQuestionButtons(quiz.questions);
        }
        console.log(sessionList);
    });
});

let answerList = document.querySelectorAll('.answer') as NodeListOf<HTMLInputElement>;
answerList.forEach(answer => {
    answer.addEventListener('input', () => {
        let sessionList = getSessionList();
        let newAnswerId = Number(answer.getAttribute('value'));
        if (checkAnsweredQuestionSessionList(curentQuestionId)) {
            updateSessionList(curentQuestionId, newAnswerId);
        } else {
            let value = {
               questionId: curentQuestionId,
               answerId: newAnswerId
            };
            console.log(`Value: ${value}`);
            addToSessionList(value);
        }
        console.log(JSON.stringify(sessionList, null, 2));
    });
});

let submitModalButtons = document.querySelectorAll('.submit-btn') as NodeListOf<HTMLButtonElement>;
submitModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        let action = btn.getAttribute('action');
        if (action === `submit`) {
            submitQuiz();
        }
    });
});


window.addEventListener('DOMContentLoaded', async () => {
    await fetchInitialQuizData();
    if (!isSessionInitialized()) {
        InitializeSessionList();
    } else {
        sessionStorage.removeItem('attemptlist');
    }
    //startTimer();
});