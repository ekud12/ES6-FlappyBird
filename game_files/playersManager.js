import { EventEmitter } from 'events';
import util from 'util';
import Scores from './ScoringController';
import * as enums from './enums';
import Player from './player';
const NB_AVAILABLE_BIRDS_COLOR = 4;

const _playersList = new Array();
let _posOnGrid = 0;
const _scores = new Scores();

class PlayersManager {
  constructor() {
    EventEmitter.call(this);
  }

  addNewPlayer(playerSocket, id) {
    let newPlayer;
    let birdColor;

    // Set an available color according the number of client's sprites
    birdColor = Math.floor(Math.random() * (NB_AVAILABLE_BIRDS_COLOR - 1 + 1));

    // Create new player and add it in the list
    newPlayer = new Player(playerSocket, id, birdColor);
    _playersList.push(newPlayer);

    console.info(`New player connected. There is currently ${_playersList.length} player(s)`);

    return newPlayer;
  }

  deletePlayer(player) {
    const pos = _playersList.indexOf(player);

    if (pos < 0) {
      console.error("[ERROR] Can't find player in playerList");
    } else {
      console.info(`Removing player ${player.getNick()}`);
      _playersList.splice(pos, 1);
      console.info(`It remains ${_playersList.length} player(s)`);
    }
  }

  changeLobbyState(player, isReady) {
    const pos = _playersList.indexOf(player);
    const nbPlayers = _playersList.length;
    let i;

    if (pos < 0) {
      console.error("[ERROR] Can't find player in playerList");
    } else {
      // Change ready state
      _playersList[pos].setReadyState(isReady);
    }

    // PlayersManager check if players are ready
    for (i = 0; i < nbPlayers; i++) {
      // if at least one player doesn't ready, return
      if (_playersList[i].getState() == enums.PlayerState.WaitingInLobby) {
        console.info(`${_playersList[i].getNick()} is not yet ready, don't start game`);
        return;
      }
    }

    // else raise the start game event !
    this.emit('players-ready');
  }

  getPlayerList(specificState) {
    const players = new Array();
    const nbPlayers = _playersList.length;
    let i;

    for (i = 0; i < nbPlayers; i++) {
      if (specificState) {
        if (_playersList[i].getState() == specificState) players.push(_playersList[i]);
      } else players.push(_playersList[i].getPlayerObject());
    }

    return players;
  }

  getOnGamePlayerList() {
    const players = new Array();
    const nbPlayers = _playersList.length;
    let i;

    for (i = 0; i < nbPlayers; i++) {
      if (_playersList[i].getState() == enums.PlayerState.Playing || _playersList[i].getState() == enums.PlayerState.Died)
        players.push(_playersList[i].getPlayerObject());
    }

    return players;
  }

  getNumberOfPlayers() {
    return _playersList.length;
  }

  updatePlayers(time) {
    const nbPlayers = _playersList.length;
    let i;

    for (i = 0; i < nbPlayers; i++) {
      _playersList[i].update(time);
    }
  }

  arePlayersStillAlive() {
    const nbPlayers = _playersList.length;
    let i;

    for (i = 0; i < nbPlayers; i++) {
      if (_playersList[i].getState() == enums.PlayerState.Playing) return true;
    }

    return false;
  }

  resetPlayersForNewGame() {
    const nbPlayers = _playersList.length;
    let i;
    const updatedList = new Array();

    // reset position counter
    _posOnGrid = 0;

    for (i = 0; i < nbPlayers; i++) {
      _playersList[i].preparePlayer(_posOnGrid++);
      updatedList.push(_playersList[i].getPlayerObject());
    }

    return updatedList;
  }

  sendPlayerScore() {
    const nbPlayers = _playersList.length;
    let i;

    // Save player score
    for (i = 0; i < nbPlayers; i++) {
      _scores.savePlayerScore(_playersList[i], _playersList[i].getScore());
      console.log(_playersList[i]._rank);
    }

    // Retreive highscores and then send scores to players
    _scores.getHighScores(highScores => {
      const nbPlayers = _playersList.length;
      let i;

      // Send score to the players
      for (i = 0; i < nbPlayers; i++) {
        _playersList[i].sendScore(nbPlayers, highScores);
      }
    });
  }

  prepareNewPlayer(player, nickname) {
    // Set his nickname
    player.setNick(nickname);

    // retreive his highscore
    _scores.setPlayerHighScore(player);

    // Put him on the game grid
    player.preparePlayer(_posOnGrid++);
  }
}

util.inherits(PlayersManager, EventEmitter);

export default PlayersManager;
