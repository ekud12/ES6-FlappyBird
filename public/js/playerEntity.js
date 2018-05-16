import { constant as Const } from '../../global.js';
const enumPlayerState = {
  Unset: 1,
  WaitingInLobby: 2,
  Playing: 3,
  Died: 4
};
const SPRITE_BIRD_HEIGHT = 64;
const SPRITE_BIRD_WIDTH = 64;
const COMPLETE_ANNIMATION_DURATION = 250;
const ANIMATION_FRAME_NUMBER = 4;

class Player {
  constructor(infos, uuid) {
    this._serverInfos = infos;
    this._isMe = false;
    if (uuid && uuid == infos.id) {
      this._isMe = true;
      console.log(`Adding player ${infos.nick}`);
    }
  }

  draw(ctx, time, spriteList, gameState) {
    let frameNumber;
    let nickPos;
    if (this._serverInfos.state == enumPlayerState.Unset) {
      return;
    } else if (this._serverInfos.state == enumPlayerState.WaitingInLobby && gameState == 2) {
      return;
    } else {
      ctx.save();
      if (this._isMe === false) {
        ctx.globalAlpha = 0.6;
        ctx.font = '25px Quantico';
        ctx.fillStyle = '#FFA24A';
        nickPos =
          this._serverInfos.posX +
          Const.BIRD_WIDTH / 2 -
          ctx.measureText(`${this._serverInfos.nick} (${this._serverInfos.best_score})`).width / 2;
        ctx.fillText(`${this._serverInfos.nick} (${this._serverInfos.best_score})`, nickPos, this._serverInfos.posY - 20);
      }
      ctx.translate(this._serverInfos.posX + Const.BIRD_WIDTH / 2, this._serverInfos.posY + Const.BIRD_HEIGHT / 2);
      ctx.rotate(this._serverInfos.rotation * Math.PI / 180);
      if (this._serverInfos.state == enumPlayerState.WaitingInLobby) {
        ctx.drawImage(
          spriteList[this._serverInfos.color],
          0,
          0,
          SPRITE_BIRD_WIDTH,
          SPRITE_BIRD_HEIGHT,
          -(Const.BIRD_WIDTH / 2),
          -(Const.BIRD_HEIGHT / 2),
          Const.BIRD_WIDTH,
          Const.BIRD_HEIGHT
        );
      } else {
        frameNumber = Math.round(time / COMPLETE_ANNIMATION_DURATION) % ANIMATION_FRAME_NUMBER;
        ctx.drawImage(
          spriteList[this._serverInfos.color],
          frameNumber * SPRITE_BIRD_WIDTH,
          0,
          SPRITE_BIRD_WIDTH,
          SPRITE_BIRD_HEIGHT,
          -(Const.BIRD_WIDTH / 2),
          -(Const.BIRD_HEIGHT / 2),
          Const.BIRD_WIDTH,
          Const.BIRD_HEIGHT
        );
      }
    }
    ctx.restore();
  }

  updateFromServer(infos) {
    this._serverInfos = infos;
  }

  isCurrentPlayer() {
    return this._isMe;
  }

  getId() {
    return this._serverInfos.id;
  }

  getNick() {
    return this._serverInfos.nick;
  }

  getScore() {
    return this._serverInfos.score;
  }

  updateReadyState(readyState) {
    this._serverInfos.state = readyState === true ? enumPlayerState.Ready : enumPlayerState.WaitingInLobby;
    console.log(`${this._serverInfos.nick} is ${this._serverInfos.state == enumPlayerState.Ready ? 'ready !' : 'not yet ready'}`);
  }
}

export default Player;
