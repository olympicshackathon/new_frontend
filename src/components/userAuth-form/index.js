import React from 'react';
import superagent from 'superagent';
import { isEmail, isAlphanumeric, isAscii } from 'validator';

import Tooltip from '../helpers/tooltip';
import { classToggler, renderIf } from '../../lib/util';

class UserAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      emailError: null,
      usernameError: null,
      usernameAvailable: true,
      passwordError: null,
      error: null,
      focused: null,
      submitted: false,
    };
  }
  componentWillUnmount() {
    this.setState({ username: '', email: '', password: '' });
  }
  validateInput = e => {
    let { name, value } = e.target;

    let errors = {
      emailError: this.state.emailError,
      passwordError: this.state.passwordError,
      usernameError: this.state.usernameError,
    };

    let setError = (name, error) => errors[`${name}Error`] = error;
    let deleteError = name => errors[`${name}Error`] = null;

    if(name === 'email') {
      if(!value)
        setError(name, `${name} can not be empty`)
      else if(!isEmail(value))
        setError(name, `${value} is not a valid email`)
      else
        deleteError(name)
    }

    if(name === 'username') {
      if(!value)
        setError(name, `${name} can not be empty`)
      else if(!isAlphanumeric(value))
        setError(name, 'username can only contain letters and numbers')
      else 
        deleteError(name)
    }

    if(name === 'password') {
      if(!value)
        setError(name, `${name} can not be empty`)
      else if(!isAscii(value))
        setError(name, 'password may only contain normal charachters')
      else 
        deleteError(name)
    }

    this.setState({
      ...errors, error: (errors.emailError || errors.usernameError || errors.passwordError),
    })
  };
  handleFocus = e => this.setState({ focused: e.target.name });
  handleBlur = e => {
    let { name } = e.target;
    this.setState(state => ({
      focused: state.focused == name ? null : state.focused,
    }))
  };
  handleChange = e => {
    let { name, value } = e.target;
    this.validateInput({...e});

    this.setState({
      [name]: value,
    });

    if(this.props.authFormAction === 'Sign Up' && name === 'username') {
      this.usernameCheckAvailable(value);
    }
  };
  usernameCheckAvailable = username => {
    return superagent.get(`${process.env.API_URL}/api/signup/usernames/${username}`)
      .then(() => this.setState({usernameAvailable: true }))
      .catch(() => this.setState({ usernameAvailable: false }))
  };
  handleSubmit = e => {
    e.preventDefault();
    if(!this.state.error) {
      this.props.onComplete(this.state, this.handleError)
        .catch(err => {
          this.setState({ 
            error,
            submitted: true,
        });
      });
    }
    this.setState(state => ({
      submitted: true,
      usernameError: state.usernameError || state.username ? null : 'Required field.',
      emailError: state.emailError || state.email ? null : 'Required field.',
      passwordError: state.passwordError || state.password ? null : 'Required field.',
    }))
  };
  handleError = err => {
    const usernameError = (
      err.status === 401 
        ? 'That username or password is incorrect. Try another.' 
        : 'That username or email already taken. Try another.'
      );

    this.setState({
      usernameError
    });
  };
  render() {
    let { focused, submitted, username, emailError, passwordError, usernameError, usernameAvailable } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className={classToggler({
        'form userauth-form': true,
        'error': this.state.error && this.state.submitted,
      })}>
        {renderIf(this.props.authFormAction === 'Sign Up',
          <div>
            <h2 className='title'>SIGN UP</h2>
            <input
              className={classToggler({error: emailError})}
              type='text'
              name='email'
              placeholder='Email Address'
              value={this.state.email}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
            <Tooltip message={emailError} show={focused === 'email' || submitted} />
          </div>
        )}
        {renderIf(this.props.authFormAction !== 'Sign Up',
          <div>
            <h2 className='title'>SIGN IN</h2>
          </div>
        )}
        <input
          className={classToggler({error: usernameError || !usernameAvailable})}
          type='text'
          name='username'
          placeholder='Username'
          value={this.state.username}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        <Tooltip message={usernameError} show={focused === 'username' || submitted}/>
        {renderIf(username && this.props.authFormAction=== 'Sign Up',
          <div className='username-availability-outer'>
            <p className='username-availability'>
              {username} {usernameAvailable ? 'is available.': 'is not available.'}
            </p>
          </div>
        )}
        <input
          className={classToggler({passwordError})}
          type='password'
          name='password'
          placeholder='Password (case sensitive)'
          value={this.state.password}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        <Tooltip message={passwordError} show={ focused === 'password' || submitted}/>
        <div className='buttonAuthFormParentDiv'>
          <button className='formButton' type='submit'> {this.props.authFormAction} </button>
        </div>
      </form>
    );
  }
}

export default UserAuthForm;