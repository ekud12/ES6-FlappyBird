import { config as Config } from '../../config.js';

const GUIController = {};

const ctx = document.getElementById('canvas').getContext('2d');
let _isReadyToDraw = false;
let _nbRessourcesToLoad = getNbRessourcesToLoad();
let _picPipe;
const _picBirds = new Array();

function getNbRessourcesToLoad() {
  return Config.SPRITES.length;
}
function drawPipe(pipe) {
  ctx.drawImage(
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
  ctx.drawImage(
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
const updateScore = score => {
  document.getElementById('score-container').innerHTML = `Your score is: ${score}`;
};

GUIController.draw = (currentTime, ellapsedTime, playerManager, pipes, gameState) => {
  let i;
  const players = playerManager.getAllPlayers();
  if (!_isReadyToDraw) {
    return;
  }
  ctx.clearRect(0, 0, Config.SCREEN_WIDTH, Config.SCREEN_HEIGHT);

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
  if (gameState == 2) updateScore(playerManager.getActivePlayer().getPlayerScore());
};

GUIController.resetGUI = () => {
  document.getElementById('score-container').innerHTML = ``;
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

  for (i = 0; i < Config.SPRITES.length; i++) {
    bird = new Image();
    bird.src = Config.SPRITES[i];
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
