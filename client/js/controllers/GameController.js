/**
 * Author: Liel Kaysari
 *     ID: 201322054
 */
/**
 * Imports and var definition
 */
import { config as Config } from '../../../config.js';
import PlayersController from '../controllers/PlayersController.js';
import GUIController from '../controllers/GUIController.js';
let audio = new Audio('./../../assets/images/jungle.mp3');
let state = Config.clientInstanceStates.New;
let GUIControllerInstance = new GUIController();
let playersCInstance;
let playerID = null;
let isPlayerReady = false;
let updateIntervalTime = null;
let socket;
let gameVines;
let audioPlaying = false;

/**
 *s
 * On resources Loaded Callback Done
 * run the client's game instance
 */

/** Audio handling */
window.audioHandler = audioHandler;
document.addEventListener('keydown', event => {
  if (event.keyCode === Config.SOUND_TOGGLE) {
    audioHandler();
  }
});

/** On finished loading, run client instance */
GUIControllerInstance.loadAssets(() => {
  audio.loop = true;
  runClientInstance();
});

const canvasPaint = (nowTime, totalTime) => {
  GUIControllerInstance.render(nowTime, totalTime, playersCInstance, gameVines, state);
};

const runClientInstance = () => {
  if (typeof io === 'undefined') {
    console.log('ERROR INIT socket.io instance.');
  }
  playersCInstance = new PlayersController();

  socket = io.connect();
  socket.on('connect', () => {
    socket.on('disconnect', () => {
      console.log(`Server Disconnected or player quit. Hit F5`);
    });
    canvasPaint(0, 0);
    document.getElementById('enter-game').onclick = initClientSocketBindings;
  });
  socket.on('error', () => {
    console.log(`Error. Check WebSockets (Maybe Proxy).`);
  });
};

/**
 * Game Loops
 */
const clientWaitingLoop = () => {
  if (state === Config.clientInstanceStates.Waiting) requestAnimationFrame(clientWaitingLoop);
  canvasPaint(new Date().getTime(), 0);
};

const clientInGameLoop = () => {
  let ellapsedTime = 0;
  const currentTime = new Date().getTime();
  if (state === Config.clientInstanceStates.Playing) requestAnimationFrame(clientInGameLoop);
  if (updateIntervalTime) {
    ellapsedTime = currentTime - updateIntervalTime;
  }
  updateIntervalTime = currentTime;
  canvasPaint(currentTime, ellapsedTime);
};

const clientGetUpdatedState = data => {
  state = data;
  switch (state) {
    case Config.clientInstanceStates.Waiting:
      document.getElementById('enter-game').disabled = false;
      gameVines = null;
      isPlayerReady = false;
      clientWaitingLoop();
      break;
    case Config.clientInstanceStates.Playing:
      document.getElementById('winner-div').innerHTML = null;
      document.getElementById('enter-game').disabled = true;
      clientInGameLoop();
      break;
    case Config.clientInstanceStates.Ended:
      document.getElementById('enter-game').disabled = false;
      gameVines = null;
      break;
    default:
      break;
  }
};

const initClientSocketBindings = () => {
  const name = document.getElementById(`player-name`).value;
  if (name === '' || name === 'Your Name' || name === ' ') {
    alert('Please choose a name First!');
    return;
  }

  /**
   * Binding sockets on different actions
   */
  socket.on('list_of_players_update', list => {
    for (let i = 0; i < list.length; i++) {
      playersCInstance.addPlayer(list[i], playerID);
    }
    /**
     * Reset Canvas because we have new players
     */
    canvasPaint(0, 0);
  });
  socket.on('player_joined', player => {
    playersCInstance.addPlayer(player);
  });
  socket.on('player_disconnected', player => {
    playersCInstance.deletePlayer(player);
  });
  socket.on('player_is_ready', playerInfos => {
    playersCInstance.findPlayerById(playerInfos.id).updatePlayerData(playerInfos);
  });
  socket.on('state_updated', gameState => {
    clientGetUpdatedState(gameState);
  });
  socket.on('we_have_a_winner', score => {
    displayWinner(score);
  });
  socket.on('update_game_digital_assets', newServerData => {
    playersCInstance.refreshPList(newServerData.players);
    gameVines = newServerData.vines;
  });

  socket.emit('welcome_player', name, (serverState, uuid) => {
    playerID = uuid;
    clientGetUpdatedState(serverState);
    if (serverState === Config.clientInstanceStates.Playing) {
      alert(`Game in Progress. Please wait...`);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.keyCode === Config.PLAY_KEYCODE) {
      switch (state) {
        case Config.clientInstanceStates.Waiting:
          isPlayerReady = !isPlayerReady;
          socket.emit('update_ready_state', isPlayerReady);
          playersCInstance.getActivePlayer().isPlayerReady(isPlayerReady);
          break;
        case Config.clientInstanceStates.Playing:
          socket.emit('play_action');
          break;
        default:
          break;
      }
    }
  });

  return false;
};

const displayWinner = data => {
  document.getElementById('winner-div').innerHTML = `The winner is : ${data.winner}! </br> The winner's Score is: ${data.score}!`;
  setTimeout(GUIControllerInstance.resetGUI(), 3000);
};

function audioHandler() {
  let audioRef = document.getElementById('myJunglePlayer');
  if (audioRef.muted) {
    audio.play();
  } else {
    audio.pause();
  }
  audioRef.muted = audioPlaying ? true : false;
  audioPlaying = audioRef.muted ? false : true;
}

/** This is better than using SetInterval because its inbrowser
 * and helps us get frames so that the canvas will render without jitters
 * possible only on client because browser does this
 */
requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;
