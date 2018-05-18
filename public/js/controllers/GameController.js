import { config as Config } from '../../../config.js';
import PlayersController from '../controllers/PlayersController.js';
import GUIController from '../controllers/GUIController.js';

let state = Config.clientInstanceStates.New;
let GUIControllerInstance = new GUIController();
let playersCInstance;
let playerID = null;
let isPlayerReady = false;
let updateIntervalTime = null;
let socket;
let gamePipes;
requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

/**
 * On resources Loaded Callback Done
 * run the client's game instance
 */
GUIControllerInstance.loadAssets(() => {
  runClientInstance();
});

function runClientInstance() {
  if (typeof io == 'undefined') {
    return;
  }

  playersCInstance = new PlayersController();

  socket = io.connect(`${Config.SOCKET_ADDR}:${Config.SOCKET_PORT}`, { reconnect: false });
  socket.on('connect', () => {
    socket.on('disconnect', () => {
      console.log(`Disconnected or player quit. Refresh Page.`);
    });
    canvasPaint(0, 0);
    document.getElementById('player-connection').onclick = initClientSocketBindings;
  });

  socket.on('error', () => {
    console.log(`Cannot connect the web_socket`);
  });
}

function clientWaitingLoop() {
  if (state == Config.clientInstanceStates.Waiting) requestAnimationFrame(clientWaitingLoop);
  canvasPaint(new Date().getTime(), 0);
}

function clientInGameLoop() {
  let ellapsedTime = 0;
  const currentTime = new Date().getTime();
  if (state == Config.clientInstanceStates.Playing) requestAnimationFrame(clientInGameLoop);
  if (updateIntervalTime) {
    ellapsedTime = currentTime - updateIntervalTime;
  }
  updateIntervalTime = currentTime;
  canvasPaint(currentTime, ellapsedTime);
}

function clientGetUpdatedState(gameState) {
  state = gameState;
  switch (state) {
    case Config.clientInstanceStates.Waiting:
      gamePipes = null;
      isPlayerReady = false;
      clientWaitingLoop();
      break;
    case Config.clientInstanceStates.Playing:
      document.getElementById('winner-div').innerHTML = null;
      clientInGameLoop();
      break;
    case Config.clientInstanceStates.Ended:
      gamePipes = null;
      break;
    default:
      break;
  }
}
function canvasPaint(nowTime, totalTime) {
  GUIControllerInstance.draw(nowTime, totalTime, playersCInstance, gamePipes, state);
}

function initClientSocketBindings() {
  const name = document.getElementById(`player-name`).value;
  if (name === '' || name === 'Afeka') {
    alert('Please choose a name!');
    return;
  }
  document.getElementById('player-connection').onclick = () => false;

  /**
   * Binding sockets on different actions
   */
  socket.on('player_list', list => {
    for (let i = 0; i < list.length; i++) {
      playersCInstance.addPlayer(list[i], playerID);
    }
    canvasPaint(0, 0);
  });
  socket.on('player_joined', player => {
    playersCInstance.addPlayer(player);
  });
  socket.on('player_is_ready', playerInfos => {
    playersCInstance.getPlayerByID(playerInfos.id).updateData(playerInfos);
  });
  socket.on('state_updated', gameState => {
    clientGetUpdatedState(gameState);
  });
  socket.on('player_disconnect', player => {
    playersCInstance.deletePlayer(player);
  });
  socket.on('we_have_a_winner', score => {
    displayWinner(score);
  });
  socket.on('update_game_digital_assets', newServerData => {
    playersCInstance.refreshPList(newServerData.players);
    gamePipes = newServerData.pipes;
  });

  socket.emit('say_hi', name, (serverState, uuid) => {
    playerID = uuid;
    clientGetUpdatedState(serverState);

    if (serverState == Config.clientInstanceStates.Playing) {
      alert(`Game in Progress. Please wait...`);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.keyCode == 32) {
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
}

function displayWinner(data) {
  document.getElementById('winner-div').innerHTML = `The winner is : ${data.winner} with a high score of: ${data.score}`;
  setTimeout(GUIControllerInstance.resetGUI(), 3000);
}
