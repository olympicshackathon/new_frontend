import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Link, Redirect } from 'react-router-dom';

import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest, userProfileUpdateRequest } from '../../actions/userProfile-actions.js';
import { currentLocationFetchRequest } from '../../actions/map-actions.js';
import { userValidation, logError, renderIf } from './../../lib/util.js';

class MyWallet extends React.Component {
  constructor(props){
    super(props);
    this.state = { };
  }
  componentWillMount() {
    userValidation(this.props);
  }

  render() {
    return (
      <div className="landingContainer container-outer myWalletContainer">
        <div className='myWallet'>
          <p> My wallet</p>
        </div>
        <div className='top'>
          <p className='top-top'>Congrats you've got</p>
          <p className='top-bot'>10.63</p>
        </div>
        <div className='ccimgDiv'>
          <img src='https://i.imgur.com/betdO7x.png' className='ccimg' />
        </div>
        <div className='bot'>
          <p className='paymentIcon'> <img src='https://i.imgur.com/wVt9N59.png' className='picon' /><span>Previous Payments</span></p>
          <div className='transactions'> 
            <p className='datecol'>We June 4 </p>
            <p className='midcol'>La Belle vie </p>
            <p className='lastcol'> 5</p>
          </div>
          <div className='transactions'> 
            <p className='datecol'>Th June 6 </p>
            <p className='midcol'>Le comptoire des saveurs </p>
            <p className='lastcol'>3 </p>
          </div>
          <div className='transactions'> 
            <p className='datecol'>Mo June 12 </p>
            <p className='midcol'>Chez Lucie </p>
            <p className='lastcol'>4 </p>
          </div>
        </div>
        <div className='donedone'></div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyWallet);