import { config as Config } from '../../config';

class Vine {
  constructor(lastVinePosition) {
    this.id = Math.random() * 10000000000;
    this.X = lastVinePosition + 380;
    this.Y = Math.floor(
      Math.random() * (Config.MAX_VINE_HEIGHT - Config.VINES_CUTOUT - Config.MIN_VINE_HEIGHT + 1) + Config.MIN_VINE_HEIGHT
    );
  }

  isOutOfScope() {
    if (this.X + Config.VINE_WIDTH < 0) return true;
    return false;
  }

  changePosition(time) {
    this.X = this.X - Math.floor(time * Config.SPEED);
  }
}

export default Vine;
