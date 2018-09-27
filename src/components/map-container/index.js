import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import PropTypes from 'prop-types';
import superagent from 'superagent';

import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest, userProfileUpdateRequest } from '../../actions/userProfile-actions.js';
import { googlePlacesFetchRequest, currentLocationFetchRequest } from '../../actions/map-actions.js';
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

    componentWillUnmount(){
        this.mounted = false;
    };

    componentDidMount() {
        this.mounted = true;

        if (this.mounted)
        {
            this.setState({ currentLocation: this.props.currentLocation });
            return this.props.googlePlacesFetch(this.props.currentLocation)
                .then(results => this.searchNearbyCB(results))
                .catch(logError);
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevProps.google !== this.props.google) {

    //     }

    // }

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
        const request = {
          location: center,
          radius: '5000',
          type: ['store', 'political', 'locality', 'restaurant', 'lodging']
        };
    
        service.nearbySearch(request, this.searchNearbyCallback);
        this.setState({ map: map });
    };

    searchNearbyCallback = (results, status, pagination) => {
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
                if (results[i].photos)
                    results[i].photos.forEach(pho => place.photos.push(pho));
                this.setState({ places: place });
                this.createMarker(place);
            }
            if (pagination.hasNextPage) {
                pagination.nextPage();
            }
        }
    };

    searchNearbyCB = results => {
        console.log('searchNearbyCB: ', results);
        for (var i = 0; (i < results.length && i < 10); i++) {
            let place = {
                location: {
                    lat: results[i].geometry.location.lat,
                    lng: results[i].geometry.location.lng
                },
                name: results[i].name,
                photos: []
            };
            if (results[i].photos)
                results[i].photos.forEach(pho => place.photos.push(pho))
            this.setState({ places: place });
            // this.renderMarker(place);
            this.createMarker(place);
        }
        console.log('state.places: ', this.state.places);
    };

    renderMarker = (item) => {
        this._map.setZoom(1);
        let {
          map, google, position, mapCenter
        } = this.props;
  
        let pos = item.location || mapCenter;
        position = new google.maps.LatLng(item.location.lat, item.location.lng);
  
        const pref = {
          map: map,
          position: position
        };
        this.marker = new google.maps.Marker(pref);
    }

    // locationPhotoFetchRequest = photoRef =>  {
    //     console.log('photoRef argument: ', photoRef);
    //     return superagent.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${process.env.__GAPI_KEY__}`)
    //         .then(res => {
    //             console.log('location photo reg res: ', res.body.results);
    //             return res.body.results;
    //         });
    // };

    createMarker = item => {
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
            

            <Map google={this.props.google} zoom={14} center={this.state.currentLocation} 
                //  onReady={this.onMapReady}
                 onClick={this.onMapClicked} ref={(map) => this._map = map}>
                 {/* <div ref='map' className='mapInnerDiv' /> */}
                 
                <Marker onClick={this.onMarkerClick}
                        onMouseover={this.onMouseoverMarker}
                        name={'Current location'} 
                        position={this.props.currentLocation}
                        icon={{
                            url: 'https://i.imgur.com/Oa8iJO5.png',
                            anchor: new google.maps.Point(8, 8),
                            scaledSize: new google.maps.Size(16, 16)
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
    currentLocation: state.currentLocation,
});
  
let mapDispatchToProps = dispatch => ({
    tokenSignIn: token => dispatch(tokenSignInRequest(token)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    userProfileUpdate: profile => dispatch(userProfileUpdateRequest(profile)),
    currentLocationFetch: () => dispatch(currentLocationFetchRequest()),
    googlePlacesFetch: location => dispatch(googlePlacesFetchRequest(location)),
});

const WrappedContainer = GoogleApiWrapper({
    apiKey: process.env.__GAPI_KEY__
 })(MapContainer);
 export default connect(mapStateToProps, mapDispatchToProps)(WrappedContainer);
