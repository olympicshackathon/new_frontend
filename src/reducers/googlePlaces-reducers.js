export default (state=null, action) => {
    let { type, payload } = action;
  
    switch(type) {
      case 'GOOGLE_PLACES_FETCH':
        return payload;
      default:
        return state;
    }
};