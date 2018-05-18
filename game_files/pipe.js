import { config as Config } from '../config';

class Pipe {
  constructor(lastPipePosX) {
    this._pipeTinyObject = {
      id: new Date().getTime(),
      posX: lastPipePosX + Config.DISTANCE_BETWEEN_PIPES,
      posY: Math.floor(
        Math.random() * (Config.MAX_PIPE_HEIGHT - Config.HEIGHT_BETWEEN_PIPES - Config.MIN_PIPE_HEIGHT + 1) +
          Config.MIN_PIPE_HEIGHT
      )
    };
  }

  update(timeLapse) {
    this._pipeTinyObject.posX -= Math.floor(timeLapse * Config.LEVEL_SPEED);
  }

  canBeDroped() {
    if (this._pipeTinyObject.posX + Config.PIPE_WIDTH < 0) return true;
    return false;
  }

  getPipeObject() {
    return this._pipeTinyObject;
  }
}

export default Pipe;
