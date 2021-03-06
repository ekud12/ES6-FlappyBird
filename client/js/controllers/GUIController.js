/**
 * Author: Liel Kaysari
 *     ID: 201322054
 */
/**
 * Imports and var definition
 */
import { config as Config } from '../../config.js';
let canvasCTX;
let vineSrc;
let toucanSrcs;
let readyToRender;
let totalSrcsCount;

export default class GUIController {
  constructor() {
    toucanSrcs = new Array();
    totalSrcsCount = Config.TOUCAN_SOURCES.length;
    readyToRender = false;
    canvasCTX = document.getElementById('canvas').getContext('2d');
  }

  render(currentTime, ellapsedTime, playerController, vines, gameState) {
    let i;
    const players = playerController.getAllPlayers();
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
    if (gameState === 2) this.updateScore(playerController.getActivePlayer().getPlayerScore());
  }

  resetGUI() {
    document.getElementById('score-container').innerHTML = ``;
  }

  loadAssets(done) {
    let toucan;

    vineSrc = new Image();
    vineSrc.src = 'assets/images/vine.png';
    vineSrc.onload = () => {
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
    document.getElementById('score-container').innerHTML = `Your score is: ${score}`;
  }
  renderVine(vine) {
    canvasCTX.drawImage(
      vineSrc,
      0,
      0,
      Config.VINE_SPR_W,
      Config.VINE_SPR_H,
      vine.X,
      vine.Y - Config.VINE_SPR_H,
      Config.VINE_WIDTH,
      Config.VINE_SPR_H
    );
    canvasCTX.drawImage(
      vineSrc,
      0,
      0,
      Config.VINE_SPR_W,
      Config.VINE_SPR_H,
      vine.X,
      vine.Y + Config.VINES_CUTOUT,
      Config.VINE_WIDTH,
      Config.VINE_SPR_H
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
