import { config as Config } from "../../../config.js";
import PlayersController from "../controllers/PlayersController.js";
import GUIController from "../controllers/GUIController.js";
let state = Config.clientInstanceStates.New;
let GUIControllerInstance = new GUIController();
let playersCInstance;
let playerID = null;
let isPlayerReady = false;
let updateIntervalTime = null;
let socket;
let gameVines;
let audioPlaying = false;
let port;
/**
 *
 * On resources Loaded Callback Done
 * run the client's game instance
 */

/** Audio handling */
window.audioHandler = audioHandler;
// fetch("http://localhost/aport")
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     port = myJson;
//   });
// console.log(port);
document.addEventListener("keydown", event => {
  if (event.keyCode === Config.SOUND_TOGGLE) {
    audioHandler();
  }
});

/** On finished loading, run client instance */
GUIControllerInstance.loadAssets(() => {
  runClientInstance();
});

const canvasPaint = (nowTime, totalTime) => {
  GUIControllerInstance.render(
    nowTime,
    totalTime,
    playersCInstance,
    gameVines,
    state
  );
};

const runClientInstance = () => {
  if (typeof io === "undefined") {
    console.log("DAMN");
  }
  playersCInstance = new PlayersController();

  socket = io.connect();

  console.log(socket);
  socket.on("connect", () => {
    socket.on("disconnect", () => {
      console.log(`Disconnected or player quit. Refresh Page.`);
    });
    canvasPaint(0, 0);
    document.getElementById("enter-game").onclick = initClientSocketBindings;
  });
  socket.on("error", () => {
    console.log(`Error connecting to WebSocket`);
  });
};

/**
 * Game Loops
 */
const clientWaitingLoop = () => {
  if (state === Config.clientInstanceStates.Waiting)
    requestAnimationFrame(clientWaitingLoop);
  canvasPaint(new Date().getTime(), 0);
};

const clientInGameLoop = () => {
  let ellapsedTime = 0;
  const currentTime = new Date().getTime();
  if (state === Config.clientInstanceStates.Playing)
    requestAnimationFrame(clientInGameLoop);
  if (updateIntervalTime) {
    ellapsedTime = currentTime - updateIntervalTime;
  }
  updateIntervalTime = currentTime;
  canvasPaint(currentTime, ellapsedTime);
};

const clientGetUpdatedState = data => {
  state = data;
  switch (state) {
    case Config.clientInstanceStates.Waiting:
      document.getElementById("enter-game").disabled = false;
      gameVines = null;
      isPlayerReady = false;
      clientWaitingLoop();
      break;
    case Config.clientInstanceStates.Playing:
      document.getElementById("winner-div").innerHTML = null;
      document.getElementById("enter-game").disabled = true;
      clientInGameLoop();
      break;
    case Config.clientInstanceStates.Ended:
      document.getElementById("enter-game").disabled = false;
      gameVines = null;
      break;
    default:
      break;
  }
};

const initClientSocketBindings = () => {
  const name = document.getElementById(`player-name`).value;
  if (name === "" || name === "Your Name") {
    alert("Please choose a name First!");
    return;
  }

  /**
   * Binding sockets on different actions
   */
  socket.on("list_of_players_update", list => {
    for (let i = 0; i < list.length; i++) {
      playersCInstance.addPlayer(list[i], playerID);
    }
    /**
     * Reset Canvas because we have new players
     */
    canvasPaint(0, 0);
  });
  socket.on("player_joined", player => {
    playersCInstance.addPlayer(player);
  });
  socket.on("player_disconnected", player => {
    playersCInstance.deletePlayer(player);
  });
  socket.on("player_is_ready", playerInfos => {
    playersCInstance.getPlayerByID(playerInfos.id).updateData(playerInfos);
  });
  socket.on("state_updated", gameState => {
    clientGetUpdatedState(gameState);
  });
  socket.on("we_have_a_winner", score => {
    displayWinner(score);
  });
  socket.on("update_game_digital_assets", newServerData => {
    playersCInstance.refreshPList(newServerData.players);
    gameVines = newServerData.vines;
  });

  /** TODO: REMOVE */
  socket.emit("say_hi", name, (serverState, uuid) => {
    playerID = uuid;
    clientGetUpdatedState(serverState);

    if (serverState === Config.clientInstanceStates.Playing) {
      alert(`Game in Progress. Please wait...`);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.keyCode === Config.PLAY_KEYCODE) {
      switch (state) {
        case Config.clientInstanceStates.Waiting:
          isPlayerReady = !isPlayerReady;
          socket.emit("update_ready_state", isPlayerReady);
          playersCInstance.getActivePlayer().isPlayerReady(isPlayerReady);
          break;
        case Config.clientInstanceStates.Playing:
          socket.emit("play_action");
          break;
        default:
          break;
      }
    }
  });

  return false;
};

const displayWinner = data => {
  document.getElementById("winner-div").innerHTML = `The winner is : ${
    data.winner
  }! </br> The winner Score is: ${data.score}!`;
  setTimeout(GUIControllerInstance.resetGUI(), 3000);
};

function audioHandler() {
  let audioRef = document.getElementById("myJunglePlayer");
  audioRef.muted = audioPlaying ? true : false;
  audioPlaying = audioRef.muted ? false : true;
}

requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;
