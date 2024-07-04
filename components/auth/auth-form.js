import { useRef, useState } from 'react';
import { signIn } from 'next-auth/react';

import { createUser } from '../../lib-db/util';
import classes from './auth-form.module.css';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  const inputEmail = useRef();
  const inputPassword = useRef();

  async function onSignup(event) {
    event.preventDefault();

    const enteredEmail = inputEmail.current.value;
    const enteredPassword = inputPassword.current.value;
    const isInvalid = !enteredEmail || !enteredPassword || !enteredEmail.includes('@') || enteredPassword.trim().length < 6;

    if (isInvalid) {
      alert('Enter valid input!')
      return;
    }

    const userData = {
      email: enteredEmail,
      password: enteredPassword
    };

    if (!isLogin) {
      try {
        await createUser(userData);
      } catch (error) {
        console.log(error);
      }

    } else {
      try {
        // or error
        const result = await signIn('credentials', {
          email: enteredEmail,
          password: enteredPassword,
          redirect: false
        });

        console.log(result);

      } catch (error) {
        console.log(error)
      }
    }
  }

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={onSignup}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={inputEmail} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={inputPassword} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
