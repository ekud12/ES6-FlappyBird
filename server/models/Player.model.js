import { config as Config } from '../../config';

// Defines
const MAX_BIRDS_IN_A_ROW = 3;
const START_BIRD_POS_X = 100;
const SPACE_BETWEEN_BIRDS_X = 120;
const START_BIRD_POS_Y = 100;
const SPACE_BETWEEN_BIRDS_Y = 100;
const GRAVITY_SPEED = 0.05;
const JUMP_SPEED = -0.5;
const MAX_ROTATION = -6;
const MIN_ROTATION = 60;
const ROTATION_SPEED = 8;

class Player {
  constructor(socket, uid, color) {
    this.socketId = socket;
    this.playerVars = {
      id: uid,
      name: '',
      rotation: 0,
      color,
      score: 0,
      state: Config.PlayerState.NoState,
      XCoordinate: 0,
      YCoordinate: 0
    };
    this.speed = 0;
    this.ranking = 1;
    this.latestVineId = 0;
  }

  update(timeLapse) {
    if (this.playerVars.state === Config.PlayerState.InProgress) {
      // calc now Y pos
      this.speed += GRAVITY_SPEED;
      this.playerVars.YCoordinate += Math.round(timeLapse * this.speed);

      // Calc rotation
      this.playerVars.rotation += Math.round(this.speed * ROTATION_SPEED);
      if (this.playerVars.rotation > MIN_ROTATION) this.playerVars.rotation = MIN_ROTATION;
    }
    // If he's died, update it's X position
    else if (this.playerVars.state === Config.PlayerState.Dead) {
      this.playerVars.XCoordinate -= Math.floor(timeLapse * Config.SPEED);
    } else {
      // console.info(this.playerVars.name + " doesn't move because he's in state " + this.playerVars.state);
    }
  }

  preparePlayer(pos) {
    let line;
    let col;
    let randomMoveX;

    // Place bird on the departure grid
    line = Math.floor(pos / 6);
    col = Math.floor(pos % 6);
    randomMoveX = Math.floor(Math.random() * (SPACE_BETWEEN_BIRDS_X / 2 + 1));
    this.playerVars.YCoordinate = START_BIRD_POS_Y + line * SPACE_BETWEEN_BIRDS_Y;
    this.playerVars.XCoordinate = START_BIRD_POS_X + col * SPACE_BETWEEN_BIRDS_X + randomMoveX;

    // Reset usefull values
    this.speed = 0;
    this.ranking = 0;
    this.playerVars.score = 0;
    this.playerVars.rotation = 0;
    // Update all register players
    if (this.playerVars.name != '') this.playerVars.state = Config.PlayerState.WaitingForGameStart;
  }

  updateScore(vineID) {
    if (vineID != this.latestVineId) {
      this.playerVars.score++;
      this.latestVineId = vineID;
    }
  }

  sendWinner(winner, score) {
    this.socketId.emit('we_have_a_winner', {
      winner: winner,
      score: score
    });
  }

  action() {
    this.speed = JUMP_SPEED;
    this.playerVars.rotation = MAX_ROTATION;
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

  getPlayerObject() {
    return this.playerVars;
  }

  getPlayerRank() {
    return this.ranking;
  }

  getPlayerName() {
    return this.playerVars.name;
  }

  setName(name) {
    this.playerVars.name = name;
  }

  getID() {
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
