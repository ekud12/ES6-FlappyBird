import { config as Config } from "../../config.js";
let canvasCTX;
let readyToRender;
let totalSrcsCount;
let _picVine;
let toucanSrcs;
export default class GUIController {
  constructor() {
    toucanSrcs = new Array();
    totalSrcsCount = Config.TOUCAN_SOURCES.length;
    readyToRender = false;
    canvasCTX = document.getElementById("canvas").getContext("2d");
  }

  render(currentTime, ellapsedTime, playerManager, vines, gameState) {
    let i;
    const players = playerManager.getAllPlayers();
    if (!readyToRender) {
      return;
    }
    canvasCTX.clearRect(0, 0, Config.SCREEN_WIDTH, Config.SCREEN_HEIGHT);

    if (vines) {
      for (i = 0; i < vines.length; i++) {
        this.renderVine(vines[i]);
      }
    }
    if (players) {
      for (i = 0; i < players.length; i++) {
        players[i].render(canvasCTX, currentTime, toucanSrcs, gameState);
      }
    }
    if (gameState === 2)
      this.updateScore(playerManager.getActivePlayer().getPlayerScore());
  }

  resetGUI() {
    document.getElementById("score-container").innerHTML = ``;
  }

  loadAssets(done) {
    let toucan;

    _picVine = new Image();
    _picVine.src = "assets/images/vine.png";
    _picVine.onload = () => {
      this.onAllAssetsLoaded(done);
    };

    for (let i = 0; i < Config.TOUCAN_SOURCES.length; i++) {
      toucan = new Image();
      toucan.src = Config.TOUCAN_SOURCES[i];
      toucan.onload = () => {
        this.onAllAssetsLoaded(done);
      };
      toucanSrcs.push(toucan);
    }
  }
  updateScore(score) {
    document.getElementById(
      "score-container"
    ).innerHTML = `Your score is: ${score}`;
  }
  renderVine(vine) {
    canvasCTX.drawImage(
      _picVine,
      0,
      0,
      Config.SPRITE_VINE_WIDTH,
      Config.SPRITE_VINE_HEIGHT,
      vine.posX,
      vine.posY - Config.SPRITE_VINE_HEIGHT,
      Config.VINE_WIDTH,
      Config.SPRITE_VINE_HEIGHT
    );
    canvasCTX.drawImage(
      _picVine,
      0,
      0,
      Config.SPRITE_VINE_WIDTH,
      Config.SPRITE_VINE_HEIGHT,
      vine.posX,
      vine.posY + Config.HEIGHT_BETWEEN_VINES,
      Config.VINE_WIDTH,
      Config.SPRITE_VINE_HEIGHT
    );
  }
  onAllAssetsLoaded(done) {
    const totalRessources = Config.TOUCAN_SOURCES.length;
    if (totalSrcsCount === 0) {
      readyToRender = true;
      done();
    } else {
      totalSrcsCount--;
    }
  }
}
