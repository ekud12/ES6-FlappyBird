const NUMBER_OF_HIGHSCORES_TO_RETREIVE = 10;

/*
* This class will store the best score of all players.
* It will try to reach a DB by default (best way to store datas). But if you don't have a MySQL server or if the class
* can't establish a connection, player's score will be store in an array (but values will be lost on server shutdown !)
* 
*/
class ScoreSystem {
  constructor() {
    this._bestScore = [];
  }

  setPlayerHighScore(player) {
    let nick = player.getNick();
    if (typeof this._bestScore[nick] != 'undefined') player.setBestScore(this._bestScore[nick]);
    else player.setBestScore(0);
  }

  savePlayerScore(player, lastScore) {
    let nick = player.getNick();
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
    nbRes = this._bestScore.length > NUMBER_OF_HIGHSCORES_TO_RETREIVE ? NUMBER_OF_HIGHSCORES_TO_RETREIVE : this._bestScore.length;

    for (key in this._bestScore) {
      hsArray.push({ player: key, score: this._bestScore[key] });
    }

    callback(hsArray);
  }
}

export default ScoreSystem;
