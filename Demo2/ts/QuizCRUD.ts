const checkAllCheckBox = document.getElementById('checkbox-all-search') as HTMLInputElement;
checkAllCheckBox.addEventListener('input', () => {
    const checkStatus: boolean = checkAllCheckBox.checked;
    const questionCheckBoxes = document.querySelectorAll('.questionCheck') as NodeListOf<HTMLInputElement>;
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
    const questionCheckBoxes = document.querySelectorAll('.questionCheck') as NodeListOf<HTMLInputElement>;
    questionCheckBoxes.forEach(questionCheck => {
        const questionId = Number(questionCheck.getAttribute('value'));
        QuestionIDList.push(questionId);
    });
}

function removeAllQuestions() {
    QuestionIDList.splice(0, QuestionIDList.length);
}

const randomCheckBox = document.getElementById('randomCheckBox') as HTMLInputElement;
const questionSelectionSection = document.getElementById('questionSelectionSection') as HTMLHeadingElement;
randomCheckBox.addEventListener('input', () => {
    if (randomCheckBox.checked) {
        questionSelectionSection.style.display = 'none';
    } else {
        questionSelectionSection.style.display = 'block';
    }
});

class Quiz {
    quizId: number;
    licenseId: string;
    name: string;
    description: string;
}
var quizPage: number = 1;
var totalQuizPage: number = 1;
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
    const quizNameElement = document.querySelector('.quizName') as HTMLInputElement;
    const quizQuestionCntElememnt = document.querySelector('.quizQuestionCnt') as HTMLInputElement;
    const quizLicenseElement = document.querySelector('.quizLicense') as HTMLInputElement;
    const quizDescriptionElement = document.querySelector('.quizDescription') as HTMLInputElement;
    const randomCheckBox = document.getElementById('randomCheckBox') as HTMLInputElement;
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
    alert('Thêm bộ đề thành công');
}

const quizTableBody = document.getElementById('quizTableBody');

function toggleQuizDetailsModal() {

}

function toogleQuizUpdateModal() {

}

function toggleQuizDeleteModal() {

}

function renderQuizTable(quizList: Quiz[]) {
    quizTableBody.innerHTML = '';
    if (quizList === null || quizList.length === 0) {
        return;
    }
    let template = document.getElementById('quiz-row-template') as HTMLTemplateElement;
    quizList.forEach(quiz => {
        let clone = document.importNode(template.content, true);
        let cells = clone.querySelectorAll('td') as NodeListOf<HTMLTableCellElement>;
        cells[0].textContent = quiz.name;
        cells[1].textContent = quiz.licenseId;
        cells[2].textContent = quiz.description;
        let quizDropdownButton = cells[3].querySelector('.quizDropDownButton') as HTMLButtonElement;
        quizDropdownButton.addEventListener('click', () => {
            let quizDropDownContent = cells[3].querySelector('.quizDropDownContent') as HTMLDivElement;
            if (!quizDropDownContent.classList.contains('open-dropdown')) {
                quizDropDownContent.classList.add('open-dropdown');
            } else {
                quizDropDownContent.classList.remove('open-dropdown');
            }
        });
        quizTableBody.appendChild(clone);
    });
}

const prevQuizButton = document.getElementById('prevQuizPageBtn') as HTMLButtonElement;
const nextQuizButton = document.getElementById('nextQuizPageBtn') as HTMLButtonElement;

