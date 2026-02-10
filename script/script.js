// --- 1. GESTION DU THEME (Sombre / Clair) ---
const boutonInterrupteur = document.querySelector('#case-interrupteur');
const corpsDePage = document.body;

// Vérifier si un thème a déjà été sauvegardé
const themeActuel = localStorage.getItem('theme');
if (themeActuel) {
    corpsDePage.classList.remove('theme-sombre', 'theme-clair');
    corpsDePage.classList.add(themeActuel);
    if (themeActuel === 'theme-clair') {
        boutonInterrupteur.checked = true;
    }
}

boutonInterrupteur.addEventListener('change', function() {
    if (this.checked) {
        corpsDePage.classList.remove('theme-sombre');
        corpsDePage.classList.add('theme-clair');
        localStorage.setItem('theme', 'theme-clair');
    } else {
        corpsDePage.classList.remove('theme-clair');
        corpsDePage.classList.add('theme-sombre');
        localStorage.setItem('theme', 'theme-sombre');
    }
});

// --- 2. DONNÉES DES PROJETS ---
const projetsData = {
    "mathsimple": {
        titre: "Site Éducatif (MathSimple)",
        categorie: "Projet Universitaire (S3)",
        duree: "3 semaines",
        technos: "HTML5, CSS3, PHP, MySQL",
        tags: ["academique"],
        image: "image/mathsimple.png",
        lien: "http://projets.iut-bobigny.univ-paris13.fr/~slimani/SAE_203/",
        mission: `
            <strong>Contexte :</strong><br>
            Réalisé dans le cadre d'une SAE en BUT MMI, ce projet visait à concevoir une plateforme éducative pour le cycle 3 (CM1-6ème) sur le thème de l'organisation des quantités et des entiers relatifs.<br><br>
            
            <strong>Spécificités fonctionnelles :</strong><br>
            L'application propose un double parcours : un accès visiteur pour consulter les leçons (droites graduées, fractions) et un espace membre sécurisé. Une fois connecté, l'élève peut accéder à des exercices interactifs et suivre sa progression.<br><br>
            
            <strong>Spécificités techniques :</strong><br>
            • <strong>Architecture :</strong> Mise en place d'un modèle MVC (Modèle-Vue-Contrôleur) strict en PHP natif pour séparer la logique métier de l'affichage.<br>
            • <strong>Sécurité :</strong> Authentification robuste via hachage Argon2ID et protection contre les injections SQL (PDO).<br>
            • <strong>Dynamisme :</strong> Utilisation de l'API Fetch (JS) pour la recherche instantanée d'articles sans rechargement de page.
        `
    },
    "portfolio": {
        titre: "Portfolio Personnel",
        categorie: "Projet Personnel",
        duree: "En cours",
        technos: "HTML5, CSS3, JavaScript",
        tags: ["perso", "academique"],
        image: "image/portfolio.png",
        lien: "#",
        mission: `
            <strong>Contexte :</strong><br>
            Projet personnel de développement web visant à créer une identité numérique forte. La contrainte auto-imposée était de ne pas utiliser de framework (React/Vue) pour démontrer une maîtrise approfondie du langage JavaScript natif (Vanilla JS).<br><br>
            
            <strong>Spécificités fonctionnelles :</strong><br>
            Le site intègre un mode sombre/clair persistant, une navigation fluide par modale immersive et un système de filtrage de projets en temps réel. L'UX a été pensée pour être totalement responsive (Mobile First).<br><br>
            
            <strong>Spécificités techniques :</strong><br>
            • <strong>Algorithmique :</strong> Création d'un système de navigation circulaire (Next/Prev) calculé mathématiquement pour la modale.<br>
            • <strong>DOM & Events :</strong> Manipulation avancée du DOM pour l'injection dynamique du contenu (JSON) et la gestion des filtres.<br>
            • <strong>Performance :</strong> Optimisation du chargement et code modulaire respectant les bonnes pratiques (Clean Code).
        `
    },
    "motus": {
        titre: "Jeu Motus (Version PHP/POO)",
        categorie: "Projet Universitaire (BUT MMI)",
        duree: "2 semaines",
        technos: "PHP 8 (POO), Librairie GD, HTML5/CSS3",
        tags: ["academique"],
        image: "image/motus.png",
        lien: "https://lamp-pedago/A2MMI/Kaina.Slimani/JeuMotus/",
        mission: `
            <strong>Contexte :</strong><br>
            Développement Back-End d'une réplique du jeu "Motus" (thème : verbes) avec une contrainte académique forte : <strong>No-JS</strong>. L'intégralité de la logique de jeu devait être gérée côté serveur.<br><br>
            
            <strong>Spécificités fonctionnelles :</strong><br>
            Gestion complète d'une partie (7 tentatives), indicateurs de couleurs (bien/mal placé) et génération d'un diplôme de victoire téléchargeable.<br><br>
            
            <strong>Spécificités techniques :</strong><br>
            • <strong>POO :</strong> Architecture 100% Orientée Objet avec gestion d'états via les Sessions PHP.<br>
            • <strong>Traitement d'image :</strong> Utilisation de la librairie GD pour générer pixel par pixel l'image du diplôme final.<br>
            • <strong>Robustesse :</strong> Implémentation d'un "Fallback" : si la librairie GD plante, le site bascule automatiquement sur un rendu HTML/CSS.
        `
    }
};

