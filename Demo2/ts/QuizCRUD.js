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
var checkAllCheckBox = document.getElementById('checkbox-all-search');
checkAllCheckBox.addEventListener('input', function () {
    var checkStatus = checkAllCheckBox.checked;
    var questionCheckBoxes = document.querySelectorAll('.questionCheck');
    if (checkStatus) {
        selectAllQuestions();
    }
    else {
        removeAllQuestions();
    }
    questionCheckBoxes.forEach(function (questionCheck) {
        questionCheck.checked = checkStatus;
    });
});
function selectAllQuestions() {
    removeAllQuestions();
    var questionCheckBoxes = document.querySelectorAll('.questionCheck');
    questionCheckBoxes.forEach(function (questionCheck) {
        var questionId = Number(questionCheck.getAttribute('value'));
        QuestionIDList.push(questionId);
    });
}
function removeAllQuestions() {
    QuestionIDList.splice(0, QuestionIDList.length);
}
var randomCheckBox = document.getElementById('randomCheckBox');
var questionSelectionSection = document.getElementById('questionSelectionSection');
randomCheckBox.addEventListener('input', function () {
    if (randomCheckBox.checked) {
        questionSelectionSection.style.display = 'none';
    }
    else {
        questionSelectionSection.style.display = 'block';
    }
});
var Quiz = /** @class */ (function () {
    function Quiz() {
    }
    return Quiz;
}());
var quizPage = 1;
var totalQuizPage = 1;
var sendQuizData = {
    keyword: "",
    licenseID: ""
};
function fetchQuizData() {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://localhost:7235/api/quizzes?page=".concat(quizPage);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(sendQuizData)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP Error! Status code: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log(data);
                    totalQuizPage = data.totalPages;
                    renderQuizTable(data.items);
                    renderQuizPagingBar();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error: ".concat(error_1));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function addQuiz() {
    return __awaiter(this, void 0, void 0, function () {
        var quizNameElement, quizQuestionCntElememnt, quizLicenseElement, quizDescriptionElement, randomCheckBox, data, url, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    quizNameElement = document.querySelector('.quizName');
                    quizQuestionCntElememnt = document.querySelector('.quizQuestionCnt');
                    quizLicenseElement = document.querySelector('.quizLicense');
                    quizDescriptionElement = document.querySelector('.quizDescription');
                    randomCheckBox = document.getElementById('randomCheckBox');
                    data = {
                        quizName: quizNameElement.value,
                        licenseID: String(quizLicenseElement.value),
                        quantity: Number(quizQuestionCntElememnt.value),
                        description: String(quizDescriptionElement.value),
                        hasRandomQuestions: randomCheckBox.checked,
                        questionIDList: QuestionIDList
                    };
                    url = "https://localhost:7235/api/quizzes/generate";
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status !== 204) {
                        throw new Error("Http Error! Status code: ".concat(response.status));
                    }
                    alert('Thêm bộ đề thành công');
                    return [2 /*return*/];
            }
        });
    });
}
var quizTableBody = document.getElementById('quizTableBody');
function toggleQuizDetailsModal() {
}
function toogleQuizUpdateModal() {
}
function toggleQuizDeleteModal() {
}
function renderQuizTable(quizList) {
    quizTableBody.innerHTML = '';
    if (quizList === null || quizList.length === 0) {
        return;
    }
    var template = document.getElementById('quiz-row-template');
    quizList.forEach(function (quiz) {
        var clone = document.importNode(template.content, true);
        var cells = clone.querySelectorAll('td');
        cells[0].textContent = quiz.name;
        cells[1].textContent = quiz.licenseId;
        cells[2].textContent = quiz.description;
        var quizDropdownButton = cells[3].querySelector('.quizDropDownButton');
        quizDropdownButton.addEventListener('click', function () {
            var quizDropDownContent = cells[3].querySelector('.quizDropDownContent');
            if (!quizDropDownContent.classList.contains('open-dropdown')) {
                quizDropDownContent.classList.add('open-dropdown');
            }
            else {
                quizDropDownContent.classList.remove('open-dropdown');
            }
        });
        quizTableBody.appendChild(clone);
    });
}
var prevQuizButton = document.getElementById('prevQuizPageBtn');
var nextQuizButton = document.getElementById('nextQuizPageBtn');
function renderQuizPagingBar() {
    var pageBarBody = document.querySelector('.pageBarBody');
    pageBarBody.innerHTML = '';
    var pageClassName = "flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
    var activePageClassName = "text-red-700 flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white";
    var _loop_1 = function () {
        var li = document.createElement('li');
        var pageLink = document.createElement('a');
        li.setAttribute('page', pageCnt.toString());
        if (pageCnt === quizPage) {
            pageLink.className = activePageClassName;
        }
        else {
            pageLink.className = pageClassName;
        }
        pageLink.textContent = pageCnt.toString();
        li.appendChild(pageLink);
        li.addEventListener('click', function () {
            var newPage = Number(li.getAttribute('page'));
            quizPage = newPage;
        });
        pageBarBody.appendChild(li);
    };
    for (var pageCnt = 1; pageCnt <= totalQuizPage; ++pageCnt) {
        _loop_1();
    }
}
prevQuizButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                --quizPage;
                if (quizPage <= 0) {
                    quizPage = totalQuizPage;
                }
                return [4 /*yield*/, fetchQuizData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
nextQuizButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ++quizPage;
                if (quizPage > totalQuizPage) {
                    quizPage = 1;
                }
                return [4 /*yield*/, fetchQuizData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var quizSearchBar = document.getElementById('quizSearchBar');
quizSearchBar.addEventListener('input', function () { return __awaiter(_this, void 0, void 0, function () {
    var newKeyword;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newKeyword = String(quizSearchBar.value);
                sendQuizData.keyword = newKeyword;
                quizPage = 1;
                return [4 /*yield*/, fetchQuizData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var quizLicenseChecks = document.querySelectorAll('.quizLicenseCheck');
var clearQuizFilterLink = document.getElementById('clearQuizFilter');
quizLicenseChecks.forEach(function (quizCheck) {
    quizCheck.addEventListener('input', function () { return __awaiter(_this, void 0, void 0, function () {
        var newLicenseID;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!quizCheck.checked) return [3 /*break*/, 2];
                    newLicenseID = String(quizCheck.getAttribute('value'));
                    sendQuizData.licenseID = newLicenseID;
                    quizPage = 1;
                    return [4 /*yield*/, fetchQuizData()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
});
clearQuizFilterLink.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                quizLicenseChecks.forEach(function (quizCheck) {
                    quizCheck.checked = false;
                });
                sendQuizData.licenseID = "";
                return [4 /*yield*/, fetchQuizData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//For questions
var Answer = /** @class */ (function () {
    function Answer() {
    }
    return Answer;
}());
var Question = /** @class */ (function () {
    function Question() {
    }
    return Question;
}());
var questionPagingData = {
    questionPage: 1,
    totalQuestionPages: 1
};
var sendQuestionData = {
    keyword: "",
    licenseid: ""
};
var QuestionIDList = [];
function fetchQuestionsDataPaging() {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://localhost:7235/api/questions/".concat(questionPagingData.questionPage);
                    console.log("Question fetch URL: ".concat(url));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(sendQuestionData)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP Error! Status code: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log(data);
                    renderQuestionTableData(data.items);
                    questionPagingData.totalQuestionPages = data.totalPages;
                    renderQuestionPagingBar();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error("Error: ".concat(error_2));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var questionTableBody = document.getElementById('questionTableBody');
function renderQuestionTableData(questionList) {
    var _this = this;
    questionTableBody.innerHTML = "";
    if (questionList === null || questionList.length === 0) {
        return;
    }
    var template = document.getElementById('question-row-template');
    questionList.forEach(function (question) {
        var clone = document.importNode(template.content, true);
        var cells = clone.querySelectorAll('td');
        var questionCheckBox = cells[0].querySelector("input[type=\"checkbox\"]");
        questionCheckBox.setAttribute('value', question.questionId.toString());
        if (QuestionIDList.indexOf(question.questionId) >= 0) {
            questionCheckBox.checked = true;
        }
        else {
            questionCheckBox.checked = false;
        }
        questionCheckBox.addEventListener('input', function () {
            var questionId = Number(questionCheckBox.getAttribute('value'));
            var index = QuestionIDList.indexOf(questionId);
            if (questionCheckBox.checked) {
                if (index === -1) {
                    QuestionIDList.push(questionId);
                    updateQuestionCount();
                }
            }
            else {
                if (index !== -1) {
                    QuestionIDList.splice(index, 1);
                    updateQuestionCount();
                }
            }
        });
        cells[1].textContent = question.questionText;
        cells[2].textContent = question.licenseId;
        cells[3].textContent = question.isCritical ? "C\u00F3" : "Kh\u00F4ng";
        var detailsButton = cells[4].querySelector('.detailsButton');
        detailsButton.setAttribute('quesid', question.questionId.toString());
        detailsButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
            var questionID;
            return __generator(this, function (_a) {
                questionID = Number(detailsButton.getAttribute('quesid'));
                loadQuestionDetailsModal(questionID);
                toggleQuestionDetailsModal();
                return [2 /*return*/];
            });
        }); });
        questionTableBody.appendChild(clone);
    });
}
function fetchSingleQuestion(questionId) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, question;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
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
                        throw new Error("Http Error! Status code: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    question = data;
                    return [2 /*return*/, question];
            }
        });
    });
}
function loadQuestionDetailsModal(questionId) {
    return __awaiter(this, void 0, void 0, function () {
        var question, questionTextElement, questionImageElement, questionModalAnswersSection, hasImage, answerTemplate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchSingleQuestion(questionId)];
                case 1:
                    question = _a.sent();
                    questionTextElement = document.getElementById('questionText');
                    questionImageElement = document.getElementById('questionImage');
                    questionModalAnswersSection = document.getElementById('questionModalAnswersSection');
                    questionModalAnswersSection.innerHTML = "";
                    questionTextElement.textContent = question.questionText;
                    hasImage = (question.questionImage !== null && question.questionImage !== "" && question.questionImage !== "none");
                    questionImageElement.setAttribute('srcset', (hasImage) ? "/img/".concat(question.questionImage) : "https://flowbite.com/docs/images/examples/image-1@2x.jpg");
                    answerTemplate = document.getElementById('answer-template');
                    question.answers.forEach(function (answer) {
                        var clone = document.importNode(answerTemplate.content, true);
                        var answerCheck = clone.querySelector('.answerCheck');
                        var answerLabel = clone.querySelector('.answerLabel');
                        if (answer.isCorrect) {
                            answerCheck.checked = true;
                        }
                        answerCheck.setAttribute('value', answer.answerId.toString());
                        answerLabel.textContent = answer.answerText;
                        questionModalAnswersSection.appendChild(clone);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function toggleQuestionDetailsModal() {
    var questionDetailsModal = document.getElementById('questionDetailsModal');
    var opened = (!questionDetailsModal.classList.contains('hidden') && questionDetailsModal.classList.contains('flex') && questionDetailsModal.classList.contains('blur-background'));
    if (!opened) {
        questionDetailsModal.classList.remove('hidden');
        questionDetailsModal.classList.add('flex');
        questionDetailsModal.classList.add('blur-background');
        questionDetailsModal.style.zIndex = "200";
        questionDetailsModal.style.justifyContent = 'center';
        questionDetailsModal.style.alignItems = 'center';
    }
    else {
        questionDetailsModal.classList.add('hidden');
        questionDetailsModal.classList.remove('flex');
        questionDetailsModal.classList.remove('blur-background');
        questionDetailsModal.style.zIndex = "-1";
    }
}
var prevQuestionButton = document.getElementById('prevQuestionButton');
var nextQuestionButton = document.getElementById('nextQuestionButton');
prevQuestionButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                --questionPagingData.questionPage;
                if (questionPagingData.questionPage <= 0) {
                    questionPagingData.questionPage = questionPagingData.totalQuestionPages;
                }
                return [4 /*yield*/, fetchQuestionsDataPaging()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
nextQuestionButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ++questionPagingData.questionPage;
                if (questionPagingData.questionPage > questionPagingData.totalQuestionPages) {
                    questionPagingData.questionPage = 1;
                }
                return [4 /*yield*/, fetchQuestionsDataPaging()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function renderQuestionPagingBar() {
    var _this = this;
    var questionPageBar = document.getElementById('questionPageBar');
    var pageClassName = "flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
    var activePageClassName = "flex items-center text-red-700 justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white";
    questionPageBar.innerHTML = "";
    var _loop_2 = function () {
        var li = document.createElement('li');
        li.setAttribute('page', pageCnt.toString());
        li.style.cursor = 'pointer';
        var pageLink = document.createElement('a');
        pageLink.style.cursor = 'pointer';
        if (pageCnt === questionPagingData.questionPage) {
            pageLink.className = activePageClassName;
        }
        else {
            pageLink.className = pageClassName;
        }
        pageLink.textContent = pageCnt.toString();
        li.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
            var newPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newPage = Number(li.getAttribute('page'));
                        questionPagingData.questionPage = newPage;
                        return [4 /*yield*/, fetchQuestionsDataPaging()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        li.appendChild(pageLink);
        questionPageBar.appendChild(li);
    };
    for (var pageCnt = 1; pageCnt <= questionPagingData.totalQuestionPages; ++pageCnt) {
        _loop_2();
    }
}
var questionSearchBar = document.getElementById('questionSearchBar');
questionSearchBar.addEventListener('input', function () { return __awaiter(_this, void 0, void 0, function () {
    var newKeyword;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newKeyword = String(questionSearchBar.value);
                sendQuestionData.keyword = newKeyword;
                questionPagingData.questionPage = 1;
                return [4 /*yield*/, fetchQuestionsDataPaging()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var questionLicenseCheckBoxes = document.querySelectorAll('.licenseCheck');
questionLicenseCheckBoxes.forEach(function (checkBox) {
    checkBox.addEventListener('input', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!checkBox.checked) return [3 /*break*/, 2];
                    sendQuestionData.licenseid = String(checkBox.getAttribute('value'));
                    questionPagingData.questionPage = 1;
                    return [4 /*yield*/, fetchQuestionsDataPaging()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
});
function updateQuestionCount() {
    var numOfQuestion = QuestionIDList.length;
    var chosenQuestionCount = document.getElementById('chosenQuestionCount');
    chosenQuestionCount.textContent = numOfQuestion.toString() + " C\u00E2u";
    console.log(QuestionIDList);
}
var quizAddButton = document.getElementById('quizAddButton');
quizAddButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, addQuiz()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
window.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchQuizData()];
            case 1:
                _a.sent();
                return [4 /*yield*/, fetchQuestionsDataPaging()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
