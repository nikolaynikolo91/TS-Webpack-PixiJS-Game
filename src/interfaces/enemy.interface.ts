import { Sprite } from "pixi.js";

export interface IEnemy {
  getSprite: () => Sprite;
  move: () => void;
  getX: () => number;
}
