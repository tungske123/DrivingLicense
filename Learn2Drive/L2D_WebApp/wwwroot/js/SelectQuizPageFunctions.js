//for circle on page button
var pageItemList = document.querySelectorAll('.page_item');
pageItemList.forEach(function (pageItem) {
    var pageCnt = parseInt(pageItem.getAttribute("cnt"));
    pageItem.addEventListener('mouseover', function () {
        var page_circle = this.querySelector('.page-circle');
        var pageNumber = this.querySelector('.pagination__number');
        pageNumber.style = 'color: white';
        page_circle.style.display = 'unset';
    });
    pageItem.addEventListener('mouseout', function () {
        var page_circle = this.querySelector('.page-circle');
        var pageNumber = this.querySelector('.pagination__number');
        if (pageCnt !== currentPage) {
            pageNumber.style = 'color: black';
            page_circle.style.display = 'none';
        }
    });
});
pageItemList.forEach(function (pageItem) {
    var pageCnt = parseInt(pageItem.getAttribute('cnt'));
    var pageNumber = pageItem.querySelector('.pagination__number');
    if (pageCnt === currentPage) {
        var page_circle = pageItem.querySelector('.page-circle');
        pageNumber.style = 'color: white';
        page_circle.style.display = 'unset';
    }
});

//paging functions
function goToPage(pageItem) {
    var pageCnt = parseInt(pageItem.getAttribute("cnt"));
    window.location = '/Quiz?licenseid=' + LicenseID + '&status=' + status + '&page=' + pageCnt;
}
function goToNextPage() {
    currentPage++;
    if (currentPage > totalPage) {
        currentPage = 1;
    }
    window.location = '/Quiz?licenseid=' + LicenseID + '&status=' + status + '&page=' + currentPage;
}
function goToPrevPage() {
    currentPage--;
    if (currentPage < 1) {
        currentPage = totalPage;
    }
    window.location = '/Quiz?licenseid=' + LicenseID + '&status=' + status + '&page=' + currentPage;
}

//For checking select options value
const licenseSelect = document.getElementById('license_option');
for (const option of licenseSelect) {
    if (option.value === LicenseID) {
        option.selected = true;
        break;
    }
}
const statusSelect = document.getElementById('status_option');
for (const option of statusSelect) {
    if (option.value === status) {
        option.selected = true;
        break;
    }
}

//For api call
async function fetchUserQuizStatus() {
    try {
        const response = await fetch('/Quiz/APIQuizStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response is not Ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error: ' + error);
    }
}

let quizAttemptBtnList = document.querySelectorAll('.quizAttemptBtn');
quizAttemptBtnList.forEach(quizAttemptBtn => {
    quizAttemptBtn.addEventListener('click', () => {
        var quizId = parseInt(quizAttemptBtn.getAttribute('qid'));
        Swal.fire({
            icon: 'question',
            title: "Xác nhận vào làm lại đề này?",
            showCancelButton: true,
            confirmButtonText: `Làm`,
            confirmButtonColor: `#d90429`,
            cancelButtonText: `Hủy`
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = `/Quiz/StartQuiz?qid=${parseInt(quizId)}`;
            }
        });
    });
});

async function fetchLicenseData() {
    try {
        const url = `https://localhost:7235/api/licenses`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error(`Error! ${response.status} - ${response.statusText}`);
            return;
        }
        const data = await response.json();
        const licenseIdList = data.map(l => l.licenseId);
        
    } catch (error) {
        console.error(error);
    }
}

function renderLicenseSelectData(licenseIdList) {
    if (licenseIdList === null || licenseIdList.length === 0) {
        console.log('No license data');
        return;
    }
    let licenseSelect = document.querySelector('.licenseSelect');
    while (licenseSelect.options.length > 0) {
        licenseSelect.remove(0);
    }

    licenseIdList.forEach(licenseid => {
        let option = document.createElement('option');
        option.value = licenseid;
        option.text = `Bằng ${licenseid}`;
        licenseSelect.add(option);
    });
}

async function fetchQuizStatus() {
    var quizData;
    try {
        quizData = await fetchUserQuizStatus();
        const quizArray = [...quizData];
        var quizCards = document.querySelectorAll('.quiz-card');
        for (var i = 0; i < quizCards.length; ++i) {
            var card = quizCards[i];
            var quizID = parseInt(card.getAttribute("qid"));
            var quizStatus = card.querySelector('.card-body .status');
            if (quizArray.includes(quizID)) {
                console.log('Quiz data contains ' + quizID);
                quizStatus.style = 'color: green';
                quizStatus.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-check-circle mb-1" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path
                                            d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                                    </svg> Đã làm`;
            } else {
                quizStatus.style = 'color: red';
                quizStatus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path
                                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg> Chưa làm`;
            }
        }
    } catch (error) {
        console.error('Error fetching quiz data:', error);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    await fetchLicenseData();
    await fetchQuizStatus();
});
