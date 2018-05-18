import { config as Config } from '../../config.js';

class Player {
  constructor(data, userId) {
    this.playerData = data;
    this.isSelf = false;
    if (userId && userId == data.id) {
      this.isSelf = true;
    }
  }
  draw(cnvsCTX, time, spriteList, gameState) {
    let frameNumber;
    let nickPos;
    if (this.playerData.state == Config.PlayerState.Unset) {
      return;
    } else if (this.playerData.state == Config.PlayerState.WaitingInLobby && gameState == 2) {
      return;
    } else {
      cnvsCTX.save();
      if (this.isSelf === false) {
        cnvsCTX.configAlpha = 0.3;
        cnvsCTX.font = '15px Quantico';
        cnvsCTX.fillStyle = 'green';
        nickPos = this.playerData.posX + Config.BIRD_WIDTH / 2 - cnvsCTX.measureText(`${this.playerData.nick}`).width / 2;
        cnvsCTX.fillText(`${this.playerData.nick}`, nickPos, this.playerData.posY - 20);
      }
      cnvsCTX.translate(this.playerData.posX + Config.BIRD_WIDTH / 2, this.playerData.posY + Config.BIRD_HEIGHT / 2);
      cnvsCTX.rotate(this.playerData.rotation * Math.PI / 180);
      if (this.playerData.state == Config.PlayerState.WaitingInLobby) {
        cnvsCTX.drawImage(
          spriteList[this.playerData.color],
          0,
          0,
          Config.SPRITE_BIRD_WIDTH,
          Config.SPRITE_BIRD_HEIGHT,
          -(Config.BIRD_WIDTH / 2),
          -(Config.BIRD_HEIGHT / 2),
          Config.BIRD_WIDTH,
          Config.BIRD_HEIGHT
        );
      } else {
        frameNumber = Math.round(time / Config.COMPLETE_ANNIMATION_DURATION) % Config.ANIMATION_FRAME_NUMBER;
        cnvsCTX.drawImage(
          spriteList[this.playerData.color],
          frameNumber * Config.SPRITE_BIRD_WIDTH,
          0,
          Config.SPRITE_BIRD_WIDTH,
          Config.SPRITE_BIRD_HEIGHT,
          -(Config.BIRD_WIDTH / 2),
          -(Config.BIRD_HEIGHT / 2),
          Config.BIRD_WIDTH,
          Config.BIRD_HEIGHT
        );
      }
    }
    cnvsCTX.restore();
  }

  updateData(data) {
    this.playerData = data;
  }

  isCurrentPlayer() {
    return this.isSelf;
  }

  getId() {
    return this.playerData.id;
  }

  getPlayerName() {
    return this.playerData.nick;
  }

  getPlayerScore() {
    return this.playerData.score;
  }

  isPlayerReady(readyState) {
    this.playerData.state = readyState === true ? Config.PlayerState.Ready : Config.PlayerState.WaitingInLobby;
  }
}

export default Player;
