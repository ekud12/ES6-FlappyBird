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
    this.speed = 0;
    this.ranking = 1;
    this.latestVineId = 0;
    this.color = color;
    this._playerTinyObject = {
      id: uid,
      nick: '',
      rotation: 0,
      score: 0,
      best_score: 0,
      state: Config.PlayerState.NoState,
      XCoordinate: 0,
      YCoordinate: 0
    };
  }

  update(timeLapse) {
    // console.info('Update player ' + this._playerTinyObject.nick);

    // If player is still alive, update its Y position
    if (this._playerTinyObject.state === Config.PlayerState.InProgress) {
      // calc now Y pos
      this.speed += GRAVITY_SPEED;
      this._playerTinyObject.YCoordinate += Math.round(timeLapse * this.speed);

      // Calc rotation
      this._playerTinyObject.rotation += Math.round(this.speed * ROTATION_SPEED);
      if (this._playerTinyObject.rotation > MIN_ROTATION) this._playerTinyObject.rotation = MIN_ROTATION;
    }
    // If he's died, update it's X position
    else if (this._playerTinyObject.state === Config.PlayerState.Dead) {
      this._playerTinyObject.XCoordinate -= Math.floor(timeLapse * Config.SPEED);
    } else {
      // console.info(this._playerTinyObject.nick + " doesn't move because he's in state " + this._playerTinyObject.state);
    }
  }

  jump() {
    this.speed = JUMP_SPEED;
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
    this.ranking = nbPlayersLeft;
    this._playerTinyObject.state = Config.PlayerState.Dead;

    console.info(`OMG ! They kill ${this._playerTinyObject.nick} :p`);
  }

  setReadyState(readyState) {
    this._playerTinyObject.state = readyState === true ? Config.PlayerState.InProgress : Config.PlayerState.WaitingForGameStart;
    console.info(
      `${this._playerTinyObject.nick} is ${
        this._playerTinyObject.state === Config.PlayerState.InProgress ? 'ready !' : 'not yet ready'
      }`
    );
  }

  setBestScore(score) {
    this._playerTinyObject.best_score = score;
    console.info(`${this._playerTinyObject.nick} just beat his highscore to ${score}`);
  }

  isReadyToPlay() {
    if (this._playerTinyObject.state === Config.PlayerState.InProgress) return true;
    return false;
  }

  getPlayerObject() {
    return this._playerTinyObject;
  }
  getPlayerRank() {
    return this.ranking;
  }

  preparePlayer(pos) {
    let line;
    let col;
    let randomMoveX;

    // Place bird on the departure grid
    line = Math.floor(pos / 6);
    col = Math.floor(pos % 6);
    randomMoveX = Math.floor(Math.random() * (SPACE_BETWEEN_BIRDS_X / 2 + 1));
    this._playerTinyObject.YCoordinate = START_BIRD_POS_Y + line * SPACE_BETWEEN_BIRDS_Y;
    this._playerTinyObject.XCoordinate = START_BIRD_POS_X + col * SPACE_BETWEEN_BIRDS_X + randomMoveX;

    // Reset usefull values
    this.speed = 0;
    this.ranking = 0;
    this._playerTinyObject.score = 0;
    this._playerTinyObject.rotation = 0;
    // Update all register players
    if (this._playerTinyObject.nick != '') this._playerTinyObject.state = Config.PlayerState.WaitingForGameStart;
  }

  updateScore(vineID) {
    if (vineID != this.latestVineId) {
      this._playerTinyObject.score++;
      this.latestVineId = vineID;
    }
  }

  // sendScore(NBPlayers, HighScores) {
  //   // Update player best score if he just make a new one !
  //   if (this._playerTinyObject.score > this._playerTinyObject.best_score) {
  //     this._playerTinyObject.best_score = this._playerTinyObject.score;
  //   }

  //   // Send him complete we_have_a_winner
  //   this.socketId.emit("we_have_a_winner", {
  //     score: this._playerTinyObject.score,
  //     bestScore: this._playerTinyObject.best_score,
  //     rank: this.ranking,
  //     nbPlayers: NBPlayers,
  //     highscores: HighScores
  //   });
  // }

  sendWinner(winner, score) {
    this.socketId.emit('we_have_a_winner', {
      winner: winner,
      score: score
    });
  }
}

export default Player;
