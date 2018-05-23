/**
 * Author: Liel Kaysari
 *     ID: 201322054
 */
/**
 * Imports
 */
import { config as Config } from '../../config';

export const checkCollisions = (vine, toucans) => {
  let collisionDetected = false;
  for (let i = 0; i < vine.length; i++) {
    for (let j = 0; j < toucans.length; j++) {
      if (checkSingleCollision(vine[i], toucans[j]) === true) {
        toucans[j].setPlayerIsDead(toucans.length);
        collisionDetected = true;
      }
    }
  }
  return collisionDetected;
};

/** uses sprite configuration from config.js
 *  2D Sprites have fixed height but when we render we can alter it
 *  abit
 */
const checkSingleCollision = (vine, toucanLatestProps) => {
  const toucan = toucanLatestProps.getPlayerVars();
  if (toucan.X + Config.TOUCAN_RENDER_WIDTH > vine.X + 70 && toucan.X < vine.X + Config.VINE_WIDTH) {
    toucanLatestProps.updatePlayerScore(vine.id);
    if (toucan.Y < vine.Y) return true;
    if (toucan.Y + Config.TOUCAN_RENDER_HEIGHT > vine.Y + Config.VINES_CUTOUT) {
      return true;
    }
  }

  if (toucan.Y + Config.TOUCAN_RENDER_HEIGHT > Config.SCREEN_HEIGHT) {
    return true;
  }

  return false;
};
