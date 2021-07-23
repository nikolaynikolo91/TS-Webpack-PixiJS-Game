import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";

const introScreen = new PIXI.Container();
const mainScreen = new PIXI.Container();
const endScreen = new PIXI.Container();
mainScreen.visible = false;
endScreen.visible = false;
const mainGameTicker = new PIXI.Ticker();

2;
const Aplication = PIXI.Application;
const app = new Aplication({
  transparent: false,
  antialias: true,
});

app.stage.addChild(introScreen);
app.stage.addChild(mainScreen);
app.stage.addChild(endScreen);

// resize screen

app.renderer.resize(window.innerWidth - 1, window.innerHeight - 1);
document.body.appendChild(app.view);
app.renderer.view.style.position = "absolute";

// setup intro screen
const introBackground = PIXI.Sprite.from("./images/introBG.jpg");
introBackground.width = app.screen.width;
introBackground.height = app.screen.height;
introScreen.addChild(introBackground);

const textureButton = PIXI.Texture.from("./images/playbtn.png");
const playButton = new PIXI.Sprite(textureButton);
playButton.anchor.set(0.5);
playButton.x = window.innerWidth / 2;
playButton.y = window.innerHeight / 2;
playButton.width = app.view.width * 0.8;
playButton.width = app.view.height * 0.7;
playButton.interactive = true;
playButton.buttonMode = true;
introScreen.addChild(playButton);

playButton.on("pointerdown", goToGame);

const textInfo = new PIXI.Text(
  `Move: Arrows \nFire: Space\nPlese click Play for start the game`
);
introScreen.addChild(textInfo);

function goToGame() {
  introScreen.visible = false;
  mainScreen.visible = true;
  endScreen.visible = false;
  mainScreenGame();
  mainGameTicker.start();
}

function endGame(score: number = 0) {
  const endBg = PIXI.Sprite.from("./images/endGameBg.png");
  endBg.width = app.view.width;
  endBg.height = app.view.height;
  endScreen.addChild(endBg);
  const endgameSprite = PIXI.Sprite.from("./images/gameOver.png");
  endgameSprite.anchor.set(0.5);
  endgameSprite.x = app.view.width * 0.5;
  endgameSprite.y = app.view.height * 0.25;
  endgameSprite.width = app.view.width * 0.5;
  endgameSprite.width = app.view.height * 0.8;
  endScreen.addChild(endgameSprite);

  const text3 = new PIXI.Text(`Your Score is: ${score}`);
  text3.anchor.set(0.5);
  text3.x = app.view.width * 0.5;
  text3.y = app.view.height * 0.75;
  text3.style = new PIXI.TextStyle({
    fill: 0x00000,
    fontSize: 40,
    fontFamily: "Arial",
    stroke: 0xffffff,
    strokeThickness: 3,
  });

  endScreen.addChild(text3);

  introScreen.visible = false;
  mainScreen.visible = false;
  endScreen.visible = true;
  mainGameTicker.stop();
}

function mainScreenGame() {
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
  const tanksBullets: Array<Sprite> = [];

  planeSprite.width = (app.renderer.height * 11) / 100;
  planeSprite.height = (app.renderer.height * 7) / 100;
  planeSprite.x = 200;

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

  mainGameTicker.add(gameLoop);

  // add background clouds
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

  mainGameTicker.add(function () {
    bgSprite.tilePosition.x -= 1;
  });

  mainScreen.addChild(bgSprite);
  mainScreen.addChild(myText);
  mainScreen.addChild(planeSprite);

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
    updateBullets();
    checkIsDead();
  }

  function checkIsDead() {
    for (let y = 0; y < tanksBullets.length; y++) {
      const b = tanksBullets[y];

      const aBox = planeSprite.getBounds();
      const bBox = b.getBounds();
      if (
        aBox.x + aBox.width > bBox.x &&
        aBox.x < bBox.x + bBox.width &&
        aBox.y + aBox.height > bBox.y &&
        aBox.y < bBox.y + bBox.height
      ) {
        //  plane.score += 1;
        //  mainScreen.removeChild(a);
        // arr1.splice(i, 1);
        endGame(plane.score);
      }
    }
  }

  setInterval(makeEnemy, 2000);
  setInterval(makeEnemyBullets, 1000);

  function makeEnemyBullets() {
    const bullet = PIXI.Sprite.from("./images/enemyFire.png");
    bullet.width = app.renderer.width * 0.03;
    bullet.height = app.renderer.height * 0.05;

    bullet.x = app.renderer.width;
    //  plane.posY
    bullet.y = plane.posY;
    mainScreen.addChild(bullet);
    tanksBullets.push(bullet);
  }

  function updateBullets() {
    const bulletSpeed = 15;
    for (let i = 0; i < tanksBullets.length; i++) {
      tanksBullets[i].position.x -= bulletSpeed;
      if (tanksBullets[i].position.x < 0) {
        mainScreen.removeChild(tanksBullets[i]);
        tanksBullets.splice(i, 1);
      }
    }
  }

  function makeEnemy() {
    const tank = PIXI.Sprite.from("./images/enemy.png");
    tank.width = app.renderer.width / 10;
    tank.height = (app.renderer.height * 11) / 100;

    tank.x = app.renderer.width;
    tank.y = (app.renderer.height * 80.5) / 100;

    mainScreen.addChild(tank);
    tanks.push(tank);
  }

  function updateTanks() {
    const tankSpeed = 5;
    for (let i = 0; i < tanks.length; i++) {
      tanks[i].position.x -= tankSpeed;
      if (tanks[i].position.x < 0) {
        mainScreen.removeChild(tanks[i]);
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
            mainScreen.removeChild(a);
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
    mainScreen.addChild(bomb);
    return bomb;
  }

  function updateBombs() {
    const bombSpeed = 10;
    for (let i = 0; i < bombs.length; i++) {
      bombs[i].position.y += bombSpeed;
      if (bombs[i].position.y > (app.renderer.height * 87) / 100) {
        mainScreen.removeChild(bombs[i]);
        bombs.splice(i, 1);
      }
    }
  }
}
