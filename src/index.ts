import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";

const Aplication = PIXI.Application;
const app = new Aplication({
  transparent: false,
  antialias: true,
});

app.renderer.backgroundColor = 0xaa3;
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);
app.renderer.view.style.position = "absolute";
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
const bombs: Array<Sprite> = [];
const tanks: any[] = [];

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
  if (e.key === " ") {
    fireBombs();
  }
}

app.ticker.add(gameLoop);

const backgroundTexture = PIXI.Texture.from("./images/background-img.jpg");
const bgSprite = new PIXI.TilingSprite(
  backgroundTexture,
  app.screen.width,
  app.screen.height
);
bgSprite.tileScale.set(
  (app.renderer.width * 0.13) / 100,
  (app.renderer.height * 0.45) / 100
);
console.log(app.renderer.width, app.renderer.height);
app.ticker.add(function () {
  bgSprite.tilePosition.x -= 1;
});

app.stage.addChild(bgSprite);
app.stage.addChild(myText);
app.stage.addChild(planeSprite);

function gameLoop() {
  myText.text = `SCORE: ${plane.score}`;
  plane.posX = planeSprite.x;
  plane.posY = planeSprite.y;

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

  updateBombs();
  updateTanks();
  collisionDetection(tanks, bombs);
}

setInterval(makeEnemy, 2000);
function makeEnemy() {
  const tank = PIXI.Sprite.from("./images/enemy.png");
  tank.width = app.renderer.width / 10;
  tank.height = (app.renderer.height * 11) / 100;

  tank.x = app.renderer.width;
  tank.y = (app.renderer.height * 80.5) / 100;
  app.stage.addChild(tank);
  tanks.push(tank);
}

function updateTanks() {
  const tankSpeed = 5;
  for (let i = 0; i < tanks.length; i++) {
    tanks[i].position.x -= tankSpeed;
    if (tanks[i].position.x < 0) {
      app.stage.removeChild(tanks[i]);
      tanks.splice(i, 1);
    }
  }
}

function collisionDetection(arr1: Array<Sprite>, arr2: Array<Sprite>) {
  if (arr1.length > 0 && arr2.length > 0) {
    for (let i = 0; i < arr1.length; i++) {
      const a = arr1[i];
      for (let y = 0; y < arr2.length; y++) {
        const b = arr2[y];

        const aBox = a.getBounds();
        const bBox = b.getBounds();
        if (
          aBox.x + aBox.width > bBox.x &&
          aBox.x < bBox.x + bBox.width &&
          aBox.y + aBox.height > bBox.y &&
          aBox.y < bBox.y + bBox.height
        ) {
          plane.score += 1;
          app.stage.removeChild(a);
          arr1.splice(i, 1);
        }
      }
    }
  }
}

function fireBombs() {
  const bomb = createBomb();
  bombs.push(bomb);
}

function createBomb() {
  const bomb = PIXI.Sprite.from("./images/bomb1.png");
  bomb.x = planeSprite.x;
  bomb.y = planeSprite.y + 30;
  bomb.width = (app.renderer.height * 6) / 100;
  bomb.height = (app.renderer.height * 5) / 100;
  app.stage.addChild(bomb);
  return bomb;
}

function updateBombs() {
  const bombSpeed = 10;
  for (let i = 0; i < bombs.length; i++) {
    bombs[i].position.y += bombSpeed;
    if (bombs[i].position.y > (app.renderer.height * 87) / 100) {
      app.stage.removeChild(bombs[i]);
      bombs.splice(i, 1);
    }
  }
}
