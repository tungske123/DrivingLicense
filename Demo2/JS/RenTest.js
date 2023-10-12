const showbtn = document.querySelectorAll(".show_button");

showbtn.forEach((btn) => {
    btn.addEventListener('click', function() {
        this.parentElement.parentElement.classList.toggle('show')
    })
});

let currentPage = 1;
let itemsPerPage = 8;

function paginate() {
    let divs = document.querySelectorAll('.car_item');
    for(let i = 0; i < divs.length; i++) {
        if(i < (currentPage - 1) * itemsPerPage || i >= currentPage * itemsPerPage) {
            divs[i].style.display = 'none';
        } else {
            divs[i].style.display = 'block';
        }
    }
}

document.querySelector('.pagination [data-page="prev"]').addEventListener('click', function(e) {
    if(currentPage > 1) {
        currentPage--;
        paginate();
        setActivePage();
    }
    e.preventDefault();
});

document.querySelector('.pagination [data-page="next"]').addEventListener('click', function(e) {
    let totalItems = document.querySelectorAll('.car_item').length;
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    if(currentPage < totalPages) {
        currentPage++;
        paginate();
        setActivePage();
    }
    e.preventDefault();
});

function addPageNumbers() {
    let totalItems = document.querySelectorAll('.car_item').length;
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationContainer = document.querySelector('.pagination-container .pagination');
    for(let i = 1; i <= totalPages; i++) {
        let li = document.createElement('li');
        li.classList.add('page-item');
        li.dataset.page = i;
        li.innerHTML = `<a class="page-link">${i}</a>`;
        paginationContainer.insertBefore(li, document.querySelector('.pagination [data-page="next"]'));
        li.addEventListener('click', function(e) {
            currentPage = i;
            paginate();
            setActivePage();
            e.preventDefault();
        });
    }
}

function setActivePage() {
    let pageItems = document.querySelectorAll('.pagination .page-item');
    for(let i = 0; i < pageItems.length; i++) {
        if(pageItems[i].dataset.page == currentPage) {
            pageItems[i].classList.add('active');
        } else {
            pageItems[i].classList.remove('active');
        }
    }
}

paginate();
addPageNumbers();
setActivePage();

