import { config as Config } from '../config';
import * as enums from './enums';

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
    this._socket = socket;
    this._speedY = 0;
    this._rank = 1;
    this._lastPipe = 0;
    this._playerTinyObject = {
      id: uid,
      nick: '',
      color,
      rotation: 0,
      score: 0,
      best_score: 0,
      state: enums.PlayerState.OnLoginScreen,
      posX: 0,
      posY: 0
    };
  }

  update(timeLapse) {
    // console.info('Update player ' + this._playerTinyObject.nick);

    // If player is still alive, update its Y position
    if (this._playerTinyObject.state == enums.PlayerState.InProgress) {
      // calc now Y pos
      this._speedY += GRAVITY_SPEED;
      this._playerTinyObject.posY += Math.round(timeLapse * this._speedY);

      // Calc rotation
      this._playerTinyObject.rotation += Math.round(this._speedY * ROTATION_SPEED);
      if (this._playerTinyObject.rotation > MIN_ROTATION) this._playerTinyObject.rotation = MIN_ROTATION;
    }
    // If he's died, update it's X position
    else if (this._playerTinyObject.state == enums.PlayerState.Dead) {
      this._playerTinyObject.posX -= Math.floor(timeLapse * Config.LEVEL_SPEED);
    } else {
      // console.info(this._playerTinyObject.nick + " doesn't move because he's in state " + this._playerTinyObject.state);
    }
  }

  jump() {
    this._speedY = JUMP_SPEED;
    this._playerTinyObject.rotation = MAX_ROTATION;
  }

  getPlayerName() {
    return this._playerTinyObject.nick;
  }

  setNick(nick) {
    this._playerTinyObject.nick = nick;
    console.info(`Please call me [${nick}] !`);
  }

  getID() {
    return this._playerTinyObject.id;
  }

  getState() {
    return this._playerTinyObject.state;
  }

  getScore() {
    return this._playerTinyObject.score;
  }

  getHighScore() {
    return this._playerTinyObject.best_score;
  }

  sorryYouAreDie(nbPlayersLeft) {
    this._rank = nbPlayersLeft;
    this._playerTinyObject.state = enums.PlayerState.Dead;

    console.info(`OMG ! They kill ${this._playerTinyObject.nick} :p`);
  }

  setReadyState(readyState) {
    this._playerTinyObject.state = readyState == true ? enums.PlayerState.InProgress : enums.PlayerState.WaitingForGameStart;
    console.info(
      `${this._playerTinyObject.nick} is ${
        this._playerTinyObject.state == enums.PlayerState.InProgress ? 'ready !' : 'not yet ready'
      }`
    );
  }

  setBestScore(score) {
    this._playerTinyObject.best_score = score;
    console.info(`${this._playerTinyObject.nick} just beat his highscore to ${score}`);
  }

  isReadyToPlay() {
    if (this._playerTinyObject.state == enums.PlayerState.InProgress) return true;
    return false;
  }

  getPlayerObject() {
    return this._playerTinyObject;
  }
  getPlayerRank() {
    return this._rank;
  }

  preparePlayer(pos) {
    let line;
    let col;
    let randomMoveX;

    // Place bird on the departure grid
    line = Math.floor(pos / MAX_BIRDS_IN_A_ROW);
    col = Math.floor(pos % MAX_BIRDS_IN_A_ROW);
    randomMoveX = Math.floor(Math.random() * (SPACE_BETWEEN_BIRDS_X / 2 + 1));
    this._playerTinyObject.posY = START_BIRD_POS_Y + line * SPACE_BETWEEN_BIRDS_Y;
    this._playerTinyObject.posX = START_BIRD_POS_X + col * SPACE_BETWEEN_BIRDS_X + randomMoveX;

    // Reset usefull values
    this._speedY = 0;
    this._rank = 0;
    this._playerTinyObject.score = 0;
    this._playerTinyObject.rotation = 0;
    // Update all register players
    if (this._playerTinyObject.nick != '') this._playerTinyObject.state = enums.PlayerState.WaitingForGameStart;
  }

  updateScore(pipeID) {
    // If the current pipe ID is different from the last one, it means the players meets a new pipe. So update score
    if (pipeID != this._lastPipe) {
      this._playerTinyObject.score++;
      this._lastPipe = pipeID;
    }
  }

  sendScore(NBPlayers, HighScores) {
    // Update player best score if he just make a new one !
    if (this._playerTinyObject.score > this._playerTinyObject.best_score) {
      this._playerTinyObject.best_score = this._playerTinyObject.score;
    }

    // Send him complete we_have_a_winner
    this._socket.emit('we_have_a_winner', {
      score: this._playerTinyObject.score,
      bestScore: this._playerTinyObject.best_score,
      rank: this._rank,
      nbPlayers: NBPlayers,
      highscores: HighScores
    });
  }

  sendWinner(winner, score) {
    // Update player best score if he just make a new one !
    // if (this._playerTinyObject.score > this._playerTinyObject.best_score) {
    //   this._playerTinyObject.best_score = this._playerTinyObject.score;
    // }

    // Send him complete we_have_a_winner
    console.log(winner);
    console.log(score);
    this._socket.emit('we_have_a_winner', {
      winner: winner,
      score: score
    });
  }
}

export default Player;
