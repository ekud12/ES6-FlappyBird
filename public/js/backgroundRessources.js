import { constant as Const } from '../../global.js';
export default [
  {
    nightSrc: 'assets/images/night.png',
    width: 500,
    height: 768,
    posY: 0,
    speed: Const.LEVEL_SPEED / 4
  },
  {
    daySrc: 'assets/images/clouds.png',
    nightSrc: 'assets/images/night-clouds.png',
    width: 300,
    height: 256,
    posY: 416,
    speed: Const.LEVEL_SPEED / 3
  },
  {
    daySrc: 'assets/images/city.png',
    nightSrc: 'assets/images/night-city.png',
    width: 300,
    height: 256,
    posY: 416,
    speed: Const.LEVEL_SPEED / 2
  },
  {
    daySrc: 'assets/images/trees.png',
    nightSrc: 'assets/images/night-trees.png',
    width: 300,
    height: 216,
    posY: 456,
    speed: Const.LEVEL_SPEED
  }
];
