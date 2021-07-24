import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { Hero } from "./hero.class";
import { StageManager } from "./stageManager.class";

const stageManager = new StageManager(
  new PIXI.Container(),
  new PIXI.Container(),
  new PIXI.Container()
);
stageManager.introOn();

const mainGameTicker = new PIXI.Ticker();
const keys: any = {};
const plane = new Hero(
  new PIXI.Sprite(PIXI.Texture.from("./images/plane.png"))
);

const mainScreenScore = new PIXI.Text(`SCORE: ${plane.getScore()}`);
const endBg = PIXI.Sprite.from("./images/endGameBg.png");
const endgameSprite = PIXI.Sprite.from("./images/gameOver.png");

const bulletSpeed = 15;
const tankSpeed = 5;

const tanks: any[] = [];
const tanksBullets: Array<Sprite> = [];

const Aplication = PIXI.Application;
const app = new Aplication({
  transparent: false,
  antialias: true,
});

app.stage.addChild(stageManager.intro);
app.stage.addChild(stageManager.main);
app.stage.addChild(stageManager.end);

// resize screen

app.renderer.resize(window.innerWidth - 1, window.innerHeight - 1);
document.body.appendChild(app.view);
app.renderer.view.style.position = "absolute";

// setup intro screen
const introBackground = PIXI.Sprite.from("./images/introBG.jpg");
introBackground.width = app.screen.width;
introBackground.height = app.screen.height;
stageManager.intro.addChild(introBackground);

const textureButton = PIXI.Texture.from("./images/playbtn.png");
const playButton = new PIXI.Sprite(textureButton);
playButton.anchor.set(0.5);
playButton.x = window.innerWidth / 2;
playButton.y = window.innerHeight / 2;
playButton.width = app.view.width * 0.8;
playButton.width = app.view.height * 0.7;
playButton.interactive = true;
playButton.buttonMode = true;
stageManager.intro.addChild(playButton);

playButton.on("pointerdown", mainStage);

const textInfo = new PIXI.Text(
  `Move: Arrows \nFire: Space\nPlease click Play for start the game`
);
stageManager.intro.addChild(textInfo);

function mainStage() {
  stageManager.mainOn();
  mainScreenGame();
  mainGameTicker.start();
}

function keysUp(e: any) {
  keys[e.key] = false;
  if (e.key === " ") {
    fireBombs();
  }
}

function endGame(score: number = 0) {
  const endScoreText = new PIXI.Text(`Your Score is: ${plane.getScore()}`);
  endBg.width = app.view.width;
  endBg.height = app.view.height;
  stageManager.end.addChild(endBg);
  endgameSprite.anchor.set(0.5);
  endgameSprite.x = app.view.width * 0.5;
  endgameSprite.y = app.view.height * 0.25;
  endgameSprite.width = app.view.width * 0.5;
  endgameSprite.width = app.view.height * 0.8;
  stageManager.end.addChild(endgameSprite);

  endScoreText.anchor.set(0.5);
  endScoreText.x = app.view.width * 0.5;
  endScoreText.y = app.view.height * 0.75;
  endScoreText.style = new PIXI.TextStyle({
    fill: 0x00000,
    fontSize: 40,
    fontFamily: "Arial",
    stroke: 0xffffff,
    strokeThickness: 3,
  });

  stageManager.end.addChild(endScoreText);
  stageManager.endOn();
  mainGameTicker.stop();
}

function keysDown(e: KeyboardEvent): any {
  keys[e.key] = true;
}

function gameLoop() {
  mainScreenScore.text = `SCORE: ${plane.getScore()}`;

  if (keys["ArrowUp"]) {
    if (plane.decreaseY() < 0) {
      plane.getSprite().y = 0;
    }
    plane.decreaseY();
  }
  if (keys["ArrowDown"]) {
    if (plane.increaseY() > app.renderer.height * 0.805) {
      plane.getSprite().y = app.renderer.height * 0.805;
    } else {
      plane.increaseY();
    }
  }
  if (keys["ArrowLeft"]) {
    if (plane.decreaseX() < 0) {
      plane.getSprite().x = 0;
    } else {
      plane.decreaseX();
    }
  }
  if (keys["ArrowRight"]) {
    if (plane.increaseX() > app.renderer.width) {
      plane.getSprite().x = app.renderer.width;
    }
    plane.increaseX();
  }

  updateBombs();
  updateTanks();
  collisionTanks(tanks, plane.getBombs());
  updateBullets();
  collisionPlane();
}

