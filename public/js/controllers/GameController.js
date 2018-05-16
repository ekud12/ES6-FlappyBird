/*
*   Game Engine
*/

import { constant as Const } from '../../../global.js';
import PlayersController from '../controllers/PlayersController.js';
import canvasPainter from '../controllers/UIController.js';
const enumState = {
  Login: 0,
  WaitingRoom: 1,
  OnGame: 2,
  Ranking: 3
};

const enumPanels = {
  Login: 'gs-login',
  Ranking: 'gs-ranking',
  HighScores: 'gs-highscores',
  Error: 'gs-error'
};

let _gameState = enumState.Login;
let _playerManager;
let _pipeList;
let _isCurrentPlayerReady = false;
let _userID = null;
let _lastTime = null;
let _rankingTimer;
let _ranking_time;
let _socket;
let _infPanlTimer;
let _isNight = false;

function draw(currentTime, ellapsedTime) {
  // If player score is > 15, night !!
  if (_gameState == enumState.OnGame && _playerManager.getCurrentPlayer().getScore() == 15) _isNight = true;

  canvasPainter.draw(currentTime, ellapsedTime, _playerManager, _pipeList, _gameState, _isNight);
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
  if (_gameState == enumState.OnGame) requestAnimationFrame(gameLoop);

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
  if (_gameState == enumState.WaitingRoom) requestAnimationFrame(lobbyLoop);

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
    _playerManager.removePlayer(player);
  });
  _socket.on('new_player', player => {
    _playerManager.addPlayer(player);
  });
  _socket.on('player_ready_state', playerInfos => {
    _playerManager.getPlayerFromId(playerInfos.id).updateFromServer(playerInfos);
  });
  _socket.on('update_game_state', gameState => {
    changeGameState(gameState);
  });
  _socket.on('game_loop_update', serverDatasUpdated => {
    _playerManager.updatePlayerListFromServer(serverDatasUpdated.players);
    _pipeList = serverDatasUpdated.pipes;
  });
  _socket.on('ranking', score => {
    displayRanking(score);
  });

  _socket.emit('say_hi', nick, (serverState, uuid) => {
    _userID = uuid;
    changeGameState(serverState);

    if (serverState == enumState.OnGame) {
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

function displayRanking(score) {
  const nodeMedal = document.querySelector('.gs-ranking-medal');
  const nodeHS = document.getElementById('gs-highscores-scores');
  let i;
  let nbHs;

  console.log(score);

  // Remove previous medals just in case
  nodeMedal.classList.remove('third');
  nodeMedal.classList.remove('second');
  nodeMedal.classList.remove('winner');

  // Display scores
  document.getElementById('gs-ranking-score').innerHTML = score.score;
  document.getElementById('gs-ranking-best').innerHTML = score.bestScore;
  document.getElementById('gs-ranking-pos').innerHTML = `${score.rank} / ${score.nbPlayers}`;

  // Set medal !
  if (score.rank == 1) nodeMedal.classList.add('winner');
  else if (score.rank == 2) nodeMedal.classList.add('second');
  else if (score.rank == 3) nodeMedal.classList.add('third');

  // Display hish scores
  nodeHS.innerHTML = '';
  nbHs = score.highscores.length;
  for (i = 0; i < nbHs; i++) {
    nodeHS.innerHTML += `<li><span>#${i + 1}</span> ${score.highscores[i].player} <strong>${
      score.highscores[i].score
    }</strong></li>`;
  }

  // Show ranking
  showHideMenu(enumPanels.Ranking, true);

  // Display hish scores in a middle of the waiting time
  window.setTimeout(() => {
    showHideMenu(enumPanels.HighScores, true);
  }, Const.TIME_BETWEEN_GAMES / 2);

  // reset graphics in case to prepare the next game
  canvasPainter.resetForNewGame();
  _isNight = false;
}

function changeGameState(gameState) {
  let strLog = 'Server just change state to ';

  _gameState = gameState;

  switch (_gameState) {
    case enumState.WaitingRoom:
      strLog += 'waiting in lobby';
      _isCurrentPlayerReady = false;
      lobbyLoop();
      break;

    case enumState.OnGame:
      strLog += 'on game !';
      gameLoop();
      break;

    case enumState.Ranking:
      strLog += 'display ranking';
      // Start timer for next game
      _ranking_time = Const.TIME_BETWEEN_GAMES / 1000;

      // Display the remaining time on the top bar
      infoPanel(true, `Next game in <strong>${_ranking_time}s</strong>...`);
      _rankingTimer = window.setInterval(() => {
        // Set seconds left
        infoPanel(true, `Next game in <strong>${--_ranking_time}s</strong>...`);

        // Stop timer if time is running up
        if (_ranking_time <= 0) {
          // Reset timer and remove top bar
          window.clearInterval(_rankingTimer);
          infoPanel(false);

          // Reset pipe list and hide ranking panel
          _pipeList = null;
          showHideMenu(enumPanels.Ranking, false);
        }
      }, 1000);
      break;

    default:
      console.log(`Unknew game state [${_gameState}]`);
      strLog += 'undefined state';
      break;
  }

  console.log(strLog);
}

const inputsManager = () => {
  switch (_gameState) {
    case enumState.WaitingRoom:
      _isCurrentPlayerReady = !_isCurrentPlayerReady;
      _socket.emit('change_ready_state', _isCurrentPlayerReady);
      _playerManager.getCurrentPlayergetCurrentPlayer().updateReadyState(_isCurrentPlayerReady);
      break;
    case enumState.OnGame:
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
canvasPainter.loadRessources(() => {
  runFBInstance();
});

function infoPanel(isShow, htmlText, timeout) {}
