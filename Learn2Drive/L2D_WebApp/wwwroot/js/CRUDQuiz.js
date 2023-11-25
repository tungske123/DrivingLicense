const checkAllCheckBox = document.getElementById('checkbox-all-search');
checkAllCheckBox.addEventListener('input', () => {
    const checkStatus = checkAllCheckBox.checked;
    const questionCheckBoxes = document.querySelectorAll('.questionCheck');
    if (checkStatus) {
        selectAllQuestions();
    } else {
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
    } else {
        questionSelectionSection.style.display = 'block';
    }
});


var quizPage = 1;
var totalQuizPage = 1;
var sendQuizData = {
    keyword: ``,
    licenseID: ``
};

async function fetchQuizData() {
    const url = `https://localhost:7235/api/quizzes?page=${quizPage}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendQuizData)
        });
        if (!response.ok) {
            throw new Error(`HTTP Error! Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        totalQuizPage = data.totalPages;
        renderQuizTable(data.items);
        renderQuizPagingBar();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function addQuiz() {
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
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.status !== 204) {
        throw new Error(`Http Error! Status code: ${response.status}`);
    }
    Swal.fire({
        icon: 'success',
        title: 'Thêm bộ đề thành công!',
        confirmButtonColor: '#d90429'
    });
}

const quizTableBody = document.getElementById('quizTableBody');


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
            } else {
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
        } else {
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

prevQuizButton.addEventListener('click', async () => {
    --quizPage;
    if (quizPage <= 0) {
        quizPage = totalQuizPage;
    }
    await fetchQuizData();
});

nextQuizButton.addEventListener('click', async () => {
    ++quizPage;
    if (quizPage > totalQuizPage) {
        quizPage = 1;
    }
    await fetchQuizData();
});

const quizSearchBar = document.getElementById('quizSearchBar');
quizSearchBar.addEventListener('input', async () => {
    const newKeyword = String(quizSearchBar.value);
    sendQuizData.keyword = newKeyword;
    quizPage = 1;
    await fetchQuizData();
})

const quizLicenseChecks = document.querySelectorAll('.quizLicenseCheck');




var questionPagingData = {
    questionPage: 1,
    totalQuestionPages: 1
};
var sendQuestionData = {
    keyword: ``,
    licenseid: ``
};
var QuestionIDList = [];
async function fetchQuestionsDataPaging() {
    const url = `https://localhost:7235/api/questions/${questionPagingData.questionPage}`;
    console.log(`Question fetch URL: ${url}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendQuestionData)
        });
        if (!response.ok) {
            throw new Error(`HTTP Error! Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        renderQuestionTableData(data.items);
        questionPagingData.totalQuestionPages = data.totalPages;
        renderQuestionPagingBar();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
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
        } else {
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
            } else {
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
        detailsButton.addEventListener('click', async () => {
            const questionID = Number(detailsButton.getAttribute('quesid'));
            loadQuestionDetailsModal(questionID);
            toggleQuestionDetailsModal();
        })
        questionTableBody.appendChild(clone);
    });
}

async function fetchSingleQuestion(questionId) {
    const url = `https://localhost:7235/api/questions/${questionId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`Http Error! Status code: ${response.status}`);
    }
    const data = await response.json();
    const question = data;
    return question;
}

async function loadQuestionDetailsModal(questionId) {
    var question = await fetchSingleQuestion(questionId);
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
    } else {
        questionDetailsModal.classList.add('hidden');
        questionDetailsModal.classList.remove('flex');
        questionDetailsModal.classList.remove('blur-background');
        questionDetailsModal.style.zIndex = `-1`;
    }
}

const prevQuestionButton = document.getElementById('prevQuestionButton');
const nextQuestionButton = document.getElementById('nextQuestionButton');
prevQuestionButton.addEventListener('click', async () => {
    --questionPagingData.questionPage;
    if (questionPagingData.questionPage <= 0) {
        questionPagingData.questionPage = questionPagingData.totalQuestionPages;
    }
    await fetchQuestionsDataPaging();
});
nextQuestionButton.addEventListener('click', async () => {
    ++questionPagingData.questionPage;
    if (questionPagingData.questionPage > questionPagingData.totalQuestionPages) {
        questionPagingData.questionPage = 1;
    }
    await fetchQuestionsDataPaging();
});

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
        } else {
            pageLink.className = pageClassName;
        }
        pageLink.textContent = pageCnt.toString();
        li.addEventListener('click', async () => {
            const newPage = Number(li.getAttribute('page'));
            questionPagingData.questionPage = newPage;
            await fetchQuestionsDataPaging();
        });
        li.appendChild(pageLink);
        questionPageBar.appendChild(li);
    }
}

const questionSearchBar = document.getElementById('questionSearchBar');
questionSearchBar.addEventListener('input', async () => {
    const newKeyword = String(questionSearchBar.value);
    sendQuestionData.keyword = newKeyword;
    questionPagingData.questionPage = 1;
    await fetchQuestionsDataPaging();
});

const questionLicenseCheckBoxes = document.querySelectorAll('.licenseCheck');
questionLicenseCheckBoxes.forEach(checkBox => {
    checkBox.addEventListener('input', async () => {
        if (checkBox.checked) {
            sendQuestionData.licenseid = String(checkBox.getAttribute('value'));
            questionPagingData.questionPage = 1;
            await fetchQuestionsDataPaging();
        }
    });
});

function updateQuestionCount() {
    const numOfQuestion = QuestionIDList.length;
    const chosenQuestionCount = document.getElementById('chosenQuestionCount');
    chosenQuestionCount.textContent = numOfQuestion.toString() + ` Câu`;
    console.log(QuestionIDList);
}

const quizAddButton = document.getElementById('quizAddButton');
quizAddButton.addEventListener('click', async () => {
    await addQuiz();
});


async function fetchLicenseFilterData() {
    try {
        const url = `https://localhost:7235/api/licenses`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        let licenseList = data.map(l => l.licenseId);
        loadQuizFilterData(licenseList);
    } catch (error) {
        console.error(error);
    }
}

function loadQuizFilterData(licenseList) {
    let quizFilterContent = document.querySelector('.quizFilterContent');
    quizFilterContent.innerHTML = ``;
    if (licenseList === null || licenseList.length === 0) {
        return;
    }
    let quizFilterItemTemplate = document.getElementById('quizFilterItemTemplate');
    licenseList.forEach(licenseId => {
        let clone = document.importNode(quizFilterItemTemplate.content, true);
        let checkInput = clone.querySelector('input');
        let label = clone.querySelector('label');
        checkInput.value = licenseId;
        checkInput.setAttribute('id', licenseId);
        checkInput.addEventListener('input', async () => {
            let newLicenseID = checkInput.value;
            sendQuizData.licenseID = newLicenseID;
            quizPage = 1;
            await fetchQuizData();
        });
        label.textContent = `Bằng ${licenseId}`;
        label.setAttribute('for', licenseId);

        quizFilterContent.appendChild(clone);
    });
}


window.addEventListener('DOMContentLoaded', async () => {
    await fetchLicenseFilterData();
    const clearQuizFilterLink = document.getElementById('clearQuizFilter');
    clearQuizFilterLink.addEventListener('click', async (e) => {
        e.preventDefault();
        quizLicenseChecks.forEach(quizCheck => {
            if (quizCheck.checked === true) {
                quizCheck.checked = false;
            }
        });
        sendQuizData.licenseID = ``;
        await fetchQuizData();
    });
    await fetchQuizData();
    await fetchQuestionsDataPaging();
});


