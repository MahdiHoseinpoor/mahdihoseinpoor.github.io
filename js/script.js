// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    async function loadCvData() {
        try {
            let data;
                // --- Default Mode: Fetch from file ---
                console.log('No live preview data. Fetching from data.json...');
                const response = await fetch('data/data.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                data = await response.json();

            // Populate all sections with the final data
            populateProfile(data.profile);
            populateHome(data.profile);
            populateProjects(data.projects);
            populateExperiences(data.experiences);
            populateSkills(data.skills);
            populateEducation(data.education);

        } catch (error) {
            console.error("Could not load CV data:", error);
            // Display an error message to the user on the page
            document.body.innerHTML = `
                <div style="color: #ff6b6b; padding: 40px; text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <h2>Error Loading CV Data</h2>
                    <p>${error.message}</p>
                    <p>Please ensure the 'data/data.json' file exists and is valid, or that the live preview data is correct.</p>
                </div>`;
        }
    }

    /**
     * Populates the sidebar profile section.
     * @param {object} profile - The profile data object.
     */
    function populateProfile(profile) {
        document.title = `رزومه تعاملی - ${profile.name}`;
        document.querySelector('.profile h1').textContent = profile.name;
        document.querySelector('.profile p').textContent = profile.title;
        document.querySelector('.profile-picture img').src = profile.imageUrl;
    }

    /**
     * Populates the main "Home" panel.
     * @param {object} profile - The profile data object.
     */
    function populateHome(profile) {
        document.querySelector('#home .about-me-summary').textContent = profile.summary;
        
        const keyInfoGrid = document.querySelector('#home .key-info-grid');
        keyInfoGrid.innerHTML = profile.keyInfo.map(info => `
            <div class="key-info-item">
                <h4>${info.title}</h4>
                <p>${info.value}</p>
            </div>
        `).join('');

        const contactLinks = document.querySelector('#home .contact-links');
        contactLinks.innerHTML = profile.links.map(link => `
            <a href="${link.url}" class="contact-link-btn" target="_blank" rel="noopener noreferrer">${link.name}</a>
        `).join('');
    }

    /**
     * Populates the "Projects" panel.
     * @param {Array<object>} projects - An array of project objects.
     */
    function populateProjects(projects) {
        const projectsGrid = document.querySelector('#projects .projects-grid');
        projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card">
                <img src="${project.imageUrl}" alt="${project.title} Logo">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    /**
     * Populates the "Experiences" panel.
     * @param {Array<object>} experiences - An array of experience objects.
     */
    function populateExperiences(experiences) {
        const container = document.querySelector('#experiences .experiences-container');
        container.innerHTML = experiences.map(exp => `
            <div class="experience-item">
                <p class="company">${exp.company}</p>
                <p class="role">${exp.role}</p>
                <p class="date">${exp.date}</p>
                <ul class="responsibilities">
                    ${exp.responsibilities.map(res => `<li>${res}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    /**
     * Populates the "Skills" section.
     * @param {Array<object>} skills - An array of skill category objects.
     */
    function populateSkills(skills) {
        const skillsGrid = document.querySelector('#skills-education .skills-grid');
        skillsGrid.innerHTML = skills.map(category => `
            <div class="skill-category">
                <h3>${category.category}</h3>
                <div class="skills-list">
                    ${category.items.map(item => `<span>${item}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    /**
     * Populates the "Education" section.
     * @param {Array<object>} education - An array of education objects.
     */
    function populateEducation(education) {
        const container = document.querySelector('#skills-education .education-container');
        container.innerHTML = education.map(edu => `
            <div class="education-item">
                <p class="institution">${edu.institution}</p>
                <p class="degree">${edu.degree}</p>
                <p class="date">${edu.date}</p>
            </div>
        `).join('');
    }

    /**
     * Initializes the tab switching functionality.
     */
    function initializeTabs() {
        const tabs = document.querySelectorAll('.tab-link');
        const panels = document.querySelectorAll('.content-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                if (tab.classList.contains('active')) return;

                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                const targetPanelId = tab.getAttribute('data-tab');
                document.getElementById(targetPanelId).classList.add('active');
            });
        });
    }

    // --- Main Execution ---
    loadCvData();
    initializeTabs();
});