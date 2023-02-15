import { getRand } from "./getRand.js";

window.addEventListener("load", () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 600;

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

  let playerPos = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 60,
  };

  function player(playerPos) {
    ctx.beginPath();
    ctx.fillStyle = "#f00";
    ctx.arc(playerPos.x, playerPos.y, playerPos.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  let enemyPos = {
    x: getRand(0, 30),
    y: getRand(0, 30),
    radius: 30,
  };

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player(playerPos);
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
      enemyPos.x = getRand(0, 30);
      enemyPos.y = getRand(0, 30);
      console.log(`x: ${enemyPos.x} y: ${enemyPos.y}`);
    }
  }

  function animate() {
    render();
    requestId = requestAnimationFrame(animate);
  }

  animate();
});
