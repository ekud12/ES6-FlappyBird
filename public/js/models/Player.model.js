import { constant as Const } from '../../global.js';

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
    if (this.playerData.state == Const.enumPlayerState.Unset) {
      return;
    } else if (this.playerData.state == Const.enumPlayerState.WaitingInLobby && gameState == 2) {
      return;
    } else {
      cnvsCTX.save();
      if (this.isSelf === false) {
        cnvsCTX.globalAlpha = 0.3;
        cnvsCTX.font = '15px Quantico';
        cnvsCTX.fillStyle = 'green';
        nickPos = this.playerData.posX + Const.BIRD_WIDTH / 2 - cnvsCTX.measureText(`${this.playerData.nick}`).width / 2;
        cnvsCTX.fillText(`${this.playerData.nick}`, nickPos, this.playerData.posY - 20);
      }
      cnvsCTX.translate(this.playerData.posX + Const.BIRD_WIDTH / 2, this.playerData.posY + Const.BIRD_HEIGHT / 2);
      cnvsCTX.rotate(this.playerData.rotation * Math.PI / 180);
      if (this.playerData.state == Const.enumPlayerState.WaitingInLobby) {
        cnvsCTX.drawImage(
          spriteList[this.playerData.color],
          0,
          0,
          Const.SPRITE_BIRD_WIDTH,
          Const.SPRITE_BIRD_HEIGHT,
          -(Const.BIRD_WIDTH / 2),
          -(Const.BIRD_HEIGHT / 2),
          Const.BIRD_WIDTH,
          Const.BIRD_HEIGHT
        );
      } else {
        frameNumber = Math.round(time / Const.COMPLETE_ANNIMATION_DURATION) % Const.ANIMATION_FRAME_NUMBER;
        cnvsCTX.drawImage(
          spriteList[this.playerData.color],
          frameNumber * Const.SPRITE_BIRD_WIDTH,
          0,
          Const.SPRITE_BIRD_WIDTH,
          Const.SPRITE_BIRD_HEIGHT,
          -(Const.BIRD_WIDTH / 2),
          -(Const.BIRD_HEIGHT / 2),
          Const.BIRD_WIDTH,
          Const.BIRD_HEIGHT
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
    this.playerData.state = readyState === true ? Const.enumPlayerState.Ready : Const.enumPlayerState.WaitingInLobby;
  }
}

export default Player;
