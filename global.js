console.log(process.env);
export const constant = {
  SERVER_PORT: process.env.SERVER_PORT,
  SOCKET_PORT: process.env.SOCKET_PORT,
  SOCKET_ADDR: process.env.SOCKET_ADDR,

  SCREEN_WIDTH: process.env.SCREEN_WIDTH,
  SCREEN_HEIGHT: process.env.SCREEN_HEIGHT,
  FLOOR_POS_Y: process.env.FLOOR_POS_Y,
  LEVEL_SPEED: process.env.LEVEL_SPEED,
  TIME_BETWEEN_GAMES: process.env.TIME_BETWEEN_GAMES,

  BIRD_WIDTH: process.env.BIRD_WIDTH,
  BIRD_HEIGHT: process.env.BIRD_HEIGHT,

  PIPE_WIDTH: process.env.PIPE_WIDTH,
  DISTANCE_BETWEEN_PIPES: process.env.DISTANCE_BETWEEN_PIPES,
  MIN_PIPE_HEIGHT: process.env.MIN_PIPE_HEIGHT,
  MAX_PIPE_HEIGHT: process.env.MAX_PIPE_HEIGHT,
  HEIGHT_BETWEEN_PIPES: process.env.HEIGHT_BETWEEN_PIPES
};
