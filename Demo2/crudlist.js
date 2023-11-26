let totalPages = 1;
let page = 1;
let keyword = ``;
let role = ``;
function fetchData() {
  const fetchAPI = `https://localhost:7235/api/account/list?page=${page}&keyword=${keyword}&role=${role}`;

  fetch(fetchAPI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      testRenderAccounts(data);
      totalPages = parseInt(data.totalPages);
      renderPagingBar();
    })
    .catch((error) => {
      console.error(error);
    });
}

function renderPagingBar() {
  let pageBarBody = document.querySelector(".pageBarBody");
  pageBarBody.innerHTML = ``;
  for (var cnt = 1; cnt <= totalPages; ++cnt) {
    let pageItemTemplate = document.getElementById("pageItemTemplate");
    let clone = document.importNode(pageItemTemplate.content, true);
    let pageLink = clone.querySelector("li a");
    if (parseInt(cnt) === parseInt(page)) {
      pageLink.classList.add("active-page");
    }
    pageLink.setAttribute("page", cnt.toString());
    pageLink.textContent = cnt.toString();
    pageLink.addEventListener("click", (e) => {
      e.preventDefault(); //Chặn chuyển trang
      let newPage = parseInt(pageLink.getAttribute("page")); //Lấy giá trị page hiện tại
      page = newPage;
      console.log(`Current page: ${page}`);
      fetchData();
    });
    pageBarBody.appendChild(clone);
  }
}

let prevPageBtn = document.getElementById("prevPageBtn");
let nextPageBtn = document.getElementById("nextPageBtn");

//Increase page
nextPageBtn.addEventListener("click", () => {
  ++page;
  if (page > totalPages) {
    page = 1;
  }
  fetchData();
});

prevPageBtn.addEventListener("click", () => {
  --page;
  if (page === 0) {
    page = totalPages;
  }
  fetchData();
});

function testRenderAccounts(data) {
  const tableBody = document.getElementById("userTableBody");
  tableBody.innerHTML = "";
  let userTableRowTemplate = document.getElementById("userTableRowTemplate");

  if (!userTableRowTemplate) {
    console.error("Template not found");
    return;
  }

  data.items.forEach((account) => {
    let clone = document.importNode(userTableRowTemplate.content, true);
    let cells = clone.querySelectorAll("td"); // Select all td elements
    cells[0].textContent = account.username;

    let pass_cell = cells[1].querySelector(".pass_cell");

    if (pass_cell) {
      pass_cell.textContent = account.password;
    } else {
      console.error(".pass_cell not found");
    }

    if(account.user !== null){
      cells[2].textContent = account.user.email;
    }
     if(account.teacher !== null){
      cells[2].textContent = account.teacher.email;
    }
     if(account.staff !== null){
      cells[2].textContent = account.staff.email;
    }
    
    cells[3].textContent = account.role;
    let deleteBtn = cells[4].querySelector(".deleteBtn");

    deleteBtn.setAttribute("aid", account.accountId);
    deleteBtn.addEventListener("click", function () {
      let accountId = deleteBtn.getAttribute("aid");
      Swal.fire({
        icon: "warning",
        title: "Bạn có muốn xóa tài khoản?",
        text: "Tài khoản đã xóa ko thể khôi phục",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        confirmButtonColor: "#FF0000",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(`Deleting account id: ${accountId}`);
          deleteAccount(accountId);
        }
      });
    });

    let editBtn = cells[4].querySelector(".updateBtn");
    editBtn.setAttribute("aid", account.accountId);

    editBtn.addEventListener("click", async () => {
      let aid = editBtn.getAttribute("aid");
      document.getElementById("updateAccountId").textContent = aid;
      let account = await getAccountById(aid);
      loadUpdateFormData(account);
      toggleDetailsModal();
    });
    tableBody.appendChild(clone);
  });
}
let closeUpdateModalBtn = document.getElementById("closeUpdateModalBtn");
closeUpdateModalBtn.addEventListener("click", toggleDetailsModal);
function loadUpdateFormData(accountData) {
  if (accountData === null || accountData === undefined) {
    console.log(`No account data`);
    return;
  }
  let usernameInput = document.querySelector(".updateUsername");
  let emailInput = document.querySelector(".updateEmail");
  let passwordInput = document.querySelector(".updatePassword");
  let roleInput = document.querySelector(".updateRole");

  usernameInput.value = accountData.account.username;
  // switch (account.role) {
  //   case 'user':
  //     emailInput.value = account.user.email;
  //     break;
  //   case 'teacher':
  //     emailInput.value = account.teacher.email;
  //     break;
  //   case 'staff':
  //     emailInput.value = account.staff.email;
  //     break;
  //   case 'admin':
  //     emailInput.value = (account.admin != null) ?  account.admin.email : '';
  //     break;
  //   default:
  //     break;
  // }
  emailInput.value = accountData.email;
  passwordInput.value = accountData.account.password;
  roleInput.value = accountData.account.role;
}

