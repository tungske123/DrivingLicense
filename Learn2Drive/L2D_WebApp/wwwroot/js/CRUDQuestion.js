let questionBankPage = 1;
let totalQBPages = 1;
let baseLinkUrl = `https://localhost:7235`;
class Question {
    questionId;
    questionText;
    keyword = '';
    licenseId;
    isCritical;
};


var sendQuestionData = {
    keyword: ``,
    licenseID: ``,

};

const questionLicenseChecks = document.querySelectorAll('.questionLicenseCheck');

window.addEventListener('DOMContentLoaded', async () => {
    await fetchFilteredQuestionData();
    const clearQuestionBankFilter = document.getElementById('clearQuestionFilter');
    clearQuestionBankFilter.addEventListener('click', async (e) => {
        e.preventDefault();
        questionLicenseChecks.forEach(questionCheck => {
            if (questionCheck.checked === true) {
                questionCheck.checked = false;
            }
        });
        sendQuestionData.licenseID = ``;
        await fetchQuestionData()
    });
    await fetchQuestionData();
});


async function fetchQuestionData() {
    try {
        const url = `${baseLinkUrl}/api/questions/${questionBankPage}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendQuestionData)
        });
        if (!response.ok) {
            throw new Error(`Http Error! Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        totalQBPages = data.totalPages;
        renderDataTableBody(data.items);
        renderQuestionBankPagingBar();
    } catch (error) {
        console.error(error);
    }
    return null;
}

const questionBankTableBody = document.getElementById('questionBankTableBody');

function renderDataTableBody(questionList) {
    questionBankTableBody.innerHTML = ``;
    let template = document.getElementById('templatequestionbody');

    console.log('Question List:' + questionList);
    if (questionList !== null && questionList.length > 0) {
        questionList.forEach(question => {
            let clone = document.importNode(template.content, true);

            let cells = clone.querySelectorAll('td');
            cells[0].textContent = question.questionId;
            cells[1].textContent = question.questionText;
            cells[2].textContent = question.licenseId;
            if (question.isCritical == true) {
                cells[3].innerHTML =
                    `<div class="flex items-center">
            <div class="h-2.5 w-2.5 rounded-full bg-red-500 me-2 mr-1"></div>
            Có
        </div> `;
            } else {
                cells[3].innerHTML =
                    `<div class="flex items-center">
            <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2 mr-1"></div>
            Không
        </div>`;
            }
            let deleteQuestionBtn = cells[4].querySelector('.deleteQuestionBtn');
            deleteQuestionBtn.setAttribute('qid', question.questionId.toString());
            deleteQuestionBtn.addEventListener('click', async () => {
                const result = await Swal.fire({
                    icon: 'question',
                    title: 'Xác nhận xóa câu hỏi?',
                    showCancelButton: true,
                    cancelButtonText: 'Hủy',
                    confirmButtonText: 'Xóa',
                    confirmButtonColor: '#d90429'
                });
                if (!result.isConfirmed) {
                    return;
                }

                let questionId = deleteQuestionBtn.getAttribute('qid');
                await deleteQuestion(questionId);
                await fetchQuestionData();
            });

            let editQuestionButton = cells[4].querySelector('.editQuestionButton');
            editQuestionButton.setAttribute('qid', question.questionId.toString());
            editQuestionButton.addEventListener('click', () => {
                let qid = parseInt(editQuestionButton.getAttribute('qid'));
                window.location.href = `/Question/QuestionDetail?questionID=${qid}`;
            });
            questionBankTableBody.appendChild(clone);
        })
    }
}

