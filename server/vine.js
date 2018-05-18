import { config as Config } from '../config';

class Vine {
  constructor(lastVinePosX) {
    this._vineTinyObject = {
      id: new Date().getTime(),
      posX: lastVinePosX + Config.DISTANCE_BETWEEN_VINES,
      posY: Math.floor(
        Math.random() * (Config.MAX_VINE_HEIGHT - Config.HEIGHT_BETWEEN_VINES - Config.MIN_VINE_HEIGHT + 1) +
          Config.MIN_VINE_HEIGHT
      )
    };
  }

  update(timeLapse) {
    this._vineTinyObject.posX -= Math.floor(timeLapse * Config.LEVEL_SPEED);
  }

  canBeDroped() {
    if (this._vineTinyObject.posX + Config.VINE_WIDTH < 0) return true;
    return false;
  }

  getVineObject() {
    return this._vineTinyObject;
  }
}

export default Vine;
