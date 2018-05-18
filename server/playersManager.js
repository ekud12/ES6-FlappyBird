import { EventEmitter } from 'events';
import util from 'util';
import * as enums from './enums';
import Player from './player';

const _playersList = new Array();
let _posOnGrid = 0;

class PlayersManager {
  constructor() {
    EventEmitter.call(this);
  }

  addNewPlayer(playerSocket, id) {
    let newPlayer;
    let newPlayerAvatarColor;

    // Set an available color according the number of client's sprites
    newPlayerAvatarColor = Math.floor(Math.random() * 4);

    // Create new player and add it in the list
    newPlayer = new Player(playerSocket, id, newPlayerAvatarColor);
    _playersList.push(newPlayer);

    console.info(`New player connected. There is currently ${_playersList.length} player(s)`);

    return newPlayer;
  }

  deletePlayer(player) {
    const pos = _playersList.indexOf(player);

    if (pos < 0) {
      console.error("[ERROR] Can't find player in playerList");
    } else {
      console.info(`Removing player ${player.getPlayerName()}`);
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
      if (_playersList[i].getState() == enums.PlayerState.WaitingForGameStart) {
        console.info(`${_playersList[i].getPlayerName()} is not yet ready, don't start game`);
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
      if (_playersList[i].getState() == enums.PlayerState.InProgress || _playersList[i].getState() == enums.PlayerState.Dead)
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
      if (_playersList[i].getState() == enums.PlayerState.InProgress) return true;
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
    let winner;
    for (i = 0; i < nbPlayers; i++) {
      if (_playersList[i].getPlayerRank()) {
        winner = _playersList[i].getPlayerName();
      }
    }
    /**
     * Send Winner to all
     */
    for (i = 0; i < nbPlayers; i++) {
      _playersList[i].sendWinner(winner);
    }
  }

  sendWinner() {
    let winner, score;
    let i;
    for (i = 0; i < _playersList.length; i++) {
      if (_playersList[i].getPlayerRank() === 1) {
        winner = _playersList[i].getPlayerName();
        score = _playersList[i].getPlayerObject().score;
      }
    }
    for (i = 0; i < _playersList.length; i++) {
      _playersList[i].sendWinner(winner, score);
    }
  }

  prepareNewPlayer(player, nickname) {
    // Set his nickname
    player.setNick(nickname);

    // Put him on the game grid
    player.preparePlayer(_posOnGrid++);
  }
}

util.inherits(PlayersManager, EventEmitter);

export default PlayersManager;
