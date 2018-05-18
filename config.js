export const config = {
  SERVER_PORT: 4242,
  SOCKET_PORT: 1337,
  SOCKET_ADDR: 'http://localhost',

  SCREEN_WIDTH: 1920,
  SCREEN_HEIGHT: 768,
  FLOOR_POS_Y: 768,
  LEVEL_SPEED: 0.3,

  BIRD_WIDTH: 60,
  BIRD_HEIGHT: 60,

  PIPE_WIDTH: 100,
  DISTANCE_BETWEEN_PIPES: 380,
  MIN_PIPE_HEIGHT: 50,
  MAX_PIPE_HEIGHT: 660,
  HEIGHT_BETWEEN_PIPES: 220,
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
  PlayerState: {
    NoState: 1,
    WaitingForGame: 2,
    PlayTime: 3,
    Dead: 4
  },

  SPRITE_BIRD_HEIGHT: 64,
  SPRITE_BIRD_WIDTH: 64,
  COMPLETE_ANNIMATION_DURATION: 250,
  ANIMATION_FRAME_NUMBER: 4,
  SPRITE_PIPE_HEIGHT: 768,
  SPRITE_PIPE_WIDTH: 148,
  SCORE_POS_Y: 200,
  SCORE_SHADOW_OFFSET: 5,
  TOT_RES: 2
};