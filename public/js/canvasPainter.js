import { constant as Const } from '../../global.js';
import BgRessources from './backgroundRessources.js';
import Parallax from './parallax.js';

const SPRITE_PIPE_HEIGHT = 768;
const SPRITE_PIPE_WIDTH = 148;
const SCORE_POS_Y = 200;
const SCORE_SHADOW_OFFSET = 5;
const NB_RESSOURCES_TO_LOAD = 2;
const BIRDS_SPRITES = [
  'assets/images/toucan.png',
  'assets/images/toucan-red.png',
  'assets/images/toucan-purple.png',
  'assets/images/toucan-green.png'
];
const canvasPainter = {};
const ctx = document.getElementById('gs-canvas').getContext('2d');
let _isReadyToDraw = false;
let _nbRessourcesToLoad = getNbRessourcesToLoad();
let _picGround;
let _parallaxGround;
let _picPipe;
const _picBG = new Array();
const _picBirds = new Array();

function getNbRessourcesToLoad() {
  let nbRessources = NB_RESSOURCES_TO_LOAD + BIRDS_SPRITES.length;
  const nbBg = BgRessources.length;
  let i;
  for (i = 0; i < nbBg; i++) {
    if (typeof BgRessources[i].daySrc !== 'undefined') nbRessources++;
    if (typeof BgRessources[i].nightSrc !== 'undefined') nbRessources++;
  }
  return nbRessources;
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
function drawScore(score) {
  let posX;
  posX = Const.SCREEN_WIDTH / 2 - ctx.measureText(score).width / 2;
  ctx.font = '120px Quantico';
  ctx.fillStyle = 'black';
  ctx.fillText(score, posX + SCORE_SHADOW_OFFSET, SCORE_POS_Y + SCORE_SHADOW_OFFSET);
  ctx.fillStyle = 'white';
  ctx.fillText(score, posX, SCORE_POS_Y);
}
canvasPainter.draw = (currentTime, ellapsedTime, playerManager, pipes, gameState, isNight) => {
  let nb;
  let i;
  const players = playerManager.getPlayers();
  if (!_isReadyToDraw) {
    console.log('[ERROR] : Ressources not yet loaded !');
    return;
  }
  ctx.fillStyle = '#0099CC';
  ctx.fillRect(0, 0, Const.SCREEN_WIDTH, Const.SCREEN_HEIGHT);
  nb = _picBG.length;
  for (i = 0; i < nb; i++) {
    _picBG[i].draw(ctx, ellapsedTime, isNight);
  }
  if (pipes) {
    nb = pipes.length;
    for (i = 0; i < nb; i++) {
      drawPipe(pipes[i]);
    }
  }
  if (players) {
    nb = players.length;
    for (i = 0; i < nb; i++) {
      players[i].draw(ctx, currentTime, _picBirds, gameState);
    }
  }
  if (gameState == 2) drawScore(playerManager.getCurrentPlayer().getScore());
  if (pipes) _parallaxGround.draw(ctx, currentTime);
  else _parallaxGround.draw(ctx, 0);
};
canvasPainter.resetForNewGame = () => {
  const nb = _picBG.length;
  let i;
  for (i = 0; i < nb; i++) {
    _picBG[i].resetToDayCycle();
  }
};
canvasPainter.loadRessources = onReadyCallback => {
  let bird;
  let dBg;
  let nBg;
  let i;
  _picGround = new Image();
  _picGround.src = 'assets/images/ground.png';
  _picGround.onload = () => {
    onRessourceLoaded(onReadyCallback);
  };
  _parallaxGround = new Parallax(_picGround, null, 1920, 96, Const.LEVEL_SPEED, 672, Const.SCREEN_WIDTH);
  _picPipe = new Image();
  _picPipe.src = 'assets/images/pipe.png';
  _picPipe.onload = () => {
    onRessourceLoaded(onReadyCallback);
  };
  for (i = 0; i < BIRDS_SPRITES.length; i++) {
    bird = new Image();
    bird.src = BIRDS_SPRITES[i];
    bird.onload = () => {
      onRessourceLoaded(onReadyCallback);
    };
    _picBirds.push(bird);
  }
  for (i = 0; i < BgRessources.length; i++) {
    if (typeof BgRessources[i].daySrc !== 'undefined') {
      dBg = new Image();
      dBg.src = BgRessources[i].daySrc;
      dBg.onload = () => {
        onRessourceLoaded(onReadyCallback);
      };
    } else dBg = null;
    if (typeof BgRessources[i].nightSrc !== 'undefined') {
      nBg = new Image();
      nBg.src = BgRessources[i].nightSrc;
      nBg.onload = () => {
        onRessourceLoaded(onReadyCallback);
      };
    } else nBg = null;
    _picBG.push(
      new Parallax(
        dBg,
        nBg,
        BgRessources[i].width,
        BgRessources[i].height,
        BgRessources[i].speed,
        BgRessources[i].posY,
        Const.SCREEN_WIDTH
      )
    );
  }
  function onRessourceLoaded(onReadyCallback) {
    const totalRessources = getNbRessourcesToLoad();
    if (--_nbRessourcesToLoad <= 0) {
      _isReadyToDraw = true;
      onReadyCallback();
    } else {
      document.getElementById('gs-loader-text').innerHTML = `Load ressource ${totalRessources -
        _nbRessourcesToLoad} / ${totalRessources}`;
    }
  }
};
export default canvasPainter;
