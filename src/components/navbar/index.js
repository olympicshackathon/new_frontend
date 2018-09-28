import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { signUpRequest, signInRequest, signOut } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { currentLocationFetchRequest } from '../../actions/map-actions.js';
import UserAuthForm from '../userAuth-form';
import { classToggler, logError, renderIf } from '../../lib/util.js';


class Navbar extends React.Component {
  constructor(props){
    super(props);
    this.state={ showDropDown: false, authFormAction: 'Sign Up' };
  }
  componentDidMount() {
    return this.props.currentLocationFetch();
  }
  handleSignin = (user, errCB) => {
    return this.props.signIn(user)
      .then(() => {
        return this.props.userProfileFetch()
          .catch(err => logError(err));
      })
      .then(() => {
        return this.setState({ showDropDown: false });
      })
      .catch(err => {
        logError(err);
        errCB(err);
      });
  };
  handleSignup = (user, errCB) => {
    return this.props.signUp(user)
      .then(() => {
        return this.props.userProfileFetch()
          .catch(err => logError(err));
      })
      .then(() => {
        return this.setState({ showDropDown: false });
      })
      .catch(err => {
        logError(err);
        errCB(err);
    });
  };
  handleSignOut = () => {
    this.props.signOut();
    this.setState({ showDropDown: false });
    this.props.history.push('/');
  };
  render() {
    let profileLink = this.props.userProfile && this.props.userProfile._id ? `/user/${this.props.userProfile._id}` : '';
    let handleComplete = this.state.authFormAction === 'Sign Up' ? this.handleSignup : this.handleSignin;
    return (
        <header>
          <nav>
            <div className='navPrimary' onClick={() => this.setState({ showDropDown: !this.state.showDropDown })}>
              <div className={classToggler({
                'navPrimary-toggle': true,
                'ddOpen': this.state.showDropDown,
              })}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className='darkNavSection'>
                {renderIf(this.props.userAuth && this.state.showDropDown ,
                  <div className='coins'>
                    <p> 10.63 </p>
                  </div>
                )}
                <img className={classToggler({
                  'navcoinlogo': true,
                  'extrapadding': !this.props.userAuth,
                  })} src='https://i.imgur.com/ey72AKX.png' />
                {renderIf(this.props.userAuth && this.state.showDropDown ,
                  <div className='distance'>
                    <p>7,3 km</p>
                  </div>
                )}
              </div>
            </div>
            {renderIf(this.props.userAuth && this.state.showDropDown ,
              <div className='navPrimary-dropdown'>
                <div className='navShadow'></div>
                <ul className='navPrimary-menu'>
                  <li className='navPrimary-li'>
                    <Link to='/dashboard' className='navPrimary-li-text' onClick={() => this.setState({ showDropDown: false })}><img src='https://i.imgur.com/OPUUc13.png' className='navIcons dbicon'/> DASHBOARD</Link>
                  </li>
                  <li className='navPrimary-li'>
                    <Link to='/map' className='navPrimary-li-text' onClick={() => this.setState({ showDropDown: false })}><img src='https://i.imgur.com/gxfbqpg.png' className='navIcons mapicon'/> MAP</Link>
                  </li>
                  <li className='navPrimary-li'>
                    <Link to='/dailychallenge' className='navPrimary-li-text' onClick={() => this.setState({ showDropDown: false })}><img src='https://i.imgur.com/KgDT2nR.png' className='navIcons dcicon'/> DAILY CHALLENGE</Link>
                  </li>
                  <li className='navPrimary-li'>
                    <Link to='/mywallet' className='navPrimary-li-text' onClick={() => this.setState({ showDropDown: false })}><img src='https://i.imgur.com/Bnd3w7M.png' className='navIcons walleticon'/> MY WALLET</Link>
                  </li>
                  <li className='navPrimary-li'>
                    <p className='navPrimary-li-text' onClick={this.handleSignOut}>LOGOUT</p>
                  </li>
                </ul>
              </div>
            )}
            {renderIf(!this.props.userAuth,
              <div>
              <div id='signInBanner'>
                <p>Sign in</p>
              </div>
              <div className='oauthDiv'>
                <div className='oauthButtonContainer'>
                  <button className='oauthButton'><span><img src='https://i.imgur.com/8SuZVDb.png' /></span> <span className='oauthbuttonText'>Sign in with Facebook</span></button>
                </div>
                <div className='oauthButtonContainer'>
                  <button className='oauthButton'><span><img src='https://i.imgur.com/1oNQY1E.png' /></span> <span className='oauthbuttonText'>Sign in with Google</span></button>
                </div>
              </div>
              <div className='orLine'>
                <p>OR</p>
                <p className='underline'> </p>
              </div>
              <div className='navForm-div'>
                <div>
                  <UserAuthForm authFormAction={this.state.authFormAction} onComplete={handleComplete} />
                    <div className='userauth-buttons'>
                      {renderIf(this.state.authFormAction==='Sign Up',
                        <button className='grayButton' onClick={() => this.setState({authFormAction: 'Sign In'})}>Sign In</button>
                      )}
                      {renderIf(this.state.authFormAction==='Sign In',
                        <div>
                          <p className='accountMessage'>Don't have an account yet?</p>
                          <button className='grayButton' onClick={() => this.setState({authFormAction: 'Sign Up'})}>Registration</button>
                        </div>
                      )}
                    </div>
                </div>
              </div>
              </div>
            )}
          </nav>
        </header>
    );
  }
}

let mapStateToProps = state => ({
  userAuth: state.userAuth,
  userProfile: state.userProfile,
  currentLocation: state.currentLocation,
});

let mapDispatchToProps = dispatch => ({
  signUp: user => dispatch(signUpRequest(user)),
  signIn: user => dispatch(signInRequest(user)),
  userProfileFetch: () => dispatch(userProfileFetchRequest()),
  signOut: () => dispatch(signOut()),
  currentLocationFetch: () => dispatch(currentLocationFetchRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);