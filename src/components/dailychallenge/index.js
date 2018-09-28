import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest, userProfileUpdateRequest } from '../../actions/userProfile-actions.js';
import { currentLocationFetchRequest } from '../../actions/map-actions.js';
import { classToggler, userValidation, logError, renderIf } from './../../lib/util.js';

class DailyChallenge extends React.Component {
  constructor(props){
    super(props);
    this.state = { active: 'today' }
  }
  componentWillMount() {
    userValidation(this.props);
  }
  render() {
    return (
      <section className='landingContainer container-outer dcContainer'>
        <div className='dchead'>
            <p>June 2024</p>
        </div>
        <div className='calendar'>
            <div className='days'>
                    <p> Mo</p>
                    <p> Tu</p>
                    <p> We</p>
                    <p> Th</p>
                    <p> Fr</p>
                    <p> Sa</p>
                    <p> Su</p>
            </div>
            <div className='dates'>
                    <p> 31</p>
                    <p> <img className='checkImg' src='https://i.imgur.com/Kqf1z6Y.png' />01</p>
                    <p> <img className='xImg' src='https://i.imgur.com/UEIMpcd.png' />02</p>
                    <p> <img className='checkImg' src='https://i.imgur.com/Kqf1z6Y.png' />03</p>
                    <p> <img className='checkImg' src='https://i.imgur.com/Kqf1z6Y.png' />04</p>
                    <p> <img className='checkImg' src='https://i.imgur.com/Kqf1z6Y.png' />05</p>
                    <p> <img className='xImg' src='https://i.imgur.com/UEIMpcd.png' />06</p>
            </div>
            <div className='dates'>
                    <p> <img className='xImg' src='https://i.imgur.com/UEIMpcd.png' />07</p>
                    <p> <img className='checkImg' src='https://i.imgur.com/Kqf1z6Y.png' />08</p>
                    <p> <img className='xImg' src='https://i.imgur.com/UEIMpcd.png' />09</p>
                    <p> <img className='xImg' src='https://i.imgur.com/UEIMpcd.png' />10</p>
                    <p> <img className='checkImg' src='https://i.imgur.com/Kqf1z6Y.png' />11</p>
                    <p> <img className='checkImg' src='https://i.imgur.com/Kqf1z6Y.png' />12</p>
                    <p> <img className='xImg' src='https://i.imgur.com/UEIMpcd.png' />13</p>
            </div>
            <div className='dates'>
                    <p> <img className='xImg' src='https://i.imgur.com/UEIMpcd.png' />14</p>
                    <p id='today'> 15</p>
                    <p className='needsPadding'> 16</p>
                    <p className='needsPadding'> 17</p>
                    <p className='needsPadding'> 18</p>
                    <p className='needsPadding'> 19</p>
                    <p className='needsPadding'> 20</p>
            </div>
            <div className='dates'>
                    <p className='needsPadding'> 21</p>
                    <p className='needsPadding'> 22</p>
                    <p className='needsPadding'> 23</p>
                    <p className='needsPadding'> 24</p>
                    <p className='needsPadding'> 25</p>
                    <p className='needsPadding'> 26</p>
                    <p className='needsPadding'> 27</p>
            </div>
            <div className='dates'>
                    <p className='needsPadding'> 28</p>
                    <p className='needsPadding'> 29</p>
                    <p className='needsPadding'> 30</p>
                    <p className='needsPadding'> 01</p>
                    <p className='needsPadding'> 02</p>
                    <p className='needsPadding'> 03</p>
                    <p className='needsPadding'> 04</p>
            </div>
        </div>
        <p className='button lightBlue oauthbuttonText'>Start daily challenge</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(DailyChallenge);