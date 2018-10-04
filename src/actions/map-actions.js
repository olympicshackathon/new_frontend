import superagent from 'superagent';

export const googlePlacesFetch = results => ({
  type: 'GOOGLE_PLACES_FETCH',
  payload: results,
});

export const currentLocationFetch = location => ({
  type: 'CURRENT_LOCATION_FETCH',
  payload: location,
});

export const googlePlacesFetchRequest = location => dispatch => {
  // console.log('location argument: ', location);
  // return superagent.get(`https://maps.googleapis.com/maps/api/js?key=${process.env.__GAPI_KEY__}&libraries=places`)
  return superagent.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=1600&type=restaurant&key=${process.env.__GAPI_KEY__}&libraries=places`)
    .then(res => {
        console.log('res: ', res.body.results);
      dispatch(googlePlacesFetch(res.body.results));
      return res.body.results;
    });
};

export const currentLocationFetchRequest = () => dispatch => {
  let lat;
  let lng;
  if (navigator && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        dispatch(currentLocationFetch({ lat, lng }));
    },
    err => {
      dispatch(currentLocationFetch({ lat: 48.8566, lng: 2.3522 }));
    },
    {
      timeout: 5000,
    });
    } else {
      dispatch(currentLocationFetch({ lat: 48.8566, lng: 2.3522 }));
    }
};

// export const locationPhotoFetchRequest = photoRef => dispatch => {
//   console.log('photoRef argument: ', photoRef);
//   // return superagent.get(`https://maps.googleapis.com/maps/api/js?key=${process.env.__GAPI_KEY__}&libraries=places`)
//   return superagent.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${process.env.__GAPI_KEY__}`)
//     .then(res => {
//         console.log('res: ', res.body.results);
//       dispatch(googlePlacesFetch(res.body.results));
//       return res.body.results;
//     });
// };


// `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=1600&type=restaurant&key=${process.env.__GAPI_KEY__}`