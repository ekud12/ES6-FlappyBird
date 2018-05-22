import { config as Config } from '../config';
import * as CollisionChecker from './utils/CollisionUtils';
import VineController from './controllers/S_VineController';
import PlayersController from './controllers/S_PlayerController';

let PlayersControllerInst;
let VineControllerInst;
let gameState;
let gameStart;
let lastUpdate = null;
let timer;
let io;

export const initializeServer = incomingIO => {
  io = incomingIO;
  gameState = Config.serverStates.WaitingForPlayers;

  // Create PlayersControllerInst instance and register events
  PlayersControllerInst = new PlayersController();

  PlayersControllerInst.on('all-players-ready-to-play', () => {
    serverGameInstanceLoop();
  });

  // Create vine manager and bind event
  VineControllerInst = new VineController();
  VineControllerInst.on('create_new_vine', () => {
    // Create a vine and send it to clients
    const vine = VineControllerInst.createNewVine();
  });

  // On new client connection
  io.sockets.on('connection', socket => {
    let player = PlayersControllerInst.addPlayer(socket, socket.id);
    socket.PlayerInstance = player;
    socket.on('disconnect', () => {
      PlayersControllerInst.removePlayer(player);
      socket.broadcast.emit('player_disconnected', player.getPlayerObject());
      player = null;
    });

    socket.on('welcome_player', (name, callback) => {
      callback(gameState, player.getID());
      initPlayerWithBindings(socket, name);
    });
  });
};

const initPlayerWithBindings = (playerSocket, name) => {
  let player = playerSocket.PlayerInstance;
  PlayersControllerInst.initPlayer(player, name);

  playerSocket.on('update_ready_state', readyState => {
    if (gameState === Config.serverStates.WaitingForPlayers) {
      PlayersControllerInst.checkAllPlayersReady(player, readyState);
      playerSocket.broadcast.emit('player_is_ready', player.getPlayerObject());
    }
  });

  playerSocket.on('play_action', () => {
    player.jump();
  });

  playerSocket.emit('list_of_players_update', PlayersControllerInst.getAllPlayersForState());
  playerSocket.broadcast.emit('player_joined', player.getPlayerObject());
};

const refreshState = (state, notifyClients) => {
  let log = '\t[SERVER] Game state changed ! Server is now ';

  gameState = state;
  switch (gameState) {
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
  io.sockets.emit('state_updated', gameState);
};

const initGameSession = () => {
  VineControllerInst.clearAllVines();

  let players = PlayersControllerInst.resetAllPlayers();
  for (let i = 0; i < players.length; i++) {
    io.sockets.emit('player_is_ready', players[i]);
  }

  refreshState(Config.serverStates.WaitingForPlayers, true);
};

const gameEnded = () => {
  clearInterval(timer);
  lastUpdate = null;
  refreshState(Config.serverStates.Ranking, true);
  PlayersControllerInst.sendWinner();
  setTimeout(initGameSession, 3000);
};

const serverGameInstanceLoop = () => {
  // Change server state
  refreshState(Config.serverStates.OnGame, true);
  // Create the first vine
  VineControllerInst.createNewVine();
  // Start timer
  timer = setInterval(() => {
    const now = new Date().getTime();
    let ellapsedTime = 0;
    let plList;

    // get time difference between the last call and now
    if (lastUpdate) {
      ellapsedTime = now - lastUpdate;
    } else {
      gameStart = now;
    }

    lastUpdate = now;

    // If everyone has quit the game, exit it
    if (PlayersControllerInst.getTotalPlayers() === 0) {
      gameEnded();
    }

    // Update players position
    PlayersControllerInst.updatePlayers(ellapsedTime);

    // Update vines
    VineControllerInst.refreshVines(ellapsedTime);

    // Check collisions
    if (
      CollisionChecker.checkCollisions(
        VineControllerInst.getClosestVines(),
        PlayersControllerInst.getAllPlayersForState(Config.PlayerState.InProgress)
      ) === true
    ) {
      if (PlayersControllerInst.anyActivePlayersLeft() === false) {
        gameEnded();
      }
    }

    // Notify players
    io.sockets.emit('update_game_digital_assets', {
      players: PlayersControllerInst.getOnGamePlayerList(),
      vines: VineControllerInst.getVines()
    });
  }, 1000 / 60);
};
