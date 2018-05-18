class ScoringController {
  constructor() {
    this._bestScore = [];
  }

  setPlayerHighScore(player) {
    let nick = player.getPlayerName();
    if (typeof this._bestScore[nick] != 'undefined') player.setBestScore(this._bestScore[nick]);
    else player.setBestScore(0);
  }

  savePlayerScore(player, lastScore) {
    let nick = player.getPlayerName();
    const highScore = player.getHighScore();
    if (lastScore > highScore) {
      this._bestScore[nick] = lastScore;
      console.info(`${nick} new high score (${lastScore}) was saved in the score array !`);
    }
  }

  getHighScores(callback) {
    let hsArray = null;
    let nbRes;
    let key;

    // Sort tab
    this._bestScore.sort((a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    });

    // Return the NUMBER_OF_HIGHSCORES_TO_RETREIVE best scores
    hsArray = [];
    nbRes = this._bestScore.length;

    for (key in this._bestScore) {
      hsArray.push({ player: key, score: this._bestScore[key] });
    }

    callback(hsArray);
  }
}

export default ScoringController;
