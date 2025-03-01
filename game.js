const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let slides, currentSlide = 0;
let text = "";
let displayedText = "";
let textIndex = 0;
let showFullText = false;
let textSpeed = 50; // Vitesse d'affichage du texte
let music = null;

// Charger les données JSON
fetch("data.json")
    .then(response => response.json())
    .then(data => {
        slides = data.slides;
    });

// Fonction pour démarrer le jeu
document.getElementById("playButton").addEventListener("click", () => {
    document.getElementById("menu").style.display = "none"; // Cacher le menu
    document.getElementById("gameContainer").style.display = "block"; // Afficher le jeu
    loadSlide(currentSlide); // Charger la première scène
});

function loadSlide(index) {
    let slide = slides[index];

    // Charger l'image de fond
    let bgImage = new Image();
    bgImage.src = slide.background;
    bgImage.onload = () => {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        // Charger les personnages
        slide.characters.forEach(char => {
            let charImage = new Image();
            charImage.src = char.image;
            charImage.onload = () => {
                ctx.drawImage(charImage, char.position[0], char.position[1]);
            };
        });
    };

    // Jouer la musique
    if (music) {
        music.pause();
        music.currentTime = 0;
    }
    music = new Audio(slide.music);
    music.play().catch(() => {
        console.log("Autoplay bloqué, en attente d'un clic...");
        document.addEventListener("click", () => {
            music.play().catch(error => console.log("Erreur audio :", error));
        }, { once: true });
    });

    // Réinitialiser le texte
    text = slide.text;
    displayedText = "";
    textIndex = 0;
    showFullText = false;

    // Démarrer l'affichage progressif du texte
    displayText();
}

// Fonction d'affichage progressif du texte
function displayText() {
    if (!showFullText && textIndex < text.length) {
        displayedText += text[textIndex];
        textIndex++;
        document.getElementById("text").innerText = displayedText;
        setTimeout(displayText, textSpeed);
    }
}

// Gérer les clics sur le jeu, mais **pas sur le menu**
document.addEventListener("click", (event) => {
    // Si on clique sur un bouton ou le menu, ne rien faire
    if (event.target.tagName === "BUTTON" || event.target.id === "menu") {
        return;
    }

    if (!showFullText) {
        showFullText = true;
        displayedText = text;
        document.getElementById("text").innerText = displayedText;
    } else {
        currentSlide++;
        if (currentSlide < slides.length) {
            loadSlide(currentSlide);
        } else {
            console.log("Fin du visual novel !");
        }
    }
});
