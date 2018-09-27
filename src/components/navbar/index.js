import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Avatar from '../helpers/avatar';
import { signUpRequest, signInRequest, signOut } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import UserAuthForm from '../userAuth-form';
import { classToggler, logError, renderIf } from '../../lib/util.js';


class Navbar extends React.Component {
  constructor(props){
    super(props);
    this.state={ showDropDown: false, authFormAction: 'Sign Up' };
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
          <p className='navPrimary-logo'><span className='logo1'>OLYMPIC </span><span className='logo2'>APP</span></p>
        </div>
        {renderIf(this.state.showDropDown,
          <div className='navPrimary-dropdown'>
            <div className='navShadow'></div>
            <ul className='navPrimary-menu'>
              <li className='navPrimary-li'>
                <Link to='/' className='navPrimary-li-text' onClick={() => this.setState({ showDropDown: false })}>HOME</Link>
              </li>
              <li className='navPrimary-li'>
                <Link to='/' className='navPrimary-li-text' onClick={() => this.setState({ showDropDown: false })}>GET INVOLVED</Link>
              </li>
              <li className='navPrimary-li'>
                <Link to='/' className='navPrimary-li-text' onClick={() => this.setState({ showDropDown: false })}>OUR MISSION</Link>
              </li>
              {renderIf(this.props.userAuth,
                <div>
                  <li className='navPrimary-li'>
                    <Link to='/play' className='navPrimary-li-text' onClick={() => this.setState({ showDropDown: false })}>PLAY</Link>
                  </li>
                  <li className='navPrimary-li'>
                    <Link to={profileLink} className='navPrimary-li-text' onClick={() => this.setState({ showDropDown: false })}>PROFILE</Link>
                  </li>
                  <li className='navPrimary-li'>
                    <p className='navPrimary-li-text' onClick={this.handleSignOut}>LOGOUT</p>
                  </li>
                </div>
              )}
              {renderIf(!this.props.userAuth,
                <div className='navForm-div'>
                  <UserAuthForm authFormAction={this.state.authFormAction} onComplete={handleComplete} />
                  <div className='userauth-buttons'>
                    {renderIf(this.state.authFormAction==='Sign In',
                      <button className='formButton darkButton' onClick={() => this.setState({authFormAction: 'Sign Up'})}>Sign Up</button>
                    )}
                    {renderIf(this.state.authFormAction==='Sign Up',
                      <button className='formButton darkButton' onClick={() => this.setState({authFormAction: 'Sign In'})}>Sign In</button>
                    )}
                  </div>
                </div>
              )}
            </ul>
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
});

let mapDispatchToProps = dispatch => ({
  signUp: user => dispatch(signUpRequest(user)),
  signIn: user => dispatch(signInRequest(user)),
  userProfileFetch: () => dispatch(userProfileFetchRequest()),
  signOut: () => dispatch(signOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);