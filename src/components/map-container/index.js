import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import PropTypes from 'prop-types';

class MapContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          currentLocation: {
            lat:  7,
            lng:  -12
          }
        }
    }
    componentDidMount() {
        this.updatePosition();
    }
    updatePosition(){
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                this.setState({
                    currentLocation: {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    }
                })
                console.log('state: ', this.state.currentLocation);
            })
        }
        else
            console.log('no');
    }
    render() {
        const style = {
            width: '100%',
            height: '100%'
          }


        return (
            <Map google={this.props.google} zoom={14} center={this.state.currentLocation}>
                <Marker onClick={this.onMarkerClick}
                        name={'Current location'} />
                <InfoWindow onClose={this.onInfoWindowClose}>
                    <p>hi</p>
                </InfoWindow>
            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.__GAPI_KEY__
  })(MapContainer)