function renderQuizPagingBar() {
    const pageBarBody = document.querySelector('.pageBarBody') as HTMLSpanElement;
    pageBarBody.innerHTML = '';
    const pageClassName: string = `flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`;
    const activePageClassName: string = `text-red-700 flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white`;
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

const quizSearchBar = document.getElementById('quizSearchBar') as HTMLInputElement;
quizSearchBar.addEventListener('input', async () => {
    const newKeyword = String(quizSearchBar.value);
    sendQuizData.keyword = newKeyword;
    quizPage = 1;
    await fetchQuizData();
})

const quizLicenseChecks = document.querySelectorAll('.quizLicenseCheck') as NodeListOf<HTMLInputElement>;
const clearQuizFilterLink = document.getElementById('clearQuizFilter') as HTMLAnchorElement;
quizLicenseChecks.forEach(quizCheck => {
    quizCheck.addEventListener('input', async () => {
        if (quizCheck.checked) {
            const newLicenseID: string = String(quizCheck.getAttribute('value'));
            sendQuizData.licenseID = newLicenseID;
            quizPage = 1;
            await fetchQuizData();
        }
    });
});

clearQuizFilterLink.addEventListener('click', async (e) => {
    e.preventDefault();
    quizLicenseChecks.forEach(quizCheck => {
        quizCheck.checked = false;
    });
    sendQuizData.licenseID = ``;
    await fetchQuizData();
});



//For questions
class Answer {
    answerId: number;
    questionId: number;
    isCorrect: boolean;
    answerText: string;
    answerImage: string;
}
class Question {
    questionId: number;
    licenseId: string;
    questionText: string;
    questionImage: string;
    isCritical: boolean;
    answers: Answer[];
}

var questionPagingData = {
    questionPage: 1,
    totalQuestionPages: 1
};
var sendQuestionData = {
    keyword: ``,
    licenseid: ``
};
var QuestionIDList: number[] = [];
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

const questionTableBody = document.getElementById('questionTableBody') as HTMLTableSectionElement;

function renderQuestionTableData(questionList: Question[]) {
    questionTableBody.innerHTML = ``;
    if (questionList === null || questionList.length === 0) {
        return;
    }
    let template = document.getElementById('question-row-template') as HTMLTemplateElement;
    questionList.forEach(question => {
        let clone = document.importNode(template.content, true);
        let cells = clone.querySelectorAll('td') as NodeListOf<HTMLTableCellElement>;
        const questionCheckBox = cells[0].querySelector(`input[type="checkbox"]`) as HTMLInputElement;
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
        const detailsButton = cells[4].querySelector('.detailsButton') as HTMLButtonElement;
        detailsButton.setAttribute('quesid', question.questionId.toString());
        detailsButton.addEventListener('click', async () => {
            const questionID = Number(detailsButton.getAttribute('quesid'));
            loadQuestionDetailsModal(questionID);
            toggleQuestionDetailsModal();
        })
        questionTableBody.appendChild(clone);
    });
}

async function fetchSingleQuestion(questionId: number): Promise<Question> {
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
    const question: Question = data;
    return question;
}

async function loadQuestionDetailsModal(questionId: number) {
    var question = await fetchSingleQuestion(questionId);
    const questionTextElement = document.getElementById('questionText') as HTMLInputElement;
    const questionImageElement = document.getElementById('questionImage') as HTMLImageElement;
    const questionModalAnswersSection = document.getElementById('questionModalAnswersSection') as HTMLDivElement;
    questionModalAnswersSection.innerHTML = ``;
    questionTextElement.textContent = question.questionText;
    const hasImage: boolean = (question.questionImage !== null && question.questionImage !== "" && question.questionImage !== "none");
    questionImageElement.setAttribute('srcset', (hasImage) ? `/img/${question.questionImage}` : `https://flowbite.com/docs/images/examples/image-1@2x.jpg`);
    const answerTemplate = document.getElementById('answer-template') as HTMLTemplateElement;
    question.answers.forEach(answer => {
        let clone = document.importNode(answerTemplate.content, true);
        const answerCheck = clone.querySelector('.answerCheck') as HTMLInputElement;
        const answerLabel = clone.querySelector('.answerLabel') as HTMLLabelElement;
        if (answer.isCorrect) {
            answerCheck.checked = true;
        }
        answerCheck.setAttribute('value', answer.answerId.toString());
        answerLabel.textContent = answer.answerText;
        questionModalAnswersSection.appendChild(clone);
    });
}

function toggleQuestionDetailsModal() {
    const questionDetailsModal = document.getElementById('questionDetailsModal') as HTMLDivElement;
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

const prevQuestionButton = document.getElementById('prevQuestionButton') as HTMLButtonElement;
const nextQuestionButton = document.getElementById('nextQuestionButton') as HTMLButtonElement;
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
    const questionPageBar = document.getElementById('questionPageBar') as HTMLSpanElement;
    const pageClassName: string = `flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`;
    const activePageClassName: string = `flex items-center text-red-700 justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white`;
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

const questionSearchBar = document.getElementById('questionSearchBar') as HTMLInputElement;
questionSearchBar.addEventListener('input', async () => {
    const newKeyword = String(questionSearchBar.value);
    sendQuestionData.keyword = newKeyword;
    questionPagingData.questionPage = 1;
    await fetchQuestionsDataPaging();
});

const questionLicenseCheckBoxes = document.querySelectorAll('.licenseCheck') as NodeListOf<HTMLInputElement>;
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
    const chosenQuestionCount = document.getElementById('chosenQuestionCount') as HTMLSpanElement;
    chosenQuestionCount.textContent = numOfQuestion.toString() + ` Câu`;
    console.log(QuestionIDList);
}

const quizAddButton = document.getElementById('quizAddButton') as HTMLButtonElement;
quizAddButton.addEventListener('click', async () => {
    await addQuiz();
});
window.addEventListener('DOMContentLoaded', async () => {
    await fetchQuizData();
    await fetchQuestionsDataPaging();
});


