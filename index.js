import { Player } from "./Player.js";
import { Missile } from "./Missile.js";
import { Enemy } from "./Enemy.js";

import { getRand } from "./getRand.js";

window.addEventListener("load", () => {
  const cvs = document.querySelector("canvas");
  const ctx = cvs.getContext("2d");
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;

  const player = new Player(cvs.width / 2, cvs.height / 2, 60, "red");

  const missile = [];
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

    missile.push(
      new Missile(cvs.width / 2, cvs.height / 2, 5, "blue", velocity)
    );
  });

  function spawnEnemies() {
    setInterval(() => {
      const x = Math.random() * cvs.width;
      const y = Math.random() * cvs.height;
      const radius = 30;
      const color = "green";

      const angle = Math.atan2(cvs.height / 2 - y, cvs.width / 2 - x);

      const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };

      enemies.push(new Enemy(x, y, radius, color, velocity));

      console.log(enemies);
    }, 1000);
  }

  spawnEnemies();
  //for test
  let playerPos = {
    x: cvs.width / 2,
    y: cvs.height / 2,
    radius: 60,
  };

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

  //   let enemyPos = {
  //     x: getRand(0, 30),
  //     y: getRand(0, 30),
  //     radius: 30,
  //   };
  const radiusTest = 30;

  let enemyPos = {
    x: Math.random() < 0.5 ? 0 - radiusTest : cvs.width + radiusTest,
    y: Math.random() < 0.5 ? 0 - radiusTest : cvs.height + radiusTest,
    radius: 30,
  };

  //   const radius = 30;
  //   const x = Math.random() < 0.5 ? 0 - radius : cvs.width + radius;
  //   const y = Math.random() < 0.5 ? 0 - radius : cvs.height + radius;

  function enemy(enemyPos) {
    ctx.beginPath();
    ctx.fillStyle = "#0f0";
    ctx.arc(enemyPos.x, enemyPos.y, enemyPos.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function arcsCollision(first, second) {
    const dx = first.x - second.x;
    const dy = first.y - second.y;

    // console.log(`x1: ${first.x} x2: ${second.x}`);
    // console.log(`y1: ${first.y} y2: ${second.y}`);
    // console.log(`dx: ${dx} dy: ${dy}`);
    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    // console.log(`dx**2: ${dx ** 2} dy**2: ${dy ** 2}`);
    // console.log(`distance: ${distance}`);

    //   return console.log(distance <= first.radius + second.radius + 0.1);
    return distance <= first.radius + second.radius + 0.1;
  }

  function render() {
    enemyPos.x++;
    enemyPos.y++;
    enemy(enemyPos);

    // console.log(typeof arcsCollision(playerPos, enemyPos));

    if (arcsCollision(playerPos, enemyPos) === true) {
      //   enemyPos = {
      //     x: getRand(0, 30),
      //     y: getRand(0, 30),
      //     radius: 30,
      //   };
      //   enemyPos.x = getRand(0, 30);
      //     enemyPos.y = getRand(0, 30);

      enemyPos.x =
        Math.random() < 0.5 ? 0 - radiusTest : cvs.width + radiusTest;

      enemyPos.y =
        Math.random() < 0.5 ? 0 - radiusTest : cvs.height + radiusTest;

      console.log(`x: ${enemyPos.x} y: ${enemyPos.y}`);
    }
  }

  function animate() {
    requestId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    player.draw(ctx);
    missile.forEach((missile) => {
      missile.update(ctx);
    });
    enemies.forEach((enemy) => {
      enemy.update(ctx);
    });
    render();
  }

  animate();
});
