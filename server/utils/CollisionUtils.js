import { config as Config } from '../../config';

export const checkCollisions = (vine, toucans) => {
  let collisionDetected = false;
  for (let i = 0; i < vine.length; i++) {
    for (let j = 0; j < toucans.length; j++) {
      if (checkSingleCollision(vine[i], toucans[j]) === true) {
        toucans[j].sorryYouAreDie(toucans.length);
        collisionDetected = true;
      }
    }
  }
  return collisionDetected;
};

const checkSingleCollision = (vine, toucanLatestProps) => {
  const toucan = toucanLatestProps.getPlayerObject();
  if (
    toucan.XCoordinate + Config.TOUCAN_RENDER_WIDTH > vine.XCoordinate + 70 &&
    toucan.XCoordinate < vine.XCoordinate + Config.VINE_WIDTH
  ) {
    toucanLatestProps.updateScore(vine.id);
    if (toucan.YCoordinate < vine.YCoordinate) return true;
    if (toucan.YCoordinate + Config.TOUCAN_RENDER_HEIGHT > vine.YCoordinate + Config.HEIGHT_BETWEEN_VINES) {
      return true;
    }
  }

  if (toucan.YCoordinate + Config.TOUCAN_RENDER_HEIGHT > Config.SCREEN_HEIGHT) {
    return true;
  }

  return false;
};
