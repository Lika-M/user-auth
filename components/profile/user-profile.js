// import { getSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation'
// import { useState, useEffect } from 'react';


import ProfileForm from './profile-form';
import classes from './user-profile.module.css';

function UserProfile() {
  // const [isLoading, setIsLoading] = useState(true);
  // const router = useRouter();

  // useEffect(() => {
  //   getSession() // null | obj
  //     .then(session => {
  //       if (!session) {
  //         router.push('/auth');
  //       } else {
  //         setIsLoading(false);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching session:', error);
  //     });
  // }, []);

  // if (isLoading) {
  //   return <p className={classes.profile}>Loading...</p>
  // }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;
