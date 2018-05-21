export const config = {
  SERVER_PORT: 4500,
  SERVER_ADDRESS: "https://afeka-flappy-bird.herokuapp.com",
  // SERVER_ADDRESS: "http://localhost",

  CLIENT_SOCKET: 2222,

  SCREEN_WIDTH: 1920,
  SCREEN_HEIGHT: 768,
  // FLOOR_POS_Y: 768,
  SPEED: 0.3,

  TOUCAN_RENDER_WIDTH: 60,
  TOUCAN_RENDER_HEIGHT: 60,
  VINE_WIDTH: 100,
  // DISTANCE_BETWEEN_VINES: 400,
  MIN_VINE_HEIGHT: 50,
  MAX_VINE_HEIGHT: 600,
  HEIGHT_BETWEEN_VINES: 240,

  /** Sprites Config */
  TOUCAN_SPR_SRC_H: 64,
  TOUCAN_SPR_SRC_W: 64,
  // SPR_ANIM_DUR: 250,
  // ANIMATION_FRAME_NUMBER: 4,
  VINE_SPR_H: 768,
  VINE_SPR_W: 148,
  // SCORE_POS_Y: 200,
  // SCORE_SHADOW_OFFSET: 5,
  // TOT_RES: 2,
  PLAY_KEYCODE: 32,
  SOUND_TOGGLE: 109,

  TOUCAN_SOURCES: [
    "assets/images/toucan.png",
    "assets/images/toucan-red.png",
    "assets/images/toucan-purple.png",
    "assets/images/toucan-green.png"
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
