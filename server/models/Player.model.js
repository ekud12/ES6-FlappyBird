import { config as Config } from '../../config';

class Player {
  constructor(socket, newID, newColor) {
    this.playerVars = {
      id: newID,
      name: '',
      X: 0,
      Y: 0,
      rotation: 0,
      color: newColor,
      score: 0,
      state: Config.PlayerState.NoState
    };
    this.socketHandler = socket;
    this.speed = 0;
    this.ranking = 1;
    this.latestVineId = 0;
  }

  initPlayerVars(position) {
    let yGrid = Math.floor(position / 10);
    let xGrid = Math.floor(position % 10);
    let randomGridPositionForToucan = Math.floor(Math.random() * (150 / 2 + 1));
    this.playerVars.Y = 100 + yGrid * 100;
    this.playerVars.X = 100 + xGrid * 150 + randomGridPositionForToucan;
    this.playerVars.score = 0;
    this.playerVars.rotation = 0;
    this.speed = 0;
    this.ranking = 0;
    if (this.playerVars.name != '' && this.playerVars.name != ' ' && this.playerVars.name != 'Your Name')
      this.playerVars.state = Config.PlayerState.WaitingForGameStart;
  }

  refreshPlayerProgress(time) {
    if (this.playerVars.state === Config.PlayerState.InProgress) {
      this.speed += 0.04;
      this.playerVars.Y += Math.round(time * this.speed);
      this.playerVars.rotation += Math.round(this.speed * 6);
      if (this.playerVars.rotation > 10) this.playerVars.rotation = 10;
    } else if (this.playerVars.state === Config.PlayerState.Dead) {
      this.playerVars.X -= Math.floor(time * Config.SPEED);
    }
  }

  updatePlayerScore(vineID) {
    if (vineID != this.latestVineId) {
      this.playerVars.score++;
      this.latestVineId = vineID;
    }
  }

  sendWinner(winner, score) {
    this.socketHandler.emit('we_have_a_winner', {
      winner: winner,
      score: score
    });
  }

  action() {
    this.speed = -0.4;
    this.playerVars.rotation = -7;
  }

  setPlayerIsDead(totalPlayersStillInGame) {
    this.ranking = totalPlayersStillInGame;
    this.playerVars.state = Config.PlayerState.Dead;
  }

  setReadyState(readyState) {
    this.playerVars.state = readyState === true ? Config.PlayerState.InProgress : Config.PlayerState.WaitingForGameStart;
  }

  isReadyToPlay() {
    if (this.playerVars.state === Config.PlayerState.InProgress) return true;
    return false;
  }

  /**
   * Getters and Setters
   */

  getPlayerVars() {
    return this.playerVars;
  }

  getPlayerRanking() {
    return this.ranking;
  }

  getPlayerName() {
    return this.playerVars.name;
  }

  setName(name) {
    this.playerVars.name = name;
  }

  getId() {
    return this.playerVars.id;
  }

  getState() {
    return this.playerVars.state;
  }

  getScore() {
    return this.playerVars.score;
  }
}

export default Player;
