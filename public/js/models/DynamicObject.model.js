const SMOOTH_DAY_NIGHHT_TRANSITION_DURATION = 2000;

class ParallaxBg {
  constructor(dayRessource, nightRessource, width, height, speed, posY, screenWidth) {
    this.dPic = dayRessource;
    this.nPic = nightRessource;
    this.speed = speed;
    this.posY = posY;
    this.posX = 0;
    this.width = width;
    this.height = height;
    this.maxW = screenWidth;
    this.nightCycle = false;
    this.isCalcOpacity = false;
    this.nightOpacity = 0;
    this.changeOpacityTime = 0;
  }

  draw(ctx, time, isNight) {
    let drawPos;
    this.posX = (this.posX - Math.floor(time * this.speed)) % this.width;
    drawPos = this.posX;
  }

  resetToDayCycle() {
    this.nightCycle = false;
    this.isCalcOpacity = false;
    this.nightOpacity = 0;
    this.changeOpacityTime = 0;
  }
}

export default ParallaxBg;
