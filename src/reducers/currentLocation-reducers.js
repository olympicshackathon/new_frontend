export default (state=null, action) => {
    let { type, payload } = action;
  
    switch(type) {
      case 'CURRENT_LOCATION_FETCH':
        return payload;
      case 'SIGN_OUT':
        return null;
      default:
        return state;
    }
};