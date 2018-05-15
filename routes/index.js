import { constant as Const } from '../global';

export function birds(req, res) {
  res.render('birds', { title: 'AfekaFlappyBird', wsAddress: `${Const.SOCKET_ADDR}:${Const.SOCKET_PORT}` });
}
