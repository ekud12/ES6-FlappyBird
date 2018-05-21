import { config as Config } from "../../config";

export const checkCollisions = (vine, toucans) => {
  let collision = false;
  for (let i = 0; i < vine.length; i++) {
    for (let j = 0; j < toucans.length; j++) {
      if (checkSingleCollision(vine[i], toucans[j]) === true) {
        toucans[j].sorryYouAreDie(toucans.length);
        collision = true;
      }
    }
  }

  return collision;
};

const checkSingleCollision = (vine, toucanLatestProps) => {
  const toucan = toucanLatestProps.getPlayerObject();
  if (
    toucan.posX + Config.TOUCAN_RENDER_WIDTH > vine.posX &&
    toucan.posX < vine.posX + Config.VINE_WIDTH
  ) {
    toucanLatestProps.updateScore(vine.id);
    if (toucan.posY < vine.posY) return true;
    if (
      toucan.posY + Config.TOUCAN_RENDER_HEIGHT >
      vine.posY + Config.HEIGHT_BETWEEN_VINES
    ) {
      return true;
    }
  }

  if (toucan.posY + Config.TOUCAN_RENDER_HEIGHT > Config.SCREEN_HEIGHT) {
    return true;
  }

  return false;
};
