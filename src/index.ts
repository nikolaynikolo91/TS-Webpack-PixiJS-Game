import * as PIXI from "pixi.js";

enum Direction {
  up = "ArrowUp",
  down = "ArrowDown",
  left = "ArrowLeft",
  right = "ArrowRight",
}

const Aplication = PIXI.Application;
const app = new Aplication({
  transparent: false,
  antialias: true,
});

app.renderer.backgroundColor = 0xaa3;
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);
app.renderer.view.style.position = "absolute";

const Graphics = PIXI.Graphics;

class Hero {
  img: string;
  score: number = 0;
  isDead = false;
  posX: number;
  posY: number;

  constructor(img: string, posX: number, posY: number) {
    this.img = img;
    this.posX = posX;
    this.posY = posY;
  }
}

const planeImg = PIXI.Texture.from("./images/plane.png");
const planeSprite = new PIXI.Sprite(planeImg);
const plane = new Hero("./images/plane.png", planeSprite.x, planeSprite.y);
const myText = new PIXI.Text(`SCORE: ${plane.score}`);
const keys: any = {};

class Enemy {
  isDead = false;
  constructor() {}

  shoot() {
    const shootToX = plane.posX;
    const shootToY = plane.posY;
  }
}

planeSprite.width = (app.renderer.height * 11) / 100;
planeSprite.height = (app.renderer.height * 7) / 100;
planeSprite.x = 200;

const moveSide = (app.renderer.height * 7) / 100;
const move: any = {
  ArrowUp: (planeSprite.y -= moveSide),

  ArrowDown: (planeSprite.y += moveSide),

  ArrowLeft: (planeSprite.x -= moveSide),

  ArrowRight: (planeSprite.x += moveSide),
};

document.addEventListener("keydown", keysDown);
document.addEventListener("keyup", keysUp);

function keysDown(e: KeyboardEvent): any {
  keys[e.key] = true;
}

function keysUp(e: any) {
  keys[e.key] = false;
}

app.ticker.add(gameLoop);

const backgroundTexture = PIXI.Texture.from("./images/background-img.jpg");
const bgSprite = new PIXI.TilingSprite(
  backgroundTexture,
  app.screen.width,
  app.screen.height
);
bgSprite.tileScale.set(2.5, 4.4);
app.ticker.add(function () {
  bgSprite.tilePosition.x -= 1;
});

const firstEnemy = PIXI.Sprite.from("./images/enemy.png");
firstEnemy.width = app.renderer.width / 10;
firstEnemy.height = (app.renderer.height * 11) / 100;

firstEnemy.x = app.renderer.width;
firstEnemy.y = (app.renderer.height * 80.5) / 100;

app.stage.addChild(bgSprite);
app.stage.addChild(myText);
app.stage.addChild(planeSprite);
app.stage.addChild(firstEnemy);

function gameLoop() {
  if (keys["ArrowUp"]) {
    planeSprite.y -= 10;
  }
  if (keys["ArrowDown"]) {
    planeSprite.y += 10;
  }
  if (keys["ArrowLeft"]) {
    planeSprite.x -= 10;
  }
  if (keys["ArrowRight"]) {
    planeSprite.x += 10;
  }
}

app.ticker.add((delta) => loop(delta));

function loop(delta: any) {
  //console.log(firstEnemy.y);
  firstEnemy.x -= 1;
  if (firstEnemy.x < 0) {
   // firstEnemy.destroy(true);
  }
}
