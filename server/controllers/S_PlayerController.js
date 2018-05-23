import { EventEmitter } from 'events';
import { config as Config } from '../../config';
import util from 'util';
import Player from '../models/Player.model';

let players = new Array();
let index = 0;

class PlayersController {
  constructor() {
    EventEmitter.call(this);
  }

  addPlayer(socket, playerId) {
    let newPlayerAvatarColor = Math.floor(Math.random() * 4);
    let newPlayer = new Player(socket, playerId, newPlayerAvatarColor);
    players.push(newPlayer);
    console.info(`New player Added! (id: ${playerId}))`);
    return newPlayer;
  }
  removePlayer(player) {
    let pIndex = players.indexOf(player);
    if (pIndex >= 0) {
      players.splice(pIndex, 1);
      console.info(`Removed Player ${player.getPlayerName()} from Game.`);
    }
  }

  initPlayer(player, name) {
    player.setNick(name);
    player.preparePlayer(index++);
  }

  updatePlayers(currentTime) {
    for (let i = 0; i < this.getTotalPlayers(); i++) {
      players[i].update(currentTime);
    }
  }

  getAllPlayersForState(state) {
    let resultSet = new Array();

    for (let i = 0; i < this.getTotalPlayers(); i++) {
      if (state) {
        if (players[i].getState() === state) resultSet.push(players[i]);
      } else resultSet.push(players[i].getPlayerObject());
    }

    return resultSet;
  }

  getOnGamePlayerList() {
    const resultSet = new Array();
    for (let i = 0; i < this.getTotalPlayers(); i++) {
      if (players[i].getState() === Config.PlayerState.InProgress || players[i].getState() === Config.PlayerState.Dead)
        resultSet.push(players[i].getPlayerObject());
    }

    return resultSet;
  }

  checkAllPlayersReady(player, isReady) {
    const pIndex = players.indexOf(player);

    if (pIndex >= 0) {
      players[pIndex].setReadyState(isReady);
    }
    for (let i = 0; i < this.getTotalPlayers(); i++) {
      if (players[i].getState() === Config.PlayerState.WaitingForGameStart) {
        console.info(`Waiting for ${players[i].getPlayerName()} to be Ready.`);
        return;
      }
    }
    this.emit('all-players-ready-to-play');
  }

  anyActivePlayersLeft() {
    for (let i = 0; i < this.getTotalPlayers(); i++) {
      if (players[i].getState() === Config.PlayerState.InProgress) return true;
    }

    return false;
  }

  sendWinner() {
    let winner, score;
    let i;
    for (i = 0; i < this.getTotalPlayers(); i++) {
      if (players[i].getPlayerRank() === 1) {
        winner = players[i].getPlayerName();
        score = players[i].getPlayerObject().score;
      }
    }
    for (i = 0; i < this.getTotalPlayers(); i++) {
      players[i].sendWinner(winner, score);
    }
  }

  resetAllPlayers() {
    const resultSet = new Array();
    index = 0;
    for (let i = 0; i < this.getTotalPlayers(); i++) {
      players[i].preparePlayer(index++);
      resultSet.push(players[i].getPlayerObject());
    }
    return resultSet;
  }

  getTotalPlayers() {
    return players.length;
  }
}

util.inherits(PlayersController, EventEmitter);

export default PlayersController;
