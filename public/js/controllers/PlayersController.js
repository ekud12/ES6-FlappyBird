import Player from '../models/Player.model.js';
import { map, filter, switchMap } from 'rxjs/operators';
let players;
let playersMap;
let activePlayer;
class PlayersController {
  constructor() {
    players = new Array();
    playersMap = new Array();
  }

  addPlayer(data, p_id) {
    let player;
    if (this.findPlayer(data.id) !== null) {
      return;
    }

    player = new Player(data, p_id);
    players.push(player);
    playersMap[data.id] = players.length - 1;
    if (player.isCurrentPlayer() == true) {
      activePlayer = players.length - 1;
    }
  }

  removePlayer(player) {
    const index = playersMap[player.id];
    if (!(typeof index == 'undefined')) {
      players.splice(index, 1);
      playersMap = new Array();
      for (let i = 0; i < players.length; i++) {
        playersMap[players[i].getId()] = i;
        if (players[i].isCurrentPlayer() == true) activePlayer = i;
      }
    }
  }

  updatePlayerListFromServer(playersData) {
    for (let i = 0; i < playersData.length; i++) {
      players[playersMap[playersData[i].id]].updateFromServer(playersData[i]);
    }
  }

  getPlayers() {
    return players;
  }

  getCurrentPlayer() {
    return players[activePlayer];
  }

  findPlayer(playerID) {
    this.players.map(val => {
      if (val.getId() === playerID) return val;
    });
    return null;
  }
}

export default PlayersController;
