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
    currentSlide = index; // Mettre à jour l'index de la scène actuelle

    let slide = slides[currentSlide];

    // Vérifier si une musique est en cours et l’arrêter
    if (music) {
        music.pause();
        music.currentTime = 0;
    }

    // Charger et jouer la nouvelle musique
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

    // Afficher la scène (background + personnages)
    redrawScene();

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

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawScene(); // Redessiner l'écran après le resize
}

// Fonction pour redessiner le background après un resize
function redrawScene() {
    if (!slides || !slides[currentSlide]) return;

    let slide = slides[currentSlide];
    let bgImage = new Image();
    bgImage.src = slide.background;
    bgImage.onload = () => {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    };

    // Re-dessiner les personnages (on fixera leur position après)
    slide.characters.forEach(char => {
        let charImage = new Image();
        charImage.src = char.image;
        charImage.onload = () => {
            ctx.drawImage(charImage, char.position[0], char.position[1]);
        };
    });
}

// Événement pour redimensionner le canvas
window.addEventListener("resize", resizeCanvas);


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
