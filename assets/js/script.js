/* =====================================================================
   SCRIPT.JS — Comportements interactifs du portfolio
   Ce fichier est écrit pour être RÉSISTANT aux pannes de CDN : si une
   librairie externe (jQuery, Typed.js, ScrollReveal, VanillaTilt,
   EmailJS) ne se charge pas chez un visiteur (réseau lent, CDN
   bloqué, ad-blocker...), SEULE la fonctionnalité qui en dépend est
   désactivée — le reste du site continue de fonctionner normalement.
   Avant cette version, une seule librairie manquante faisait planter
   TOUT le script (page blanche pour le visiteur).
===================================================================== */

// ===== jQuery : menu mobile, scroll spy, smooth scroll, formulaire de contact =====
if (typeof $ !== "undefined" && typeof jQuery !== "undefined") {

    $(document).ready(function () {

        $('#menu').click(function () {
            $(this).toggleClass('fa-times');
            $('.navbar').toggleClass('nav-toggle');
        });

        $(window).on('scroll load', function () {
            $('#menu').removeClass('fa-times');
            $('.navbar').removeClass('nav-toggle');

            if (window.scrollY > 60) {
                document.querySelector('#scroll-top').classList.add('active');
            } else {
                document.querySelector('#scroll-top').classList.remove('active');
            }

            if (window.scrollY > 30) {
                document.querySelector('.header').classList.add('scrolled');
            } else {
                document.querySelector('.header').classList.remove('scrolled');
            }

            // scroll spy
            $('section').each(function () {
                let height = $(this).height();
                let offset = $(this).offset().top - 200;
                let top = $(window).scrollTop();
                let id = $(this).attr('id');

                if (top > offset && top < offset + height) {
                    $('.navbar ul li a').removeClass('active');
                    $('.navbar').find(`[href="#${id}"]`).addClass('active');
                }
            });
        });

        // smooth scrolling
        $('a[href*="#"]').on('click', function (e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top,
            }, 500, 'linear')
        });

        // <!-- emailjs to mail contact form data -->
        $("#contact-form").submit(function (event) {
            event.preventDefault();

            if (typeof emailjs === "undefined") {
                alert("Le service d'envoi de messages est momentanément indisponible. Réessaie un peu plus tard, ou écris-moi directement à borisigorbalima@gmail.com.");
                return;
            }

            emailjs.init({
                publicKey: "pvAFYY_9NxS-fzFEm"
            });

            emailjs.sendForm('service_b0gfcva', 'template_qait78d', '#contact-form')
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                    document.getElementById("contact-form").reset();
                    alert("Message envoyé avec succès !");
                }, function (error) {
                    console.log('FAILED...', error);
                    alert("Échec de l'envoi. Réessayez !");
                });
        });

    });

    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Boris Igor BALIMA";
            $("#favicon").attr("href", "assets/images/favicon.png");
        } else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });

} else {
    console.warn("[Portfolio] jQuery non chargé — menu mobile, scroll fluide et formulaire de contact désactivés.");
}

// Boutons "Voir plus / Voir moins" (vanilla JS pur, aucune dépendance)
document.querySelectorAll('.voir-plus-btn').forEach(button => {
    button.addEventListener('click', () => {
        const details = button.nextElementSibling;
        if (details.style.display === "block") {
            details.style.display = "none";
            button.textContent = "Voir plus";
        } else {
            details.style.display = "block";
            button.textContent = "Voir moins";
        }
    });
});

// ===== Typed.js : effet machine à écrire du sous-titre =====
if (typeof Typed !== "undefined") {
    var typed = new Typed(".typing-text", {
        strings: ["Front-End Developer", "Ingénieur IA", "Ingénieur IoT"],
        loop: true,
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 500,
    });
} else {
    // Fallback simple : affiche un texte fixe si Typed.js est indisponible
    document.querySelectorAll('.typing-text').forEach(el => {
        el.textContent = "Front-End Developer";
    });
    console.warn("[Portfolio] Typed.js non chargé — texte fixe affiché à la place.");
}

/**
 * Charge un fichier JSON (compétences ou projets). Ne dépend d'aucune
 * librairie externe : le fetch natif fonctionne toujours.
 * @param {"skills"|"projects"} type
 */
async function fetchData(type = "skills") {
    const response = type === "skills"
        ? await fetch("skills.json")
        : await fetch("projects/projects.json");
    if (!response.ok) {
        throw new Error(`Impossible de charger ${type} (statut ${response.status})`);
    }
    return await response.json();
}

// ===== SKILLS : affichage en cartes catégorisées =====
function showSkills(categories) {
    let skillsContainer = document.getElementById("skillsContainer");
    let html = "";

    categories.forEach(category => {
        html += `
        <div class="skill-category">
          <div class="skill-category-header">
            <span class="skill-category-icon"><i class="fas ${category.categoryIcon}"></i></span>
            <h3 class="skill-category-title">${category.category}</h3>
          </div>
          <div class="skill-category-grid">`;

        category.items.forEach(skill => {
            html += `
            <div class="bar">
              <div class="info">
                <img src="${skill.icon}" alt="${skill.name}"
                     onerror="this.onerror=null; this.src='https://img.icons8.com/color/48/000000/around-the-globe.png'; this.style.opacity='0.5';" />
                <span>${skill.name}</span>
              </div>
            </div>`;
        });

        html += `
          </div>
        </div>`;
    });

    skillsContainer.innerHTML = html;
}

