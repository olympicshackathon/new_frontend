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
          showingInfoWindow: false,
          activeMarker: {},
          selectedPlace: {},
          places: [],
          map: null,
          currentLocation: {},
        }
    }
    componentWillMount() {
        userValidation(this.props);
    }
    // https://hackernoon.com/replacing-componentwillreceiveprops-with-getderivedstatefromprops-c3956f7ce607
    // componentWillReceiveProps(nextProps){
    //     if(nextProps.currentLocation !== this.props.currentLocation){
    //       let {firebaseRef}=this.state;
          
    //       firebaseRef.off("value"); //Turn off the connection to previous path.
          
    //       firebaseRef=firebase.database().ref(nextProps.path);
    //       this.setState({firebaseRef, path :nextProps.path });
    //       this.getData(firebaseRef);
    //     }
    // }
    componentDidMount() {
        // this.props.currentLocationFetch();
        this.mounted = true;

        if (this.mounted)
            this.updatePosition();
    }
    componentWillUnmount(){
        this.mounted = false;
    };

    // handleGooglePlacesFetch = location => {
    //     console.log('location: ', location);
    //     return this.props.googlePlacesFetch(location)
    //         .then(results => console.log(results))
    //         .catch(logError);
    // };

    updatePosition = () => {
        // this.handleGooglePlacesFetch({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        console.log('update position func');
    }

    onMapReady = (mapProps, map) => {
        this.searchNearby(map, map.center);

        this.map = map;
        window.onresize = () => {
            const currCenter = map.getCenter();
            this.props.google.maps.event.trigger(map, 'resize');
            map.setCenter(currCenter);
        };
    }

    searchNearby = (map, center) => {
        const { google } = this.props;
        const service = new google.maps.places.PlacesService(map);
    
        // Specify location, radius and place types for your Places API search.
        const request = {
          location: center,
          radius: '5000',
          type: ['store', 'political', 'locality', 'restaurant', 'lodging']
        };
    
        service.nearbySearch(request, this.searchNearbyCallback);
        this.setState({ map: map });
        console.log('map state: ', this.state.map);
        // service.nearbySearch(request, (results, status) => {
        //     if (status === google.maps.places.PlacesServiceStatus.OK)
        //     {
        //       console.log('results: ', results);
        //       this.setState({ places: results });
        //     }
        //   });
    };

    searchNearbyCallback = (results, status, pagination) => {
        console.log('marketscallback()');
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {

                let place = {
                    location: {
                        lat: results[i].geometry.location.lat(),
                        lng: results[i].geometry.location.lng()
                    },
                    name: results[i].name,
                    photos: []
                };
                results[i].photos.forEach(pho => place.photos.push(pho.getUrl({'maxWidth': 600, 'maxHeight': 400})))
                this.setState({ places: place });
                this.createMarker(place);
            }
            if (pagination.hasNextPage) {
                pagination.nextPage();
            }
        }
    };

    createMarker = item => {
        console.log('createmarker()');
        const { google } = this.props;
        var marker = new google.maps.Marker({
            map: this.state.map,
            position: item.location,
            title: item.name,
            icon: 'http://www.clker.com/cliparts/E/9/d/W/E/9/google-maps-icon-blank-red.svg.hi.png'
        });
        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">' + item.name + '</h1>' +
            '<div id="bodyContent">' +
            '<img src="' + item.photos[0] + '"/>' +
            '</div>' +
            '</div>';
    
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
    
        google.maps.event.addListener(marker, 'click', () => {
            infowindow.setContent(contentString);
            infowindow.open(this.state.map, this);
        });
    }

    onMapClicked = props => {
        if (this.state.showingInfoWindow) {
          this.setState({ showingInfoWindow: false, activeMarker: null})
        }
    };

    // markers
    onMarkerClick = (props, marker, e) => this.setState({ 
        selectedPlace: props, activeMarker: marker, showingInfoWindow: true
    });

    onMouseoverMarker = (props, marker, e) => {
        // ..
    };

    // info window
    windowHasOpened = () => {

    };

    onInfoWindowClose = () => this.setState({ activeMarker: null, showingInfoWindow: false });

    render() {
        const style = { width: '100%', height: '100%' };
        return (
            <Map google={this.props.google} zoom={14} center={this.props.currentLocation} 
                 onReady={this.onMapReady} onClick={this.onMapClicked} >
                <Marker onClick={this.onMarkerClick}
                        onMouseover={this.onMouseoverMarker}
                        name={'Current location'} 
                        position={this.props.currentLocation}
                        icon={{
                            url: 'https://i.imgur.com/Oa8iJO5.png',
                            anchor: new google.maps.Point(32, 32),
                            scaledSize: new google.maps.Size(64, 64)
                        }}
                        />
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
