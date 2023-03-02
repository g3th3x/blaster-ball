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

  let frames = 0;

  const soundEffects = {
    laser: document.querySelector("audio#sound-laser"),
    blast: document.querySelector("audio#sound-blast"),
  };

  const startGameBtn = document.querySelector("#startGameBtn");
  const modalEl = document.querySelector("#modalEl");
  const scoreEl = document.querySelector("#scoreEl");
  const highScoreEl = document.querySelector("#highScoreEl");
  const highScoreLSEl = document.querySelector("#highScoreLSEl");

  let highScore = localStorage.getItem("highScore");

  let player = new Player(cvs.width / 2, cvs.height / 2, 10, "white");
  let missiles = [];
  let enemies = [];
  let particles = [];

  let scoreTmp = 0;
  let requestId;
  let isPause = false;
  let isGameOver = false;

  const accel = 5;

  function init() {
    player = new Player(cvs.width / 2, cvs.height / 2, 10, "white");
    missiles = [];
    enemies = [];
    particles = [];
    scoreTmp = 0;
    scoreEl.textContent = scoreTmp;
    highScoreEl.textContent = scoreTmp;
    isPause = false;
    isGameOver = false;
    highScore = localStorage.getItem("highScore");
    highScore > 0
      ? (highScoreLSEl.textContent = highScore)
      : (highScoreLSEl.textContent = 0);
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
      player.sound(soundEffects.laser);
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
        modalEl.style.display = "flex";
        highScoreEl.textContent = scoreTmp;
        if (scoreTmp > highScore) {
          localStorage.setItem("highScore", scoreTmp);
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
            scoreTmp += 10;
            scoreEl.textContent = scoreTmp;

            enemy.sound(soundEffects.blast);

            gsap.to(enemy, {
              radius: enemy.radius - 10,
            });
            setTimeout(() => {
              missiles.splice(missileIndex, 1);
            }, 0);
          } else {
            // Increase the score when an enemy removed from scene altogether
            scoreTmp += 15;
            scoreEl.textContent = scoreTmp;

            enemy.sound(soundEffects.blast);

            setTimeout(() => {
              enemies.splice(enemyIndex, 1);
              missiles.splice(missileIndex, 1);
            }, 0);
          }
        }
      });
    });
  }

  startGameBtn.addEventListener("click", () => {
    init();
    animate();
    modalEl.style.display = "none";
  });
});
