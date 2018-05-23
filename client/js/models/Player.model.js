import { config as Config } from '../../config.js';

class Player {
  constructor(data, userId) {
    this.playerData = data;
    this.isSelf = false;
    if (userId === data.id) {
      this.isSelf = true;
    }
  }
  render(cnvsCTX, time, spriteAssetsSrcs, state) {
    let frameNumber;
    let pName;
    if (this.playerData.state === Config.PlayerState.NoState) {
      return;
    } else if (this.playerData.state === Config.PlayerState.WaitingForGameStart && state === 2) {
      return;
    } else {
      cnvsCTX.save();
      if (this.isSelf === false) {
        cnvsCTX.configAlpha = 0.5;
        cnvsCTX.font = '20px Quantico';
        cnvsCTX.fillStyle = 'green';
        pName =
          this.playerData.XCoordinate + Config.TOUCAN_RENDER_WIDTH / 2 - cnvsCTX.measureText(`${this.playerData.name}`).width / 2;
        cnvsCTX.fillText(`${this.playerData.name}`, pName, this.playerData.YCoordinate - 20);
      }
      cnvsCTX.translate(
        this.playerData.XCoordinate + Config.TOUCAN_RENDER_WIDTH / 2,
        this.playerData.YCoordinate + Config.TOUCAN_RENDER_HEIGHT / 2
      );
      cnvsCTX.rotate(this.playerData.rotation * Math.PI / 180);
      if (this.playerData.state === Config.PlayerState.WaitingForGameStart) {
        cnvsCTX.drawImage(
          spriteAssetsSrcs[this.playerData.color],
          0,
          0,
          Config.TOUCAN_SPR_SRC_W,
          Config.TOUCAN_SPR_SRC_H,
          -(Config.TOUCAN_RENDER_WIDTH / 2),
          -(Config.TOUCAN_RENDER_HEIGHT / 2),
          Config.TOUCAN_RENDER_WIDTH,
          Config.TOUCAN_RENDER_HEIGHT
        );
      } else {
        if (this.isSelf === false) {
          cnvsCTX.shadowBlur = 20;
          cnvsCTX.shadowColor = 'red';
        } else {
          cnvsCTX.shadowBlur = 20;
          cnvsCTX.shadowColor = 'white';
        }
        frameNumber = Math.round(time / 200) % 4;
        cnvsCTX.drawImage(
          spriteAssetsSrcs[this.playerData.color],
          frameNumber * Config.TOUCAN_SPR_SRC_W,
          0,
          Config.TOUCAN_SPR_SRC_W,
          Config.TOUCAN_SPR_SRC_H,
          -(Config.TOUCAN_RENDER_WIDTH / 2),
          -(Config.TOUCAN_RENDER_HEIGHT / 2),
          Config.TOUCAN_RENDER_WIDTH,
          Config.TOUCAN_RENDER_HEIGHT
        );
      }
    }
    cnvsCTX.restore();
  }

  updatePlayerData(data) {
    this.playerData = data;
  }

  isCurrentPlayer() {
    return this.isSelf;
  }

  getId() {
    return this.playerData.id;
  }

  getPlayerName() {
    return this.playerData.name;
  }

  getPlayerScore() {
    return this.playerData.score;
  }

  isPlayerReady(readyState) {
    this.playerData.state = readyState === true ? Config.PlayerState.Ready : Config.PlayerState.WaitingForGameStart;
  }
}

export default Player;
