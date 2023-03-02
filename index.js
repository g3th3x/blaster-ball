import { Player } from "./src/Player.js";
import { Missile } from "./src/Missile.js";
import { Enemy } from "./src/Enemy.js";
import { Particle } from "./src/Particle.js";

window.addEventListener("load", () => {
  const cvs = document.querySelector("canvas");
  const ctx = cvs.getContext("2d");
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false;

  const soundEffects = {
    laser: document.querySelector("audio#sound-laser"),
    blast: document.querySelector("audio#sound-blast"),
  };

  const startGameBtn = document.querySelector("#startGameBtn");
  const restartGameBtn = document.querySelector("#restartGameBtn");
  const settingsBtn = document.querySelector("#settingsBtn");
  const backBtn = document.querySelector("#backBtn");
  const resetScoreBtn = document.querySelector("#resetScoreBtn");

  const mainWindow = document.querySelector("#mainWindow");
  const modalWindow = document.querySelector("#modalWindow");
  const setWindow = document.querySelector("#setWindow");

  const currentScoreEl = document.querySelector("#currentScoreEl");
  const gameScoreEl = document.querySelector("#gameScoreEl");
  const highScoreEl = document.querySelector("#highScoreEl");

  const soundVolumeEl = document.querySelector("#soundVolumeEl");

  let highScore = 0;
  let currentScore = 0;

  let player = new Player(cvs.width / 2, cvs.height / 2, 10, "white");
  let missiles = [];
  let enemies = [];
  let particles = [];

  let requestId = 0;
  let frames = 0;

  let isPause = false;
  let isGameOver = false;

  let volume = 0;

  const accel = 5;

  function init() {
    player = new Player(cvs.width / 2, cvs.height / 2, 10, "white");
    missiles = [];
    enemies = [];
    particles = [];
    currentScore = 0;

    currentScoreEl.textContent = 0;
    gameScoreEl.textContent = 0;

    highScore = localStorage.getItem("highScore");

    highScore > 0
      ? (highScoreEl.textContent = highScore)
      : (highScoreEl.textContent = 0);

    isPause = false;
    isGameOver = false;

    volume = localStorage.getItem("soundVolume");
    volume >= 0 ? volume : localStorage.setItem("soundVolume", 0.5);
  }

  document.addEventListener("keydown", (e) => {
    if (!isGameOver) {
      const code = e.code;
      if (code === "KeyP" && !isPause) {
        isPause = true;
        cancelAnimationFrame(requestId);
      } else if (code === "KeyP" && isPause) {
        isPause = false;
        requestId = requestAnimationFrame(animate);
      }
    }
  });

  document.addEventListener("click", (e) => {
    const angle = Math.atan2(
      e.clientY - cvs.height / 2,
      e.clientX - cvs.width / 2
    );

    const velocity = {
      x: Math.cos(angle) * accel,
      y: Math.sin(angle) * accel,
    };

    if (
      missiles.push(
        new Missile(cvs.width / 2, cvs.height / 2, 5, "white", velocity)
      ) &&
      !isGameOver
    )
      player.sound(soundEffects.laser, volume);
  });

  function spawnEnemies() {
    const radius = Math.random() * (30 - 5) + 5;

    let x, y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : cvs.width + radius;
      y = Math.random() * cvs.height;
    } else {
      x = Math.random() * cvs.width;
      y = Math.random() < 0.5 ? 0 - radius : cvs.height + radius;
    }

    const color = `hsl(${Math.random() * 360},50%,50%)`;

    const angle = Math.atan2(cvs.height / 2 - y, cvs.width / 2 - x);

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }

  function animate() {
    frames++;
    if (frames % 60 === 0) spawnEnemies();

    requestId = requestAnimationFrame(animate);

    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    player.draw(ctx);

    particles.forEach((particle, particleIndex) => {
      particle.alpha <= 0
        ? particles.slice(particleIndex, 1)
        : particle.update(ctx);
    });

    missiles.forEach((missile, missileIndex) => {
      missile.update(ctx);

      // Removing a missile from the edge of the screen
      if (
        missile.x + missile.radius < 0 ||
        missile.x - missile.radius > cvs.width ||
        missile.y + missile.radius < 0 ||
        missile.y - missile.radius > cvs.height
      ) {
        setTimeout(() => {
          missiles.splice(missileIndex, 1);
        }, 0);
      }
    });

    enemies.forEach((enemy, enemyIndex) => {
      enemy.update(ctx);
      // Detect collision on enemy / player hit
      const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      // Objects hit (Game Over)
      if (dist - enemy.radius - player.radius < 0.1) {
        cancelAnimationFrame(requestId);
        modalWindow.style.display = "flex";
        gameScoreEl.textContent = currentScore;
        if (currentScore > highScore) {
          localStorage.setItem("highScore", currentScore);
        }

        isGameOver = true;
      }

      // Detect collision on enemy / missile hit
      missiles.forEach((missile, missileIndex) => {
        const dist = Math.hypot(missile.x - enemy.x, missile.y - enemy.y);
        // Objects hit
        if (dist - enemy.radius - missile.radius < 0.1) {
          // Particle explosions
          for (let i = 0; i < enemy.radius * 2; i++) {
            particles.push(
              new Particle(
                missile.x,
                missile.y,
                Math.random() * 2,
                enemy.color,
                {
                  x: (Math.random() - 0.5) * (Math.random() * 6),
                  y: (Math.random() - 0.5) * (Math.random() * 6),
                }
              )
            );
          }

          if (enemy.radius - 10 > 5) {
            // Increase score on hit
            currentScore += 10;
            currentScoreEl.textContent = currentScore;

            enemy.sound(soundEffects.blast, volume);

            gsap.to(enemy, {
              radius: enemy.radius - 10,
            });
            setTimeout(() => {
              missiles.splice(missileIndex, 1);
            }, 0);
          } else {
            // Increase the score when an enemy removed from scene altogether
            currentScore += 15;
            currentScoreEl.textContent = currentScore;

            enemy.sound(soundEffects.blast, volume);

            setTimeout(() => {
              enemies.splice(enemyIndex, 1);
              missiles.splice(missileIndex, 1);
            }, 0);
          }
        }
      });
    });
  }

  restartGameBtn.addEventListener("click", () => {
    init();
    animate();
    modalWindow.style.display = "none";
  });

  startGameBtn.addEventListener("click", () => {
    init();
    animate();
    mainWindow.style.display = "none";
  });

  settingsBtn.addEventListener("click", () => {
    setWindow.style.display = "flex";
    mainWindow.style.display = "none";
  });

  backBtn.addEventListener("click", () => {
    setWindow.style.display = "none";
    mainWindow.style.display = "flex";
  });

  resetScoreBtn.addEventListener("click", () => {
    localStorage.removeItem("highScore");
  });

  soundVolumeEl.addEventListener("change", () => {
    localStorage.setItem("soundVolume", soundVolumeEl.value / 10);
    init();
  });
});
