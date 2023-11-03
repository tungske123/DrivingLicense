var staffTabLinkList = document.querySelectorAll('.dashboard-item');
staffTabLinkList.forEach(function (tabLink) {
    tabLink.addEventListener('click', function (e) {
        e.preventDefault();
        var tabList = document.querySelectorAll('.staff-tab');
        tabList.forEach(function (tab) {
            tab.style.display = 'none';
        });
        // Remove is-active from all tab links
        staffTabLinkList.forEach(function (link) {
            link.classList.remove('is-active');
        });
        // Add is-active to this current tab link
        tabLink.classList.add('is-active');
        //Get id target for each link
        var linkAnchor = tabLink.querySelector('a');
        if (!linkAnchor) {
            return;
        }
        var target = linkAnchor.getAttribute('href');
        if (target === "/Home") {
            window.location.href = "/Home";
            return;
        }
        //Show the tab
        if (target) {
            var tab = document.querySelector(target);
            if (tab) {
                tab.style.display = 'block';
            }
        }
    });
});
staffTabLinkList[0].click();
