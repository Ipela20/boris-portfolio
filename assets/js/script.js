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
        event.preventDefault();
    });

    // <!-- emailjs to mail contact form data -->

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Boris Igor BALIMA";
            $("#favicon").attr("href", "assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });

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


// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["Front-End Developer", "Ingénieur IA", "Ingénieur IoT"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});
// <!-- typed js effect ends -->

async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json")
        :
       response = await fetch("projects/projects.json")
    const data = await response.json();
    return data;
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
                <img src="${skill.icon}" alt="${skill.name}" />
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

    /* ===== SCROLL REVEAL ANIMATION ===== */
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });

    /* SCROLL PROJECTS */
    srtop.reveal('.work .flip-card', { interval: 200 });

}

fetchData().then(data => {
    showSkills(data);
});

fetchData("projects").then(data => {
    showProjects(data);
});

// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});
// <!-- tilt js effect ends -->


// disable developer mode
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




/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL HOME */
srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home-subtitle', { delay: 200 });
srtop.reveal('.home-cta', { delay: 400 });
srtop.reveal('.home-socials a', { interval: 200 });

/* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });


/* SCROLL SKILLS */
srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skill-category', { interval: 200 });

/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });



// ===== Modal CV =====
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
   APPARITION DOUCE DE LA PAGE AU CHARGEMENT
   Le body démarre invisible (opacity:0, voir skills-categories.css)
   et devient visible avec un fondu dès que le HTML est prêt, au lieu
   d'un affichage "sec" instantané.
===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        document.body.classList.add('page-loaded');
    });
});