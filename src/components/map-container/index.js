import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import PropTypes from 'prop-types';

import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest, userProfileUpdateRequest } from '../../actions/userProfile-actions.js';
import { googlePlacesFetchRequest } from '../../actions/map-actions.js';
import Modal from '../helpers/modal';
import { userValidation, logError, renderIf } from './../../lib/util.js';

class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          currentLocation: {
            lat:  7,
            lng:  -12
          },
          showingInfoWindow: false,
          activeMarker: {},
          selectedPlace: {},
        }
    }
    componentWillMount() {
        userValidation(this.props);
    }
    componentDidMount() {
        this.mounted = true;

        if (this.mounted)
            this.updatePosition();
    }
    componentWillUnmount(){
        this.mounted = false;
    };

    handleGooglePlacesFetch = location => {
        console.log('location: ', location);
        return this.props.googlePlacesFetch(location)
            .then(results => console.log(results))
            .catch(logError);
    };

    updatePosition = () => {
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                this.setState({
                    currentLocation: {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    }
                });
                this.handleGooglePlacesFetch({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            })
        }
        else
            console.log('no');
    }

    googlePlacesCallback = (results, status) => {
        console.log('results: ', results);
        console.log('status: ', status);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
              console.log('results[i]: '. results[i]);
            // var place = results[i];
            // createMarker(results[i]);
          }
        }
    }

    fetchplaces = () => {

    };

    onMapClicked = props => {
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          })
        }
    };

    // markers
    onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

    onMouseoverMarker = (props, marker, e) => {
        // ..
    };

    // info window
    windowHasOpened = () => {

    };

    onInfoWindowClose = () =>
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    });

    render() {
        const style = {
            width: '100%',
            height: '100%'
          };
        let markerStyle = {
            url: 'https://i.imgur.com/Oa8iJO5.png',
            scale: 0.3
        };
        // let currentPositionIcon = require('../helpers/assets/position.png');
        return (
            <Map google={this.props.google} zoom={14} center={this.state.currentLocation} 
                 onReady={this.fetchPlaces} onClick={this.onMapClicked}>
                <Marker onClick={this.onMarkerClick}
                        onMouseover={this.onMouseoverMarker}
                        name={'Current location'} 
                        position={this.state.currentLocation}
                        icon={markerStyle}/>
                <InfoWindow onClose={this.onInfoWindowClose} marker={this.state.activeMarker}
                            visible={this.state.showingInfoWindow} onOpen={this.windowHasOpened}>
                    <p>{this.state.selectedPlace.name}</p>
                </InfoWindow>
            </Map>
        )
    }
}

let mapStateToProps = state => ({
    userAuth: state.userAuth,
    userProfile: state.userProfile,
    googlePlaces: state.googlePlaces,
});
  
let mapDispatchToProps = dispatch => ({
    tokenSignIn: token => dispatch(tokenSignInRequest(token)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    userProfileUpdate: profile => dispatch(userProfileUpdateRequest(profile)),
    googlePlacesFetch: location => dispatch(googlePlacesFetchRequest(location)),
});

const WrappedContainer = GoogleApiWrapper({
    apiKey: process.env.__GAPI_KEY__
 })(MapContainer);
 export default connect(mapStateToProps, mapDispatchToProps)(WrappedContainer);
