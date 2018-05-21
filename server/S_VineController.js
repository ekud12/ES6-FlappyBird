import { EventEmitter } from "events";
import { config as Config } from "../config";
import util from "util";
import Vine from "./models/Vine.model";

let vines = new Array();
let socket = null;

class VineController {
  constructor() {
    EventEmitter.call(this);
  }

  createNewVine() {
    let newVine;
    let lastVinePosition = Config.SCREEN_WIDTH + 60;

    if (vines.length > 0)
      lastVinePosition = vines[vines.length - 1].XCoordinate;
    newVine = new Vine(lastVinePosition);
    vines.push(newVine);
    return newVine;
  }

  refreshVines(lastUpdatedTime) {
    if (vines[0].isOutOfScope() === true) {
      vines.shift();
    }
    for (let i = 0; i < vines.length; i++) {
      vines[i].changePosition(lastUpdatedTime);
    }

    if (vines[vines.length - 1].XCoordinate < Config.SCREEN_WIDTH)
      this.emit("create_new_vine");
  }

  getVines() {
    const resultSet = new Array();
    for (let i = 0; i < vines.length; i++) {
      resultSet.push(vines[i]);
    }
    return resultSet;
  }

  getClosestVines() {
    const resultSet = new Array();
    let totalVines = vines.length > 3 ? 3 : vines.length;
    for (let i = 0; i < totalVines; i++) {
      resultSet.push(vines[i]);
    }
    return resultSet;
  }

  clearAllVines() {
    vines = new Array();
  }

  setSocket(socket) {
    socket = socket;
  }
}

util.inherits(VineController, EventEmitter);

export default VineController;
