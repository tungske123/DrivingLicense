const sideMenu = document.querySelector("aside");
const menuBTN = document.querySelector("#menu-btn");
const closeBTN = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

menuBTN.addEventListener("click", () => {
    sideMenu.style.display = "block";
});

closeBTN.addEventListener("click", () => {
    sideMenu.style.display = "none";
});


//Change theme
themeToggler.addEventListener("click", () => {
    document.body.classList.toggle('dark-theme-variables'); 

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
    changeBSTheme();
});

//Change bootstrap theme

function changeBSTheme() {
    var htmlTag = document.getElementsByTagName('html')[0];
    var theme = htmlTag.getAttribute('data-bs-theme');
    if (theme === 'light') {
        htmlTag.setAttribute('data-bs-theme', 'dark');
    } else {
        htmlTag.setAttribute('data-bs-theme', 'light');
    }
}
