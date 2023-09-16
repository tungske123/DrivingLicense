//load animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry)=> {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-load');
            observer.unobserve(entry.target);
        } else {
            entry.target.classList.remove('show-load');
        }
    })
});
const hiddenElements = document.querySelectorAll('.hidden-load');
hiddenElements.forEach((el) => observer.observe(el));