import { constant as Const } from '../global';

class Pipe {
  constructor(lastPipePosX) {
    this._pipeTinyObject = {
      id: new Date().getTime(),
      posX: lastPipePosX + Const.DISTANCE_BETWEEN_PIPES,
      posY: Math.floor(
        Math.random() * (Const.MAX_PIPE_HEIGHT - Const.HEIGHT_BETWEEN_PIPES - Const.MIN_PIPE_HEIGHT + 1) + Const.MIN_PIPE_HEIGHT
      )
    };
  }

  update(timeLapse) {
    this._pipeTinyObject.posX -= Math.floor(timeLapse * Const.LEVEL_SPEED);
  }

  canBeDroped() {
    if (this._pipeTinyObject.posX + Const.PIPE_WIDTH < 0) return true;
    return false;
  }

  getPipeObject() {
    return this._pipeTinyObject;
  }
}

export default Pipe;
