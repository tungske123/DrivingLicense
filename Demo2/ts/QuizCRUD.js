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
    questionCheckBoxes.forEach(function (questionCheck) {
        questionCheck.checked = checkStatus;
    });
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
        var url, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://localhost:7235/api/quizzes?page=".concat(quizPage);
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(sendQuizData)
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP Error! Status code: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    console.log(data);
                    totalQuizPage = data.totalPages;
                    renderQuizTable(data.items);
                    renderQuizPagingBar();
                    return [2 /*return*/];
            }
        });
    });
}
var quizTableBody = document.getElementById('quizTableBody');
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
window.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchQuizData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
