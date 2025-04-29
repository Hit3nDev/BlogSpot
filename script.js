// Add active class to current page in navigation
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    const header = document.querySelector('header');
    
    // Set header transparency only on home page
    if (currentPage === 'index.html') {
        header.classList.add('transparent');
        
        // Add scroll event listener for header transparency
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.remove('transparent');
            } else {
                header.classList.add('transparent');
            }
        });
    }
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Blog search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterPosts);
    }

    // Category filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterPosts();
        });
    });

    // Like button functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('liked');
            const icon = btn.querySelector('i');
            if (btn.classList.contains('liked')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#e74c3c';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        });
    });

    // Share button functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const postTitle = btn.closest('.blog-post-preview').querySelector('h2').textContent;
            const shareData = {
                title: postTitle,
                text: `Check out this article: ${postTitle}`,
                url: window.location.href
            };

            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    // Fallback for browsers that don't support Web Share API
                    const dummy = document.createElement('input');
                    document.body.appendChild(dummy);
                    dummy.value = window.location.href;
                    dummy.select();
                    document.execCommand('copy');
                    document.body.removeChild(dummy);
                    alert('Link copied to clipboard!');
                }
            } catch (err) {
                console.log('Error sharing:', err);
            }
        });
    });
});

// Filter posts based on search input and selected category
function filterPosts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
    const posts = document.querySelectorAll('.blog-post-preview');

    posts.forEach(post => {
        const title = post.querySelector('h2').textContent.toLowerCase();
        const content = post.querySelector('p').textContent.toLowerCase();
        const category = post.dataset.category;
        const matchesSearch = title.includes(searchTerm) || content.includes(searchTerm);
        const matchesCategory = activeCategory === 'all' || category === activeCategory;

        if (matchesSearch && matchesCategory) {
            post.style.display = '';
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            setTimeout(() => {
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, 50);
        } else {
            post.style.display = 'none';
        }
    });
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation to post cards on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.post-card, .blog-post-preview').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
}); 