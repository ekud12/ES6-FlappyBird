export const constant = {
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
  SPRITES: [
    'assets/images/toucan.png',
    'assets/images/toucan-red.png',
    'assets/images/toucan-purple.png',
    'assets/images/toucan-green.png'
  ],
  clientInstanceStates: {
    Login: 0,
    WaitingRoom: 1,
    OnGame: 2,
    End: 3
  },
  enumPlayerState: {
    Unset: 1,
    WaitingInLobby: 2,
    Playing: 3,
    Died: 4
  }
};
