import { Sprite } from "pixi.js";

export class Enemy {
  private speed: number = 5;
  constructor(private sprite: Sprite) {}
  getSprite() {
    return this.sprite;
  }
  move() {
    this.sprite.position.x -= this.speed;
  }
  getX() {
    return this.sprite.position.x;
  }
}
