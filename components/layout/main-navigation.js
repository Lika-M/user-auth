import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

import classes from './main-navigation.module.css';

function MainNavigation() {
  const { data: session, status } = useSession();

  console.log(session); // undefined | null | {user: obj, expires: string}
  console.log(status);  // loading | authenticated | unauthenticated

  if (status === 'loading') {
    return (
      <header className={classes.header}>
        <div className={classes.logo}>Loading...</div>
      </header>
    );
  }

  async function onLogout() {
    await signOut();
  }

  return (
    <header className={classes.header}>
      <Link href="/">
        <div className={classes.logo}>Next Auth</div>
      </Link>
      <nav>
        <ul>
          {status === 'unauthenticated' &&
            <li>
              <Link href="/auth">Login</Link>
            </li>}
          {status === 'authenticated' &&
            <>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <button type="button" onClick={onLogout}>Logout</button>
              </li>
            </>}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
