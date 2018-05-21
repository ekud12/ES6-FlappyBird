export const config = {
  SERVER_PORT: 4242,
  SOCKET_PORT: 1337,
  SOCKET_ADDR: 'http://localhost',

  SCREEN_WIDTH: 1920,
  SCREEN_HEIGHT: 768,
  // FLOOR_POS_Y: 768,
  SPEED: 0.3,

  TOUCAN_RENDER_WIDTH: 60,
  TOUCAN_RENDER_HEIGHT: 60,
  VINE_WIDTH: 100,
  // DISTANCE_BETWEEN_VINES: 400,
  MIN_VINE_HEIGHT: 50,
  MAX_VINE_HEIGHT: 660,
  HEIGHT_BETWEEN_VINES: 240,

  /** Sprites Config */
  SPRITE_BIRD_HEIGHT: 64,
  SPRITE_BIRD_WIDTH: 64,
  COMPLETE_ANNIMATION_DURATION: 250,
  ANIMATION_FRAME_NUMBER: 4,
  SPRITE_VINE_HEIGHT: 768,
  SPRITE_VINE_WIDTH: 148,
  SCORE_POS_Y: 200,
  SCORE_SHADOW_OFFSET: 5,
  TOT_RES: 2,
  PLAY_KEYCODE: 32,

  TOUCAN_SOURCES: [
    'assets/images/toucan.png',
    'assets/images/toucan-red.png',
    'assets/images/toucan-purple.png',
    'assets/images/toucan-green.png'
  ],
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
  }
};
