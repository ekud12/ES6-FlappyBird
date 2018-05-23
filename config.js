export let config = {
  /** Sprites Config */
  TOUCAN_SPR_SRC_H: 64,
  TOUCAN_SPR_SRC_W: 64,
  VINE_SPR_H: 768,
  VINE_SPR_W: 148,
  TOUCAN_SOURCES: [
    'assets/images/toucan.png',
    'assets/images/toucan-red.png',
    'assets/images/toucan-purple.png',
    'assets/images/toucan-green.png'
  ],

  /** Action keycodes */
  PLAY_KEYCODE: 32,
  SOUND_TOGGLE: 109,

  /** States Config */
  clientInstanceStates: {
    New: 0,
    Waiting: 1,
    Playing: 2,
    Ended: 3
  },
  serverStates: {
    WaitingForPlayers: 1,
    OnGame: 2,
    Ranking: 3
  },
  PlayerState: {
    NoState: 1,
    WaitingForGameStart: 2,
    InProgress: 3,
    Dead: 4
  },

  /** Rendering Options */
  /** DO NOT CHANGE */
  SCREEN_WIDTH: 1920,
  SCREEN_HEIGHT: 768,
  TOUCAN_RENDER_WIDTH: 60,
  TOUCAN_RENDER_HEIGHT: 60,
  VINE_WIDTH: 100,
  MIN_VINE_HEIGHT: 50,
  MAX_VINE_HEIGHT: 600,
  VINES_CUTOUT: 240,
  SPEED: 0.3
};
