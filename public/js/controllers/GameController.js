/*
*   Game Engine
*/

import { constant as Const } from '../../../global.js';
import PlayersController from '../controllers/PlayersController.js';
import GUIController from '../controllers/UIController.js';

const enumPanels = {
  Login: 'gs-login',
  Ranking: 'gs-ranking',
  HighScores: 'gs-highscores',
  Error: 'gs-error'
};

let _gameState = Const.clientInstanceStates.Login;
let _playerManager;
let _pipeList;
let _isCurrentPlayerReady = false;
let _userID = null;
let _lastTime = null;
let _rankingTimer;
let _ranking_time;
let _socket;
let _infPanlTimer;

function draw(currentTime, ellapsedTime) {
  GUIController.draw(currentTime, ellapsedTime, _playerManager, _pipeList, _gameState);
}

requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

function gameLoop() {
  const now = new Date().getTime();
  let ellapsedTime = 0;

  // Call for next anim frame
  if (_gameState == Const.clientInstanceStates.OnGame) requestAnimationFrame(gameLoop);

  // Get time difference between the last call and now
  if (_lastTime) {
    ellapsedTime = now - _lastTime;
  }
  _lastTime = now;

  // Call draw with the ellapsed time between the last frame and the current one
  draw(now, ellapsedTime);
}

function lobbyLoop() {
  const now = new Date().getTime();

  // Call for next anim frame
  if (_gameState == Const.clientInstanceStates.WaitingRoom) requestAnimationFrame(lobbyLoop);

  // Call draw with the ellapsed time between the last frame and the current one
  draw(now, 0);
}

function runFBInstance() {
  if (typeof io == 'undefined') {
    console.log('Error With Socket.IO');
    return;
  }

  _playerManager = new PlayersController();

  _socket = io.connect(`${Const.SOCKET_ADDR}:${Const.SOCKET_PORT}`, { reconnect: false });
  _socket.on('connect', () => {
    _socket.on('disconnect', () => {
      document.getElementById('gs-error-message').innerHTML = 'Player Left/Disconnected';
      showHideMenu(enumPanels.Error, true);
    });

    draw(0, 0);
    showHideMenu(enumPanels.Login, true);
    document.getElementById('player-connection').onclick = loadGameRoom;
  });

  _socket.on('error', () => {
    document.getElementById('gs-error-message').innerHTML =
      'Fail to connect the WebSocket to the server.<br/><br/>Please check the WS address.';
    showHideMenu(enumPanels.Error, true);
    console.log('Cannot connect the web_socket ');
  });
}

function loadGameRoom() {
  const nick = document.getElementById('player-name').value;

  // If nick is empty or if it has the default value,
  if (nick == '') {
    alert(true, 'Please choose a name!');
    return false;
  }

  // Unbind button event to prevent "space click"
  document.getElementById('player-connection').onclick = () => false;

  // Bind new socket events
  _socket.on('player_list', playersList => {
    const nb = playersList.length;
    let i;

    // Add this player in the list
    for (i = 0; i < nb; i++) {
      _playerManager.addPlayer(playersList[i], _userID);
    }

    // Redraw
    draw(0, 0);
  });

  _socket.on('player_disconnect', player => {
    _playerManager.deletePlayer(player);
  });
  _socket.on('new_player', player => {
    _playerManager.addPlayer(player);
  });
  _socket.on('player_ready_state', playerInfos => {
    _playerManager.getPlayerByID(playerInfos.id).updateFromServer(playerInfos);
  });
  _socket.on('update_game_state', gameState => {
    changeGameState(gameState);
  });
  _socket.on('game_loop_update', serverDatasUpdated => {
    _playerManager.refreshPList(serverDatasUpdated.players);
    _pipeList = serverDatasUpdated.pipes;
  });
  _socket.on('ranking', score => {
    displayRanking(score);
  });

  _socket.emit('say_hi', nick, (serverState, uuid) => {
    _userID = uuid;
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

  // Hide login screen
  showHideMenu(enumPanels.Login, false);
  return false;
}

function displayRanking(data) {
  // const nodeMedal = document.querySelector('.gs-ranking-medal');
  // const nodeHS = document.getElementById('gs-highscores-scores');
  // let i;
  // let nbHs;

  console.log(data);

  // Remove previous medals just in case
  // nodeMedal.classList.remove('third');
  // nodeMedal.classList.remove('second');
  // nodeMedal.classList.remove('winner');

  // // Display scores
  // document.getElementById('gs-ranking-score').innerHTML = data.score;
  document.getElementById('gs-ranking-best').innerHTML = `The winner is : ${data.winner} with a high score of: ${data.score}`;
  // document.getElementById('gs-ranking-pos').innerHTML = `${data.rank} / ${data.nbPlayers}`;

  // // Set medal !
  // if (data.rank == 1) nodeMedal.classList.add('winner');
  // else if (data.rank == 2) nodeMedal.classList.add('second');
  // else if (data.rank == 3) nodeMedal.classList.add('third');

  // // Display hish scores
  // nodeHS.innerHTML = '';
  // nbHs = data.highscores.length;
  // for (i = 0; i < nbHs; i++) {
  //   nodeHS.innerHTML += `<li><span>#${i + 1}</span> ${data.highscores[i].player} <strong>${
  //     data.highscores[i].score
  //   }</strong></li>`;
  // }

  // Show ranking
  // showHideMenu(enumPanels.Ranking, true);

  // Display hish scores in a middle of the waiting time
  // window.setTimeout(() => {
  //   showHideMenu(enumPanels.HighScores, true);
  // }, 10000 / 2);

  // reset graphics in case to prepare the next game
  setTimeout(GUIController.resetGUI(), 3000);
}

function changeGameState(gameState) {
  let strLog = 'Server just change state to ';
  console.log('WHATS');

  _gameState = gameState;

  switch (_gameState) {
    case Const.clientInstanceStates.WaitingRoom:
      strLog += 'waiting in lobby';
      _pipeList = null;
      _isCurrentPlayerReady = false;
      lobbyLoop();
      break;

    case Const.clientInstanceStates.OnGame:
      document.getElementById('gs-ranking-best').innerHTML = null;
      gameLoop();
      break;

    case Const.clientInstanceStates.End:
      _pipeList = null;
      // // Start timer for next game
      // _ranking_time = 5000 / 1000;

      // // Display the remaining time on the top bar
      // infoPanel(true, `Next game in <strong>${_ranking_time}s</strong>...`);
      // _rankingTimer = window.setInterval(() => {
      //   // Set seconds left
      //   infoPanel(true, `Next game in <strong>${--_ranking_time}s</strong>...`);

      //   // Stop timer if time is running up
      //   if (_ranking_time <= 0) {
      //     // Reset timer and remove top bar
      //     window.clearInterval(_rankingTimer);
      //     infoPanel(false);

      //     // Reset pipe list and hide ranking panel
      //     console.log('Flushing pipes');
      //     _pipeList = null;
      //     showHideMenu(enumPanels.Ranking, false);
      //   }
      // }, 1000);

      break;

    default:
      break;
  }
}

const inputsManager = () => {
  switch (_gameState) {
    case Const.clientInstanceStates.WaitingRoom:
      _isCurrentPlayerReady = !_isCurrentPlayerReady;
      _socket.emit('change_ready_state', _isCurrentPlayerReady);
      _playerManager.getActivePlayer().updateReadyState(_isCurrentPlayerReady);
      break;
    case Const.clientInstanceStates.OnGame:
      _socket.emit('player_jump');
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
  runFBInstance();
});

function infoPanel(isShow, htmlText, timeout) {}
