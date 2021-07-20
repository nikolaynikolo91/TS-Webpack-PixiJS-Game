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

class Enemy {
  isDead = false;
  constructor() {}

  shoot() {
    const shootToX = plane.posX;
    const shootToY = plane.posY;
  }
}

planeSprite.width = 100;
planeSprite.height = 70;
planeSprite.x = 200;

const move: any = {
  ArrowUp: (planeSprite.y -= 100),

  ArrowDown: (planeSprite.y += 100),

  ArrowLeft: (planeSprite.x -= 100),

  ArrowRight: (planeSprite.x += 100),
};

document.addEventListener("keydown", logKey);

function logKey(e: any): any {
  move[e.code];
  console.log(e.code);

  switch (e.code) {
    case "ArrowUp":
      planeSprite.y -= 10;
      break;
    case "ArrowDown":
      planeSprite.y += 10;
      break;
    case "ArrowLeft":
      planeSprite.x -= 10;
      break;
    case "ArrowRight":
      planeSprite.x += 10;
      break;

    default:
      break;
  }
}

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
firstEnemy.width = 180;
firstEnemy.height = 110;
firstEnemy.x = 1800;
firstEnemy.y = 780;

app.stage.addChild(bgSprite);
app.stage.addChild(myText);
app.stage.addChild(planeSprite);
app.stage.addChild(firstEnemy);

app.ticker.add((delta) => loop(delta));
function loop(delta: any) {
  firstEnemy.x -= 1;
}
