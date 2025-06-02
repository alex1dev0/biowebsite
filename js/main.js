document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });

    document.getElementById('year').textContent = new Date().getFullYear();

    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Non è più necessario impostare il tema qui poiché lo facciamo già nell'head
    // Ma manteniamo il toggle per cambiare tema
    
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark-mode');
        
        if (html.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '1';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.zIndex = '0';
        });
    });

    const linkCards = document.querySelectorAll('.link-card');
    linkCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}


document.querySelectorAll('.gallery-item').forEach(item => {
    const githubLink = item.querySelector('.github-link');
    const projectLink = item.querySelector('.project-link');
    
    if (githubLink) {
        githubLink.addEventListener('click', function(e) {
            e.stopPropagation();
            window.open(item.getAttribute('href'), '_blank');
        });
    }
    
    if (projectLink) {
        projectLink.addEventListener('click', function(e) {
            e.stopPropagation();
            const demoUrl = item.dataset.demoUrl || '#';
            window.open(demoUrl, '_blank');
        });
    }
});


const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.classList.add('scroll-to-top');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});