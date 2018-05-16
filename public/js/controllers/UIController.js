import { constant as Const } from '../../global.js';

const SPRITE_PIPE_HEIGHT = 768;
const SPRITE_PIPE_WIDTH = 148;
const SCORE_POS_Y = 200;
const SCORE_SHADOW_OFFSET = 5;
const TOT_RES = 2;

const GUIController = {};

const ctx = document.getElementById('canvas').getContext('2d');
let _isReadyToDraw = false;
let _nbRessourcesToLoad = getNbRessourcesToLoad();
let _picPipe;
const _picBirds = new Array();

function getNbRessourcesToLoad() {
  return Const.SPRITES.length;
}
function drawPipe(pipe) {
  ctx.drawImage(
    _picPipe,
    0,
    0,
    SPRITE_PIPE_WIDTH,
    SPRITE_PIPE_HEIGHT,
    pipe.posX,
    pipe.posY - SPRITE_PIPE_HEIGHT,
    Const.PIPE_WIDTH,
    SPRITE_PIPE_HEIGHT
  );
  ctx.drawImage(
    _picPipe,
    0,
    0,
    SPRITE_PIPE_WIDTH,
    SPRITE_PIPE_HEIGHT,
    pipe.posX,
    pipe.posY + Const.HEIGHT_BETWEEN_PIPES,
    Const.PIPE_WIDTH,
    SPRITE_PIPE_HEIGHT
  );
}
const drawScore = score => {
  let posX;
  posX = Const.SCREEN_WIDTH / 2 - ctx.measureText(score).width / 2;
  ctx.font = '120px Quantico';
  ctx.fillStyle = 'black';
  ctx.fillText(score, posX + SCORE_SHADOW_OFFSET, SCORE_POS_Y + SCORE_SHADOW_OFFSET);
  ctx.fillStyle = 'white';
  ctx.fillText(score, posX, SCORE_POS_Y);
};

GUIController.draw = (currentTime, ellapsedTime, playerManager, pipes, gameState, isNight) => {
  let i;
  const players = playerManager.getAllPlayers();
  if (!_isReadyToDraw) {
    console.log('[ERROR] : Ressources not yet loaded !');
    return;
  }
  ctx.clearRect(0, 0, Const.SCREEN_WIDTH, Const.SCREEN_HEIGHT);

  if (pipes) {
    for (i = 0; i < pipes.length; i++) {
      drawPipe(pipes[i]);
    }
  }
  if (players) {
    for (i = 0; i < players.length; i++) {
      players[i].draw(ctx, currentTime, _picBirds, gameState);
    }
  }
  if (gameState == 2) drawScore(playerManager.getActivePlayer().getScore());
};

GUIController.resetForNewGame = () => {
  // const nb = _picBG.length;
  // let i;
  // for (i = 0; i < nb; i++) {
  //   _picBG[i].resetToDayCycle();
  // }
};

GUIController.loadRessources = onReadyCallback => {
  let bird;
  let dBg;
  let nBg;
  let i;

  _picPipe = new Image();
  _picPipe.src = 'assets/images/pipe2.png';
  _picPipe.onload = () => {
    onRessourceLoaded(onReadyCallback);
  };

  for (i = 0; i < Const.SPRITES.length; i++) {
    bird = new Image();
    bird.src = Const.SPRITES[i];
    bird.onload = () => {
      onRessourceLoaded(onReadyCallback);
    };
    _picBirds.push(bird);
  }

  function onRessourceLoaded(onReadyCallback) {
    const totalRessources = getNbRessourcesToLoad();
    if (--_nbRessourcesToLoad <= 0) {
      _isReadyToDraw = true;
      onReadyCallback();
    } else {
      console.log('Still Loading Files');
    }
  }
};
export default GUIController;
