document.addEventListener('DOMContentLoaded', function() {

    function renderSkills(skillsData) {
        const skillsContainer = document.getElementById('skills-container');
        if (!skillsContainer) return;

        let skillsHtml = '';
        skillsData.forEach(category => {
            const skillList = category.skills.map(skill => `<li>${skill}</li>`).join('');
            skillsHtml += `
                <div class="skill-category">
                    <h3>${category.title}</h3>
                    <ul>${skillList}</ul>
                </div>`;
        });
        skillsContainer.innerHTML = skillsHtml;
    }

    function renderProjects(projectsData) {
        const projectsContainer = document.getElementById('projects-container');
        if (!projectsContainer) return;

        let projectsHtml = '';
        projectsData.forEach(project => {
            const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            const sourceLink = project.sourceUrl ? `<a href="${project.sourceUrl}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> Source Code</a>` : '';
            const demoLink = project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-play"></i> Play Demo</a>` : '';

            projectsHtml += `
                <div class="project-card">
                    <img src="${project.imageUrl}" alt="Thumbnail for ${project.title}" class="project-image" onerror="this.onerror=null;this.src='https://placehold.co/600x400/1e1e1e/ffffff?text=Image+Not+Found';">
                    <div class="project-content">
                        <div class="project-tags">${tagsHtml}</div>
                        <h3>${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-links">
                            ${sourceLink}
                            ${demoLink}
                        </div>
                    </div>
                </div>`;
        });
        projectsContainer.innerHTML = projectsHtml;
    }

    function initTypingEffect() {
        const typingElement = document.getElementById('typing-effect');
        if (!typingElement) return;

        const words = ["Unity Developer", "Game Programmer", "C# & C++ Language", "AI Enthusiast", "Problem Solver"];
        let wordIndex = 0, charIndex = 0, isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                setTimeout(() => isDeleting = true, 1000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
            
            const typingSpeed = isDeleting ? 50 : 100;
            setTimeout(type, typingSpeed);
        }
        type();
    }

    function initScrollFadeIn() {
        const faders = document.querySelectorAll('.fade-in');
        if (faders.length === 0) return;
        
        const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
        const appearOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, appearOptions);

        faders.forEach(fader => appearOnScroll.observe(fader));
    }
    
    function initMobileNav() {
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        if (!navToggle || !navLinks) return;

        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    function initActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.main-nav .nav-links a');
        if (sections.length === 0 || navLinks.length === 0) return;

        const observerOptions = {
            rootMargin: '-80px 0px -50% 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    function initGlitchEffect() {
        const nameElement = document.querySelector('.hero h1');
        if (!nameElement) return;

        const allChars = "ABΓΔEZHΘIKΛMNΞOΠPΣTYΦXΨΩabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-+=[{]};:'\"<>,.?/|\\";
        const names = ["Tazakka Atthariq", "Zyxe"];
        
        const scrambleText = (originalText) => {
            let scrambled = "";
            for (let i = 0; i < originalText.length; i++) {
                if (originalText[i] === ' ') { scrambled += ' '; continue; }
                const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
                scrambled += Math.random() > 0.6 ? randomChar : originalText[i];
            }
            return scrambled;
        };

        const textMeasurer = document.createElement('span');
        textMeasurer.style.position = 'absolute';
        textMeasurer.style.visibility = 'hidden';
        textMeasurer.style.zIndex = '-1';
        textMeasurer.style.top = '-9999px';
        textMeasurer.style.left = '-9999px';
        textMeasurer.style.font = window.getComputedStyle(nameElement).font;
        textMeasurer.style.fontWeight = window.getComputedStyle(nameElement).fontWeight;
        textMeasurer.style.fontSize = window.getComputedStyle(nameElement).fontSize;
        textMeasurer.style.fontFamily = window.getComputedStyle(nameElement).fontFamily;
        textMeasurer.style.letterSpacing = window.getComputedStyle(nameElement).letterSpacing;
        textMeasurer.style.whiteSpace = 'nowrap';
        document.body.appendChild(textMeasurer);

        const wrapper = document.createElement('div');
        wrapper.className = 'glitch-wrapper';
        const boxCount = 5;
        for (let i = 0; i < boxCount; i++) {
            const box = document.createElement('div');
            box.className = 'glitch-box';
            wrapper.appendChild(box);
        }
        const glitchBoxes = wrapper.childNodes;

        let currentIndex = 0;
        let isGlitching = false;
        
        nameElement.textContent = names[currentIndex];
        nameElement.setAttribute('data-text', names[currentIndex]);

        const runGlitchCycle = () => {
            if (isGlitching) return; 
            isGlitching = true;

            const startText = names[currentIndex];
            const endText = names[(currentIndex + 1) % names.length];
            const startLength = startText.length;
            const endLength = endText.length;
            
            const glitchDuration = 300;
            let startTime = null;

            const animateBoxes = () => {
                for (let i = 0; i < glitchBoxes.length; i++) {
                    glitchBoxes[i].style.top = (Math.random() * 30 + 30) + '%';
                    glitchBoxes[i].style.left = Math.random() * 100 + '%';
                    glitchBoxes[i].style.width = Math.random() * 100 + 1 + 'px';
                    glitchBoxes[i].style.height = Math.random() * 10 + 1 + 'px';
                    glitchBoxes[i].style.opacity = Math.random() * 0.6 + 0.3;
                }
            };

            function animationStep(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsedTime = timestamp - startTime;
                const progress = Math.min(elapsedTime / glitchDuration, 1.0);

                const currentLength = Math.round(startLength + (endLength - startLength) * progress);
                let textToDisplay;

                if (startLength > endLength) {
                    const trimTotal = startLength - currentLength;
                    const trimLeft = Math.round(trimTotal / 2);
                    textToDisplay = startText.substring(trimLeft, startLength - (trimTotal - trimLeft));
                } else {
                    const anchorText = startText;
                    const paddingTotal = currentLength - anchorText.length;
                    const paddingLeft = Math.round(paddingTotal / 2);
                    const paddingRight = paddingTotal - paddingLeft;
                    
                    let leftPad = "";
                    for (let i = 0; i < paddingLeft; i++) { leftPad += allChars[Math.floor(Math.random() * allChars.length)]; }
                    let rightPad = "";
                    for (let i = 0; i < paddingRight; i++) { rightPad += allChars[Math.floor(Math.random() * allChars.length)]; }
                    textToDisplay = leftPad + anchorText + rightPad;
                }
                
                const finalGlitchText = scrambleText(textToDisplay);

                textMeasurer.textContent = finalGlitchText;
                const currentWidth = textMeasurer.offsetWidth;
                nameElement.style.width = currentWidth + 'px';
                
                nameElement.setAttribute('data-text', finalGlitchText);
                animateBoxes();

                if (progress < 1) {
                    requestAnimationFrame(animationStep);
                } else {
                    currentIndex = (currentIndex + 1) % names.length;
                    const newName = names[currentIndex];
                    
                    nameElement.removeChild(wrapper); 
                    nameElement.textContent = newName;

                    nameElement.setAttribute('data-text', newName);
                    nameElement.classList.remove('glitching');
                    nameElement.style.width = 'auto'; 
                    isGlitching = false;
                }
            }

            nameElement.appendChild(wrapper);
            nameElement.classList.add('glitching');
            requestAnimationFrame(animationStep);
        };

        setInterval(runGlitchCycle, 3000);
    }

    async function main() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            
            renderSkills(data.skills);
            renderProjects(data.projects);

        } catch (error) {
            console.error("Could not load portfolio data:", error);
            const skillsContainer = document.getElementById('skills-container');
            const projectsContainer = document.getElementById('projects-container');
            if(skillsContainer) skillsContainer.innerHTML = "<p>Could not load skills data.</p>";
            if(projectsContainer) projectsContainer.innerHTML = "<p>Could not load projects data.</p>";
        }

        initTypingEffect();
        initScrollFadeIn();
        initMobileNav();
        initActiveNavOnScroll();
        initGlitchEffect();
    }

    main();
});