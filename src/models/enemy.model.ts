import { Sprite } from "pixi.js";
import { IEnemy } from "../interfaces/enemy.interface";

export class Enemy implements IEnemy {
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
