import superagent from 'superagent';

export const googlePlacesFetch = results => ({
  type: 'GOOGLE_PLACES_FETCH',
  payload: results,
});

export const googlePlacesFetchRequest = location => dispatch => {
    console.log('location argument: ', location);
  return superagent.get(`https://maps.googleapis.com/maps/api/js?key=${process.env.__GAPI_KEY__}&libraries=places`)
    .then(res => {
        console.log('res: ', res);
      dispatch(googlePlacesFetch(res.body.results));
      return res;
    });
};

// `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=1600&type=restaurant&key=${process.env.__GAPI_KEY__}`

// "<a href="https://maps.google.com/maps/contrib/102854453448299280738/photos">Domino&#39;s Pizza</a>"