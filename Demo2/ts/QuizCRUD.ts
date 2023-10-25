const checkAllCheckBox = document.getElementById('checkbox-all-search') as HTMLInputElement;
checkAllCheckBox.addEventListener('input', () => {
    const checkStatus: boolean = checkAllCheckBox.checked;
    const questionCheckBoxes = document.querySelectorAll('.questionCheck') as NodeListOf<HTMLInputElement>;
    questionCheckBoxes.forEach(questionCheck => {
        questionCheck.checked = checkStatus;
        const questionID = Number(questionCheck.getAttribute('value'));
        const index = QuestionIDList.indexOf(questionID);
        if (index !== -1 && checkStatus === true && !questionCheck.checked) {
            QuestionIDList.push(questionID);
            updateQuestionCount();
        } else {
            QuestionIDList.splice(index, 1);
            updateQuestionCount();
        }
    });
});

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
class Question {
    questionId: number;
    licenseId: string;
    questionText: string;
    questionImage: string;
    isCritical: boolean;
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
        cells[1].textContent = question.questionText;
        cells[2].textContent = question.licenseId;
        cells[3].textContent = question.isCritical ? `Có` : `Không`;

        questionTableBody.appendChild(clone);
    });
}

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
    chosenQuestionCount.textContent = numOfQuestion.toString();
}

const questionCheckBoxList = document.querySelectorAll('.questionCheck') as NodeListOf<HTMLInputElement>;
questionCheckBoxList.forEach(questionCheck => {
    questionCheck.addEventListener('input', () => {
        const questionID = Number(questionCheck.getAttribute('value'));
        const index = QuestionIDList.indexOf(questionID);
        if (questionCheck.checked) {
            if (index === -1) {
                QuestionIDList.push(questionID);
                updateQuestionCount();
            }
        } else {
            if (index !== -1) {
                QuestionIDList.splice(index, 1);
                updateQuestionCount();
            }
        }
    });
});

window.addEventListener('DOMContentLoaded', async () => {
    await fetchQuizData();
    await fetchQuestionsDataPaging();
});


