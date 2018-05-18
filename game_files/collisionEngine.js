import { config as Config } from '../config';

function checkBirdCollision(pipe, birdInstance) {
  const bird = birdInstance.getPlayerObject();

  // If the bird is inside a pipe on the X axis, check if he touch it
  if (bird.posX + Config.BIRD_WIDTH > pipe.posX && bird.posX < pipe.posX + Config.PIPE_WIDTH) {
    // Notify the bird he is inside the pipe
    birdInstance.updateScore(pipe.id);

    // Check if the bird touch the upper pipe
    if (bird.posY < pipe.posY) return true;

    // Check if the bird touch the ground pipe
    if (bird.posY + Config.BIRD_HEIGHT > pipe.posY + Config.HEIGHT_BETWEEN_PIPES) {
      return true;
    }
  }

  // If the bird hit the ground
  if (bird.posY + Config.BIRD_HEIGHT > Config.FLOOR_POS_Y) {
    return true;
  }

  return false;
}

export function checkCollision(pipe, birdsList) {
  let thereIsCollision = false;
  const pipeLength = pipe.length;
  const birdLength = birdsList.length;
  let i;
  let j;

  for (i = 0; i < pipeLength; i++) {
    for (j = 0; j < birdsList.length; j++) {
      if (checkBirdCollision(pipe[i], birdsList[j]) == true) {
        // Change player state to died
        birdsList[j].sorryYouAreDie(birdsList.length);

        thereIsCollision = true;
      }
    }
  }

  return thereIsCollision;
}