function makeEnemyBullets() {
  const bullet = PIXI.Sprite.from("./images/enemyFire.png");
  bullet.width = app.renderer.width * 0.03;
  bullet.height = app.renderer.height * 0.05;
  bullet.x = app.renderer.width;
  bullet.y = plane.getSprite().y;
  stageManager.main.addChild(bullet);
  tanksBullets.push(bullet);
}

function collisionPlane() {
  for (let y = 0; y < tanksBullets.length; y++) {
    const b = tanksBullets[y];
    const aBox = plane.getSprite().getBounds();
    const bBox = b.getBounds();
    if (
      aBox.x + aBox.width > bBox.x &&
      aBox.x < bBox.x + bBox.width &&
      aBox.y + aBox.height > bBox.y &&
      aBox.y < bBox.y + bBox.height
    ) {
      endGame(plane.getScore());
    }
  }
}

function updateBullets() {
  for (let i = 0; i < tanksBullets.length; i++) {
    tanksBullets[i].position.x -= bulletSpeed;
    if (tanksBullets[i].position.x < 0) {
      stageManager.main.removeChild(tanksBullets[i]);
      tanksBullets.splice(i, 1);
    }
  }
}

function updateTanks() {
  for (let i = 0; i < tanks.length; i++) {
    tanks[i].position.x -= tankSpeed;
    if (tanks[i].position.x < 0) {
      stageManager.main.removeChild(tanks[i]);
      tanks.splice(i, 1);
    }
  }
}

function makeEnemy() {
  const tank = PIXI.Sprite.from("./images/enemy.png");
  tank.width = app.renderer.width / 10;
  tank.height = app.renderer.height * 0.11;

  tank.x = app.renderer.width;
  tank.y = app.renderer.height * 0.805;

  stageManager.main.addChild(tank);
  tanks.push(tank);
}

function collisionTanks(arr1: Array<Sprite>, arr2: Array<Sprite>) {
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
          plane.hitEnemy();
          stageManager.main.removeChild(a);
          arr1.splice(i, 1);
        }
      }
    }
  }
}

function createBomb() {
  const bomb = PIXI.Sprite.from("./images/bomb1.png");
  bomb.x = plane.getSprite().x;
  bomb.y = plane.getSprite().y + 30;
  bomb.width = app.renderer.height * 0.06;
  bomb.height = app.renderer.height * 0.05;
  stageManager.main.addChild(bomb);
  return bomb;
}

function fireBombs() {
  const bomb = createBomb();
  plane.getBombs().push(bomb);
}

function updateBombs() {
  const bombSpeed = 10;
  for (let i = 0; i < plane.getBombs().length; i++) {
    plane.getBombs()[i].position.y += bombSpeed;
    if (plane.getBombs()[i].position.y > app.renderer.height * 0.87) {
      stageManager.main.removeChild(plane.getBombs()[i]);
      plane.getBombs().splice(i, 1);
    }
  }
}

function mainScreenGame() {
  plane.getSprite().width = app.renderer.height * 0.11;
  plane.getSprite().height = app.renderer.height * 0.07;
  plane.getSprite().x = 200;

  document.addEventListener("keydown", keysDown);
  document.addEventListener("keyup", keysUp);

  mainGameTicker.add(gameLoop);

  // add background clouds
  const backgroundTexture = PIXI.Texture.from("./images/background-img.jpg");
  const bgSprite = new PIXI.TilingSprite(
    backgroundTexture,
    app.screen.width,
    app.screen.height
  );
  bgSprite.tileScale.set(
    app.renderer.width * 0.0013,
    app.renderer.height * 0.0045
  );

  mainGameTicker.add(function () {
    bgSprite.tilePosition.x -= 1;
  });

  stageManager.main.addChild(bgSprite);
  stageManager.main.addChild(mainScreenScore);
  stageManager.main.addChild(plane.getSprite());

  setInterval(makeEnemy, 2000);
  setInterval(makeEnemyBullets, 1000);
}
