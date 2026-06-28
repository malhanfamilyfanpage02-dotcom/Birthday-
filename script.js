// ==================== CONFIGURATION ====================

const CONFIG = {
    TOTAL_STARS: 200,
    TOTAL_PARTICLES: 50,
    SCENE_TIMING: {
        background: 0,
        envelope: 1000,
        letter: 5000,
        poppers: 10000,
        card: 14000,
        cake: 18000,
        candle_blow: 23000,
        cutting: 25000,
        final: 27000,
        music: 28000
    },
    SCENE_DURATIONS: {
        envelope: 4000,
        letter: 4500,
        poppers: 3500,
        card: 4000,
        cake: 5000,
        smoke: 2500,
        cutting: 1500,
        final: 5000
    }
};

// ==================== CANVAS MANAGERS ====================

class StarManager {
    constructor() {
        this.canvas = document.getElementById('starCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.animationId = null;
        this.setupCanvas();
        this.createStars();
        this.animate();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars() {
        for (let i = 0; i < CONFIG.TOTAL_STARS; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5,
                opacity: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                baseOpacity: Math.random() * 0.7 + 0.3
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            star.baseOpacity += star.twinkleSpeed;
            if (star.baseOpacity > 1 || star.baseOpacity < 0.3) {
                star.twinkleSpeed *= -1;
            }

            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.baseOpacity})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

class ParticleManager {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.setupCanvas();
        this.createParticles();
        this.animate();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < CONFIG.TOTAL_PARTICLES; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                decay: Math.random() * 0.005 + 0.001
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.opacity -= p.decay;

            if (p.opacity <= 0) {
                p.x = Math.random() * this.canvas.width;
                p.y = Math.random() * this.canvas.height;
                p.opacity = Math.random() * 0.5 + 0.2;
            }

            // Glow effect
            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
            gradient.addColorStop(0, `rgba(255, 215, 0, ${p.opacity})`);
            gradient.addColorStop(1, `rgba(255, 215, 0, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

class ConfettiManager {
    constructor() {
        this.canvas = document.getElementById('confettiCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.confetti = [];
        this.animationId = null;
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createConfetti(x, y, count = 30) {
        const colors = ['#ffd700', '#ff69b4', '#00d4ff', '#ff6b6b', '#4ecdc4'];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 5 + Math.random() * 8;

            this.confetti.push({
                x: x || this.canvas.width / 2,
                y: y || this.canvas.height / 2,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 8,
                radius: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                life: 1,
                decay: 0.01 + Math.random() * 0.01
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.confetti = this.confetti.filter(c => c.life > 0);

        this.confetti.forEach(c => {
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.2; // gravity
            c.rotation += c.rotationSpeed;
            c.life -= c.decay;

            this.ctx.save();
            this.ctx.globalAlpha = c.life;
            this.ctx.translate(c.x, c.y);
            this.ctx.rotate(c.rotation);
            this.ctx.fillStyle = c.color;
            this.ctx.fillRect(-c.radius, -c.radius, c.radius * 2, c.radius * 2);
            this.ctx.restore();
        });

        if (this.confetti.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    explode() {
        // Multiple explosions from different points
        const explosions = [
            { x: this.canvas.width * 0.2, y: this.canvas.height * 0.3 },
            { x: this.canvas.width * 0.5, y: this.canvas.height * 0.2 },
            { x: this.canvas.width * 0.8, y: this.canvas.height * 0.3 }
        ];

        explosions.forEach(pos => {
            this.createConfetti(pos.x, pos.y, 50);
        });

        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

class FireworksManager {
    constructor() {
        this.canvas = document.getElementById('fireworksCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.fireworks = [];
        this.particles = [];
        this.animationId = null;
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createFirework(x, y) {
        const colors = ['#ffd700', '#ff1493', '#00d4ff', '#ff6347', '#32cd32'];
        const particleCount = 60;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 3 + Math.random() * 8;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: 0.015 + Math.random() * 0.01
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(p => p.life > 0);

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // gravity
            p.life -= p.decay;

            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.globalAlpha = 1;

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    burst() {
        const burstLocations = [
            { x: this.canvas.width * 0.2, y: this.canvas.height * 0.25 },
            { x: this.canvas.width * 0.5, y: this.canvas.height * 0.15 },
            { x: this.canvas.width * 0.8, y: this.canvas.height * 0.25 },
            { x: this.canvas.width * 0.35, y: this.canvas.height * 0.35 },
            { x: this.canvas.width * 0.65, y: this.canvas.height * 0.35 }
        ];

        burstLocations.forEach(pos => {
            this.createFirework(pos.x, pos.y);
        });

        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

class SmokeManager {
    constructor() {
        this.canvas = document.getElementById('smokeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createSmoke() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2 + 50;

        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: centerX + (Math.random() - 0.5) * 40,
                y: centerY,
                vx: (Math.random() - 0.5) * 1,
                vy: -Math.random() * 2 - 1,
                radius: Math.random() * 20 + 10,
                opacity: 0.5,
                decay: 0.01
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(p => p.opacity > 0);

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.radius += 0.5;
            p.opacity -= p.decay;

            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
            gradient.addColorStop(0, `rgba(200, 200, 200, ${p.opacity})`);
            gradient.addColorStop(1, `rgba(100, 100, 100, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    burst() {
        this.createSmoke();
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ==================== SCENE MANAGER ====================

class SceneManager {
    constructor() {
        this.scenes = {};
        this.currentScene = null;
        this.timers = [];
        this.setupScenes();
    }

    setupScenes() {
        const sceneIds = [
            'envelopeScene',
            'letterScene',
            'poppersScene',
            'cardScene',
            'cakeScene',
            'smokeScene',
            'cuttingScene',
            'finalScene'
        ];

        sceneIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.scenes[id] = element;
            }
        });
    }

    showScene(sceneId) {
        if (this.currentScene && this.currentScene !== sceneId) {
            const currentElement = this.scenes[this.currentScene];
            if (currentElement) {
                currentElement.classList.remove('active');
            }
        }

        const element = this.scenes[sceneId];
        if (element) {
            element.classList.add('active');
            this.currentScene = sceneId;
        }
    }

    hideScene(sceneId) {
        const element = this.scenes[sceneId];
        if (element) {
            element.classList.remove('active');
        }
    }

    schedule(delay, callback) {
        const timer = setTimeout(callback, delay);
        this.timers.push(timer);
        return timer;
    }

    clearAllTimers() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers = [];
    }
}

// ==================== ANIMATION ORCHESTRATOR ====================

class BirthdayOrchestrator {
    constructor() {
        this.starManager = new StarManager();
        this.particleManager = new ParticleManager();
        this.confettiManager = new ConfettiManager();
        this.fireworksManager = new FireworksManager();
        this.smokeManager = new SmokeManager();
        this.sceneManager = new SceneManager();
        this.audioManager = new AudioManager();
        this.isPlaying = false;
    }

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        // Envelope scene
        this.sceneManager.schedule(CONFIG.SCENE_TIMING.envelope, () => {
            this.sceneManager.showScene('envelopeScene');
            this.openEnvelope();
        });

        // Letter scene
        this.sceneManager.schedule(CONFIG.SCENE_TIMING.letter, () => {
            this.sceneManager.showScene('letterScene');
            this.sceneManager.hideScene('envelopeScene');
        });

        // Poppers scene
        this.sceneManager.schedule(CONFIG.SCENE_TIMING.poppers, () => {
            this.sceneManager.showScene('poppersScene');
            this.sceneManager.hideScene('letterScene');
            this.triggerConfetti();
        });

        // Card scene
        this.sceneManager.schedule(CONFIG.SCENE_TIMING.card, () => {
            this.sceneManager.showScene('cardScene');
            this.sceneManager.hideScene('poppersScene');
        });

        // Cake scene
        this.sceneManager.schedule(CONFIG.SCENE_TIMING.cake, () => {
            this.sceneManager.showScene('cakeScene');
            this.sceneManager.hideScene('cardScene');
        });

        // Candle blow
        this.sceneManager.schedule(CONFIG.SCENE_TIMING.candle_blow, () => {
            this.blowCandles();
        });

        // Cutting scene
        this.sceneManager.schedule(CONFIG.SCENE_TIMING.cutting, () => {
            this.sceneManager.showScene('cuttingScene');
            this.cakeCut();
        });

        // Final celebration
        this.sceneManager.schedule(CONFIG.SCENE_TIMING.final, () => {
            this.sceneManager.showScene('finalScene');
            this.sceneManager.hideScene('cuttingScene');
            this.sceneManager.hideScene('cakeScene');
            this.finalCelebration();
        });

        // Music
        this.sceneManager.schedule(CONFIG.SCENE_TIMING.music, () => {
            this.audioManager.playMusic();
        });
    }

    openEnvelope() {
        const envelope = document.querySelector('.envelope');
        const flap = document.querySelector('.envelope-flap');
        
        if (envelope && flap) {
            // After 3 seconds, open the envelope
            setTimeout(() => {
                envelope.style.animation = 'none';
                flap.style.animation = 'flapOpen 0.8s ease-out forwards';
            }, 3000);
        }
    }

    triggerConfetti() {
        // Play sound if available
        this.audioManager.playCelebrationSound();
        this.confettiManager.explode();
    }

    blowCandles() {
        const flames = document.querySelectorAll('.flame');
        flames.forEach(flame => {
            flame.style.opacity = '0';
            flame.style.animation = 'none';
        });

        // Trigger smoke
        this.sceneManager.showScene('smokeScene');
        this.smokeManager.burst();

        // Darken the room slightly
        const bgLayer = document.querySelector('.background-layer');
        if (bgLayer) {
            bgLayer.style.animation = 'none';
            bgLayer.style.filter = 'brightness(0.8)';
        }
    }

    cakeCut() {
        const knife = document.querySelector('.knife');
        if (knife) {
            // Create particle effect for cake cutting
            this.createCakeParticles();
        }
    }

    createCakeParticles() {
        const canvas = document.getElementById('confettiCanvas');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2 + 100;

        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 3 + Math.random() * 5;

            this.confettiManager.confetti.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 3,
                radius: Math.random() * 3 + 1,
                color: '#f5deb3',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3,
                life: 1,
                decay: 0.02
            });
        }

