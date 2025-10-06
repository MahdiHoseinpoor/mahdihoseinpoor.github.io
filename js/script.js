document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Functions ---
    fetchDataAndRender();
    initMobileNav();
    updateYear();
    setActiveNavLink();
});

// --- Fetch and Render Data ---
async function fetchDataAndRender() {
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Render all sections with the fetched data
        renderProfile(data.profile);
        renderProjects(data.projects);
        renderExperience(data.experiences);
        renderEducation(data.education);
        renderSkills(data.skills);
        renderFooterLinks(data.profile.links);

    } catch (error) {
        console.error("Could not fetch or render data:", error);
        // Optionally display an error message to the user on the page
    }
}

// --- Render Functions ---

function renderProfile(profile) {
    const profileSection = document.getElementById('profile');
    if (!profileSection) return;

    // Sanitize summary to prevent basic HTML injection issues
    const safeSummary = profile.summary.replace(/\n/g, '<br>');

    profileSection.innerHTML = `
        <div class="profile-image-container">
            <img src="${profile.imageUrl}" alt="تصویر پروفایل ${profile.name}" class="profile-image">
        </div>
        <div class="profile-content">
            <h1 class="name">${profile.name}</h1>
            <p class="title">${profile.title}</p>
            <p class="summary">${safeSummary}</p>
            <div class="key-info">
                ${profile.keyInfo.map(info => `
                    <div class="key-info-item">
                        <strong>${info.title}:</strong>
                        <span>${info.value}</span>
                    </div>
                `).join('')}
            </div>
            <div class="profile-links">
                ${profile.links.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="profile-link">
                        ${link.name}
                    </a>
                `).join('')}
            </div>
        </div>
    `;
}

function renderProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = projects.map(project => {
        // Create the repository link HTML only if repoUrl exists
        const repoLink = project.repoUrl 
            ? `<a href="${project.repoUrl}" class="project-link" target="_blank" rel="noopener noreferrer">مشاهده در گیت‌هاب</a>`
            : '';

        return `
            <div class="project-card">
                <img src="${project.imageUrl}" alt="تصویر پروژه ${project.title}" class="project-image">
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-techs">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    ${repoLink}
                </div>
            </div>
        `;
    }).join('');
}


function renderExperience(experiences) {
    const timeline = document.getElementById('experience-timeline');
    if (!timeline) return;

    timeline.innerHTML = experiences.map(exp => `
        <div class="timeline-item">
            <div class="timeline-content">
                <h3 class="timeline-title">${exp.role}</h3>
                <span class="timeline-subtitle">${exp.company}</span>
                <span class="timeline-date">${exp.date}</span>
            </div>
        </div>
    `).join('');
}

function renderEducation(education) {
    const timeline = document.getElementById('education-timeline');
    if (!timeline) return;

    timeline.innerHTML = education.map(edu => `
        <div class="timeline-item">
            <div class="timeline-content">
                <h3 class="timeline-title">${edu.degree}</h3>
                <span class="timeline-subtitle">${edu.institution}</span>
                <span class="timeline-date">${edu.date}</span>
            </div>
        </div>
    `).join('');
}

function renderSkills(skills) {
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid) return;

    skillsGrid.innerHTML = skills.map(category => `
        <div class="skill-category">
            <h3 class="skill-category-title">${category.category}</h3>
            <ul class="skill-list">
                ${category.items.map(item => `<li class="skill-item">${item}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

function renderFooterLinks(links) {
    const footerLinksContainer = document.getElementById('footer-links');
    if (!footerLinksContainer) return;

    footerLinksContainer.innerHTML = links.map(link => `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.name}</a>
    `).join('');
}

// --- UI Interactivity ---

function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

function updateYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

function setActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' }); // Activates when section is in the middle of the viewport

    sections.forEach(section => observer.observe(section));
}