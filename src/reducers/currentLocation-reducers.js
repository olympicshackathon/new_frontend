export default (state=null, action) => {
    let { type, payload } = action;
  
    console.log('payload: ', payload);
    switch(type) {
      case 'CURRENT_LOCATION_FETCH':
        return payload;
      default:
        return state;
    }
};