import { EventEmitter } from "events";
import { config as Config } from "../config";
import util from "util";
import Vine from "./models/Vine.model";

const FIRST_VINE_POSX = Config.SCREEN_WIDTH + 60;
const SPAWN_VINE_ALERT = Config.SCREEN_WIDTH;
const MAX_VINE_CHECK_COLLISION = 3;

let _vineList = new Array();
let socket = null;

class VineManager {
  constructor() {
    EventEmitter.call(this);
  }

  setSocket(socket) {
    socket = socket;
  }

  newVine() {
    let newVine;
    let lastPos = FIRST_VINE_POSX;

    if (_vineList.length > 0)
      lastPos = _vineList[_vineList.length - 1].getVineObject().posX;

    newVine = new Vine(lastPos);
    _vineList.push(newVine);

    return newVine;
  }

  updateVines(time) {
    let nbVines = _vineList.length;
    let i;

    // If the first vine is out of the screen, erase it
    if (_vineList[0].canBeDroped() === true) {
      _vineList.shift();
      nbVines--;
    }

    for (i = 0; i < nbVines; i++) {
      _vineList[i].update(time);
    }

    if (_vineList[nbVines - 1].getVineObject().posX < SPAWN_VINE_ALERT)
      this.emit("need_new_vine");
  }

  getVineList() {
    const vines = new Array();
    const nbVines = _vineList.length;
    let i;

    for (i = 0; i < nbVines; i++) {
      vines.push(_vineList[i].getVineObject());
    }

    return vines;
  }

  getPotentialVineHit() {
    const vines = new Array();
    let nbVines = _vineList.length;
    let i;

    // In multiplayer mode, just check the first 2 vines
    // because the other ones are too far from the players
    if (nbVines > MAX_VINE_CHECK_COLLISION) nbVines = MAX_VINE_CHECK_COLLISION;

    for (i = 0; i < nbVines; i++) {
      vines.push(_vineList[i].getVineObject());
    }

    return vines;
  }

  clearAllVines() {
    _vineList = new Array();
  }
}

util.inherits(VineManager, EventEmitter);

export default VineManager;
