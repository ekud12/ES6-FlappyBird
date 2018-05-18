// import { config as Config } from '../../config.js';

// const GUIController = {};

// const canvasCTX = document.getElementById('canvas').getContext('2d');
// let toDraw = false;
// let _nbRessourcesToLoad = Config.TOUCAN_SOURCES.length;
// let _picVine;
// const toucanSrcs = new Array();

// GUIController.draw = (currentTime, ellapsedTime, playerManager, vines, gameState) => {
//   let i;
//   const players = playerManager.getAllPlayers();
//   if (!toDraw) {
//     return;
//   }
//   canvasCTX.clearRect(0, 0, Config.SCREEN_WIDTH, Config.SCREEN_HEIGHT);

//   if (vines) {
//     for (i = 0; i < vines.length; i++) {
//       drawVine(vines[i]);
//     }
//   }
//   if (players) {
//     for (i = 0; i < players.length; i++) {
//       players[i].draw(canvasCTX, currentTime, toucanSrcs, gameState);
//     }
//   }
//   if (gameState == 2) updateScore(playerManager.getActivePlayer().getPlayerScore());
// };

// GUIController.resetGUI = () => {
//   document.getElementById('score-container').innerHTML = ``;
// };

// GUIController.loadAssets = doneCallBack => {
//   let toucan;

//   _picVine = new Image();
//   _picVine.src = 'assets/images/vine.png';
//   _picVine.onload = () => {
//     onAssetsLoadingDone(doneCallBack);
//   };

//   for (let i = 0; i < Config.TOUCAN_SOURCES.length; i++) {
//     toucan = new Image();
//     toucan.src = Config.TOUCAN_SOURCES[i];
//     toucan.onload = () => {
//       onAssetsLoadingDone(doneCallBack);
//     };
//     toucanSrcs.push(toucan);
//   }

//   function onAssetsLoadingDone(doneCallBack) {
//     const totalRessources = Config.TOUCAN_SOURCES.length;
//     if (--_nbRessourcesToLoad <= 0) {
//       toDraw = true;
//       doneCallBack();
//     } else {
//       console.log('Still Loading Files');
//     }
//   }
// };

// function drawVine(vine) {
//   canvasCTX.drawImage(
//     _picVine,
//     0,
//     0,
//     Config.SPRITE_VINE_WIDTH,
//     Config.SPRITE_VINE_HEIGHT,
//     vine.posX,
//     vine.posY - Config.SPRITE_VINE_HEIGHT,
//     Config.VINE_WIDTH,
//     Config.SPRITE_VINE_HEIGHT
//   );
//   canvasCTX.drawImage(
//     _picVine,
//     0,
//     0,
//     Config.SPRITE_VINE_WIDTH,
//     Config.SPRITE_VINE_HEIGHT,
//     vine.posX,
//     vine.posY + Config.HEIGHT_BETWEEN_VINES,
//     Config.VINE_WIDTH,
//     Config.SPRITE_VINE_HEIGHT
//   );
// }
// const updateScore = score => {
//   document.getElementById('score-container').innerHTML = `Your score is: ${score}`;
// };

// export default GUIController;

import { config as Config } from '../../config.js';
let canvasCTX;
let toDraw;
let totalSrcsCount;
let _picVine;
let toucanSrcs;
export default class GUIController {
  constructor() {
    toucanSrcs = new Array();
    totalSrcsCount = Config.TOUCAN_SOURCES.length;
    toDraw = false;
    canvasCTX = document.getElementById('canvas').getContext('2d');
  }

  draw(currentTime, ellapsedTime, playerManager, vines, gameState) {
    let i;
    const players = playerManager.getAllPlayers();
    if (!toDraw) {
      return;
    }
    canvasCTX.clearRect(0, 0, Config.SCREEN_WIDTH, Config.SCREEN_HEIGHT);

    if (vines) {
      for (i = 0; i < vines.length; i++) {
        this.drawVine(vines[i]);
      }
    }
    if (players) {
      for (i = 0; i < players.length; i++) {
        players[i].draw(canvasCTX, currentTime, toucanSrcs, gameState);
      }
    }
    if (gameState == 2) this.updateScore(playerManager.getActivePlayer().getPlayerScore());
  }

  resetGUI() {
    document.getElementById('score-container').innerHTML = ``;
  }

  loadAssets(doneCallBack) {
    let toucan;

    _picVine = new Image();
    _picVine.src = 'assets/images/vine.png';
    _picVine.onload = () => {
      this.onAssetsLoadingDone(doneCallBack);
    };

    for (let i = 0; i < Config.TOUCAN_SOURCES.length; i++) {
      toucan = new Image();
      toucan.src = Config.TOUCAN_SOURCES[i];
      toucan.onload = () => {
        this.onAssetsLoadingDone(doneCallBack);
      };
      toucanSrcs.push(toucan);
    }
  }
  updateScore(score) {
    document.getElementById('score-container').innerHTML = `Your score is: ${score}`;
  }
  drawVine(vine) {
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
  onAssetsLoadingDone(doneCallBack) {
    const totalRessources = Config.TOUCAN_SOURCES.length;
    if (totalSrcsCount == 0) {
      toDraw = true;
      doneCallBack();
    } else {
      totalSrcsCount--;
      console.log('Please Wait... Loading Assets');
    }
  }
}
