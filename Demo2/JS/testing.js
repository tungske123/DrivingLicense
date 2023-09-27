const sideMenu = document.querySelector("aside");
const menuBTN = document.querySelector("#menu-btn");
const closeBTN = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

menuBTN.addEventListener("click", () => {
    sideMenu.style.display = "block";
})

closeBTN.addEventListener("click", () => {
    sideMenu.style.display = "none";
})


//Change theme
themeToggler.addEventListener("click", () => {
    document.body.classList.toggle('dark-theme-variables'); 

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
})

