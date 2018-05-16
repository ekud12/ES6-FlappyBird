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
    // this.calcOpacity(time, isNight);
    // while (drawPos < this.maxW) {
    //   if (this.dPic && this.nightOpacity != 1) ctx.drawImage(this.dPic, drawPos, this.posY, this.width, this.height);
    //   if (this.nPic && this.nightCycle == true) {
    //     if (this.nightOpacity != 1) {
    //       ctx.save();
    //       ctx.globalAlpha = this.nightOpacity;
    //     }
    //     ctx.drawImage(this.nPic, drawPos, this.posY, this.width, this.height);
    //     if (this.nightOpacity != 1) ctx.restore();
    //   }
    //   drawPos += this.width;
    // }
  }

  resetToDayCycle() {
    this.nightCycle = false;
    this.isCalcOpacity = false;
    this.nightOpacity = 0;
    this.changeOpacityTime = 0;
  }

  // calcOpacity(time, isNight) {
  //   if (this.nightCycle != isNight) {
  //     this.nightCycle = isNight;
  //     this.isCalcOpacity = true;
  //     this.changeOpacityTime = 0;
  //     console.log(`Switching background to ${this.nightCycle == true ? 'night' : 'day'}`);
  //   }
  //   if (this.isCalcOpacity == true) {
  //     this.changeOpacityTime += time;
  //     this.nightOpacity = this.changeOpacityTime / SMOOTH_DAY_NIGHHT_TRANSITION_DURATION;
  //     if (this.changeOpacityTime >= SMOOTH_DAY_NIGHHT_TRANSITION_DURATION) {
  //       this.isCalcOpacity = false;
  //       this.nightOpacity = this.nightCycle == true ? 1 : 0;
  //       this.changeOpacityTime = 0;
  //     }
  //     if (this.nightCycle == false) this.nightOpacity = 1 - this.nightOpacity;
  //   }
  // }
}

export default ParallaxBg;
