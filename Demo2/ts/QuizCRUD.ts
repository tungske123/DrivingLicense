const checkAllCheckBox = document.getElementById('checkbox-all-search') as HTMLInputElement;
checkAllCheckBox.addEventListener('input', () => {
    const checkStatus: boolean = checkAllCheckBox.checked;
    const questionCheckBoxes = document.querySelectorAll('.questionCheck') as NodeListOf<HTMLInputElement>;
    questionCheckBoxes.forEach(questionCheck => {
        questionCheck.checked = checkStatus;
    });
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
}

const quizTableBody = document.getElementById('quizTableBody');

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

window.addEventListener('DOMContentLoaded', async () => {
    await fetchQuizData();
});