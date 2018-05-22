import Player from "../models/Player.model.js";

let players;
let playersIndices;
let activePlayer;

export default class PlayersController {
  constructor() {
    players = new Array();
    playersIndices = new Array();
  }

  addPlayer(data, p_id) {
    console.log(data);
    let player;
    if (this.getPlayerByID(data.id) !== null) {
      return;
    }
    player = new Player(data, p_id);
    players.push(player);
    playersIndices[data.id] = players.length - 1;
    if (player.isCurrentPlayer() === true) {
      activePlayer = players.length - 1;
    }
  }

  deletePlayer(player) {
    const index = playersIndices[player.id];
    if (!(typeof index === "undefined")) {
      players.splice(index, 1);
      playersIndices = new Array();
      for (let i = 0; i < players.length; i++) {
        playersIndices[players[i].getId()] = i;
        if (players[i].isCurrentPlayer() === true) activePlayer = i;
      }
    }
  }

  refreshPList(playersData) {
    for (let i = 0; i < playersData.length; i++) {
      players[playersIndices[playersData[i].id]].updateData(playersData[i]);
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
