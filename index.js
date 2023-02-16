import { Player } from "./Player.js";
import { Missile } from "./Missile.js";

import { getRand } from "./getRand.js";

window.addEventListener("load", () => {
  const cvs = document.querySelector("canvas");
  const ctx = cvs.getContext("2d");
  //   cvs.width = 800;
  //   cvs.height = 600;
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;

  const player = new Player(cvs.width / 2, cvs.height / 2, 60, "red");

  console.log(player);

  const missile = new Missile(cvs.width / 2, cvs.height / 2, 5, "blue", {
    x: 1,
    y: 1,
  });

  document.addEventListener("click", (e) => {
    // console.log(e);
    // console.log("Missile");
    // const missile = new Missile(e.clientX, e.clientY, 5, "blue", null);
    // const missile = new Missile(cvs.width / 2, cvs.height / 2, 5, "blue", {
    //   x: 1,
    //   y: 1,
    // });
    // console.log(missile);
  });

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

  //   let playerPos = {
  //     x: cvs.width / 2,
  //     y: cvs.height / 2,
  //     radius: 60,
  //   };

  //   function playerOne(playerPos) {
  //     ctx.beginPath();
  //     ctx.fillStyle = "#f00";
  //     ctx.arc(playerPos.x, playerPos.y, playerPos.radius, 0, Math.PI * 2);
  //     ctx.fill();
  //   }

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
    //ctx.clearRect(0, 0, cvs.width, cvs.height);
    //playerOne(playerPos);

    player.draw(ctx);
    missile.draw(ctx);
    missile.update();
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
    render();

    requestId = requestAnimationFrame(animate);
  }

  animate();
});
