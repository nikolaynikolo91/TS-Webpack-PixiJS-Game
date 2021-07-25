import { Sprite } from "pixi.js";

export interface IHero {
  getScore: () => number;
  getSprite: () => Sprite;
  hitEnemy: () => void;
  getBombs: () => Array<Sprite>;
  getBombSpeed: () => number;
  getSpeed: () => number;
  decreaseY: () => number;
  increaseY: () => number;
  decreaseX: () => number;
  increaseX: () => number;
}
