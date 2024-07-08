import { getServerSession } from 'next-auth/next';

import { authOptions } from './api/auth/[...nextauth]';
import UserProfile from '../components/profile/user-profile';

function ProfilePage({session}) {
  return <UserProfile />;
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session
    },
  };
}

export default ProfilePage;
