/* ==============================================
   ZONA DE CONFIGURACIÓN (EDITA AQUÍ TUS DATOS)
   ============================================== */
const CONFIGURACION = {
    // ENLACE DE MÚSICA DE FONDO:
    // Pega aquí el enlace directo a tu archivo MP3 (debe terminar en .mp3)
    // musicaFondo: "https://nu.vgmtreasurechest.com/soundtracks/garena-free-fire-classic-original-game-soundtrack-2020-android-ios/moixpiua/08.%20Free%20Fire%20-%20Booyah%21.mp3", 
    
    // DATOS DE WHATSAPP:
    telefono: "522311576228", // Tu número con código de país
    mensajeConfirmacion: "¡Hola! Confirmo mi asistencia al cumpleaños de David. Mi nombre es: ",
    
    // DATOS DEL MAPA:
    linkMapa: "https://share.google/cUb8p7q7XV94e3xAB", // Enlace de Google Maps

    // TEXTOS DE LA INVITACIÓN:
    fecha: "Martes, 27 de Enero",
    hora: "3:30 PM (15:30 hrs)",
    direccion: "Pizzas Angelotti (Abasolo 211, Centro, 73800 Teziutlán)"
};


/* --- INICIALIZACIÓN DE DATOS --- */

// Cargar música desde la configuración
if (CONFIGURACION.musicaFondo) {
    document.getElementById('bg-music').src = CONFIGURACION.musicaFondo;
}

// Cargar textos en el HTML
document.getElementById('info-date').textContent = CONFIGURACION.fecha;
document.getElementById('info-time').textContent = CONFIGURACION.hora;
document.getElementById('info-address').textContent = CONFIGURACION.direccion;

/* --- LOGICA DEL JUEGO / INTERACCIÓN --- */

// Referencias Audio
const bgMusic = document.getElementById('bg-music');
const sfxClick = document.getElementById('sfx-click');
const sfxOpen = document.getElementById('sfx-open');
const sfxBooyah = document.getElementById('sfx-booyah');
const sfxWind = document.getElementById('sfx-wind');
const sfxFire = document.getElementById('sfx-fire');

// Referencias Pantallas
const screenStart = document.getElementById('screen-start');
const screenDrop = document.getElementById('screen-drop');
const screenInvite = document.getElementById('screen-invite');
const lootBox = document.getElementById('loot-box');

// --- CONTROL DE VOLUMEN ---
const volSlider = document.getElementById('vol-slider');
const volIcon = document.getElementById('vol-icon');
const allAudio = [bgMusic, sfxClick, sfxOpen, sfxBooyah, sfxWind, sfxFire];

function updateVolume(value) {
    allAudio.forEach(audio => { audio.volume = value; });
    
    if (value == 0) {
        volIcon.className = "fa-solid fa-volume-xmark text-gray-500 mr-3 w-4 text-center text-lg";
    } else if (value < 0.5) {
        volIcon.className = "fa-solid fa-volume-low text-yellow-500 mr-2 w-4 text-center text-sm drop-shadow-[0_0_5px_rgba(255,187,0,0.8)]";
    } else {
        volIcon.className = "fa-solid fa-volume-high text-yellow-500 mr-2 w-4 text-center text-sm drop-shadow-[0_0_5px_rgba(255,187,0,0.8)]";
    }
}

volSlider.addEventListener('input', (e) => updateVolume(e.target.value));
updateVolume(0.2); // Volumen inicial 20%

// Helper para reproducir audio seguro
function safePlay(audioElement) {
    audioElement.volume = volSlider.value;
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => console.warn("Audio play prevented:", error));
    }
}

// NUEVA FUNCIÓN: DETENER TODO EL AUDIO
function stopAllAudio() {
    allAudio.forEach(audio => {
        audio.pause();
        audio.currentTime = 0; // Reiniciar al principio
    });
}

function startGame() {
    safePlay(sfxClick);
    safePlay(bgMusic);
    safePlay(sfxWind);

    screenStart.classList.add('hidden');
    screenStart.style.opacity = 0;
    
    setTimeout(() => {
        screenStart.style.display = 'none';
        screenDrop.classList.remove('hidden');
        screenDrop.style.opacity = 1;
    }, 500);
}