        this.confettiManager.animate();
    }

    finalCelebration() {
        this.confettiManager.explode();
        this.fireworksManager.burst();
        
        // Schedule additional fireworks bursts
        setTimeout(() => this.fireworksManager.burst(), 500);
        setTimeout(() => this.fireworksManager.burst(), 1000);
        setTimeout(() => this.fireworksManager.burst(), 1500);
    }

    stop() {
        this.isPlaying = false;
        this.sceneManager.clearAllTimers();
        this.starManager.stop();
        this.particleManager.stop();
        this.confettiManager.stop();
        this.fireworksManager.stop();
        this.smokeManager.stop();
        this.audioManager.stop();
    }
}

// ==================== AUDIO MANAGER ====================

class AudioManager {
    constructor() {
        this.audio = document.getElementById('birthdayAudio');
        this.musicBtn = document.getElementById('musicBtn');
        this.setupAudio();
    }

    setupAudio() {
        if (!this.audio) return;

        // Try to autoplay
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Autoplay prevented, show button
                this.showMusicButton();
            });
        } else {
            // Fallback for older browsers
            this.showMusicButton();
        }

        // Setup button
        if (this.musicBtn) {
            this.musicBtn.addEventListener('click', () => this.playMusic());
        }
    }

    playMusic() {
        if (this.audio) {
            this.audio.play().catch(error => {
                console.log('Audio playback failed:', error);
            });
            
            if (this.musicBtn) {
                this.musicBtn.textContent = '♫ Music Playing ♫';
                this.musicBtn.style.pointerEvents = 'none';
                this.musicBtn.style.opacity = '0.7';
            }
        }
    }

    showMusicButton() {
        if (this.musicBtn) {
            setTimeout(() => {
                this.musicBtn.classList.add('show');
            }, 30000); // Show after 30 seconds
        }
    }

    playCelebrationSound() {
        // This would play a celebration sound if available
        // For now, just a visual indicator
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }
}

// ==================== EVENT LISTENERS & INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    // Create orchestrator
    const orchestrator = new BirthdayOrchestrator();

    // Start animation automatically
    orchestrator.start();

    // Add styles for flap animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flapOpen {
            0% {
                transform: rotateX(0deg);
            }
            100% {
                transform: rotateX(-140deg);
            }
        }
    `;
    document.head.appendChild(style);

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            orchestrator.stop();
        } else {
            // Note: Restarting mid-animation may not be ideal
            // Consider pausing instead
        }
    });

    // Optional: Add restart functionality
    window.restartBirthday = () => {
        orchestrator.stop();
        location.reload();
    };

    // Handle window resize for responsive behavior
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Canvas managers handle resize automatically
        }, 250);
    });
});

// ==================== UTILITY FUNCTIONS ====================

function playClickSound() {
    // Creates a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// ==================== ACCESSIBILITY ====================

// Respect prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('Reduced motion preference detected. Animations will be minimal.');
}
