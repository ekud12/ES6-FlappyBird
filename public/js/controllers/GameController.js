import { config as Config } from '../../../config.js';
import PlayersController from '../controllers/PlayersController.js';
import GUIController from '../controllers/UIController.js';

let state = Config.clientInstanceStates.Login;
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
GUIController.loadRessources(() => {
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
      console.log(`Disconnected or player quit. Refresh Page`);
    });
    canvasPaint(0, 0);
    document.getElementById('player-connection').onclick = initClientSocketBindings;
  });

  socket.on('error', () => {
    console.log(`Cannot connect the web_socket`);
  });
}

function clientWaitingLoop() {
  const now = new Date().getTime();
  if (state == Config.clientInstanceStates.WaitingRoom) requestAnimationFrame(clientWaitingLoop);
  canvasPaint(now, 0);
}

function clientInGameLoop() {
  const now = new Date().getTime();
  let ellapsedTime = 0;
  if (state == Config.clientInstanceStates.OnGame) requestAnimationFrame(clientInGameLoop);
  if (updateIntervalTime) {
    ellapsedTime = now - updateIntervalTime;
  }
  updateIntervalTime = now;
  canvasPaint(now, ellapsedTime);
}

function clientGetUpdatedState(gameState) {
  state = gameState;
  switch (state) {
    case Config.clientInstanceStates.WaitingRoom:
      gamePipes = null;
      isPlayerReady = false;
      clientWaitingLoop();
      break;
    case Config.clientInstanceStates.OnGame:
      document.getElementById('winner-div').innerHTML = null;
      clientInGameLoop();
      break;

    case Config.clientInstanceStates.End:
      gamePipes = null;
      break;
    default:
      break;
  }
}
function canvasPaint(nowTime, totalTime) {
  GUIController.draw(nowTime, totalTime, playersCInstance, gamePipes, state);
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

    if (serverState == Config.clientInstanceStates.OnGame) {
      alert(`Game in Progress. Please wait...`);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.keyCode == 32) {
      switch (state) {
        case Config.clientInstanceStates.WaitingRoom:
          isPlayerReady = !isPlayerReady;
          socket.emit('update_ready_state', isPlayerReady);
          playersCInstance.getActivePlayer().isPlayerReady(isPlayerReady);
          break;
        case Config.clientInstanceStates.OnGame:
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
  setTimeout(GUIController.resetGUI(), 3000);
}
