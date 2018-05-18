import { config as Config } from '../config';

function checkBirdCollision(vine, birdInstance) {
  const bird = birdInstance.getPlayerObject();

  // If the bird is inside a vine on the X axis, check if he touch it
  if (bird.posX + Config.BIRD_WIDTH > vine.posX && bird.posX < vine.posX + Config.VINE_WIDTH) {
    // Notify the bird he is inside the vine
    birdInstance.updateScore(vine.id);

    // Check if the bird touch the upper vine
    if (bird.posY < vine.posY) return true;

    // Check if the bird touch the ground vine
    if (bird.posY + Config.BIRD_HEIGHT > vine.posY + Config.HEIGHT_BETWEEN_VINES) {
      return true;
    }
  }

  // If the bird hit the ground
  if (bird.posY + Config.BIRD_HEIGHT > Config.FLOOR_POS_Y) {
    return true;
  }

  return false;
}

export function checkCollision(vine, birdsList) {
  let thereIsCollision = false;
  const vineLength = vine.length;
  const birdLength = birdsList.length;
  let i;
  let j;

  for (i = 0; i < vineLength; i++) {
    for (j = 0; j < birdsList.length; j++) {
      if (checkBirdCollision(vine[i], birdsList[j]) == true) {
        // Change player state to died
        birdsList[j].sorryYouAreDie(birdsList.length);

        thereIsCollision = true;
      }
    }
  }

  return thereIsCollision;
}
