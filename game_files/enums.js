const enumServerState = {
  WaitingForPlayers: 1,
  OnGame: 2,
  Ranking: 3
};

const PlayerState = {
  OnLoginScreen: 1,
  WaitingForGameStart: 2,
  InProgress: 3,
  Dead: 4
};

export { PlayerState };
export { enumServerState as ServerState };
