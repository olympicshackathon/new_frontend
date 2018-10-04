export default (state=null, action) => {
    let { type, payload } = action;
  
    switch(type) {
      case 'GOOGLE_PLACES_FETCH':
        return payload;
      case 'SIGN_OUT':
        return null;
      default:
        return state;
    }
};