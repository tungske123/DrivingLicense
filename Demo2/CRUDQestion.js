var totalPages = 0;
var page = 1;
var pageSize = 20;
let licenseId = "";
let bodydata = {
  keyword: ``,
  licenseID: licenseId,
  isCritical: null
};
function fetchdata() {
  const url = `https://localhost:7235/api/questions/${page}`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodydata),
  })
    .then((res) => res.json())
    .then((data) => {
      totalPages = data.totalPages;
      renderDataTableBody(data);
      renderPagingBar();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

document.getElementById("searchQuestion").addEventListener("input", () => {
  fetchdata();
});

function renderDataTableBody(data) {
  const tbody = document.getElementById("questionTableBody");
  tbody.innerHTML = "";
  let Templatebody = document.getElementById("templatequestionbody");
  data.items.forEach((element) => {
    const clone = document.importNode(Templatebody.content, true);
    const cells = clone.querySelectorAll("td");
    const tr = clone.querySelectorAll("tr");
    tr[1].textContent = "";
    cells[0].textContent = element.questionId;
    cells[1].textContent = element.questionText;
    cells[2].textContent = element.licenseId;
    if (element.isCritical === true) {
      cells[3].innerHTML = `<div class="flex items-center">
            <div class="h-2.5 w-2.5 rounded-full bg-red-500 me-2 mr-1"></div>
            Có
        </div> `;
    } else {
      cells[3].innerHTML = `<div class="flex items-center">
            <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2 mr-1"></div>
            Không
        </div>`;
    }
    let deleteBtn = cells[4].querySelector(".deleteBtn");
    deleteBtn.setAttribute("qid", element.questionId);
    deleteBtn.addEventListener("click", () => {
      const qid = deleteBtn.getAttribute("qid");
      Swal.fire({
        icon: "warning",
        title: "Bạn có muốn xóa câu hỏi?",
        text: "Câu hỏi đã xóa ko thể khôi phục",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        confirmButtonColor: "#FF0000",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(`Deleting question id: ${qid}`);
          deleteAccount(qid);
        }
      });

      let editBtn = cells[4].querySelector(".editBtn");
      editBtn.setAttribute("qid", element.questionId);
      editBtn.addEventListener("click", () => {
        const qid = editBtn.getAttribute("qid");
        let question = getquestionbyId(qid);
      });
    });
    tbody.appendChild(clone);
  });
}

function renderPagingBar() {
  let pageBarBody = document.querySelector(".pageBarBody");
  pageBarBody.innerHTML = ``;

  const displayedPages = 5;

  let startPage = Math.max(1, page - Math.floor(displayedPages / 2));
  let endPage = Math.min(totalPages, startPage + displayedPages - 1);

  for (let cnt = startPage; cnt <= endPage; ++cnt) {
    let pageItemTemplate = document.getElementById("pageItemTemplate");
    let clone = document.importNode(pageItemTemplate.content, true);
    let pageLink = clone.querySelector("a");

    if (parseInt(cnt) === parseInt(page)) {
      pageLink.classList.add("active-page");
    }

    pageLink.setAttribute("page", cnt.toString());
    pageLink.textContent = cnt.toString();

    pageLink.addEventListener("click", (e) => {
      e.preventDefault();
      let newPage = parseInt(pageLink.getAttribute("page"));
      page = newPage;
      console.log(`Current page: ${page}`);
      fetchdata();
    });

    pageBarBody.appendChild(clone);
  }
}
document.getElementById("prevQuizPageBtn").addEventListener("click", () => {
  page--;
  if (page <= 0) {
    page = 1;
  }
  fetchdata();
});

document.getElementById("nextQuizPageBtn").addEventListener("click", () => {
  ++page;
  if (page > totalPages) {
    page = 1;
  }
  fetchdata();
});

function fetchLicenseFilter() {
  const url = `https://localhost:7235/api/licenses`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      var license = document.getElementById("filterLicenseId");
      const ul = document.querySelector(".ulLicenseID");
      ul.innerHTML = "";
      data.forEach((element) => {
        var clone = document.importNode(license.content, true);
        var cells = clone.querySelector("input");
        var label = clone.querySelector("li label");

        cells.value = element.licenseId;
        label.textContent = element.licenseId;

        var radioId = "licenseRadio" + element.licenseId;
        var radio = clone.querySelector("input");
        radio.id = radioId;
        radio.value = element.licenseId;
        label.setAttribute("for", radioId);
        radio.addEventListener('input', () => {
          bodydata.licenseID = radio.value;
          fetchdata();
        });
        ul.appendChild(clone);
      });
    });
}


function deleteAccount(qid) {
  const url = `https://localhost:7235/api/question/delete/${qid}`;

  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Lỗi xóa câu hỏi",
          text: `${response.status} - ${response.statusText}`,
          confirmButtonColor: `#FF0000`,
        });
        return;
      }
      Swal.fire({
        icon: `success`,
        title: `Xóa câu hỏi thành công!`,
        confirmButtonColor: `#FF0000`,
      });
      fetchdata();
    })
    .catch((error) => {
      console.error(error);
    });
}

function getquestionbyId(qid) {
  var url = `https://localhost:7235/api/question/get/${qid}`;
  try {
    const response = fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(`Error! ${error}`);
  }
}


let criticalCheckBox = document.getElementById('criticalCheckBox');
criticalCheckBox.addEventListener('input', () => {
  bodydata.isCritical = criticalCheckBox.checked;
  fetchdata();
});

let searchQuestionInput = document.getElementById('searchQuestion');
searchQuestionInput.addEventListener('input', () => {
  let newKeyword = searchQuestionInput.value;
  bodydata.keyword = newKeyword;
  fetchdata();
});

let clearFilterLink = document.getElementById('clearQuestionFilter');
clearFilterLink.addEventListener('input', () => {
  bodydata.keyword = ``;
  bodydata.licenseID = ``;
  bodydata.isCritical = null;
});

document.addEventListener("DOMContentLoaded", () => {
  fetchLicenseFilter();
  fetchdata();
});