let isOpening = false;

function openLoot() {
    if(isOpening) return;
    isOpening = true;

    lootBox.classList.remove('airdrop-box');
    lootBox.classList.add('shake-box');
    safePlay(sfxOpen);
    sfxWind.pause(); // Silenciar viento

    setTimeout(() => {
        screenDrop.style.opacity = 0;
        
        setTimeout(() => {
            screenDrop.style.display = 'none';
            screenInvite.classList.remove('hidden');
            
            safePlay(sfxBooyah);
            safePlay(sfxFire);
            startFireParticles();
        }, 500);
    }, 1500);
}

function confirmAssist() {
    // CORRECCIÓN: Detener audio al confirmar
    stopAllAudio();
    window.open(`https://wa.me/${CONFIGURACION.telefono}?text=${encodeURIComponent(CONFIGURACION.mensajeConfirmacion)}`, '_blank');
}

function openMap() {
    // CORRECCIÓN: Detener audio al ver mapa
    stopAllAudio();
    window.open(CONFIGURACION.linkMapa, '_blank');
}


/* --- EFECTOS VISUALES (CANVAS) --- */

// 1. Fondo Táctico
const canvasBg = document.getElementById('bg-canvas');
const ctxBg = canvasBg.getContext('2d');
let width, height;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvasBg.width = width;
    canvasBg.height = height;
    fireCanvas.width = width;
    fireCanvas.height = height;
}
window.addEventListener('resize', resize);

let offset = 0;
function drawBg() {
    // Fondo oscuro con gradiente
    const gradient = ctxBg.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(1, '#000000');
    ctxBg.fillStyle = gradient;
    ctxBg.fillRect(0, 0, width, height);
    
    // Grid Táctico
    ctxBg.strokeStyle = 'rgba(255, 187, 0, 0.05)'; // Amarillo muy tenue
    ctxBg.lineWidth = 1;

    offset = (offset + 0.2) % 50;
    
    for (let x = 0; x < width; x += 50) {
        ctxBg.beginPath();
        ctxBg.moveTo(x, 0);
        ctxBg.lineTo(x, height);
        ctxBg.stroke();
    }
    
    // Líneas horizontales en movimiento (Efecto escáner)
    for (let y = offset; y < height; y += 50) {
        ctxBg.beginPath();
        ctxBg.moveTo(0, y);
        ctxBg.lineTo(width, y);
        ctxBg.stroke();
    }

    // Radar central
    ctxBg.strokeStyle = 'rgba(255, 187, 0, 0.1)';
    ctxBg.beginPath();
    ctxBg.arc(width/2, height/2, 150, 0, Math.PI * 2);
    ctxBg.stroke();
    ctxBg.beginPath();
    ctxBg.arc(width/2, height/2, 100, 0, Math.PI * 2);
    ctxBg.stroke();

    requestAnimationFrame(drawBg);
}

// 2. Partículas de Fuego
const fireCanvas = document.getElementById('fire-overlay');
const ctxFire = fireCanvas.getContext('2d');
let particles = [];

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 6 + 2;
        // Colores entre rojo y amarillo
        const red = 255;
        const green = Math.floor(Math.random() * 180); 
        this.color = `rgba(${red}, ${green}, 0,`; // Alpha se añade al dibujar
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.005;
    }
    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.alpha -= this.decay;
        if (this.alpha < 0) this.alpha = 0;
    }
    draw() {
        ctxFire.fillStyle = `${this.color} ${this.alpha})`;
        ctxFire.beginPath();
        ctxFire.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctxFire.fill();
    }
}

function startFireParticles() {
    resize();
    function animateFire() {
        ctxFire.clearRect(0, 0, width, height);
        // Generar nuevas partículas constantemente
        if (particles.length < 150) {
            particles.push(new Particle());
            particles.push(new Particle()); // Doble intensidad
        }
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animateFire);
    }
    animateFire();
}

// Init
resize();
drawBg();

    
