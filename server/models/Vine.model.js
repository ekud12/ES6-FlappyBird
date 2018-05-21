import { config as Config } from "../../config";
class Vine {
  constructor(lastVinePosX) {
    this._vineTinyObject = {
      id: new Date().getTime(),
      XCoordinate: lastVinePosX + 380,
      YCoordinate: Math.floor(
        Math.random() *
          (Config.MAX_VINE_HEIGHT -
            Config.HEIGHT_BETWEEN_VINES -
            Config.MIN_VINE_HEIGHT +
            1) +
          Config.MIN_VINE_HEIGHT
      )
    };
  }

  update(timeLapse) {
    this._vineTinyObject.XCoordinate -= Math.floor(timeLapse * Config.SPEED);
  }

  canBeDroped() {
    if (this._vineTinyObject.XCoordinate + Config.VINE_WIDTH < 0) return true;
    return false;
  }

  getVineObject() {
    return this._vineTinyObject;
  }
}

export default Vine;
