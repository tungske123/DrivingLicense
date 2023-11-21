let totalPage = 1;
let page = 1;
let pageSize = 7;
let totalDoneQuiz;
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
        const dashboard = data;
        console.log(dashboard);
        renderDashBoardData(dashboard);
        totalDoneQuiz = dashboard.totalDoneQuiz;
        totalPage = calculateTotalPage(totalDoneQuiz, pageSize);
        renderQuizTable(paginateArray(totalDoneQuiz, pageSize, page));
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
    renderQuizTable(paginateArray(totalDoneQuiz, pageSize, page));
    totalPage = calculateTotalPage(totalDoneQuiz, pageSize);
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
    User.innerHTML = ` <strong>${dashboard.totalUser} Học viên</strong>`;
    const Teacher = document.getElementById("total_teacher");
    Teacher.innerHTML = ` <strong>${dashboard.totalTeacher} Giáo viên</strong>`;
    const Staff = document.getElementById("total_staff");
    Staff.innerHTML = ` <strong>${dashboard.totalStaff} Nhân viên</strong>`;
    const Examprofile = document.getElementById("totalExProfile");
    Examprofile.innerHTML = ` <strong>Số lượt đăng ký thi: ${dashboard.totalExProfile}</strong>`;
    const PassExam = document.getElementById("totalPassEx");
    PassExam.innerHTML = ` <strong>Tổng điểm thi đậu: ${dashboard.totalPassEx}</strong>`;
    const Quizz = document.getElementById("totalQuiz");
    Quizz.innerHTML = ` <strong>Số lượng đề thi: ${dashboard.totalQuiz}</strong>`;
    const PassAttempt = document.getElementById("totalPassAttempt");
    PassAttempt.innerHTML = ` <strong>Số lượt thi đạt: ${dashboard.totalPassAttempt}</strong>`;
}

function renderQuizTable(totaldidquiz) {
    const quizTableBody = document.getElementById('quizTableBody');
    quizTableBody.innerHTML = '';
    let quizTableRowTemplate = document.getElementById('quizTableRowTemplate');
    totaldidquiz.forEach(x => {
        console.log(totaldidquiz.name);

        let clone = document.importNode(quizTableRowTemplate.content, true);
        let cells = clone.querySelectorAll('td');
        cells[0].textContent = x.name;
        cells[1].textContent = x.licenseId;
        cells[2].textContent = x.totalDid;
        cells[3].textContent = x.description
        quizTableBody.appendChild(clone);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    fetchDashboardData();
});