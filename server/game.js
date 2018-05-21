import { config as Config } from '../config';
import * as CollisionChecker from './utils/CollisionUtils';

import VineManager from './vineManager';
import PlayersManager from './playersManager';
let io = require('socket.io').listen(Config.SOCKET_PORT);
let _playersManager;
let _vineManager;

let _gameState;
let _timeStartGame;
let _lastTime = null;
let _timer;
export function startServer() {
  // io.configure(() => {
  //   io.set('log level', 2);
  // });

  _gameState = Config.serverStates.WaitingForPlayers;

  // Create playersManager instance and register events
  _playersManager = new PlayersManager();
  _playersManager.on('players-ready', () => {
    startGameLoop();
  });

  // Create vine manager and bind event
  _vineManager = new VineManager();
  _vineManager.on('need_new_vine', () => {
    // Create a vine and send it to clients
    const vine = _vineManager.newVine();
  });

  // On new client connection
  io.sockets.on('connection', socket => {
    // Add new player
    let player = _playersManager.addNewPlayer(socket, socket.id);
    socket.PlayerInstance = player;
    // Register to socket events
    socket.on('disconnect', () => {
      _playersManager.deletePlayer(player);
      socket.broadcast.emit('player_disconnected', player.getPlayerObject());
      player = null;
    });

    socket.on('say_hi', (nick, fn) => {
      fn(_gameState, player.getID());
      playerLog(socket, nick);
    });
  });

  console.log(`Game started and waiting for players on port ${Config.SOCKET_PORT}`);
}

function playerLog(socket, nick) {
  // Retreive PlayerInstance
  let player = socket.PlayerInstance;

  // Bind new client events
  socket.on('update_ready_state', readyState => {
    // If the server is currently waiting for players, update ready state
    if (_gameState == Config.serverStates.WaitingForPlayers) {
      _playersManager.changeLobbyState(player, readyState);
      socket.broadcast.emit('player_is_ready', player.getPlayerObject());
    }
  });
  socket.on('play_action', () => {
    player.jump();
  });

  // Set player's nickname and prepare him for the next game
  _playersManager.prepareNewPlayer(player, nick);

  // Notify new client about other players AND notify other about the new one ;)
  socket.emit('list_of_players_update', _playersManager.getPlayerList());
  socket.broadcast.emit('player_joined', player.getPlayerObject());
}

function updateGameState(newState, notifyClients) {
  let log = '\t[SERVER] Game state changed ! Server is now ';

  _gameState = newState;
  switch (_gameState) {
    case Config.serverStates.WaitingForPlayers:
      log += 'in lobby waiting for players';
      break;
    case Config.serverStates.OnGame:
      log += 'in game !';
      break;
    case Config.serverStates.Ranking:
      log += 'displaying ranking';
      break;
    default:
      log += 'dead :p';
  }
  console.info(log);

  // If requested, inform clients qbout the chsnge
  io.sockets.emit('state_updated', _gameState);
}

function createNewGame() {
  let players;
  let i;

  // Flush vine list
  _vineManager.clearAllVines();

  // Reset players state and send it
  players = _playersManager.resetPlayersForNewGame();
  for (i = 0; i < players.length; i++) {
    io.sockets.emit('player_is_ready', players[i]);
  }

  // Notify players of the new game state
  updateGameState(Config.serverStates.WaitingForPlayers, true);
}

function gameOver() {
  let players;
  let i;

  // Stop game loop
  clearInterval(_timer);
  _lastTime = null;
  updateGameState(Config.serverStates.Ranking, true);
  _playersManager.sendWinner();
  setTimeout(createNewGame, 3000);
}

function startGameLoop() {
  // Change server state
  updateGameState(Config.serverStates.OnGame, true);

  // Create the first vine
  _vineManager.newVine();

  // Start timer
  _timer = setInterval(() => {
    const now = new Date().getTime();
    let ellapsedTime = 0;
    let plList;

    // get time difference between the last call and now
    if (_lastTime) {
      ellapsedTime = now - _lastTime;
    } else {
      _timeStartGame = now;
    }

    _lastTime = now;

    // If everyone has quit the game, exit it
    if (_playersManager.getNumberOfPlayers() == 0) {
      gameOver();
    }

    // Update players position
    _playersManager.updatePlayers(ellapsedTime);

    // Update vines
    _vineManager.updateVines(ellapsedTime);

    // Check collisions
    if (
      CollisionChecker.checkCollisions(
        _vineManager.getPotentialVineHit(),
        _playersManager.getPlayerList(Config.PlayerState.InProgress)
      ) == true
    ) {
      if (_playersManager.arePlayersStillAlive() == false) {
        gameOver();
      }
    }

    // Notify players
    io.sockets.emit('update_game_digital_assets', {
      players: _playersManager.getOnGamePlayerList(),
      vines: _vineManager.getVineList()
    });
  }, 1000 / 60);
}
