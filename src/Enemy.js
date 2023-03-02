import { playSound, stopSound } from "./engine/soundHandler.js";

export class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  sound(sound, volume) {
    stopSound(sound);
    playSound(sound, volume);
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update(ctx) {
    this.draw(ctx);
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
