var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Change the icons inside the button based on previous settings
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
} else {
    themeToggleDarkIcon.classList.remove('hidden');
}

var themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', function() {

    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }

    // if NOT set via local storage previously
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
    
});


//Switching tabs
const adminTabLinkList = document.querySelectorAll('#logo-sidebar .dashboard-item');
adminTabLinkList.forEach(tabLink => {
    tabLink.addEventListener('click', (e) => {
        e.preventDefault();

        const tabList = document.querySelectorAll('.admin-tab');
        tabList.forEach(tab => {
            tab.style.display = 'none';
        });


        // Remove is-active from all tab links
        adminTabLinkList.forEach(link => {
            link.classList.remove('is-active'); 
        });

        // Add is-active to this current tab link
        tabLink.classList.add('is-active');

        //Get id target for each link
        const linkAnchor= tabLink.querySelector('a');
        if (!linkAnchor) {
            return;
        }
        const target = linkAnchor.getAttribute('href');
        if (target === `/Home`) {
            window.location.href = `/Home`;
            return;
        }
        if (target === `/Login/logout`) {
            window.location.href = target;
            return;
        }
        //Show the tab
        if (target) {
            const tab = document.querySelector(target);
            if (tab) {
                tab.style.display = 'block';
            }
        }
    });
});

//Switching tabs for CRUD
const teacherTabLinkList = document.querySelectorAll('#logo-sidebar .dashboard-item');
teacherTabLinkList.forEach(tabLink => {
    tabLink.addEventListener('click', (e) => {
        e.preventDefault();

        const tabList = document.querySelectorAll('.admin-tab');
        tabList.forEach(tab => {
            tab.style.display = 'none';
        });

        // Remove is-active from all tab links
        teacherTabLinkList.forEach(link => {
            link.classList.remove('is-active'); 
        });

        // Add is-active to this current tab link
        tabLink.classList.add('is-active');

        //Get id target for each link
        const linkAnchor= tabLink.querySelector('a');
        if (!linkAnchor) {
            const dropdown = tabLink.querySelector('ul');
            if (dropdown.style.display === 'none' || dropdown.style.display === '') {
                dropdown.style.display = 'block';
            } else {
                dropdown.style.display = 'none';
            }
            return;
        }
        const target = linkAnchor.getAttribute('href');
        if (target === `/Home`) {
            window.location.href = `/Home`;
            return;
        }
        if (target === `/Login/logout`) {
            window.location.href = target;
            return;
        }
        //Show the tab
        if (target) {
            const tab = document.querySelector(target);
            if (tab) {
                tab.style.display = 'block';
            }
        }
    });
});



