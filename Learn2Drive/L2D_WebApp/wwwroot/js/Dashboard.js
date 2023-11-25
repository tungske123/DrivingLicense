let totalPage = 1;
let page = 1;
let pageSize = 7;
let quizStatList;
function fetchDashboardData() {

    const fetchDashboardAPI = `https://localhost:7235/api/dashboard`;

    fetch(fetchDashboardAPI, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("error");
        }
        return response.json();
    }).then(data => {
        const dashboardData = data;
        console.log(dashboardData);
        renderDashBoardData(dashboardData);
        quizStatList = dashboardData.quizStatData;
        totalPage = calculateTotalPage(quizStatList, pageSize);
        renderQuizTable(paginateArray(quizStatList, pageSize, page));
        renderPagingBar();
    }).then(error => {
        console.error(error);
    });
}

function paginateArray(array, pageSize, pageNumber) {
    // calculate the start index
    let startIndex = (pageNumber - 1) * pageSize;
    startItemCnt = startIndex + 1;
    // return a slice of the array
    return array.slice(startIndex, startIndex + pageSize);
}

function calculateTotalPage(array, pageSize) {
    return Math.ceil(array.length / pageSize);
}

function goToPage(page) {
    renderQuizTable(paginateArray(quizStatList, pageSize, page));
    totalPage = calculateTotalPage(quizStatList, pageSize);
    renderPagingBar();
}

function renderPagingBar() {
    // let pageLinkTemplate = document.getElementById('pageLinkTemplate');
    // let pageBar = document.getElementById('pageBar');
    // pageBar.innerHTML = ``;
    // for (var cnt = 1; cnt <= totalPage; ++cnt) {
    //     let clone = document.importNode(pageLinkTemplate.content, true);
    //     let pageLink = clone.querySelector('li a');
    //     pageLink.textContent = cnt.toString();
    //     pageLink.setAttribute('page', cnt.toString());
    //     if (parseInt(cnt) === parseInt(page)) {
    //         pageLink.style = `color: red`;
    //     }
    //     pageLink.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         var newPage = parseInt(pageLink.getAttribute('page'));
    //         page = newPage;
    //         goToPage(page);
    //     });
    //     pageBar.appendChild(clone);
    // }
    let pageBarBody = document.querySelector(".pageBarBody");
    pageBarBody.innerHTML = ``;
    for (var cnt = 1; cnt <= totalPage; ++cnt) {
        let pageItemTemplate = document.getElementById("pageItemTemplate");
        let clone = document.importNode(pageItemTemplate.content, true);
        let pageLink = clone.querySelector("li a");
        if (parseInt(cnt) === parseInt(page)) {
            // pageLink.classList.add("active-page");
            pageLink.style = `color: red`;
        }
        pageLink.setAttribute("page", cnt.toString());
        pageLink.textContent = cnt.toString();
        pageLink.addEventListener("click", (e) => {
            e.preventDefault(); //Chặn chuyển trang
            let newPage = parseInt(pageLink.getAttribute("page")); //Lấy giá trị page hiện tại
            page = newPage;
            console.log(`Current page: ${page}`);
            goToPage(page);
        });
        pageBarBody.appendChild(clone);
    }
}

let prevPageBtn = document.getElementById('prevPageBtn');
let nextPageBtn = document.getElementById('nextPageBtn');

prevPageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    --page;
    if (page <= 0) {
        page = totalPage;
    }
    goToPage(page);
});

nextPageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    ++page;
    if (page > totalPage) {
        page = 1;
    }
    goToPage(page);
});

function renderDashBoardData(dashboard) {
    const User = document.getElementById("total_user");
    User.innerHTML = ` <strong>Số lượng Học viên: ${dashboard.totalUser}</strong>`;
    const Teacher = document.getElementById("total_teacher");
    Teacher.innerHTML = ` <strong>Số lượng Giáo viên: ${dashboard.totalTeacher}</strong>`;
    const Staff = document.getElementById("total_staff");
    Staff.innerHTML = ` <strong>Số lượng Nhân viên: ${dashboard.totalStaff}</strong>`;
    const Examprofile = document.getElementById("totalExProfile");
    Examprofile.innerHTML = ` <strong>Số lượt đăng ký thi: ${dashboard.totalExProfile}</strong>`;
    const PassExam = document.getElementById("totalPassEx");
    PassExam.innerHTML = ` <strong>Số lượt thi thành công : ${dashboard.totalPassEx}</strong>`;
    const Quizz = document.getElementById("totalQuiz");
    Quizz.innerHTML = ` <strong>Số lượng đề thi thử: ${dashboard.totalQuiz}</strong>`;
    const PassAttempt = document.getElementById("totalPassAttempt");
    PassAttempt.innerHTML = ` <strong>Số lượng đậu thi thử: ${dashboard.totalPassAttempt}</strong>`;
}

function renderQuizTable(attempts) {
    const quizTableBody = document.getElementById('quizTableBody');
    quizTableBody.innerHTML = '';
    let quizTableRowTemplate = document.getElementById('quizTableRowTemplate');
    attempts.forEach(quizStat => {
        let clone = document.importNode(quizTableRowTemplate.content, true);
        let cells = clone.querySelectorAll('td');
        cells[0].textContent = quizStat.quizName;
        cells[1].textContent = quizStat.licenseId;
        cells[2].textContent = (quizStat.totalDoneCnt !== null) ? quizStat.totalDoneCnt.toString() : ``;
        let totalAttemptCnt = quizStat.attempts.length;
        console.log(`Total attempt cnt: ${totalAttemptCnt}`);
        let passAttemptCnt = quizStat.attempts.filter(att => att.result === true).length;
        console.log(`Total pass attempt cnt: ${passAttemptCnt}`);
        let passRate = (parseInt(totalAttemptCnt) !== 0) ? (parseInt(passAttemptCnt) * 100 / parseInt(totalAttemptCnt)).toFixed(2) : 0;
        cells[3].textContent = `${passRate}%`;
        quizTableBody.appendChild(clone);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    fetchDashboardData();
});