function toggleDetailsModal() {
  let updateModal = document.getElementById("updateProductModal");
  let isOpened = !updateModal.classList.contains("hidden");
  if (!isOpened) {
    console.log(`Modal not opened -> opened`);
    updateModal.classList.remove(`hidden`);
    updateModal.style.display = `flex`;
    updateModal.style.justifyContent = `center`;
    updateModal.style.alignItems = `center`;
    updateModal.classList.add("blur-background");
  } else {
    console.log(`Modal opened -> close`);
    updateModal.classList.add("hidden");
    updateModal.classList.remove("blur-background");
    updateModal.style.display = `none`;
  }
}
document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});

document.getElementById("quizSearchBar").addEventListener("input", function () {
  const newKeyword = document.getElementById("quizSearchBar").value;
  keyword = newKeyword;
  fetchData();
});

const userRoleRadios = document.querySelectorAll('input[name="filterRoleBar"]');
userRoleRadios.forEach((radioBtn) => {
  radioBtn.addEventListener("click", () => {
    let newRole = radioBtn.value;
    role = newRole;
    fetchData();
  });
});

function addNewAccount() {
  const url = "https://localhost:7235/api/account/add";
  let addAccountForm = document.getElementById("addAccountForm");
  const account = {
    Account: {
      Username: addAccountForm.querySelector(".addFormUsername").value,
      Password: addAccountForm.querySelector(".addFormPassword").value,
      Role: addAccountForm.querySelector(".addFormRole").value,
    },
    Email: addAccountForm.querySelector(".addFormEmail").value,
  };
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  })
    .then((response) => {
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Something went wrong!${response.status} - ${response.statusText}`,
          confirmButtonColor: `#FF0000`,
        });
        return;
      }
      Swal.fire({
        icon: `success`,
        title: `Thêm tài khoản mới thành công!`,
        confirmButtonColor: `#FF0000`,
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

let addAccountForm = document.getElementById("addAccountForm");

addAccountForm.addEventListener("submit", (e) => {
  //Chẳn gửi server
  e.preventDefault();
  Swal.fire({
    icon: "question",
    title: "Xác nhận thêm tài khoản này?",
    showCancelButton: true,
    confirmButtonText: "Thêm",
    confirmButtonColor: `#FF0000`,
    cancelButtonText: `Hủy`,
  }).then((result) => {
    if (result.isConfirmed) {
      addNewAccount();
      fetchData();
    }
  });
});

function deleteAccount(accountId) {
  let url = `https://localhost:7235/api/account/delete/${accountId}`;
  console.log(`Delete url: ${url}`);
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
          title: "Lỗi xóa tài khoản",
          text: `${response.status} - ${response.statusText}`,
          confirmButtonColor: `#FF0000`,
        });
        return;
      }
      Swal.fire({
        icon: `success`,
        title: `Xóa tài khoản thành công!`,
        confirmButtonColor: `#FF0000`,
      });
      fetchData();
    })
    .catch((error) => {
      console.error(error);
    });
}

function updateAccount(accountId) {
  try {
    let url = `https://localhost:7235/api/account/update/${accountId}`;

    const formData = new FormData();
    formData.append('username', document.querySelector('.updateUsername').value);
    formData.append('password', document.querySelector('.updatePassword').value);
    formData.append('role', document.querySelector('.updateRole').value);
    formData.append('email', document.querySelector('.updateEmail').value);
    formData.append('licenseId', '');
    
    fetch(url, {
      method: 'PATCH',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      body: formData,
    }).then((res) => {
      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi khi cập nhật tài khoản',
          text: `${res.status} - ${res.statusText}`,
          confirmButtonColor: '#FF0000',
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Cập nhật tài khoản thành công!',
        confirmButtonColor: '#FF0000',
      });

      fetchData();
    });
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("updateAccountform").addEventListener("submit", (e) => {
  e.preventDefault();
  let accountId = document.getElementById("updateAccountId").textContent;
  updateAccount(accountId);
  fetchData();
});

async function getAccountById(accountId) {
  var url = `https://localhost:7235/api/account/detail/${accountId}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(`Error! ${error}`);
  }
}

function getAccountByIdget(accountId) {
  var url = `https://localhost:7235/api/account/get/${accountId}`;
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
