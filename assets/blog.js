// assets/blog.js

function filterByTag(selectedTag) {
    const articles = document.querySelectorAll('.post-item');
    const filterStatus = document.getElementById('filter-status');
    const activeFilterName = document.getElementById('active-filter-name');

    if (selectedTag === 'all') {
        clearFilter();
        return;
    }

    articles.forEach(art => {
        const tags = art.getAttribute('data-tags').split(',');
        if (tags.includes(selectedTag)) {
            art.style.display = 'block';
        } else {
            art.style.display = 'none';
        }
    });

    activeFilterName.textContent = "Tag: " + selectedTag;
    filterStatus.style.display = 'block';
}

function filterByArchive(selectedArchive) {
    const articles = document.querySelectorAll('.post-item');
    const filterStatus = document.getElementById('filter-status');
    const activeFilterName = document.getElementById('active-filter-name');

    articles.forEach(art => {
        const archive = art.getAttribute('data-archive');
        if (archive === selectedArchive) {
            art.style.display = 'block';
        } else {
            art.style.display = 'none';
        }
    });

    activeFilterName.textContent = "Archive: " + selectedArchive;
    filterStatus.style.display = 'block';
}

function clearFilter() {
    const articles = document.querySelectorAll('.post-item');
    const filterStatus = document.getElementById('filter-status');
    articles.forEach(art => art.style.display = 'block');
    filterStatus.style.display = 'none';
}
