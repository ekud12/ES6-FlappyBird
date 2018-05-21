import { config as Config } from "../../config";

class Vine {
  constructor(lastVinePosition) {
    this.id = Math.random() * 10000000000;
    this.XCoordinate = lastVinePosition + 380;
    this.YCoordinate = Math.floor(
      Math.random() *
        (Config.MAX_VINE_HEIGHT -
          Config.HEIGHT_BETWEEN_VINES -
          Config.MIN_VINE_HEIGHT +
          1) +
        Config.MIN_VINE_HEIGHT
    );
  }

  isOutOfScope() {
    if (this.XCoordinate + Config.VINE_WIDTH < 0) return true;
    return false;
  }

  changePosition(time) {
    this.XCoordinate = this.XCoordinate - Math.floor(time * Config.SPEED);
  }
}

export default Vine;
