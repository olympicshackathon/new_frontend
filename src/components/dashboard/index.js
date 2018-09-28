import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest, userProfileUpdateRequest } from '../../actions/userProfile-actions.js';
import { currentLocationFetchRequest } from '../../actions/map-actions.js';
import { classToggler, userValidation, logError, renderIf } from './../../lib/util.js';

class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = { active: 'today' }
  }
  componentWillMount() {
    userValidation(this.props);
  }
  render() {
    return (
      <section className='landingContainer container-outer dbContainer'>
        <div className='dbhead'>
            <p onClick={() => this.setState({active: 'today'})} className={classToggler({ 'today': true, 'active': this.state.active == 'today' })}>
              Today
            </p>
            <p onClick={() => this.setState({active: 'total'})} className={classToggler({ 'total': true, 'active': this.state.active == 'total' })}>
              Total
            </p>
        </div>
        <div className='dbCharts'>
          <img src="https://i.imgur.com/EJcdtgi.png" />
        </div>
        <div className='dbFooter'>
          <p className='gain'>Total Gain</p>
          <p className='footerBottomRow'>10.63 <span> . <img src='https://i.imgur.com/VGksbdY.png'/></span> </p>
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