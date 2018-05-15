import Player from './playerEntity.js';
let _playerList;
let _keyMatching;
let _currentPlayer;

class PlayerManager {
  constructor() {
    _playerList = new Array();
    _keyMatching = new Array();
  }

  addPlayer(infos, playerID) {
    let player;
    if (this.getPlayerFromId(infos.id) !== null) {
      console.log(`${infos.nick} is already in the list ! Adding aborted`);
      return;
    }
    player = new Player(infos, playerID);
    _playerList.push(player);
    _keyMatching[infos.id] = _playerList.length - 1;
    console.log(`[${player.getNick()}] just join the game !`);
    console.log(player);
    if (player.isCurrentPlayer() == true) {
      _currentPlayer = _playerList.length - 1;
      console.log("Hey, it's me !");
    }
  }

  removePlayer(player) {
    const pos = _keyMatching[player.id];
    let i;
    if (typeof pos == 'undefined') {
      console.log("Can't find the disconected player in list");
    } else {
      console.log(`Removing ${_playerList[pos].getNick()}`);
      _playerList.splice(pos, 1);
      _keyMatching = new Array();
      for (i = 0; i < _playerList.length; i++) {
        _keyMatching[_playerList[i].getId()] = i;
        if (_playerList[i].isCurrentPlayer() == true) _currentPlayer = i;
      }
    }
  }

  updatePlayerListFromServer(playerlistUpdated) {
    const nbUpdates = playerlistUpdated.length;
    let i;
    for (i = 0; i < nbUpdates; i++) {
      _playerList[_keyMatching[playerlistUpdated[i].id]].updateFromServer(playerlistUpdated[i]);
    }
  }

  getPlayers() {
    return _playerList;
  }

  getCurrentPlayer() {
    return _playerList[_currentPlayer];
  }

  getPlayerFromId(playerID) {
    const nbPlayers = _playerList.length;
    let i;
    for (i = 0; i < nbPlayers; i++) {
      if (_playerList[i].getId() === playerID) return _playerList[i];
    }
    console.log("Can't find player in list");
    return null;
  }
}

export default PlayerManager;