// ===== PROJETS : cartes qui se retournent au survol =====
function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";

    projects.forEach(project => {
        projectHTML += `
        <div class="flip-card">
          <div class="flip-card-inner">

            <!-- Face avant -->
            <div class="flip-card-front">
              <div class="box-img-wrap">
                <img 
                    loading="lazy"
                    draggable="false"
                    src="assets/images/projects/${project.image}" 
                    alt="${project.name}"
                    onerror="this.parentElement.innerHTML = 
                    '<div class=\\'project-logo-fallback\\'>${project.name}</div>';" />
              </div>
              <span class="flip-hint">
                <i class="fas fa-sync-alt"></i> Survoler pour en savoir plus
              </span>
            </div>

            <!-- Face arrière -->
            <div class="flip-card-back">
              <h3>${project.name}</h3>
              <p>${project.desc}</p>
              <a href="${project.links.view}" class="btn" target="_blank">
                <i class="fas fa-eye"></i> Voir le projet
              </a>
            </div>

          </div>
        </div>`;
    });

    projectsContainer.innerHTML = projectHTML;
    safeReveal('.work .flip-card', { interval: 200 });
}

// Chargement des données dynamiques (compétences + projets).
// En cas d'échec réseau, un message clair remplace le contenu au lieu
// de laisser la section vide sans explication.
fetchData().then(data => {
    showSkills(data);
}).catch(err => {
    console.error("[Portfolio] Erreur de chargement des compétences :", err);
    const el = document.getElementById("skillsContainer");
    if (el) el.innerHTML = "<p style='color:#fff;text-align:center;'>Impossible de charger les compétences pour le moment.</p>";
});

fetchData("projects").then(data => {
    showProjects(data);
}).catch(err => {
    console.error("[Portfolio] Erreur de chargement des projets :", err);
    const el = document.querySelector("#work .box-container");
    if (el) el.innerHTML = "<p style='color:#fff;text-align:center;'>Impossible de charger les projets pour le moment.</p>";
});

// ===== VanillaTilt : effet tilt 3D léger au survol =====
if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
} else {
    console.warn("[Portfolio] VanillaTilt non chargé — effet tilt désactivé.");
}

// Désactivation de quelques raccourcis d'inspection (aucune dépendance externe)
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}

// ===== ScrollReveal : animations d'apparition au scroll =====
// srtop reste "null" si la librairie est absente ; safeReveal() gère
// ce cas partout où l'animation est utilisée, sans jamais planter.
const srtop = (typeof ScrollReveal !== "undefined")
    ? ScrollReveal({ origin: 'top', distance: '80px', duration: 1000, reset: true })
    : null;

function safeReveal(selector, options) {
    if (srtop) {
        srtop.reveal(selector, options);
    }
    // Si ScrollReveal est indisponible, les éléments restent simplement
    // visibles par défaut (pas d'animation, mais rien de caché).
}

if (!srtop) {
    console.warn("[Portfolio] ScrollReveal non chargé — animations d'apparition désactivées, contenu affiché normalement.");
}

/* SCROLL HOME */
safeReveal('.home .content h3', { delay: 200 });
safeReveal('.home-subtitle', { delay: 200 });
safeReveal('.home-cta', { delay: 400 });
safeReveal('.home-socials a', { interval: 200 });

/* SCROLL ABOUT */
safeReveal('.about .content h3', { delay: 200 });
safeReveal('.about .content .tag', { delay: 200 });
safeReveal('.about .content p', { delay: 200 });
safeReveal('.about .content .box-container', { delay: 200 });
safeReveal('.about .content .resumebtn', { delay: 200 });

/* SCROLL SKILLS */
safeReveal('.skills .container', { interval: 200 });
safeReveal('.skill-category', { interval: 200 });

/* SCROLL EDUCATION */
safeReveal('.education .box', { interval: 200 });

/* SCROLL EXPERIENCE */
safeReveal('.experience .timeline', { delay: 400 });
safeReveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
safeReveal('.contact .container', { delay: 400 });
safeReveal('.contact .container .form-group', { delay: 400 });

/* ===== Modal CV (vanilla JS pur, aucune dépendance) ===== */
const cvModal = document.getElementById('cvModal');
document.querySelectorAll('.open-cv-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        cvModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});
function closeCvModal() {
    cvModal.classList.remove('active');
    document.body.style.overflow = '';
}
document.querySelector('.cv-modal-close').addEventListener('click', closeCvModal);
document.querySelector('.cv-modal-overlay').addEventListener('click', closeCvModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCvModal();
});

/* =====================================================================
   NOTE — Apparition de la page au chargement :
   Ce n'est PLUS géré ici en JavaScript (c'était la cause de la page
   blanche chez ton ami : si ce script plantait avant d'arriver ici,
   le body restait invisible pour toujours). C'est maintenant une
   simple animation CSS pure dans skills-categories.css, qui se joue
   automatiquement dès que la page se peint, sans dépendre de la
   réussite du JavaScript.
===================================================================== */