let UserId = `AFB98A94-D245-4075-8B5D-9B309BCE96F3`;
var quizId = 1;
//For the timer
let timer;
var totalTime = 1200;
let quizDuration = 1200;
var questionCnt = 0;
const savedTimeLeft = sessionStorage.getItem("quizTimer");
let timeLeft = savedTimeLeft ? parseInt(savedTimeLeft) : totalTime;
let startTime = 0;
let attemptDateTime;
function saveTimerState() {
    sessionStorage.setItem("quizTimer", timeLeft.toString());
}
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function secondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  
  // Example usage:
  const totalSeconds = 3661; // Example seconds
  const formattedTime = secondsToHMS(totalSeconds);
  console.log(formattedTime); // Output: "01:01:01"
  

function secondsToTimeSpan(seconds) {
    var hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    var minutes = Math.floor(seconds / 60);
    seconds %= 60;

    return 'PT' + hours + 'H' + minutes + 'M' + seconds + 'S';
}

function startTimer() {
    // Clear the interval if it's already running
    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(async () => {
        const timeElement = document.getElementById("time");
        timeElement.textContent = formatTime(timeLeft);
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            await submitQuiz();
        }
        saveTimerState();
    }, 1000);
}

class Attempt {
    quizId = 0;
    attemptTime;
    attemptDate;
    totalQuestion = 0;
    totalAnswered = 0;
    result = 0;
}

class AttemptDetail {

}

function calculateResult() {
    let questionList = quiz.questions;
    let totalQuestionCnt = questionList.length;
    let correctQuestionCnt = 0;
    let incorrectQuestionCnt = 0;
    let failedImportantQuestion = false;
    attemptDataList.forEach(attemptData => {
        let question = questionList.find(q => parseInt(q.questionId) === parseInt(attemptData.questionId));
        console.log(`Question: ` + question);
        if (question !== undefined) {
            let attemptAnswerId = attemptData.answerId;
            console.log('Attempt answer id: ' + attemptAnswerId);
            let correctAnswer = question.answers.find(ans => parseInt(ans.answerId) === parseInt(attemptAnswerId) && ans.isCorrect === true);
            console.log('Correct answer: ' + correctAnswer);
            if (correctAnswer !== undefined) {
                ++correctQuestionCnt;
            } else {
                if (question.isCritical === true && failedImportantQuestion === false) {
                    failedImportantQuestion = true;
                }
                ++incorrectQuestionCnt;
            }
        }
    });
    let remainingQuestionCnt = totalQuestionCnt - correctQuestionCnt - incorrectQuestionCnt;
    let isPassed = (failedImportantQuestion === false && (incorrectQuestionCnt + remainingQuestionCnt <= 3));
    let remainingTime = document.getElementById('time').textContent;

    var attempt = {
        userId: UserId,
        quizId: quiz.quizId,
        attemptTime: `${secondsToHMS(quizDuration - timeLeft)}`,
        attemptDate: attemptDateTime,
        totalQuestion: totalQuestionCnt,
        totalAnswered: correctQuestionCnt + incorrectQuestionCnt,
        result: isPassed
    };
    console.log(`Nộp bài thành công!
    \nThời gian bắt đầu làm: ${attemptDateTime}
    \nThời gian làm bài: ${remainingTime}
    \nTổng số câu hỏi trong đề: ${totalQuestionCnt}
    \nTổng số câu đã làm: ${attemptDataList.length}
    \nSố câu đúng: ${correctQuestionCnt}\nSố câu sai: ${incorrectQuestionCnt}
    \nKết quả: ${isPassed ? 'Đậu' : 'Rớt'}`);
    return attempt;
}

async function submitQuiz() {
    // sessionStorage.clear();
    var attempt = await submitQuizAttempt();
    let attemptDetailList = [];
    var questionList = quiz.questions;
    questionList.forEach(question => {
        let attemptData = attemptDataList.find(att => parseInt(att.questionId) === parseInt(question.questionId));
        console.log(`Attempt data:` + attemptData);
        let isAnswered = (attemptData !== undefined);
        let status = `notdone`;
        if (attemptData !== undefined) {
            let currentAnswer = question.answers.find(ans => parseInt(ans.answerId) === parseInt(attemptData.answerId));
            let hasCorrectAnswer = currentAnswer.isCorrect;
            if (!isAnswered) {
                status = `notdone`;
            } else {
                status = (hasCorrectAnswer) ? `correct` : `incorrect`;
            }
        }
        let attemptDetail = {
            attemptId: attempt.attemptId,
            selectedAnswerId: (isAnswered === true) ? attemptData.answerId : null,
            questionId: question.questionId,
            status: status
        };
        attemptDetailList.push(attemptDetail);
    });
    await submitQuizAttemptDetail(attempt.attemptId, attemptDetailList);
    alert('Nộp bài thành công');
}

async function submitQuizAttemptDetail(attemptId, attemptDetailList) {
    try {
        const url = `https://localhost:7235/api/quiz/submitattemptdetails/${attemptId}`;
        console.log(`Submit quiz attempt details url: ${url}`);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attemptDetailList)
        });
        if (response.status !== 204) {
            console.error(`Error! ${response.status} - ${response.statusText}`);
            return;
        }
        console.log('Submit quiz attempt details sucessfully');
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function submitQuizAttempt() {
    var attempt = calculateResult();
    try {
        const url = `https://localhost:7235/api/quiz/submitattempt/${parseInt(quiz.quizId)}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attempt)
        });
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return;
        }
        var newAttempt = await response.json();
        console.log(`Submit quiz attempt success!Attempt: ${newAttempt}`);
        return newAttempt;
    } catch (error) {
        console.error('Submit quiz error:' + error);
    }
    return null;
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

    if (quiz.timer != null) {
        totalTime = parseInt(quiz.timer) * 60;
        timeLeft = parseInt(quiz.timer) * 60;
        quizDuration = parseInt(quiz.timer) * 60;
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
    btn.addEventListener('click', async () => {
        let action = btn.getAttribute('action');
        if (action === `submit`) {
            await submitQuiz();
        }
    });
});

function getVietnamDateTime() {
    const utcDate = new Date();

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

window.addEventListener('DOMContentLoaded', async () => {
    attemptDateTime = getVietnamDateTime();
    console.log(`Attempt date time: ${attemptDateTime}`);
    await fetchQuizData();
    startTimer();
});