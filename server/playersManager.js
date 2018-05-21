import { EventEmitter } from "events";
import { config as Config } from "../config";
import util from "util";

import Player from "./models/Player.model";

let _playersList = new Array();
let _posOnGrid = 0;

class PlayersManager {
  constructor() {
    EventEmitter.call(this);
  }

  addPlayer(playerSocket, id) {
    let newPlayerAvatarColor = Math.floor(Math.random() * 4);
    // Create new player and add it in the list
    let newPlayer = new Player(playerSocket, id, newPlayerAvatarColor);
    _playersList.push(newPlayer);
    console.info(`New player Added! (id: ${id}))`);
    return newPlayer;
  }

  removePlayer(player) {
    let pIndex = _playersList.indexOf(player);
    if (pIndex >= 0) {
      _playersList.splice(pIndex, 1);
      console.info(`Removed Player ${player.getPlayerName()} from Game.`);
    }
  }

  checkAllPlayersReady(player, isReady) {
    const pIndex = _playersList.indexOf(player);
    // const nbPlayers = _playersList.length;
    // let i;

    if (pIndex >= 0) {
      _playersList[pIndex].setReadyState(isReady);
    }

    for (let i = 0; i < _playersList.length; i++) {
      if (
        _playersList[i].getState() === Config.PlayerState.WaitingForGameStart
      ) {
        console.info(
          `Waiting for ${_playersList[i].getPlayerName()} to be Ready.`
        );
        return;
      }
    }

    this.emit("all-players-ready-to-play");
  }

  getPlayerList(specificState) {
    let resultSet = new Array();

    for (let i = 0; i < _playersList.length; i++) {
      if (specificState) {
        if (_playersList[i].getState() === specificState)
          resultSet.push(_playersList[i]);
      } else resultSet.push(_playersList[i].getPlayerObject());
    }

    return resultSet;
  }

  getOnGamePlayerList() {
    const resultSet = new Array();
    for (let i = 0; i < _playersList.length; i++) {
      if (
        _playersList[i].getState() === Config.PlayerState.InProgress ||
        _playersList[i].getState() === Config.PlayerState.Dead
      )
        resultSet.push(_playersList[i].getPlayerObject());
    }

    return resultSet;
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
      if (_playersList[i].getState() === Config.PlayerState.InProgress)
        return true;
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
