import { Sprite } from "pixi.js";
import { IHero } from "./interfaces/hero.interface";

export class Hero implements IHero{
  private speed = 5;
  private bombSpeed = 10;
  private bombs: Array<Sprite> = [];
  private score: number = 0;
 
  constructor(private sprite: Sprite) {}

  getScore() {
    return this.score;
  }

  getSprite() {
    return this.sprite;
  }

  hitEnemy() {
    this.score += 100;
  }
  getBombs() {
    return this.bombs;
  }
  getBombSpeed() {
    return this.bombSpeed;
  }
  getSpeed() {
    return this.speed;
  }
  decreaseY() {
    this.sprite.y -= this.speed;
    return this.sprite.y
  }
  increaseY () {
    this.sprite.y += this.speed;
    return this.sprite.y
  }
  decreaseX() {
    this.sprite.x -= this.speed;
    return this.sprite.x
  }
  increaseX () {
    this.sprite.x += this.speed;
    return this.sprite.x
  }
}
