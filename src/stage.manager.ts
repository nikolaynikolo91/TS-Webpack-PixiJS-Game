import { Container } from "pixi.js";
import { IStage } from "./interfaces/stage.interface";

export class StageManager implements IStage{
  constructor(
    public intro: Container,
    public main: Container,
    public end: Container
  ) {
    this.intro = intro;
    this.main = main;
    this.end = end;
  }

  introOn() {
    this.main.visible = false;
    this.end.visible = false;
    this.intro.visible = true;
  }
  mainOn() {
    this.intro.visible = false;
    this.end.visible = false;
    this.main.visible = true;
  }
  endOn() {
    this.intro.visible = false;
    this.main.visible = false;
    this.end.visible = true;
  }
}
