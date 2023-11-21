var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const checkAllCheckBox = document.getElementById('checkbox-all-search');
checkAllCheckBox.addEventListener('input', () => {
    const checkStatus = checkAllCheckBox.checked;
    const questionCheckBoxes = document.querySelectorAll('.questionCheck');
    if (checkStatus) {
        selectAllQuestions();
    }
    else {
        removeAllQuestions();
    }
    questionCheckBoxes.forEach(questionCheck => {
        questionCheck.checked = checkStatus;
    });
});
function selectAllQuestions() {
    removeAllQuestions();
    const questionCheckBoxes = document.querySelectorAll('.questionCheck');
    questionCheckBoxes.forEach(questionCheck => {
        const questionId = Number(questionCheck.getAttribute('value'));
        QuestionIDList.push(questionId);
    });
}
function removeAllQuestions() {
    QuestionIDList.splice(0, QuestionIDList.length);
}
const randomCheckBox = document.getElementById('randomCheckBox');
const questionSelectionSection = document.getElementById('questionSelectionSection');
randomCheckBox.addEventListener('input', () => {
    if (randomCheckBox.checked) {
        questionSelectionSection.style.display = 'none';
    }
    else {
        questionSelectionSection.style.display = 'block';
    }
});
class Quiz {
}
var quizPage = 1;
var totalQuizPage = 1;
var sendQuizData = {
    keyword: ``,
    licenseID: ``
};
function fetchQuizData() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://localhost:7235/api/quizzes?page=${quizPage}`;
        try {
            const response = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendQuizData)
            });
            if (!response.ok) {
                throw new Error(`HTTP Error! Status code: ${response.status}`);
            }
            const data = yield response.json();
            console.log(data);
            totalQuizPage = data.totalPages;
            renderQuizTable(data.items);
            renderQuizPagingBar();
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
function addQuiz() {
    return __awaiter(this, void 0, void 0, function* () {
        const quizNameElement = document.querySelector('.quizName');
        const quizQuestionCntElememnt = document.querySelector('.quizQuestionCnt');
        const quizLicenseElement = document.querySelector('.quizLicense');
        const quizDescriptionElement = document.querySelector('.quizDescription');
        const randomCheckBox = document.getElementById('randomCheckBox');
        const data = {
            quizName: quizNameElement.value,
            licenseID: String(quizLicenseElement.value),
            quantity: Number(quizQuestionCntElememnt.value),
            description: String(quizDescriptionElement.value),
            hasRandomQuestions: randomCheckBox.checked,
            questionIDList: QuestionIDList
        };
        const url = `https://localhost:7235/api/quizzes/generate`;
        const response = yield fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.status !== 204) {
            throw new Error(`Http Error! Status code: ${response.status}`);
        }
        alert('Thêm bộ đề thành công');
    });
}
const quizTableBody = document.getElementById('quizTableBody');
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
    let template = document.getElementById('quiz-row-template');
    quizList.forEach(quiz => {
        let clone = document.importNode(template.content, true);
        let cells = clone.querySelectorAll('td');
        cells[0].textContent = quiz.name;
        cells[1].textContent = quiz.licenseId;
        cells[2].textContent = quiz.description;
        let quizDropdownButton = cells[3].querySelector('.quizDropDownButton');
        quizDropdownButton.addEventListener('click', () => {
            let quizDropDownContent = cells[3].querySelector('.quizDropDownContent');
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
const prevQuizButton = document.getElementById('prevQuizPageBtn');
const nextQuizButton = document.getElementById('nextQuizPageBtn');
function renderQuizPagingBar() {
    const pageBarBody = document.querySelector('.pageBarBody');
    pageBarBody.innerHTML = '';
    const pageClassName = `flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`;
    const activePageClassName = `text-red-700 flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white`;
    for (var pageCnt = 1; pageCnt <= totalQuizPage; ++pageCnt) {
        const li = document.createElement('li');
        const pageLink = document.createElement('a');
        li.setAttribute('page', pageCnt.toString());
        if (pageCnt === quizPage) {
            pageLink.className = activePageClassName;
        }
        else {
            pageLink.className = pageClassName;
        }
        pageLink.textContent = pageCnt.toString();
        li.appendChild(pageLink);
        li.addEventListener('click', () => {
            const newPage = Number(li.getAttribute('page'));
            quizPage = newPage;
        });
        pageBarBody.appendChild(li);
    }
}
prevQuizButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    --quizPage;
    if (quizPage <= 0) {
        quizPage = totalQuizPage;
    }
    yield fetchQuizData();
}));
nextQuizButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    ++quizPage;
    if (quizPage > totalQuizPage) {
        quizPage = 1;
    }
    yield fetchQuizData();
}));
const quizSearchBar = document.getElementById('quizSearchBar');
quizSearchBar.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
    const newKeyword = String(quizSearchBar.value);
    sendQuizData.keyword = newKeyword;
    quizPage = 1;
    yield fetchQuizData();
}));
const quizLicenseChecks = document.querySelectorAll('.quizLicenseCheck');
const clearQuizFilterLink = document.getElementById('clearQuizFilter');
quizLicenseChecks.forEach(quizCheck => {
    quizCheck.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
        if (quizCheck.checked) {
            const newLicenseID = String(quizCheck.getAttribute('value'));
            sendQuizData.licenseID = newLicenseID;
            quizPage = 1;
            yield fetchQuizData();
        }
    }));
});
clearQuizFilterLink.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    quizLicenseChecks.forEach(quizCheck => {
        quizCheck.checked = false;
    });
    sendQuizData.licenseID = ``;
    yield fetchQuizData();
}));
//For questions
class Answer {
}
class Question {
}
var questionPagingData = {
    questionPage: 1,
    totalQuestionPages: 1
};
var sendQuestionData = {
    keyword: ``,
    licenseid: ``
};
var QuestionIDList = [];
function fetchQuestionsDataPaging() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://localhost:7235/api/questions/${questionPagingData.questionPage}`;
        console.log(`Question fetch URL: ${url}`);
        try {
            const response = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendQuestionData)
            });
            if (!response.ok) {
                throw new Error(`HTTP Error! Status code: ${response.status}`);
            }
            const data = yield response.json();
            console.log(data);
            renderQuestionTableData(data.items);
            questionPagingData.totalQuestionPages = data.totalPages;
            renderQuestionPagingBar();
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
}
const questionTableBody = document.getElementById('questionTableBody');
function renderQuestionTableData(questionList) {
    questionTableBody.innerHTML = ``;
    if (questionList === null || questionList.length === 0) {
        return;
    }
    let template = document.getElementById('question-row-template');
    questionList.forEach(question => {
        let clone = document.importNode(template.content, true);
        let cells = clone.querySelectorAll('td');
        const questionCheckBox = cells[0].querySelector(`input[type="checkbox"]`);
        questionCheckBox.setAttribute('value', question.questionId.toString());
        if (QuestionIDList.indexOf(question.questionId) >= 0) {
            questionCheckBox.checked = true;
        }
        else {
            questionCheckBox.checked = false;
        }
        questionCheckBox.addEventListener('input', () => {
            const questionId = Number(questionCheckBox.getAttribute('value'));
            const index = QuestionIDList.indexOf(questionId);
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
        cells[3].textContent = question.isCritical ? `Có` : `Không`;
        const detailsButton = cells[4].querySelector('.detailsButton');
        detailsButton.setAttribute('quesid', question.questionId.toString());
        detailsButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const questionID = Number(detailsButton.getAttribute('quesid'));
            loadQuestionDetailsModal(questionID);
            toggleQuestionDetailsModal();
        }));
        questionTableBody.appendChild(clone);
    });
}
function fetchSingleQuestion(questionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://localhost:7235/api/questions/${questionId}`;
        const response = yield fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Http Error! Status code: ${response.status}`);
        }
        const data = yield response.json();
        const question = data;
        return question;
    });
}
function loadQuestionDetailsModal(questionId) {
    return __awaiter(this, void 0, void 0, function* () {
        var question = yield fetchSingleQuestion(questionId);
        const questionTextElement = document.getElementById('questionText');
        const questionImageElement = document.getElementById('questionImage');
        const questionModalAnswersSection = document.getElementById('questionModalAnswersSection');
        questionModalAnswersSection.innerHTML = ``;
        questionTextElement.textContent = question.questionText;
        const hasImage = (question.questionImage !== null && question.questionImage !== "" && question.questionImage !== "none");
        questionImageElement.setAttribute('srcset', (hasImage) ? `/img/${question.questionImage}` : `https://flowbite.com/docs/images/examples/image-1@2x.jpg`);
        const answerTemplate = document.getElementById('answer-template');
        question.answers.forEach(answer => {
            let clone = document.importNode(answerTemplate.content, true);
            const answerCheck = clone.querySelector('.answerCheck');
            const answerLabel = clone.querySelector('.answerLabel');
            if (answer.isCorrect) {
                answerCheck.checked = true;
            }
            answerCheck.setAttribute('value', answer.answerId.toString());
            answerLabel.textContent = answer.answerText;
            questionModalAnswersSection.appendChild(clone);
        });
    });
}
function toggleQuestionDetailsModal() {
    const questionDetailsModal = document.getElementById('questionDetailsModal');
    const opened = (!questionDetailsModal.classList.contains('hidden') && questionDetailsModal.classList.contains('flex') && questionDetailsModal.classList.contains('blur-background'));
    if (!opened) {
        questionDetailsModal.classList.remove('hidden');
        questionDetailsModal.classList.add('flex');
        questionDetailsModal.classList.add('blur-background');
        questionDetailsModal.style.zIndex = `200`;
        questionDetailsModal.style.justifyContent = 'center';
        questionDetailsModal.style.alignItems = 'center';
    }
    else {
        questionDetailsModal.classList.add('hidden');
        questionDetailsModal.classList.remove('flex');
        questionDetailsModal.classList.remove('blur-background');
        questionDetailsModal.style.zIndex = `-1`;
    }
}
const prevQuestionButton = document.getElementById('prevQuestionButton');
const nextQuestionButton = document.getElementById('nextQuestionButton');
prevQuestionButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    --questionPagingData.questionPage;
    if (questionPagingData.questionPage <= 0) {
        questionPagingData.questionPage = questionPagingData.totalQuestionPages;
    }
    yield fetchQuestionsDataPaging();
}));
nextQuestionButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    ++questionPagingData.questionPage;
    if (questionPagingData.questionPage > questionPagingData.totalQuestionPages) {
        questionPagingData.questionPage = 1;
    }
    yield fetchQuestionsDataPaging();
}));
function renderQuestionPagingBar() {
    const questionPageBar = document.getElementById('questionPageBar');
    const pageClassName = `flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`;
    const activePageClassName = `flex items-center text-red-700 justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white`;
    questionPageBar.innerHTML = ``;
    for (var pageCnt = 1; pageCnt <= questionPagingData.totalQuestionPages; ++pageCnt) {
        const li = document.createElement('li');
        li.setAttribute('page', pageCnt.toString());
        li.style.cursor = 'pointer';
        const pageLink = document.createElement('a');
        pageLink.style.cursor = 'pointer';
        if (pageCnt === questionPagingData.questionPage) {
            pageLink.className = activePageClassName;
        }
        else {
            pageLink.className = pageClassName;
        }
        pageLink.textContent = pageCnt.toString();
        li.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const newPage = Number(li.getAttribute('page'));
            questionPagingData.questionPage = newPage;
            yield fetchQuestionsDataPaging();
        }));
        li.appendChild(pageLink);
        questionPageBar.appendChild(li);
    }
}
const questionSearchBar = document.getElementById('questionSearchBar');
questionSearchBar.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
    const newKeyword = String(questionSearchBar.value);
    sendQuestionData.keyword = newKeyword;
    questionPagingData.questionPage = 1;
    yield fetchQuestionsDataPaging();
}));
const questionLicenseCheckBoxes = document.querySelectorAll('.licenseCheck');
questionLicenseCheckBoxes.forEach(checkBox => {
    checkBox.addEventListener('input', () => __awaiter(this, void 0, void 0, function* () {
        if (checkBox.checked) {
            sendQuestionData.licenseid = String(checkBox.getAttribute('value'));
            questionPagingData.questionPage = 1;
            yield fetchQuestionsDataPaging();
        }
    }));
});
function updateQuestionCount() {
    const numOfQuestion = QuestionIDList.length;
    const chosenQuestionCount = document.getElementById('chosenQuestionCount');
    chosenQuestionCount.textContent = numOfQuestion.toString() + ` Câu`;
    console.log(QuestionIDList);
}
const quizAddButton = document.getElementById('quizAddButton');
quizAddButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
    yield addQuiz();
}));
window.addEventListener('DOMContentLoaded', () => __awaiter(this, void 0, void 0, function* () {
    yield fetchQuizData();
    yield fetchQuestionsDataPaging();
}));
//# sourceMappingURL=QuizCRUD.js.map