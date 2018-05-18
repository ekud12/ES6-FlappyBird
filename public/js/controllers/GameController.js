import { constant as Const } from '../../../global.js';
import PlayersController from '../controllers/PlayersController.js';
import GUIController from '../controllers/UIController.js';

const enumPanels = {
  Login: 'gs-login',
  Ranking: 'gs-ranking',
  HighScores: 'gs-highscores',
  Error: 'gs-error'
};

let state = Const.clientInstanceStates.Login;
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

function canvasPaint(nowTime, totalTime) {
  GUIController.draw(nowTime, totalTime, playersCInstance, gamePipes, state);
}

function clientInGameLoop() {
  const now = new Date().getTime();
  let ellapsedTime = 0;
  if (state == Const.clientInstanceStates.OnGame) requestAnimationFrame(clientInGameLoop);
  if (updateIntervalTime) {
    ellapsedTime = now - updateIntervalTime;
  }
  updateIntervalTime = now;
  canvasPaint(now, ellapsedTime);
}

function clientWaitingLoop() {
  const now = new Date().getTime();
  if (state == Const.clientInstanceStates.WaitingRoom) requestAnimationFrame(clientWaitingLoop);
  canvasPaint(now, 0);
}

function runClientInstance() {
  if (typeof io == 'undefined') {
    return;
  }

  playersCInstance = new PlayersController();
  socket = io.connect(`${Const.SOCKET_ADDR}:${Const.SOCKET_PORT}`, { reconnect: false });
  socket.on('connect', () => {
    socket.on('disconnect', () => {
      alert(`Disconnected or player quit`);
      // document.getElementById('gs-error-message').innerHTML = 'Player Left/Disconnected';
      // showHideMenu(enumPanels.Error, true);
    });

    canvasPaint(0, 0);
    showHideMenu(enumPanels.Login, true);

    /** bind button to load the waiting room */
    document.getElementById('player-connection').onclick = loadClientWaitingRoom;
  });

  socket.on('error', () => {
    // document.getElementById('gs-error-message').innerHTML =
    //   'Fail to connect the WebSocket to the server.<br/><br/>Please check the WS address.';
    // showHideMenu(enumPanels.Error, true);
    console.log('Cannot connect the web_socket ');
  });
}

function loadClientWaitingRoom() {
  const name = document.getElementById('player-name').value;
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
  socket.on('new_player', player => {
    playersCInstance.addPlayer(player);
  });
  socket.on('player_ready_state', playerInfos => {
    playersCInstance.getPlayerByID(playerInfos.id).updateData(playerInfos);
  });
  socket.on('update_game_state', gameState => {
    changeGameState(gameState);
  });
  socket.on('player_disconnect', player => {
    playersCInstance.deletePlayer(player);
  });

  socket.on('ranking', score => {
    displayRanking(score);
  });
  socket.on('update_game', serverDatasUpdated => {
    playersCInstance.refreshPList(serverDatasUpdated.players);
    gamePipes = serverDatasUpdated.pipes;
  });

  socket.emit('say_hi', name, (serverState, uuid) => {
    playerID = uuid;
    changeGameState(serverState);

    if (serverState == Const.clientInstanceStates.OnGame) {
      alert(`Game in Progress. Please wait...`);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.keyCode == 32) {
      inputsManager();
    }
  });

  showHideMenu(enumPanels.Login, false);
  return false;
}

function displayRanking(data) {
  document.getElementById('winner-div').innerHTML = `The winner is : ${data.winner} with a high score of: ${data.score}`;
  setTimeout(GUIController.resetGUI(), 3000);
}

function changeGameState(gameState) {
  state = gameState;
  switch (state) {
    case Const.clientInstanceStates.WaitingRoom:
      gamePipes = null;
      isPlayerReady = false;
      clientWaitingLoop();
      break;

    case Const.clientInstanceStates.OnGame:
      document.getElementById('winner-div').innerHTML = null;
      clientInGameLoop();
      break;

    case Const.clientInstanceStates.End:
      gamePipes = null;
      break;

    default:
      break;
  }
}

const inputsManager = () => {
  switch (state) {
    case Const.clientInstanceStates.WaitingRoom:
      isPlayerReady = !isPlayerReady;
      socket.emit('change_ready_state', isPlayerReady);
      playersCInstance.getActivePlayer().isPlayerReady(isPlayerReady);
      break;
    case Const.clientInstanceStates.OnGame:
      socket.emit('player_jump');
      break;
    default:
      break;
  }
};

const showHideMenu = (panelName, isShow) => {
  const panel = document.getElementById(panelName);
  const currentOverlayPanel = document.querySelector('.overlay');

  if (isShow) {
    if (currentOverlayPanel) currentOverlayPanel.classList.remove('overlay');
    panel.classList.add('overlay');
  } else {
    if (currentOverlayPanel) currentOverlayPanel.classList.remove('overlay');
  }
};
GUIController.loadRessources(() => {
  runClientInstance();
});

// function infoPanel(isShow, htmlText, timeout) {}
