/******/ (function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {}
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(module.exports, module, module.exports, __webpack_require__); // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        /******/ configurable: false,
        /******/ enumerable: true,
        /******/ get: getter
        /******/
      });
      /******/
    }
    /******/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module['default'];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, 'a', getter);
    /******/ return getter;
    /******/
  }; // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = ''; // Load entry module and return exports
  /******/
  /******/ /******/ return __webpack_require__((__webpack_require__.s = 0));
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var _GUIController = __webpack_require__(1);

      var _GUIController2 = _interopRequireDefault(_GUIController);

      var _playersManager = __webpack_require__(2);

      var _playersManager2 = _interopRequireDefault(_playersManager);

      var _global = __webpack_require__(3);

      var sharedConstants = _interopRequireWildcard(_global);

      function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
          return obj;
        } else {
          var newObj = {};
          if (obj != null) {
            for (var key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
          }
          newObj.default = obj;
          return newObj;
        }
      }

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      new Promise(function(resolve) {
        resolve();
      })
        .then(function() {
          var __WEBPACK_AMD_REQUIRE_ARRAY__ = [
            !(function webpackMissingModule() {
              var e = new Error('Cannot find module "GUIController"');
              e.code = 'MODULE_NOT_FOUND';
              throw e;
            })(),
            !(function webpackMissingModule() {
              var e = new Error('Cannot find module "playersManager"');
              e.code = 'MODULE_NOT_FOUND';
              throw e;
            })(),
            !(function webpackMissingModule() {
              var e = new Error('Cannot find module "sharedConstants"');
              e.code = 'MODULE_NOT_FOUND';
              throw e;
            })()
          ];
          (function(GUIController, PlayersManager, Const) {
            var enumState = {
              Login: 0,
              WaitingRoom: 1,
              OnGame: 2,
              Ranking: 3
            };

            var enumPanels = {
              Login: 'gs-login',
              Ranking: 'gs-ranking',
              HighScores: 'gs-highscores',
              Error: 'gs-error'
            };

            var _gameState = enumState.Login;
            var _playerManager = void 0;
            var _pipeList = void 0;
            var _isCurrentPlayerReady = false;
            var _userID = null;
            var _lastTime = null;
            var _rankingTimer = void 0;
            var _ranking_time = void 0;
            var _isTouchDevice = false;
            var _socket = void 0;
            var _infPanlTimer = void 0;
            var _isNight = false;

            function draw(currentTime, ellapsedTime) {
              // If player score is > 15, night !!
              if (_gameState == enumState.OnGame && _playerManager.getActivePlayer().getScore() == 15) _isNight = true;

              GUIController.draw(currentTime, ellapsedTime, _playerManager, _pipeList, _gameState, _isNight);
            }

            requestAnimationFrame =
              window.requestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.msRequestAnimationFrame;

            function gameLoop() {
              var now = new Date().getTime();
              var ellapsedTime = 0;

              // Call for next anim frame
              if (_gameState == enumState.OnGame) requestAnimationFrame(gameLoop);

              // Get time difference between the last call and now
              if (_lastTime) {
                ellapsedTime = now - _lastTime;
              }
              _lastTime = now;

              // Call draw with the ellapsed time between the last frame and the current one
              draw(now, ellapsedTime);
            }

            function lobbyLoop() {
              var now = new Date().getTime();

              // Call for next anim frame
              if (_gameState == enumState.WaitingRoom) requestAnimationFrame(lobbyLoop);

              // Call draw with the ellapsed time between the last frame and the current one
              draw(now, 0);
            }

            function runFBInstance() {
              if (typeof io == 'undefined') {
                document.getElementById('gs-error-message').innerHTML =
                  'Cannot retreive socket.io file at the address ' +
                  Const.SOCKET_ADDR +
                  '<br/><br/>Please provide a valid address.';
                showHideMenu(enumPanels.Error, true);
                console.log('Cannot reach socket.io file !');
                return;
              }

              _playerManager = new PlayersManager();

              document.getElementById('gs-loader-text').innerHTML = 'Connecting to the server...';
              _socket = io.connect(Const.SOCKET_ADDR + ':' + Const.SOCKET_PORT, { reconnect: false });
              _socket.on('connect', function() {
                console.log('Connection established :)');

                // Bind disconnect event
                _socket.on('disconnect', function() {
                  document.getElementById('gs-error-message').innerHTML = 'Connection with the server lost';
                  showHideMenu(enumPanels.Error, true);
                  console.log('Connection with the server lost :( ');
                });

                // Try to retreive previous player name if exists
                if (typeof sessionStorage != 'undefined') {
                  if ('playerName' in sessionStorage) {
                    document.getElementById('player-name').value = sessionStorage.getItem('playerName');
                  }
                }

                // Draw bg and bind button click
                draw(0, 0);
                showHideMenu(enumPanels.Login, true);
                document.getElementById('player-connection').onclick = loadGameRoom;
              });

              _socket.on('error', function() {
                document.getElementById('gs-error-message').innerHTML =
                  'Fail to connect the WebSocket to the server.<br/><br/>Please check the WS address.';
                showHideMenu(enumPanels.Error, true);
                console.log('Cannot connect the web_socket ');
              });
            }

            function loadGameRoom() {
              var nick = document.getElementById('player-name').value;

              // If nick is empty or if it has the default value,
              if (nick == '' || nick == 'Player_1') {
                infoPanel(true, 'Please choose your <strong>name</strong> !', 2000);
                document.getElementById('player-name').focus();
                return false;
              }
              // Else store it in sessionstorage if available
              else {
                if (typeof sessionStorage != 'undefined') {
                  sessionStorage.setItem('playerName', nick);
                }
              }

              // Unbind button event to prevent "space click"
              document.getElementById('player-connection').onclick = function() {
                return false;
              };

              // Bind new socket events
              _socket.on('player_list', function(playersList) {
                var nb = playersList.length;
                var i = void 0;

                // Add this player in the list
                for (i = 0; i < nb; i++) {
                  _playerManager.addPlayer(playersList[i], _userID);
                }

                // Redraw
                draw(0, 0);
              });
              _socket.on('player_disconnect', function(player) {
                _playerManager.deletePlayer(player);
              });
              _socket.on('new_player', function(player) {
                _playerManager.addPlayer(player);
              });
              _socket.on('player_ready_state', function(playerInfos) {
                _playerManager.getPlayerByID(playerInfos.id).updateData(playerInfos);
              });
              _socket.on('update_game_state', function(gameState) {
                changeGameState(gameState);
              });
              _socket.on('update_game', function(serverDatasUpdated) {
                _playerManager.refreshPList(serverDatasUpdated.players);
                _pipeList = serverDatasUpdated.pipes;
              });
              _socket.on('ranking', function(score) {
                displayRanking(score);
              });

              // Send nickname to the server
              console.log('Send nickname ' + nick);
              _socket.emit('say_hi', nick, function(serverState, uuid) {
                _userID = uuid;
                changeGameState(serverState);

                // Display a message according to the game state
                if (serverState == enumState.OnGame) {
                  infoPanel(true, '<strong>Please wait</strong> for the previous game to finish...');
                } else {
                  // Display a little help text
                  if (_isTouchDevice == false) infoPanel(true, 'Press <strong>space</strong> to fly !', 3000);
                  else infoPanel(true, '<strong>Tap</strong> to fly !', 3000);
                }
              });

              // Get input
              if (_isTouchDevice == false) {
                document.addEventListener('keydown', function(event) {
                  if (event.keyCode == 32) {
                    inputsManager();
                  }
                });
              } else {
                var evt = window.navigator.msPointerEnabled ? 'MSPointerDown' : 'touchstart';
                document.addEventListener(evt, inputsManager);
              }

              // Hide login screen
              showHideMenu(enumPanels.Login, false);
              return false;
            }

            function displayRanking(score) {
              var nodeMedal = document.querySelector('.gs-ranking-medal');
              var nodeHS = document.getElementById('gs-highscores-scores');
              var i = void 0;
              var nbHs = void 0;

              console.log(score);

              // Remove previous medals just in case
              nodeMedal.classList.remove('third');
              nodeMedal.classList.remove('second');
              nodeMedal.classList.remove('winner');

              // Display scores
              document.getElementById('gs-ranking-score').innerHTML = score.score;
              document.getElementById('winner-div').innerHTML = score.bestScore;
              document.getElementById('gs-ranking-pos').innerHTML = score.rank + ' / ' + score.nbPlayers;

              // Set medal !
              if (score.rank == 1) nodeMedal.classList.add('winner');
              else if (score.rank == 2) nodeMedal.classList.add('second');
              else if (score.rank == 3) nodeMedal.classList.add('third');

              // Display hish scores
              nodeHS.innerHTML = '';
              nbHs = score.highscores.length;
              for (i = 0; i < nbHs; i++) {
                nodeHS.innerHTML +=
                  '<li><span>#' +
                  (i + 1) +
                  '</span> ' +
                  score.highscores[i].player +
                  ' <strong>' +
                  score.highscores[i].score +
                  '</strong></li>';
              }

              // Show ranking
              showHideMenu(enumPanels.Ranking, true);

              // Display hish scores in a middle of the waiting time
              window.setTimeout(function() {
                showHideMenu(enumPanels.HighScores, true);
              }, Const.TIME_BETWEEN_GAMES / 2);

              // reset graphics in case to prepare the next game
              GUIController.resetForNewGame();
              _isNight = false;
            }

            function changeGameState(gameState) {
              var strLog = 'Server just change state to ';

              _gameState = gameState;

              switch (_gameState) {
                case enumState.WaitingRoom:
                  strLog += 'waiting in lobby';
                  _isCurrentPlayerReady = false;
                  lobbyLoop();
                  break;

                case enumState.OnGame:
                  strLog += 'on game !';
                  gameLoop();
                  break;

                case enumState.Ranking:
                  strLog += 'display ranking';
                  // Start timer for next game
                  _ranking_time = Const.TIME_BETWEEN_GAMES / 1000;

                  // Display the remaining time on the top bar
                  infoPanel(true, 'Next game in <strong>' + _ranking_time + 's</strong>...');
                  _rankingTimer = window.setInterval(function() {
                    // Set seconds left
                    infoPanel(true, 'Next game in <strong>' + --_ranking_time + 's</strong>...');

                    // Stop timer if time is running up
                    if (_ranking_time <= 0) {
                      // Reset timer and remove top bar
                      window.clearInterval(_rankingTimer);
                      infoPanel(false);

                      // Reset pipe list and hide ranking panel
                      _pipeList = null;
                      showHideMenu(enumPanels.Ranking, false);
                    }
                  }, 1000);
                  break;

                default:
                  console.log('Unknew game state [' + _gameState + ']');
                  strLog += 'undefined state';
                  break;
              }

              console.log(strLog);
            }

            function inputsManager() {
              switch (_gameState) {
                case enumState.WaitingRoom:
                  _isCurrentPlayerReady = !_isCurrentPlayerReady;
                  _socket.emit('change_ready_state', _isCurrentPlayerReady);
                  _playerManager.getActivePlayer().isPlayerReady(_isCurrentPlayerReady);
                  break;
                case enumState.OnGame:
                  _socket.emit('player_jump');
                  break;
                default:
                  break;
              }
            }

            function showHideMenu(panelName, isShow) {
              var panel = document.getElementById(panelName);
              var currentOverlayPanel = document.querySelector('.overlay');

              if (isShow) {
                if (currentOverlayPanel) currentOverlayPanel.classList.remove('overlay');
                panel.classList.add('overlay');
              } else {
                if (currentOverlayPanel) currentOverlayPanel.classList.remove('overlay');
              }
            }

            function infoPanel(isShow, htmlText, timeout) {
              var topBar = document.getElementById('gs-info-panel');

              // Reset timer if there is one pending
              if (_infPanlTimer != null) {
                window.clearTimeout(_infPanlTimer);
                _infPanlTimer = null;
              }

              // Hide the bar
              if (isShow == false) {
                topBar.classList.remove('showTopBar');
              } else {
                // If a set is setted, print it
                if (htmlText) topBar.innerHTML = htmlText;
                // If a timeout is specified, close the bar after this time !
                if (timeout)
                  _infPanlTimer = setTimeout(function() {
                    infoPanel(false);
                  }, timeout);

                // Don't forget to display the bar :)
                topBar.classList.add('showTopBar');
              }
            }

            // Detect touch event. If available, we will use touch events instead of space key
            if (window.navigator.msPointerEnabled) _isTouchDevice = true;
            else if ('ontouchstart' in window) _isTouchDevice = true;
            else _isTouchDevice = false;

            // Load ressources and Start the client !
            console.log('Client started, load ressources...');
            GUIController.loadRessources(function() {
              console.log('Ressources loaded, connect to server...');
              runFBInstance();
            });
          }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));
        })
        .catch(__webpack_require__.oe); /*
    *   Game Engine
    */

      /***/
    },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _parallax = __webpack_require__(
        !(function webpackMissingModule() {
          var e = new Error('Cannot find module "parallax"');
          e.code = 'MODULE_NOT_FOUND';
          throw e;
        })()
      );

      var _parallax2 = _interopRequireDefault(_parallax);

      var _backgroundRessources = __webpack_require__(
        !(function webpackMissingModule() {
          var e = new Error('Cannot find module "backgroundRessources"');
          e.code = 'MODULE_NOT_FOUND';
          throw e;
        })()
      );

      var _backgroundRessources2 = _interopRequireDefault(_backgroundRessources);

      var _global = __webpack_require__(
        !(function webpackMissingModule() {
          var e = new Error('Cannot find module "../../global"');
          e.code = 'MODULE_NOT_FOUND';
          throw e;
        })()
      );

      var _global2 = _interopRequireDefault(_global);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var SPRITE_PIPE_HEIGHT = 768;
      var SPRITE_PIPE_WIDTH = 148;
      var SCORE_POS_Y = 200;
      var SCORE_SHADOW_OFFSET = 5;
      var NB_RESSOURCES_TO_LOAD = 2;
      var BIRDS_SPRITES = [
        'assets/images/toucan.png',
        'assets/images/toucan-red.png',
        'assets/images/toucan-purple.png',
        'assets/images/toucan-green.png'
      ];
      var that = {};
      var ctx = document.getElementById('gs-canvas').getContext('2d');
      var _isReadyToDraw = false;
      var _nbRessourcesToLoad = getNbRessourcesToLoad();
      var _picGround = void 0;
      var _parallaxGround = void 0;
      var _picPipe = void 0;
      var _picBG = new Array();
      _picBirds = new Array();
      function getNbRessourcesToLoad() {
        var nbRessources = NB_RESSOURCES_TO_LOAD + BIRDS_SPRITES.length;
        var nbBg = _backgroundRessources2.default.length;
        var i = void 0;
        for (i = 0; i < nbBg; i++) {
          if (typeof _backgroundRessources2.default[i].daySrc !== 'undefined') nbRessources++;
          if (typeof _backgroundRessources2.default[i].nightSrc !== 'undefined') nbRessources++;
        }
        return nbRessources;
      }
      function drawPipe(pipe) {
        ctx.drawImage(
          _picPipe,
          0,
          0,
          SPRITE_PIPE_WIDTH,
          SPRITE_PIPE_HEIGHT,
          pipe.posX,
          pipe.posY - SPRITE_PIPE_HEIGHT,
          _global2.default.PIPE_WIDTH,
          SPRITE_PIPE_HEIGHT
        );
        ctx.drawImage(
          _picPipe,
          0,
          0,
          SPRITE_PIPE_WIDTH,
          SPRITE_PIPE_HEIGHT,
          pipe.posX,
          pipe.posY + _global2.default.HEIGHT_BETWEEN_PIPES,
          _global2.default.PIPE_WIDTH,
          SPRITE_PIPE_HEIGHT
        );
      }
      function drawScore(score) {
        var posX = void 0;
        posX = _global2.default.SCREEN_WIDTH / 2 - ctx.measureText(score).width / 2;
        ctx.font = '120px Quantico';
        ctx.fillStyle = 'black';
        ctx.fillText(score, posX + SCORE_SHADOW_OFFSET, SCORE_POS_Y + SCORE_SHADOW_OFFSET);
        ctx.fillStyle = 'white';
        ctx.fillText(score, posX, SCORE_POS_Y);
      }
      that.draw = function(currentTime, ellapsedTime, playerManager, pipes, gameState, isNight) {
        var nb = void 0;
        var i = void 0;
        var players = playerManager.getAllPlayers();
        if (!_isReadyToDraw) {
          console.log('[ERROR] : Ressources not yet loaded !');
          return;
        }
        ctx.fillStyle = '#0099CC';
        ctx.fillRect(0, 0, _global2.default.SCREEN_WIDTH, _global2.default.SCREEN_HEIGHT);
        nb = _picBG.length;
        for (i = 0; i < nb; i++) {
          _picBG[i].draw(ctx, ellapsedTime, isNight);
        }
        if (pipes) {
          nb = pipes.length;
          for (i = 0; i < nb; i++) {
            drawPipe(pipes[i]);
          }
        }
        if (players) {
          nb = players.length;
          for (i = 0; i < nb; i++) {
            players[i].draw(ctx, currentTime, _picBirds, gameState);
          }
        }
        if (gameState == 2) drawScore(playerManager.getActivePlayer().getScore());
        if (pipes) _parallaxGround.draw(ctx, currentTime);
        else _parallaxGround.draw(ctx, 0);
      };
      that.resetForNewGame = function() {
        var nb = _picBG.length;
        var i = void 0;
        for (i = 0; i < nb; i++) {
          _picBG[i].resetToDayCycle();
        }
      };
      that.loadRessources = function(onReadyCallback) {
        var bird = void 0;
        var dBg = void 0;
        var nBg = void 0;
        var i = void 0;
        _picGround = new Image();
        _picGround.src = 'assets/images/ground.png';
        _picGround.onload = function() {
          onRessourceLoaded(onReadyCallback);
        };
        _parallaxGround = new _parallax2.default(
          _picGround,
          null,
          900,
          96,
          _global2.default.LEVEL_SPEED,
          672,
          _global2.default.SCREEN_WIDTH
        );
        _picPipe = new Image();
        _picPipe.src = 'assets/images/pipe.png';
        _picPipe.onload = function() {
          onRessourceLoaded(onReadyCallback);
        };
        for (i = 0; i < BIRDS_SPRITES.length; i++) {
          bird = new Image();
          bird.src = BIRDS_SPRITES[i];
          bird.onload = function() {
            onRessourceLoaded(onReadyCallback);
          };
          _picBirds.push(bird);
        }
        for (i = 0; i < _backgroundRessources2.default.length; i++) {
          if (typeof _backgroundRessources2.default[i].daySrc !== 'undefined') {
            dBg = new Image();
            dBg.src = _backgroundRessources2.default[i].daySrc;
            dBg.onload = function() {
              onRessourceLoaded(onReadyCallback);
            };
          } else dBg = null;
          if (typeof _backgroundRessources2.default[i].nightSrc !== 'undefined') {
            nBg = new Image();
            nBg.src = _backgroundRessources2.default[i].nightSrc;
            nBg.onload = function() {
              onRessourceLoaded(onReadyCallback);
            };
          } else nBg = null;
          _picBG.push(
            new _parallax2.default(
              dBg,
              nBg,
              _backgroundRessources2.default[i].width,
              _backgroundRessources2.default[i].height,
              _backgroundRessources2.default[i].speed,
              _backgroundRessources2.default[i].posY,
              _global2.default.SCREEN_WIDTH
            )
          );
        }
        function onRessourceLoaded(onReadyCallback) {
          var totalRessources = getNbRessourcesToLoad();
          if (--_nbRessourcesToLoad <= 0) {
            _isReadyToDraw = true;
            onReadyCallback();
          } else {
            document.getElementById('gs-loader-text').innerHTML =
              'Load ressource ' + (totalRessources - _nbRessourcesToLoad) + ' / ' + totalRessources;
          }
        }
      };
      exports.default = that;

      /***/
    },
    /* 2 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      var _playerEntity = __webpack_require__(
        !(function webpackMissingModule() {
          var e = new Error('Cannot find module "playerEntity"');
          e.code = 'MODULE_NOT_FOUND';
          throw e;
        })()
      );

      var _playerEntity2 = _interopRequireDefault(_playerEntity);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      var _playerList = void 0;
      var _keyMatching = void 0;
      var _currentPlayer = void 0;

      var PlayersController = (function() {
        function PlayersController() {
          _classCallCheck(this, PlayersController);

          _playerList = new Array();
          _keyMatching = new Array();
        }

        _createClass(PlayersController, [
          {
            key: 'addPlayer',
            value: function addPlayer(infos, playerID) {
              var player = void 0;
              if (this.getPlayerByID(infos.id) !== null) {
                console.log(infos.nick + ' is already in the list ! Adding aborted');
                return;
              }
              player = new _playerEntity2.default(infos, playerID);
              _playerList.push(player);
              _keyMatching[infos.id] = _playerList.length - 1;
              console.log('[' + player.getPlayerName() + '] just join the game !');
              console.log(player);
              if (player.isCurrentPlayer() == true) {
                _currentPlayer = _playerList.length - 1;
                console.log("Hey, it's me !");
              }
            }
          },
          {
            key: 'deletePlayer',
            value: function deletePlayer(player) {
              var pos = _keyMatching[player.id];
              var i = void 0;
              if (typeof pos == 'undefined') {
                console.log("Can't find the disconected player in list");
              } else {
                console.log('Removing ' + _playerList[pos].getPlayerName());
                _playerList.splice(pos, 1);
                _keyMatching = new Array();
                for (i = 0; i < _playerList.length; i++) {
                  _keyMatching[_playerList[i].getId()] = i;
                  if (_playerList[i].isCurrentPlayer() == true) _currentPlayer = i;
                }
              }
            }
          },
          {
            key: 'refreshPList',
            value: function refreshPList(playerlistUpdated) {
              var nbUpdates = playerlistUpdated.length;
              var i = void 0;
              for (i = 0; i < nbUpdates; i++) {
                _playerList[_keyMatching[playerlistUpdated[i].id]].updateData(playerlistUpdated[i]);
              }
            }
          },
          {
            key: 'getAllPlayers',
            value: function getAllPlayers() {
              return _playerList;
            }
          },
          {
            key: 'getActivePlayer',
            value: function getActivePlayer() {
              return _playerList[_currentPlayer];
            }
          },
          {
            key: 'getPlayerByID',
            value: function getPlayerByID(playerID) {
              var nbPlayers = _playerList.length;
              var i = void 0;
              for (i = 0; i < nbPlayers; i++) {
                if (_playerList[i].getId() === playerID) return _playerList[i];
              }
              console.log("Can't find player in list");
              return null;
            }
          }
        ]);

        return PlayersController;
      })();

      exports.default = PlayersController;

      /***/
    },
    /* 3 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      // Define all constants usefull by the server and the client
      var constant = (exports.constant = {
        SERVER_PORT: 4242,
        SOCKET_PORT: 1337,
        SOCKET_ADDR: 'http://localhost',

        SCREEN_WIDTH: 900,
        SCREEN_HEIGHT: 768,
        FLOOR_POS_Y: 672,
        LEVEL_SPEED: 0.3,
        TIME_BETWEEN_GAMES: 5000,

        BIRD_WIDTH: 42,
        BIRD_HEIGHT: 30,

        // Pipe constants
        PIPE_WIDTH: 100,
        DISTANCE_BETWEEN_PIPES: 380,
        MIN_PIPE_HEIGHT: 60,
        MAX_PIPE_HEIGHT: 630,
        HEIGHT_BETWEEN_PIPES: 150
      });

      // // To be use by the server part, we have to provide the object with exports
      // if (typeof exports != 'undefined') {
      //   exports.constant = constant;
      // }
      // // Else provide the const object to require.js with define()
      // else {
      //   define(constant);
      // }

      /***/
    }
    /******/
  ]
);
