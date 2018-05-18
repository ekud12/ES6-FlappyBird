// import { config as Config } from '../../config.js';

// const GUIController = {};

// const canvasCTX = document.getElementById('canvas').getContext('2d');
// let toDraw = false;
// let _nbRessourcesToLoad = Config.TOUCAN_SOURCES.length;
// let _picPipe;
// const toucanSrcs = new Array();

// GUIController.draw = (currentTime, ellapsedTime, playerManager, pipes, gameState) => {
//   let i;
//   const players = playerManager.getAllPlayers();
//   if (!toDraw) {
//     return;
//   }
//   canvasCTX.clearRect(0, 0, Config.SCREEN_WIDTH, Config.SCREEN_HEIGHT);

//   if (pipes) {
//     for (i = 0; i < pipes.length; i++) {
//       drawPipe(pipes[i]);
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

//   _picPipe = new Image();
//   _picPipe.src = 'assets/images/pipe2.png';
//   _picPipe.onload = () => {
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

// function drawPipe(pipe) {
//   canvasCTX.drawImage(
//     _picPipe,
//     0,
//     0,
//     Config.SPRITE_PIPE_WIDTH,
//     Config.SPRITE_PIPE_HEIGHT,
//     pipe.posX,
//     pipe.posY - Config.SPRITE_PIPE_HEIGHT,
//     Config.PIPE_WIDTH,
//     Config.SPRITE_PIPE_HEIGHT
//   );
//   canvasCTX.drawImage(
//     _picPipe,
//     0,
//     0,
//     Config.SPRITE_PIPE_WIDTH,
//     Config.SPRITE_PIPE_HEIGHT,
//     pipe.posX,
//     pipe.posY + Config.HEIGHT_BETWEEN_PIPES,
//     Config.PIPE_WIDTH,
//     Config.SPRITE_PIPE_HEIGHT
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
let _picPipe;
let toucanSrcs;
export default class GUIController {
  constructor() {
    toucanSrcs = new Array();
    totalSrcsCount = Config.TOUCAN_SOURCES.length;
    toDraw = false;
    canvasCTX = document.getElementById('canvas').getContext('2d');
  }

  draw(currentTime, ellapsedTime, playerManager, pipes, gameState) {
    let i;
    const players = playerManager.getAllPlayers();
    if (!toDraw) {
      return;
    }
    canvasCTX.clearRect(0, 0, Config.SCREEN_WIDTH, Config.SCREEN_HEIGHT);

    if (pipes) {
      for (i = 0; i < pipes.length; i++) {
        this.drawPipe(pipes[i]);
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

    _picPipe = new Image();
    _picPipe.src = 'assets/images/pipe2.png';
    _picPipe.onload = () => {
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
  drawPipe(pipe) {
    canvasCTX.drawImage(
      _picPipe,
      0,
      0,
      Config.SPRITE_PIPE_WIDTH,
      Config.SPRITE_PIPE_HEIGHT,
      pipe.posX,
      pipe.posY - Config.SPRITE_PIPE_HEIGHT,
      Config.PIPE_WIDTH,
      Config.SPRITE_PIPE_HEIGHT
    );
    canvasCTX.drawImage(
      _picPipe,
      0,
      0,
      Config.SPRITE_PIPE_WIDTH,
      Config.SPRITE_PIPE_HEIGHT,
      pipe.posX,
      pipe.posY + Config.HEIGHT_BETWEEN_PIPES,
      Config.PIPE_WIDTH,
      Config.SPRITE_PIPE_HEIGHT
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