async function deleteQuestion(questionId) {
    try {
        const url = `https://localhost:7235/api/question/delete/${questionId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi xóa câu hỏi',
                text: `${response.status} - ${response.statusText}`,
                confirmButtonColor: '#d90429'
            });
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Xóa câu hỏi thành công!',
            confirmButtonColor: '#d90429'
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi xóa câu hỏi',
            text: `${error}`,
            confirmButtonColor: '#d90429'
        });
    }
}

function renderQuestionBankPagingBar() {
    const pageQuestionBank = document.querySelector('.pageQuestionBank');
    pageQuestionBank.innerHTML = '';
    let pageQuestionBankTemplate = document.getElementById('pageItemforQuestionBankTemplate');
    for (var pageCount = 1; pageCount <= totalQBPages; ++pageCount) {
        let clone = document.importNode(pageQuestionBankTemplate.content, true);
        let pageQBItem = clone.querySelector('li button');
        pageQBItem.setAttribute('page', pageCount.toString());
        if (parseInt(questionBankPage) === parseInt(pageCount)) {
            pageQBItem.classList.add('active-page');
        }
        pageQBItem.textContent = pageCount.toString();
        pageQBItem.addEventListener('click', async () => {
            let newPage = Number(pageQBItem.getAttribute('page'));
            questionBankPage = newPage;
            await fetchQuestionData();
        });
        pageQuestionBank.appendChild(clone);
    }
}

let prevQuestionBankBtn = document.getElementById('prevQuestionPageBtn');
prevQuestionBankBtn.addEventListener('click', async () => {
    --questionBankPage;
    if (questionBankPage <= 0) {
        questionBankPage = totalQBPages;
    }
    await fetchQuestionData();
});

let nextQuestionBankBtn = document.getElementById('nextQuestionPageBtn');
nextQuestionBankBtn.addEventListener('click', async () => {
    ++questionBankPage;
    if (questionBankPage > totalQBPages) {
        questionBankPage = 1;
    }
    await fetchQuestionData();
});


async function fetchFilteredQuestionData() {
    try {
        const url = `${baseLinkUrl}/api/questions/filterQuestions`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP Error! Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const licenseIdList = data.licenseIdList;
        loadLiencseIDListFilter(licenseIdList);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}



function loadLiencseIDListFilter(lienseIDList) {
    let QBFilterContent = document.querySelector('.questionBankFilterContent');
    QBFilterContent.innerHTML = ``;
    if (lienseIDList === null || lienseIDList.length === 0) {
        return;
    }
    console.log('License id list: ' + lienseIDList);
    let templateFilterData = document.getElementById('questionBankFilterTemplate');
    lienseIDList.forEach(licenseId => {
        let clone = document.importNode(templateFilterData.content, true);
        let checkInput = clone.querySelector('input');
        let label = clone.querySelector('label');
        checkInput.value = licenseId;
        checkInput.setAttribute('id', licenseId);;
        checkInput.addEventListener('input', async () => {
            let newLicenseID = checkInput.value;
            sendQuestionData.licenseID = newLicenseID;
            questionBankPage = 1;
            await fetchQuestionData();
        });
        label.textContent = `Bằng ${licenseId}`;
        label.setAttribute('for', licenseId);
        QBFilterContent.appendChild(clone);
    });
}
// function fetchLicenseFilter() {
//   const url = `https://localhost:7235/api/licenses`;
//   fetch(url, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       var license = document.getElementById("filterLicenseId");
//       const ul = document.querySelector(".ulLicenseID");
//       ul.innerHTML = "";
//       data.forEach((element) => {
//         var clone = document.importNode(license.content, true);
//         var cells = clone.querySelector("input");
//         var label = clone.querySelector("li label");

//         cells.value = element.licenseId;
//         label.textContent = element.licenseId;

//         var radioId = "licenseRadio" + element.licenseId;
//         var radio = clone.querySelector("input");
//         radio.id = radioId;
//         radio.value = element.licenseId;
//         label.setAttribute("for", radioId);
//         radio.addEventListener('input', () => {
//           bodydata.licenseID = radio.value;
//           fetchdata();
//         });
//         ul.appendChild(clone);
//       });
//     });
// }


// function deleteAccount(qid) {
//   const url = `https://localhost:7235/api/question/delete/${qid}`;

//   fetch(url, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => {
//       if (!response.ok) {
//         Swal.fire({
//           icon: "error",
//           title: "Lỗi xóa câu hỏi",
//           text: `${response.status} - ${response.statusText}`,
//           confirmButtonColor: `#FF0000`,
//         });
//         return;
//       }
//       Swal.fire({
//         icon: `success`,
//         title: `Xóa câu hỏi thành công!`,
//         confirmButtonColor: `#FF0000`,
//       });
//       fetchdata();
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// function getquestionbyId(qid) {
//   var url = `https://localhost:7235/api/question/get/${qid}`;
//   try {
//     const response = fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const data = response.json();
//     console.log(data);
//     return data;
//   } catch (error) {
//     console.error(`Error! ${error}`);
//   }
// }


// let criticalCheckBox = document.getElementById('criticalCheckBox');
// criticalCheckBox.addEventListener('input', () => {
//   bodydata.isCritical = criticalCheckBox.checked;
//   fetchdata();
// });

// let searchQuestionInput = document.getElementById('searchQuestion');
// searchQuestionInput.addEventListener('input', () => {
//   let newKeyword = searchQuestionInput.value;
//   bodydata.keyword = newKeyword;
//   fetchdata();
// });

// let clearFilterLink = document.getElementById('clearQuestionFilter');
// clearFilterLink.addEventListener('input', () => {
//   bodydata.keyword = ``;
//   bodydata.licenseID = ``;
//   bodydata.isCritical = null;
// });

