import Cookies from 'js-cookie';
import { User } from '../types';

const USER_COOKIE_KEY = 'gamehub_user';

export const saveUserToCookie = (user: User) => {
  Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), { expires: 7 });
};

export const getUserFromCookie = (): User | null => {
  const userCookie = Cookies.get(USER_COOKIE_KEY);
  return userCookie ? JSON.parse(userCookie) : null;
};

export const removeUserCookie = () => {
  Cookies.remove(USER_COOKIE_KEY);
};