import AuthService from '../services/auth/AuthService.js';
import UserService from '../services/users/UserService.js';

const authService = new AuthService();
const userService = new UserService();

/**
 * Token認証チェック
 */
const authenticate = async function authenticate(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization ?? '';
    const token = authorizationHeader.startsWith('Bearer ')
      ? authorizationHeader.slice(7)
      : authorizationHeader;
    if (!token) throw new Error('No token');
    const decoded = authService.checkToken(token);
    let user = decoded;
    if (!user.id && user.email) {
      const users = await userService.searchUser('', '', user.email, '');
      if (users.length > 0) {
        user = {
          ...user,
          id: users[0].id,
          user_id: users[0].id,
        };
      }
    }
    if (!user.id) throw new Error('No user id');
    req.jwtPayload = decoded;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Not authenticated',
    });
  }
};

export default authenticate;
