document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. KONFIGURASI & VARIABEL GLOBAL ---
    const CONFIG = {
        sanity: {
            projectId: "fitgiw5b",
            dataset: "production",
            apiVersion: "v2021-10-21"
        },
        dom: {
            heroTitle: document.querySelector('.hero h1'),
            typingElement: document.getElementById('typing-effect'),
            skillsContainer: document.getElementById('skills-container'),
            certContainer: document.getElementById('certifications-container'),
            projectsContainer: document.getElementById('projects-container'),
            aboutText: document.querySelector('#about p'),
            contactText: document.querySelector('#contact p'),
            contactLinks: document.querySelector('.contact-links'),
            emailLink: document.querySelector('.email-link'),
            cvButton: document.querySelector('a[href="cv.html"]'),
            navToggle: document.getElementById('navToggle'),
            navLinks: document.getElementById('navLinks')
        }
    };

    // --- FUNGSI TOGGLE (SIMPEL) ---
    window.toggleItems = (containerId, btnElement) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const isExpanded = btnElement.classList.contains('expanded');
        const hiddenItems = container.querySelectorAll('.hidden-item');

        if (!isExpanded) {
            // EXPAND
            hiddenItems.forEach((item, index) => {
                item.style.display = ''; 
                setTimeout(() => item.classList.add('visible'), index * 50);
            });
            
            btnElement.textContent = "Show Less"; // Teks saat terbuka
            btnElement.classList.add('expanded');
        } else {
            // COLLAPSE
            hiddenItems.forEach(item => {
                item.style.display = 'none'; 
                item.classList.remove('visible');
            });

            btnElement.textContent = "Show All"; // Teks saat tertutup (Reset)
            btnElement.classList.remove('expanded');

            // Scroll balik ke atas
            const sectionTitle = container.parentElement.querySelector('.section-title');
            if (sectionTitle) sectionTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    window.flipCard = (elementId) => {
        const card = document.getElementById(elementId);
        if (card) card.classList.toggle('is-flipped');
    };

    function getYouTubeId(url) {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    let isYouTubeApiReady = false;
    function loadYouTubeAPI() {
        if (window.YT) return;
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    window.onYouTubeIframeAPIReady = () => {
        isYouTubeApiReady = true;
    };
    loadYouTubeAPI();

    window.playVideo = (index, videoId) => {
        event.stopPropagation();

        const wrapper = document.getElementById(`media-wrapper-${index}`);
        const container = document.getElementById(`video-container-${index}`);
        
        if (!wrapper || !container) return;

        wrapper.classList.add('is-playing');
        container.innerHTML = '<div id="yt-player-' + index + '"></div>';

        if (!isYouTubeApiReady || !window.YT) {
            container.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                class="project-video-iframe" allowfullscreen allow="autoplay"></iframe>`;
            return;
        }

        new YT.Player(`yt-player-${index}`, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                'autoplay': 1,
                'rel': 0,
                'controls': 1
            },
            events: {
                'onStateChange': (event) => {
                    if (event.data === YT.PlayerState.ENDED) {
                        wrapper.classList.remove('is-playing');
                        container.innerHTML = ''; 
                    }
                }
            }
        });
    };

    // --- 2. API & DATA FETCHING ---
    async function fetchSanityData() {
        const { projectId, dataset, apiVersion } = CONFIG.sanity;
        
        const query = `
        {
            "profile": *[_type == "profile"][0] {
                about, contactMessage, email, 
                socials,
                "cvUrl": cvFile.asset->url
            },
            "skills": *[_type == "skillCategory"] | order(orderId asc, date desc) {
                title, skills
            },
            "certifications": *[_type == "certification"] | order(orderId asc, date desc) {
                title, organizer, date, credentialUrl,
                "logoUrl": logo.asset->url
            },
            "projects": *[_type == "project"] | order(orderId asc, date desc) {
                title, description, role, tags, 
                sourceUrl, demoUrl, trailerUrl, 
                "imageUrl": image.asset->url
            }
        }`;

        const url = `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const { result } = await response.json();
            return result;
        } catch (error) {
            console.error("Sanity Fetch Error:", error);
            return null;
        }
    }

    // --- 3. UI RENDERING ---
    const UI = {
        renderProfile: (data) => {
            if (!data) return;
            const { aboutText, contactText, contactLinks, emailLink, cvButton } = CONFIG.dom;

            if (aboutText && data.about) aboutText.textContent = data.about;
            if (contactText && data.contactMessage) contactText.innerHTML = data.contactMessage.replace(/\n/g, '<br>');
            
            // --- LOGIKA EMAIL (Tetap Sama/Manual) ---
            if (emailLink && data.email) {
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${data.email}`;
                emailLink.href = gmailUrl;
                emailLink.target = "_blank";
                emailLink.rel = "noopener noreferrer";
                emailLink.textContent = "Email Me";
            }
            
            // --- LOGIKA CV (Tetap Sama) ---
            if (cvButton && data.cvUrl) {
                cvButton.href = data.cvUrl;
                cvButton.textContent = "Download CV";
            }

            // --- PERUBAHAN BARU: RENDER DYNAMIC SOCIALS ---
            if (contactLinks && data.socials && data.socials.length > 0) {
                // Loop data dari database, bukan hardcode
                contactLinks.innerHTML = data.socials.map(item => {
                    // Pastikan ikonnya valid (lowercase biar aman)
                    const iconName = item.icon ? item.icon.toLowerCase() : 'link'; 
                    return `
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${item.platform}">
                            <i class="fab fa-${iconName}"></i>
                        </a>
                    `;
                }).join('');
            } else if (contactLinks) {
                // Jika data kosong di database
                contactLinks.innerHTML = ''; 
            }
        },

        renderSkills: (data) => {
            const container = CONFIG.dom.skillsContainer;
            if (!container) return;
            if (!data) { container.innerHTML = '<p>Failed to load skills.</p>'; return; }

            container.innerHTML = data.map(category => `
                <div class="skill-category fade-in">
                    <h3>${category.title}</h3>
                    <ul>${(category.skills || []).map(skill => `<li>${skill}</li>`).join('')}</ul>
                </div>
            `).join('');
        },

        renderCertifications: (data) => {
            const container = CONFIG.dom.certContainer;
            if (!container) return;
            if (!data || data.length === 0) { 
                container.innerHTML = '<p class="text-secondary">No certifications added yet.</p>'; 
                return; 
            }

            const LIMIT = 3; // Batas tampil awal

            // Render SEMUA data, tapi yang > LIMIT disembunyikan
            const htmlItems = data.map((cert, index) => {
                // Cek apakah item ini harus disembunyikan
                const isHidden = index >= LIMIT;
                const hiddenStyle = isHidden ? 'style="display:none;"' : '';
                const hiddenClass = isHidden ? 'hidden-item' : '';

                const iconHtml = cert.logoUrl 
                    ? `<img src="${cert.logoUrl}" alt="${cert.organizer}">`
                    : `<i class="fas fa-trophy"></i>`;
                
                const linkHtml = cert.credentialUrl 
                    ? `<a href="${cert.credentialUrl}" target="_blank" class="cert-link">View Credential <i class="fas fa-external-link-alt" style="font-size:0.7em"></i></a>`
                    : '';

                // Tambahkan class hidden-item dan style display:none jika index >= limit
                return `
                <div class="cert-card fade-in ${hiddenClass}" ${hiddenStyle}>
                    <div class="cert-icon-box">
                        ${iconHtml}
                    </div>
                    <div class="cert-content">
                        <h3>${cert.title}</h3>
                        <div class="cert-organizer">${cert.organizer}</div>
                        <div class="cert-date">${cert.date}</div>
                        ${linkHtml}
                    </div>
                </div>`;
            }).join('');

            // Tambahkan Tombol View All jika data lebih dari LIMIT
            let buttonHtml = '';
            if (data.length > LIMIT) {
                // Tidak perlu kirim teks, cukup panggil ID dan 'this'
                buttonHtml = `
                    <div class="view-more-container">
                        <button class="btn-view-all" onclick="toggleItems('certifications-container', this)">
                            Show All
                        </button>
                    </div>
                `;
            }

            container.innerHTML = htmlItems + buttonHtml;
            Effects.initScrollFadeIn();
        },

        renderProjects: (data) => {
            const container = CONFIG.dom.projectsContainer;
            if (!container) return;
            if (!data) { container.innerHTML = '<p>Failed to load projects.</p>'; return; }

            const LIMIT = 3; // Batas tampil awal untuk Projects

            const htmlItems = data.map((project, index) => {
                // Cek Hidden
                const isHidden = index >= LIMIT;
                const hiddenStyle = isHidden ? 'style="display:none;"' : '';
                const hiddenClass = isHidden ? 'hidden-item' : '';

                const img = project.imageUrl || 'https://placehold.co/600x400/1e1e1e/ffffff?text=No+Image';
                const tags = (project.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
                
                // Logic Video (Tetap dipertahankan)
                const videoId = getYouTubeId(project.trailerUrl);
                let mediaContent;

                if (videoId) {
                    mediaContent = `
                        <div class="project-media-wrapper" id="media-wrapper-${index}" onclick="playVideo(${index}, '${videoId}')">
                            <img src="${img}" alt="${project.title}" class="project-image">
                            <div class="play-overlay"><i class="fas fa-play-circle"></i></div>
                            <div class="video-container" id="video-container-${index}"></div>
                        </div>
                    `;
                } else {
                    mediaContent = `
                        <div class="project-media-wrapper" style="cursor: default;">
                             <img src="${img}" alt="${project.title}" class="project-image">
                        </div>`;
                }

                const btnRole = project.role 
                    ? `<button class="btn-role" onclick="flipCard('project-${index}')"><i class="fas fa-user-tag"></i> Role</button>` : '';
                const btnSource = project.sourceUrl 
                    ? `<a href="${project.sourceUrl}" target="_blank"><i class="fab fa-github"></i> Code</a>` : '';
                const btnDemo = project.demoUrl 
                    ? `<a href="${project.demoUrl}" target="_blank"><i class="fas fa-play"></i> Play</a>` : '';
                
                const actionButtons = `${btnRole}${btnSource}${btnDemo}`;

                let roleContent = '<p style="text-align:center; color:gray;">No role details provided.</p>';
                if (project.role) {
                    const lines = project.role.split('\n').filter(line => line.trim() !== '');
                    const listItems = lines.map(line => `<li>${line.trim()}</li>`).join('');
                    roleContent = `<ul class="role-list">${listItems}</ul>`;
                }

                // Tambahkan hiddenClass dan hiddenStyle ke wrapper utama
                return `
                <div class="project-card fade-in ${hiddenClass}" ${hiddenStyle}>
                    <div class="project-inner" id="project-${index}">
                        <div class="project-front">
                            ${mediaContent}
                            <div class="project-content">
                                <div class="project-scroll-area">
                                    <div class="project-tags">${tags}</div>
                                    <h3>${project.title}</h3>
                                    <div class="project-description">${project.description}</div>
                                </div>
                                <div class="project-links">${actionButtons}</div>
                            </div>
                        </div>
                        <div class="project-back">
                            <h3>My Role</h3>
                            <div class="role-text">${roleContent}</div>
                            <button class="btn-back" onclick="flipCard('project-${index}')"><i class="fas fa-undo"></i> Back</button>
                        </div>
                    </div>
                </div>`;
            }).join('');
            
            // Tambahkan Tombol View All Projects
            let buttonHtml = '';
            if (data.length > LIMIT) {
                buttonHtml = `
                    <div class="view-more-container">
                        <button class="btn-view-all" onclick="toggleItems('projects-container', this)">
                            Show All
                        </button>
                    </div>
                `;
            }

            container.innerHTML = htmlItems + buttonHtml;
            Effects.initScrollFadeIn();
        }
    };

    // --- 4. VISUAL EFFECTS & ANIMATIONS ---
    const Effects = {
        initTyping: () => {
            const el = CONFIG.dom.typingElement;
            if (!el) return;
            const words = ["Unity Developer", "Game Programmer", "C# & C++ Language", "AI Enthusiast", "Problem Solver"];
            let wordIdx = 0, charIdx = 0, isDeleting = false;
            const type = () => {
                const current = words[wordIdx];
                el.textContent = current.substring(0, isDeleting ? charIdx - 1 : charIdx + 1);
                charIdx += isDeleting ? -1 : 1;
                if (!isDeleting && charIdx === current.length) {
                    setTimeout(() => isDeleting = true, 1000);
                } else if (isDeleting && charIdx === 0) {
                    isDeleting = false;
                    wordIdx = (wordIdx + 1) % words.length;
                }
                setTimeout(type, isDeleting ? 50 : 100);
            };
            type();
        },
        initScrollFadeIn: () => {
            const faders = document.querySelectorAll('.fade-in');
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });
            faders.forEach(fader => observer.observe(fader));
        },
        initNavbar: () => {
            const { navToggle, navLinks } = CONFIG.dom;
            if (!navToggle || !navLinks) return;
            navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
            navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('active')));
            const sections = document.querySelectorAll('section[id]');
            window.addEventListener('scroll', () => {
                let current = '';
                sections.forEach(sec => {
                    const sectionTop = sec.offsetTop;
                    if (window.scrollY >= sectionTop - 200) {
                        current = sec.getAttribute('id');
                    }
                });
                const scrollPosition = window.innerHeight + window.scrollY;
                const bodyHeight = document.body.offsetHeight;
                if (scrollPosition >= bodyHeight - 10) { current = 'contact'; }
                navLinks.querySelectorAll('a').forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${current}`) { a.classList.add('active'); }
                });
            });
        },
        initNameFade: () => {
            const el = CONFIG.dom.heroTitle;
            if (!el) return;
            const names = ["Tazakka Atthariq", "Zyxe"];
            let idx = 0;
            setInterval(() => {
                el.classList.add('fade-out');
                setTimeout(() => {
                    idx = (idx + 1) % names.length;
                    el.textContent = names[idx];
                    el.classList.remove('fade-out');
                }, 500);
            }, 4000);
        }
    };

    // --- 5. INITIALIZATION ---
    async function init() {
        Effects.initTyping();
        Effects.initScrollFadeIn();
        Effects.initNavbar();
        Effects.initNameFade();

        const data = await fetchSanityData();
        if (data) {
            UI.renderProfile(data.profile);
            UI.renderSkills(data.skills);
            UI.renderCertifications(data.certifications);
            UI.renderProjects(data.projects);
        }
    }

    init();
});