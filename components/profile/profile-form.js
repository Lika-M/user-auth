import { useRef } from 'react';

import classes from './profile-form.module.css';

function ProfileForm() {
  const inputNewPassword = useRef();
  const inputOldPassword = useRef();

  function changePassword(userData) {
    fetch('/api/user/change-password', {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }

  function onSubmit(ev) {
    ev.preventDefault();

    const newPassword = inputNewPassword.current.value;
    const oldPassword = inputOldPassword.current.value;

    const isValid = newPassword && newPassword.trim() !== '' &&
      oldPassword && oldPassword.trim() !== '' &&
      newPassword.length > 5 && oldPassword.length > 5;

    if (!isValid) {
      return alert('Enter valid passwords!');
    }

    changePassword({newPassword, oldPassword});
  }

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={inputNewPassword} />
      </div>
      <div className={classes.control}>
        <label htmlFor='old-password'>Old Password</label>
        <input type='password' id='old-password' ref={inputOldPassword} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
