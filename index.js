import { Player } from "./Player.js";
import { Missile } from "./Missile.js";
import { Enemy } from "./Enemy.js";

window.addEventListener("load", () => {
  const cvs = document.querySelector("canvas");
  const ctx = cvs.getContext("2d");
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;

  const player = new Player(cvs.width / 2, cvs.height / 2, 60, "red");

  const missiles = [];
  const enemies = [];

  document.addEventListener("click", (e) => {
    const angle = Math.atan2(
      e.clientY - cvs.height / 2,
      e.clientX - cvs.width / 2
    );

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    missiles.push(
      new Missile(cvs.width / 2, cvs.height / 2, 5, "blue", velocity)
    );
  });

  function spawnEnemies() {
    setInterval(() => {
      const radius = Math.random() * (30 - 5) + 5;

      let x, y;

      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : cvs.width + radius;
        y = Math.random() * cvs.height;
      } else {
        x = Math.random() * cvs.width;
        y = Math.random() < 0.5 ? 0 - radius : cvs.height + radius;
      }

      const color = "green";

      const angle = Math.atan2(cvs.height / 2 - y, cvs.width / 2 - x);

      const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };

      enemies.push(new Enemy(x, y, radius, color, velocity));
      //   console.log(enemies);
    }, 1000);
  }

  spawnEnemies();

  let requestId;
  let isPause = true;

  document.addEventListener("keydown", (e) => {
    const code = e.code;
    if (code === "KeyP" && isPause) {
      isPause = false;
      cancelAnimationFrame(requestId);
    } else if (code === "KeyP" && !isPause) {
      isPause = true;
      requestId = requestAnimationFrame(animate);
    }
  });

  function animate() {
    requestId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    player.draw(ctx);
    missiles.forEach((missile) => {
      missile.update(ctx);
    });

    enemies.forEach((enemy, enemyIndex) => {
      enemy.update(ctx);
      // Detect collision on enemy / missile hit
      missiles.forEach((missile, missileIndex) => {
        const dist = Math.hypot(missile.x - enemy.x, missile.y - enemy.y);

        if (dist - enemy.radius - missile.radius < 0.5) {
          console.log("hit");
          enemies.splice(enemyIndex, 1);
          missiles.splice(missileIndex, 1);
        }
      });
    });
  }

  animate();
});
