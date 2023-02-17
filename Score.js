export class Score {
  constructor() {
    this.score = 0;
  }
  increase(points) {
    this.score += points;
  }
  reset() {
    this.score = 0;
  }
  draw(ctx) {
    ctx.font = "18px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${this.score}`, 10, 25);
  }
}
