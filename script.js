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

    // Fungsi Global untuk Flip Card
    window.flipCard = (elementId) => {
        const card = document.getElementById(elementId);
        if (card) card.classList.toggle('is-flipped');
    };

    // --- 2. API & DATA FETCHING (Update Query) ---
    async function fetchSanityData() {
        const { projectId, dataset, apiVersion } = CONFIG.sanity;
        
        const query = `
        {
            "profile": *[_type == "profile"][0] {
                about, contactMessage, email, github, linkedin, instagram, whatsapp,
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

    // --- 3. UI RENDERING (Update Logic Tombol) ---
    const UI = {
        renderProfile: (data) => {
            if (!data) return;
            const { aboutText, contactText, contactLinks, emailLink, cvButton } = CONFIG.dom;

            if (aboutText && data.about) aboutText.textContent = data.about;
            if (contactText && data.contactMessage) contactText.innerHTML = data.contactMessage.replace(/\n/g, '<br>');
            
            if (cvButton && data.cvUrl) {
                cvButton.href = data.cvUrl;
                cvButton.textContent = "Download CV";
            }
            
            if (emailLink && data.email) {
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${data.email}`;
                
                emailLink.href = gmailUrl;
                emailLink.target = "_blank";
                emailLink.rel = "noopener noreferrer";
                emailLink.textContent = "Email Me";
            }

            if (contactLinks) {
                const socialMap = [
                    { url: data.github, icon: 'github', label: 'GitHub' },
                    { url: data.linkedin, icon: 'linkedin', label: 'LinkedIn' },
                    { url: data.instagram, icon: 'instagram', label: 'Instagram' },
                    { url: data.whatsapp, icon: 'whatsapp', label: 'WhatsApp' }
                ];
                
                contactLinks.innerHTML = socialMap
                    .filter(item => item.url)
                    .map(item => `<a href="${item.url}" target="_blank" aria-label="${item.label}"><i class="fab fa-${item.icon}"></i></a>`)
                    .join('');
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
            
            // Jika data kosong, sembunyikan section (opsional) atau tampilkan pesan
            if (!data || data.length === 0) { 
                container.innerHTML = '<p class="text-secondary">No certifications added yet.</p>'; 
                return; 
            }

            container.innerHTML = data.map(cert => {
                // Tentukan Icon: Jika ada gambar pakai gambar, jika tidak pakai ikon piala default
                const iconHtml = cert.logoUrl 
                    ? `<img src="${cert.logoUrl}" alt="${cert.organizer}">`
                    : `<i class="fas fa-trophy"></i>`;
                
                // Link Credential (hanya muncul jika ada URL)
                const linkHtml = cert.credentialUrl 
                    ? `<a href="${cert.credentialUrl}" target="_blank" class="cert-link">View Credential <i class="fas fa-external-link-alt" style="font-size:0.7em"></i></a>`
                    : '';

                return `
                <div class="cert-card fade-in">
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
            
            Effects.initScrollFadeIn(); // Refresh animasi
        },

        renderProjects: (data) => {
            const container = CONFIG.dom.projectsContainer;
            if (!container) return;
            if (!data) { container.innerHTML = '<p>Failed to load projects.</p>'; return; }

            container.innerHTML = data.map((project, index) => {
                const img = project.imageUrl || 'https://placehold.co/600x400/1e1e1e/ffffff?text=No+Image';
                const tags = (project.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
                
                const btnRole = project.role 
                    ? `<button class="btn-role" onclick="flipCard('project-${index}')"><i class="fas fa-user-tag"></i> Role</button>` 
                    : '';
                const btnTrailer = project.trailerUrl 
                    ? `<a href="${project.trailerUrl}" target="_blank"><i class="fab fa-youtube"></i> Video</a>` 
                    : '';
                const btnSource = project.sourceUrl 
                    ? `<a href="${project.sourceUrl}" target="_blank"><i class="fab fa-github"></i> Code</a>` 
                    : '';
                const btnDemo = project.demoUrl 
                    ? `<a href="${project.demoUrl}" target="_blank"><i class="fas fa-play"></i> Play</a>` 
                    : '';
                
                const actionButtons = `${btnRole}${btnTrailer}${btnSource}${btnDemo}`;

                let roleContent = '<p style="text-align:center; color:gray;">No role details provided.</p>';
                if (project.role) {
                    const lines = project.role.split('\n').filter(line => line.trim() !== '');
                    const listItems = lines.map(line => `<li>${line.trim()}</li>`).join('');
                    roleContent = `<ul class="role-list">${listItems}</ul>`;
                }

                return `
                <div class="project-card fade-in">
                    <div class="project-inner" id="project-${index}">
                        <div class="project-front">
                            <img src="${img}" alt="${project.title}" class="project-image">
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
                    const sectionHeight = sec.clientHeight;
                    
                    if (window.scrollY >= sectionTop - 200) {
                        current = sec.getAttribute('id');
                    }
                });

                const scrollPosition = window.innerHeight + window.scrollY;
                const bodyHeight = document.body.offsetHeight;

                if (scrollPosition >= bodyHeight - 10) {
                    current = 'contact';
                }

                // 3. Terapkan Class Active
                navLinks.querySelectorAll('a').forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${current}`) {
                        a.classList.add('active');
                    }
                });
            });
        },

        // --- NEW: FADE NAME SWITCHER (No Glitch) ---
        initNameFade: () => {
            const el = CONFIG.dom.heroTitle;
            if (!el) return;

            const names = ["Tazakka Atthariq", "Zyxe"];
            let idx = 0;

            setInterval(() => {
                // 1. Fade Out (Opacity 0)
                el.classList.add('fade-out');

                // 2. Tunggu transisi CSS selesai (500ms), baru ganti teks
                setTimeout(() => {
                    idx = (idx + 1) % names.length;
                    el.textContent = names[idx];
                    
                    // 3. Fade In (Hapus class fade-out)
                    el.classList.remove('fade-out');
                }, 500); // Harus sama dengan durasi transition CSS (0.5s)

            }, 4000); // Ganti setiap 4 detik
        }
    };

    // --- 5. INITIALIZATION ---
    async function init() {
        Effects.initTyping();
        Effects.initScrollFadeIn();
        Effects.initNavbar();
        Effects.initNameFade(); // Panggil fungsi Fade baru

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