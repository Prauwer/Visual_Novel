let music = new Audio("assets/theme.mp3");
music.muted = true;  // On démarre la musique en mode silencieux
music.play().then(() => {
    music.muted = false; // On active le son après démarrage
}).catch(error => console.log("Erreur d'autoplay :", error));