// --- 3. GESTION DE L'OUVERTURE DE LA MODALE ---
const modal = document.getElementById('modal-projet');
const modalTitre = document.getElementById('modal-titre');
const modalCorps = document.getElementById('modal-description'); 

function ouvrirModale(idProjet) {
    
    // 1. Récupérer le filtre ACTUELLEMENT actif
    const boutonActif = document.querySelector('.btn-filtre.actif');
    const filtreActif = boutonActif ? boutonActif.getAttribute('data-filter') : 'tout';

    // 2. Créer la liste des projets DISPONIBLES selon ce filtre
    const tousLesProjets = Object.keys(projetsData);
    
    const projetsFiltres = tousLesProjets.filter(cle => {
        if (filtreActif === 'tout') return true;
        return projetsData[cle].tags.includes(filtreActif);
    });
    
    // 3. Trouver la position et calculer Suivant/Précédent
    const indexActuel = projetsFiltres.indexOf(idProjet);
    if (indexActuel === -1) return; // Sécurité

    const indexPrev = (indexActuel - 1 + projetsFiltres.length) % projetsFiltres.length;
    const indexNext = (indexActuel + 1) % projetsFiltres.length;
    
    const idPrev = projetsFiltres[indexPrev];
    const idNext = projetsFiltres[indexNext];

    // 4. Récupérer les données
    const projet = projetsData[idProjet];
    const afficherFleches = projetsFiltres.length > 1;

    if (projet) {
        modalTitre.innerText = projet.titre;
        
        let boutonActionHtml = '';
        if (idProjet === 'portfolio') {
            boutonActionHtml = `
                <span class="bouton-carte" style="background: transparent; border: 1px solid var(--or); color: var(--or); cursor: default;">
                    Vous êtes dessus !
                </span>
            `;
        } else {
            boutonActionHtml = `
                <a href="${projet.lien}" target="_blank" class="bouton-carte" style="text-decoration: none; display: inline-block;">
                    Voir le projet <i class="fas fa-external-link-alt" style="margin-left: 5px;"></i>
                </a>
            `;
        }

        modalCorps.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${projet.image}" alt="${projet.titre}" style="width: 100%; height: auto; border-radius: 10px; border: 1px solid var(--bordure);">
            </div>
            <div class="details-projet-complet">
                <p class="detail-ligne"><strong><i class="fas fa-folder-open"></i> Contexte :</strong> ${projet.categorie}</p>
                <p class="detail-ligne"><strong><i class="far fa-clock"></i> Durée :</strong> ${projet.duree}</p>
                <p class="detail-ligne"><strong><i class="fas fa-code"></i> Technologies :</strong> <span style="color: var(--or);">${projet.technos}</span></p>
                
                <hr class="separateur-modale">
                
                <div class="mission-bloc">
                    ${projet.mission}
                </div>

                <div class="conteneur-bouton-projet">
                    ${boutonActionHtml}
                </div>

                ${afficherFleches ? `
                <div class="nav-footer-container">
                    <button onclick="ouvrirModale('${idPrev}')" class="btn-nav-simple prev">
                        <i class="fas fa-long-arrow-alt-left"></i> Précédent
                    </button>
                    <span style="font-size: 0.8rem; opacity: 0.5;">
                        ${indexActuel + 1} / ${projetsFiltres.length}
                    </span>
                    <button onclick="ouvrirModale('${idNext}')" class="btn-nav-simple next">
                        Suivant <i class="fas fa-long-arrow-alt-right"></i>
                    </button>
                </div>
                ` : ''} 
            </div>
        `;
        
        modal.style.display = "flex";
    }
}

// --- 4. FERMETURE DE LA MODALE ---
const croixFermer = document.querySelector('.fermer-modale');

if (croixFermer) {
    croixFermer.addEventListener('click', () => {
        modal.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

// --- 5. ÉCRAN DE CHARGEMENT (Optimisé) ---
window.addEventListener('load', function() {
    const loader = document.getElementById('ecran-chargement');
    if (loader) {
        loader.style.opacity = '0'; // Déclenche le fondu CSS
        setTimeout(() => {
            loader.style.display = 'none'; // Retire l'élément après l'anim
        }, 500);
    }
});

// --- 6. BOUTON RETOUR HAUT DE PAGE ---
const boutonRetour = document.getElementById("bouton-retour-haut");

window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        boutonRetour.style.display = "block";
    } else {
        boutonRetour.style.display = "none";
    }
}

boutonRetour.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// --- 7. SYSTÈME DE FILTRES PROJETS --- 
const boutonsFiltre = document.querySelectorAll('.btn-filtre');
const cartesProjet = document.querySelectorAll('.projet-item');

boutonsFiltre.forEach(bouton => {
    bouton.addEventListener('click', () => {
        // 1. Gestion visuelle des boutons
        boutonsFiltre.forEach(btn => btn.classList.remove('actif'));
        bouton.classList.add('actif');

        const valeurFiltre = bouton.getAttribute('data-filter');

        // 2. Filtrage des cartes
        cartesProjet.forEach(carte => {
            // On récupère la catégorie via l'attribut HTML data-categorie
            const categorieCarte = carte.getAttribute('data-categorie');

            if (valeurFiltre === 'tout' || categorieCarte === valeurFiltre) {
                carte.classList.remove('cache');
                carte.classList.add('montre'); // Affiche avec animation
            } else {
                carte.classList.remove('montre');
                carte.classList.add('cache'); // Cache
            }
        });
    });
});

// --- 8. MENU BURGER MOBILE --- 
const burgerBtn = document.getElementById('burger-menu');
const menuNav = document.getElementById('menu-nav');
const liensNav = document.querySelectorAll('.liens-menu a');

if (burgerBtn) {
    burgerBtn.addEventListener('click', () => {
        menuNav.classList.toggle('mobile-visible');
        
        const icone = burgerBtn.querySelector('i');
        if (menuNav.classList.contains('mobile-visible')) {
            icone.classList.remove('fa-bars');
            icone.classList.add('fa-times');
        } else {
            icone.classList.remove('fa-times');
            icone.classList.add('fa-bars');
        }
    });
}

liensNav.forEach(lien => {
    lien.addEventListener('click', () => {
        menuNav.classList.remove('mobile-visible');
        if (burgerBtn) {
            const icone = burgerBtn.querySelector('i');
            icone.classList.remove('fa-times');
            icone.classList.add('fa-bars');
        }
    });
});

// --- 9. SYSTÈME DE COPIE UNIVERSEL ---
const elementsACopier = document.querySelectorAll('.info-copie');

elementsACopier.forEach(element => {
    element.addEventListener('click', function() {
        // 1. Récupérer le texte
        const texte = this.innerText.trim();
        
        // 2. Trouver le message de succès juste à côté
        const msgSucces = this.nextElementSibling;

        // 3. Copier dans le presse-papier
        navigator.clipboard.writeText(texte).then(() => {
            if (msgSucces && msgSucces.classList.contains('msg-succes')) {
                msgSucces.style.display = 'inline';
                setTimeout(() => {
                    msgSucces.style.display = 'none';
                }, 2000);
            }
        }).catch(err => {
            console.error('Erreur :', err);
            alert("Info : " + texte);
        });
    });
});