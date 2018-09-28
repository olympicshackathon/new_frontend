import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest, userProfileUpdateRequest } from '../../actions/userProfile-actions.js';
import { currentLocationFetchRequest } from '../../actions/map-actions.js';
import { userValidation, logError, renderIf } from './../../lib/util.js';

class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = { profileFormDisplay: true }
  }
  componentWillMount() {
    userValidation(this.props);
  }
  render() {
    return (
      <section className='landingContainer container-outer'>
        <div className='dbHead'>

        </div>
        <div className='dbCharts'>

        </div>
        <div className='dbFooter'>

        </div>
      </section>
    );
  }
}

let mapStateToProps = state => ({
  userAuth: state.userAuth,
  userProfile: state.userProfile,
  currentLocation: state.currentLocation,
});

let mapDispatchToProps = dispatch => ({
  tokenSignIn: token => dispatch(tokenSignInRequest(token)),
  userProfileFetch: () => dispatch(userProfileFetchRequest()),
  userProfileUpdate: profile => dispatch(userProfileUpdateRequest(profile)),
  currentLocationFetch: () => dispatch(currentLocationFetchRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);