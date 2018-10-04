import superagent from 'superagent';
import noCache from 'superagent-no-cache';
import isIE from 'ie';
var finalNoCache = isIE ? noCache : noCache.withQueryStrings;

export const signIn = token => ({
  type: 'SIGN_IN',
  payload: token,
});

export const signOut = () => {
  delete localStorage.token;
  return { type: 'SIGN_OUT' };
};

export const signUpRequest = user => dispatch => {
  return superagent.post(`${process.env.API_URL}/api/signup`)
    .use(finalNoCache)
    .withCredentials()
    .send(user)
    .then( res => {
      dispatch(signIn(res.text));
      localStorage.token = res.text;
      return res;
    });
};

export const signInRequest = user => dispatch => {
  return superagent.get(`${process.env.API_URL}/api/signin`)
    .use(finalNoCache)
    .withCredentials()
    .auth(user.username, user.password)
    .then( res => {
      dispatch(signIn(res.text));
      localStorage.token = res.text;
      return res;
    });
};

export const tokenSignInRequest = token => dispatch => {
  return superagent.get(`${process.env.API_URL}/api/signin/token`)
    .use(finalNoCache)
    .set('Authorization', `Bearer ${token}`)
    .then( res => {
      dispatch(signIn(res.text));
      localStorage.token = res.text;
      return res;
    });
};