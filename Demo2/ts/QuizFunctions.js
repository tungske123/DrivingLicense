var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
//For the timer
var timer;
var totalTime = 1100;
var questionCnt = 0;
var savedTimeLeft = sessionStorage.getItem("quizTimer");
var timeLeft = savedTimeLeft ? parseInt(savedTimeLeft) : totalTime;
function saveTimerState() {
    sessionStorage.setItem("quizTimer", timeLeft.toString());
}
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return "".concat(minutes, ":").concat(remainingSeconds < 10 ? "0" : "").concat(remainingSeconds);
}
function startTimer() {
    // Clear the interval if it's already running
    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(function () {
        var timeElement = document.getElementById("time");
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
var AnswerData = /** @class */ (function () {
    function AnswerData() {
    }
    return AnswerData;
}());
var QuestionData = /** @class */ (function () {
    function QuestionData() {
    }
    return QuestionData;
}());
var QuizData = /** @class */ (function () {
    function QuizData() {
    }
    return QuizData;
}());
var AttemptData = /** @class */ (function () {
    function AttemptData() {
    }
    return AttemptData;
}());
var curentQuestionId = 0;
function InitializeSessionList() {
    sessionStorage.setItem('attemptlist', JSON.stringify({}));
}
function isSessionInitialized() {
    var sessionData = sessionStorage.getItem('attemptlist');
    return (sessionData !== null && sessionData !== undefined);
}
function getSessionList() {
    var sessionData = sessionStorage.getItem('attemptlist');
    return JSON.parse(sessionData) || {};
}
function addToSessionList(value) {
    var sessionList = getSessionList();
    var questionId = value.questionId.toString(); // Convert to string for key
    sessionList[questionId] = value.answerId; // Store answerId directly
    sessionStorage.setItem('attemptlist', JSON.stringify(sessionList));
}
function updateSessionList(questionId, newAnswerId) {
    var sessionList = getSessionList();
    if (sessionList.hasOwnProperty(questionId.toString())) {
        sessionList[questionId.toString()] = newAnswerId;
        sessionStorage.setItem('attemptlist', JSON.stringify(sessionList));
        return true; // Return true if successfully updated
    }
    return false; // Return false if questionId doesn't exist
}
function removeFromSessionList(questionId) {
    var sessionList = getSessionList();
    delete sessionList[questionId.toString()];
    sessionStorage.setItem('attemptlist', JSON.stringify(sessionList));
}
function checkAnsweredQuestionSessionList(questionId) {
    var sessionList = getSessionList();
    return sessionList.hasOwnProperty(questionId.toString());
}
var quizId = 1;
var currentQuestionId = 1;
var quiz = null;
function fetchInitialQuizData() {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    url = "https://localhost:7235/api/quiz/".concat(quizId);
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        console.error("Error: ".concat(response.status, " - ").concat(response.statusText));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    // console.log(data);
                    quiz = data;
                    renderInitialQuizData(quiz);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchQuestionFromId(questionId, cnt) {
    if (cnt === void 0) { cnt = 1; }
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    url = "https://localhost:7235/api/questions/".concat(questionId);
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        console.error("Error: ".concat(response.status, " - ").concat(response.statusText));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    // console.log(data);
                    renderQuestion(data, cnt);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function renderQuestion(question, cnt) {
    if (cnt === void 0) { cnt = 1; }
    if (question === null) {
        console.log('Question is null');
        return;
    }
    var questionTextElement = document.querySelector('.question-description');
    questionTextElement.textContent = "C\u00E2u ".concat(cnt, ": ").concat(question.questionText);
    var questionImageElement = document.querySelector('.question-image');
    // questionImageElement.src = `/img/question/A1/${question.questionImage}`;
    var answersSection = document.querySelector('.question-answers');
    answersSection.innerHTML = "";
    var answerTemplate = document.getElementById('answer-template');
    question.answers.forEach(function (answer) {
        var clone = document.importNode(answerTemplate.content, true);
        var answerInput = clone.querySelector('.form-check-input');
        var answerLabel = clone.querySelector('.form-check-label');
        if (checkAnsweredQuestionSessionList(curentQuestionId)) {
            answerInput.checked = true;
        }
        answerLabel.textContent = answer.answerText;
        answerInput.setAttribute('qid', answer.answerId.toString());
        answerInput.setAttribute('value', answer.answerId.toString());
        answersSection.appendChild(clone);
    });
}
function renderQuestionButtons(questions) {
    var _this = this;
    // console.log(`Question list: ` + JSON.stringify(questions, null, 2));
    if (questions == null) {
        return;
    }
    var buttonSection = document.querySelector('.quiz-select-section');
    buttonSection.innerHTML = "";
    var _loop_1 = function (i) {
        question = questions[i];
        templateIdName = "normalQuestionButtonTemplate";
        if (checkAnsweredQuestionSessionList(curentQuestionId)) {
            templateIdName = "doneQuestionButtonTemplate";
        }
        if (question.questionId == currentQuestionId) {
            templateIdName = "currentQuestionButtonTemplate";
        }
        var questionBtnTemplate = document.getElementById(templateIdName);
        var clone = document.importNode(questionBtnTemplate.content, true);
        var button = clone.querySelector('button');
        button.setAttribute('qid', question.questionId.toString());
        button.textContent = "C\u00E2u ".concat(i + 1);
        button.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
            var qid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qid = Number(button.getAttribute('qid'));
                        return [4 /*yield*/, fetchQuestionFromId(qid, i + 1)];
                    case 1:
                        _a.sent();
                        curentQuestionId = qid;
                        console.log('Current Question id: ' + curentQuestionId);
                        renderQuestionButtons(quiz.questions);
                        renderQuestion(question);
                        return [2 /*return*/];
                }
            });
        }); });
        buttonSection.appendChild(clone);
    };
    var question, templateIdName;
    for (var i = 0; i < questions.length; ++i) {
        _loop_1(i);
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
    curentQuestionId = question.questionId;
    console.log("Current question id: ".concat(curentQuestionId));
    renderQuestion(question);
    renderQuestionButtons(quiz.questions);
}
//Clear answers
var clearAnswerLink = document.getElementById('clearLink');
clearAnswerLink.addEventListener('click', function (e) {
    e.preventDefault();
    var answerList = document.querySelectorAll('.answer');
    answerList.forEach(function (answer) {
        answer.checked = false;
        var sessionList = getSessionList();
        if (checkAnsweredQuestionSessionList(curentQuestionId)) {
            removeFromSessionList(curentQuestionId);
            renderQuestionButtons(quiz.questions);
        }
        console.log(sessionList);
    });
});
var answerList = document.querySelectorAll('.answer');
answerList.forEach(function (answer) {
    answer.addEventListener('input', function () {
        var sessionList = getSessionList();
        var newAnswerId = Number(answer.getAttribute('value'));
        if (checkAnsweredQuestionSessionList(curentQuestionId)) {
            updateSessionList(curentQuestionId, newAnswerId);
        }
        else {
            var value = {
                questionId: curentQuestionId,
                answerId: newAnswerId
            };
            console.log("Value: ".concat(value));
            addToSessionList(value);
        }
        console.log(JSON.stringify(sessionList, null, 2));
    });
});
var submitModalButtons = document.querySelectorAll('.submit-btn');
submitModalButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
        var action = btn.getAttribute('action');
        if (action === "submit") {
            submitQuiz();
        }
    });
});
window.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchInitialQuizData()];
            case 1:
                _a.sent();
                if (!isSessionInitialized()) {
                    InitializeSessionList();
                }
                else {
                    sessionStorage.removeItem('attemptlist');
                }
                return [2 /*return*/];
        }
    });
}); });
