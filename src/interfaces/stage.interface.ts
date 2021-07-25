import { Container } from "pixi.js";

export interface IStage {
  intro: Container;
  main: Container;
  end: Container;
  introOn: () => void;
  mainOn: () => void;
  endOn: () => void;
}
