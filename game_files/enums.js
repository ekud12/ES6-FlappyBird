const enumServerState = {
  WaitingForPlayers: 1,
  OnGame: 2,
  Ranking: 3
};

const enumPlayerState = {
  OnLoginScreen: 1,
  WaitingInLobby: 2,
  Playing: 3,
  Died: 4
};

export { enumPlayerState as PlayerState };
export { enumServerState as ServerState };
