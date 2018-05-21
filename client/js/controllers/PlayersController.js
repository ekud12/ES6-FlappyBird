import Player from "../models/Player.model.js";

let players;
let playersMap;
let activePlayer;

export default class PlayersController {
  constructor() {
    players = new Array();
    playersMap = new Array();
  }

  addPlayer(data, p_id) {
    let player;
    if (this.getPlayerByID(data.id) !== null) {
      return;
    }
    player = new Player(data, p_id);
    players.push(player);
    playersMap[data.id] = players.length - 1;
    if (player.isCurrentPlayer() === true) {
      activePlayer = players.length - 1;
    }
  }

  deletePlayer(player) {
    const index = playersMap[player.id];
    if (!(typeof index === "undefined")) {
      players.splice(index, 1);
      playersMap = new Array();
      for (let i = 0; i < players.length; i++) {
        playersMap[players[i].getId()] = i;
        if (players[i].isCurrentPlayer() === true) activePlayer = i;
      }
    }
  }

  refreshPList(playersData) {
    for (let i = 0; i < playersData.length; i++) {
      players[playersMap[playersData[i].id]].updateData(playersData[i]);
    }
  }

  getPlayerByID(playerID) {
    for (let i = 0; i < players.length; i++) {
      if (players[i].getId() === playerID) return players[i];
    }
    return null;
  }

  getAllPlayers() {
    return players;
  }

  getActivePlayer() {
    return players[activePlayer];
  }
}
